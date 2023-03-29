const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ignoreHTTPSErrors: true});
  const page = await browser.newPage();

  // Listen for the 'response' event
  page.on('response', async (response) => {
    const url = response.url();
    const timing = response.timing();

    // console log http version
    // console.log(response.request().)

    // Check if the response is for a JPEG image or an MP4 video
    if (url.endsWith('.jpeg') || url.endsWith('.jpg') || url.endsWith('.mp4')) {
        console.log(url)
        console.log(timing)
    //   const requestStart = timing.requestTime;
    //   const responseStart = timing.responseStart;
    //   const responseEnd = timing.responseEnd;

    //   console.log(`URL: ${url}`);
    //   console.log(`Request Start: ${requestStart} ms`);
    //   console.log(`Response Start: ${responseStart} ms`);
    //   console.log(`Response End: ${responseEnd} ms`);
    //   console.log('------');
    }
  });

  await page.goto('https://vm1.research.letswhirl.com');
//   await page.waitForTimeout(5000); // Wait for 5 seconds to ensure all resources are loaded
//   await browser.close();
})();
