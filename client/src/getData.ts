import { firefox } from 'playwright'

export const getData = async ({
    url,
    forceHTTP3URL,
    logActivity
}: {
    url: string,
    forceHTTP3URL?: string,
    logActivity?: boolean
}): Promise<{
    url: string,
    protocol: string, // HTTP/1.1, HTTP/2, HTTP/2
    timing: {
        startTime: number;
        domainLookupStart: number;
        domainLookupEnd: number;
        connectStart: number;
        secureConnectionStart: number;
        connectEnd: number;
        requestStart: number;
        responseStart: number;
        responseEnd: number;
    },
    headers: {
        [key: string]: string;
    },
    lossRate: string | undefined
}[]> => {

    

    const log = (...args: string[]) => {
        if (logActivity) console.log(...args)
    }
    
    const getLossRateFromArgs = () => {
        const args = process.argv
        if (args.includes('--loss-rate')) {
            const index = args.indexOf('--loss-rate')
            const lossRate = args[index + 1]
            if (lossRate) {
                return lossRate
            }
        }
    }

    const browser = await firefox.launch()
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36 Edg/96.0.1054.29+HTTP/3',
    });
    const page = await context.newPage()

    let reqCount: number = 0
    let resCount: number = 0

    const waitUntilAllRequestsFinished = async () => {
        while (reqCount !== resCount) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // wait until all responses have resolved
        }
    }

    let results: {
        url: string,
        protocol: string, // HTTP/1.1, HTTP/2, HTTP/2
        timing: {
            startTime: number;
            domainLookupStart: number;
            domainLookupEnd: number;
            connectStart: number;
            secureConnectionStart: number;
            connectEnd: number;
            requestStart: number;
            responseStart: number;
            responseEnd: number;
        },
        headers: {
            [key: string]: string;
        },
        lossRate: string | undefined
    }[] = []

    page.on('request', (request) => {
        log(`Request Initiated: ${request.url()}`)
        reqCount++;
    });

    page.on('response', async (response) => {
        log(`Receiving Response: ${response.url()}`)
        const url = response.url();
        const request = response.request();
        const timing = request.timing()
        const headers = response.headers()
        const protocol = await response.headerValue('x-protocol') || ""

        // Wait for the response to finish downloading
        await response.finished()
        resCount++
        log(`Response Finished: ${response.url()}`)
        results.push({
            url,
            protocol,
            timing,
            headers,
            lossRate: getLossRateFromArgs()
        })
    });

    const openPage = async (url: string) => {
        await page.goto(url).catch(e => console.error('Error navigating to page', e));
    }

    if (forceHTTP3URL) {
        await openPage(forceHTTP3URL).catch(e => console.error('Error navigating to page', e));
        await new Promise(resolve => setTimeout(resolve, 5000))
    }
    await openPage(url).catch(e => console.error('Error navigating to page', e));

    await page.click('#downloadVideo').catch(e => console.error('Error clicking button', e));

    await waitUntilAllRequestsFinished()


    await browser.close()
    return results
}