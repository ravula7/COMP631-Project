import puppeteer, { Protocol } from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch({ ignoreHTTPSErrors: true });
    const page = await browser.newPage();

    page.on('response', async (response) => {
    const url = response.url();
    const timing = response.timing() as Protocol.Network.ResourceTiming;
    console.log(url);
    // console.log(timing);

    // Calculate the response time
    const requestTimeMs = timing.requestTime * 1000;
    const responseTime = timing.receiveHeadersEnd - requestTimeMs;
    // console.log(`Response Time: ${responseTime} ms`);

    // Check if the request is for a video resource
    if (url.endsWith('.mp4')) {
        console.log(timing)
    }
  });

})