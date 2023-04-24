const puppeteer = require('puppeteer');

(async () => {
  // Launch a new browser instance
  const browser = await puppeteer.launch({ ignoreHTTPSErrors: true });
  const page = await browser.newPage();

  // Wait for the page to fully load

  // Listen to the 'response' event
  page.on('response', async (response) => {
    const url = response.url();
    const resourceType = response.request().resourceType();

    // Check if the response is for an image resource
    if (url.includes("jp")) {
      const timing = response.timing();
      console.log(url)
      console.log(timing)

      // Calculate the response time
      const requestTimeMs = timing.requestTime / 1000;
      const responseTime = timing.receiveHeadersEnd - requestTimeMs;
      // console.log("HERE")

      // // Wait for the entire image to be downloaded
      // const buffer = await response.buffer();
      // console.log("HEADERS", response.headers())
      // while (buffer.length.toString() !== response.headers()['content-length']) {
      //   // console.log(buffer.length)
      //   await new Promise(resolve => setTimeout(resolve, 10));
      // }
      // if (buffer.length.toString() === response.headers()['content-length']) {
      //   console.log("done")
      // }

      // console.log(`Image URL: ${url}, Response Time: ${responseTime} ms`);
    }
  });

  await page.goto('https://vm1.research.letswhirl.com', { waitUntil: 'networkidle2' });


  // Click all the buttons on the page
  const buttons = await page.$$('button');
  for (const button of buttons) {
    await button.click();
  }

  // Wait for some time to ensure all image resources are loaded
//   await page.waitForTimeout(10000); // Adjust the timeout as needed

  // Close the browser
//   await browser.close();
})();
