const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36 Edg/96.0.1054.29+HTTP/3',
  });
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
    const startTime = startTimes.get(request);

    // Wait for the response to finish downloading
    await response.finished().catch(console.error)

    const responseTime = Date.now() - startTime;
    // console.log('Response time:', responseTime, 'ms');
    console.log('Response URL:', response.url());
    console.log('Protocol:', response.headers()['x-protocol']);
    console.log(timing)
  });

  const urls = [
    'https://vm1.research.letswhirl.com',
    'https://vm1.research.letswhirl.com',
  ]

  let lastURL;
  for (const url of urls) {
    if (url === lastURL) await new Promise(resolve => setTimeout(resolve, 60000)); // wait for connection to close
    await page.goto(url).catch(e => console.error('Error navigating to page', e));
    lastURL = url
  }

  // Click the "downloadVideo" button, which will only execute on last page
  await page.click('#downloadVideo').catch(e => console.error('Error clicking button', e));

  while (reqCount !== resCount) {
    await new Promise(resolve => setTimeout(resolve, 1000)); // wait until all responses have resolved
  }

  await browser.close();
})()