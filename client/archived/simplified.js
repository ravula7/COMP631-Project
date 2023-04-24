const puppeteer = require('puppeteer');

(async () => {
  // Launch a new browser instance
  const browser = await puppeteer.launch({ ignoreHTTPSErrors: true });
  const page = await browser.newPage();

  // Listen to the 'requestfinished' event
  page.on('response', async (response) => {
    const url = response.url();
    const timing = response.timing();
    console.log(url);
    // console.log(timing);

    // Calculate the response time
    const requestTimeMs = timing.requestTime * 1000;
    const responseTime = timing.receiveHeadersEnd - requestTimeMs;
    // console.log(`Response Time: ${responseTime} ms`);

    // Check if the request is for a video resource
    if (url.includes('.jp')) {
        console.log(timing.e)
    }
  });

  // Navigate to the web page and wait for it to load completely
  await page.goto('https://vm1.research.letswhirl.com', { waitUntil: 'networkidle0' });
//   await page.goto('https://vm1.research.letswhirl.com', { waitUntil: 'networkidle0' });

  const buttons = await page.$$('button');
  for (const button of buttons) {
    await button.click();
  }

  // Wait for some time to ensure all video resources are loaded
  // await page.waitForTimeout(10000); // Adjust the timeout as needed

  // Close the browser
  // await browser.close();
})();
