import { chromium, BrowserContext} from 'playwright';

export const measure = async (url: string, forceHTTP3: boolean = false, logActivity: boolean = false, c: BrowserContext = null, waitTime: number = null): Promise<{
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
}
}[]> => {
  if (c) console.log("RE-USING CONTEXT")
  const browser = await chromium.launch();
  const context = c || await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36 Edg/96.0.1054.29+HTTP/3',
  });
  const page = await context.newPage();

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
}
  }[] = []

  let reqCount = 0
  let resCount = 0

  // Record start time for each request
  page.on('request', (request) => {
    if (logActivity) console.log(`Request Initiated: ${request.url()}`)
    reqCount++;
  });

  // Calculate response time and log it along with response headers
  page.on('response', async (response) => {
    if (logActivity) console.log(`Receiving Response: ${response.url()}`)
    const url = response.url();
    const request = response.request();
    const timing = request.timing()
    const headers = response.headers()
    const protocol = await response.headerValue('x-protocol') || ""

    // Wait for the response to finish downloading
    await response.finished()
    resCount++
    if (logActivity) console.log(`Response Finished: ${response.url()}`)
    results.push({
      url,
      protocol,
      timing,
      headers
    })
  });

  const openPage = async (url: string) => {
    await page.goto(url).catch(e => console.error('Error navigating to page', e));
  }

  if (waitTime) await new Promise(resolve => setTimeout(resolve, waitTime));
  
  await openPage(url).catch(e => console.error('Error navigating to page', e));

  // Click the "downloadVideo" button, which will only execute on last page
  await page.click('#downloadVideo').catch(e => console.error('Error clicking button', e));

  while (reqCount !== resCount) {
    await new Promise(resolve => setTimeout(resolve, 1000)); // wait until all responses have resolved
  }

  const getResults = async () => {
    await browser.close()
    return results
  }

  return forceHTTP3 ?
    results.every(r => r.protocol === "HTTP/3") ?
    getResults() :
    measure(url, true, logActivity, context, 60000) :
    getResults()
}