const puppeteer = require('puppeteer');

(async () => {
  // Launch a new browser instance
  const browser = await puppeteer.launch({ignoreHTTPSErrors: true});
  const page = await browser.newPage();

  page.on('response', (response) => {
    // console.log(response.headers());
    // console.log(response.timing())
  })

  // Navigate to the web page and wait for it to load completely
  const startTime = Date.now();
  await page.goto('https://vm1.research.letswhirl.com:441', { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    const videos = document.querySelectorAll('video');

    for (const video of videos) {
      if (video.preload !== 'none') {
        video.load();
      }
    }
  });
  const endTime = Date.now();

  const timingMetrics = await page.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0];
    return navigation.toJSON();
  });
  console.log(timingMetrics)

  // Calculate the time it took to load the page and its resources
//   const loadTime = endTime - startTime;
  console.log(`The page and its resources took ${timingMetrics.duration} ms to load.`);

  // Close the browser
  await browser.close();
})();
