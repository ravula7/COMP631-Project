const { chromium } = require('playwright');

const measure = async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const startTimes = new Map();

  let reqCount = 0
  let resCount = 0

  // Record start time for each request
  page.on('request', (request) => {
    reqCount++;
    startTimes.set(request, Date.now());
  });

  // Calculate response time and log it along with response headers
  page.on('response', async (response) => {
    reqCount++
    const request = response.request();
    const timing = request.timing()
    const headers = response.headers()

    // Wait for the response to finish downloading
    console.log(timing)
    await response.finished().catch(console.error)
    console.log(timing)

    console.log('Response URL:', response.url());
    console.log('Protocol:', response.headers()['x-protocol']);
  });

  const urls = [
    'https://vm1.research.letswhirl.com:444',
  ]

  for (const url of urls) {
    await page.goto(url).catch(e => console.error('Error navigating to page', e));
  }

  // Click the "downloadVideo" button, which will only execute on last page
  await page.click('#downloadVideo').catch(e => console.error('Error clicking button', e));

  while (reqCount !== resCount) {
    await new Promise(resolve => setTimeout(resolve, 1000)); // wait until all responses have resolved
  }

  await browser.close();
}

measure()