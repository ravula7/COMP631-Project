const puppeteer = require('puppeteer');

(async () => {
  // Launch a new browser instance
  const browser = await puppeteer.launch({ ignoreHTTPSErrors: true });
  const page = await browser.newPage();

  // Listen to the 'requestfinished' event
  page.on('response', async (response) => {
    const url = response.url();
    const timing = response.timing();
    console.log(url)
    console.log(response.headers()['x-protocol'])

    // Check if the request is for a video resource
    if (url.endsWith('.mp4')) {
      // console.log(timing)
    }
    //   const requestStart = timing.start;
    //   const responseStart = timing.responseStart;
    //   const responseEnd = timing.responseEnd;

    //   console.log(`URL: ${url}`);
    //   console.log(`Request Start: ${requestStart} ms`);
    //   console.log(`Response Start: ${responseStart} ms`);
    //   console.log(`Response End: ${responseEnd} ms`);
    //   console.log(`Response Time: ${responseEnd - requestStart} ms`);
    //   console.log('------');
    // }
  })

  // Navigate to the web page and wait for it to load completely
  await page.goto('https://vm1.research.letswhirl.com:443', { waitUntil: 'networkidle0' });
  await page.goto('https://vm1.research.letswhirl.com:443', { waitUntil: 'networkidle0' });

  // Ensure all video objects are loaded in full
  await page.evaluate(() => {
    const videos = document.querySelectorAll('video');

    for (const video of videos) {
      if (video.preload !== 'none') {
        // load video
        video.play();
      }
    }
  });

  // Wait for some time to ensure all video resources are loaded
//   await page.waitForTimeout(10000); // Adjust the timeout as needed

  // Close the browser
//   await browser.close();
})()
