const { chromium } = require('playwright');

const measure = async (url) => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36 Edg/96.0.1054.29+HTTP/3',
  });
  const page = await context.newPage();

  let results = [];

  let reqCount = 0;
  let resCount = 0;

  // Record start time for each request
  page.on('request', (request) => {
    // if (logActivity) console.log(`Request Initiated: ${request.url()}`);
    reqCount++;
  });

  // Calculate response time and log it along with response headers
  page.on('response', async (response) => {
    // if (logActivity) console.log(`Receiving Response: ${response.url()}`);
    const url = response.url();
    const request = response.request();
    const timing = request.timing();
    const headers = response.headers();
    const protocol = await response.headerValue('x-protocol') || "";

    // Wait for the response to finish downloading
    await response.finished();
    resCount++;
    // if (logActivity) console.log(`Response Finished: ${response.url()}`);
    results.push({
      url,
      protocol,
      timing,
      headers
    });
  });

  const openPage = async (url) => {
    await page.goto('https://vm1.research.letswhirl.com/ping').catch(e => console.error('Error navigating to page', e));
    await new Promise(r => setTimeout(r, 10000))
    await page.goto('https://vm1.research.letswhirl.com').catch(e => console.error('Error navigating to page', e));
  }

  await openPage(url).catch(e => console.error('Error navigating to page', e));
//   if (forceHTTP3 && !results.every(r => r.protocol === "HTTP/3")) {
//     await new Promise(resolve => setTimeout(resolve, 60000)); // wait for page to load
//     results = [];
//     await openPage(url).catch(e => console.error('Error navigating to page', e));
//   }

  // Click the "downloadVideo" button, which will only execute on last page
  await page.click('#downloadVideo').catch(e => console.error('Error clicking button', e));

  while (reqCount !== resCount) {
    await new Promise(resolve => setTimeout(resolve, 1000)); // wait until all responses have resolved
  }

  const getResults = async () => {
    await browser.close();
    return results;
  }

  return getResults();
}

measure("https://vm1.research.letswhirl.com").then(console.log)

module.exports = measure;
