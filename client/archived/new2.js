'use strict';

const puppeteer = require('puppeteer');
const request_client = require('request-promise-native');

(async () => {
  const browser = await puppeteer.launch({
    product: 'chrome'
  });
  const page = await browser.newPage();
  const result = [];

  await page.setRequestInterception(true);

  let requestCounter = 0;
  let responseCounter = 0;

  page.on('request', request => {
    requestCounter++;
    let start = Date.now();
    request_client({
      uri: request.url(),
      resolveWithFullResponse: true,
    }).then(response => {
      const request_url = request.url();
      const response_headers = response.headers;
      const content_size = response_headers['content-length'];
      let end = Date.now();
      const time = end - start;

      result.push({
        request_url,
        response_headers,
        content_size,
        time
      });

      request.continue();
    }).catch(error => {
      console.error(error);
      request.abort();
    });
  });

  page.on('response', () => {
    responseCounter++;
    if (responseCounter === requestCounter) {
      console.log(result);
    }
  });

  await page.goto('https://vm1.research.letswhirl.com', {
    waitUntil: 'networkidle0',
    timeout: 120000, // Increase the timeout to 120,000 ms (120 seconds)
  })
  await page.goto('https://vm1.research.letswhirl.com', {
    waitUntil: 'networkidle0',
    timeout: 120000, // Increase the timeout to 120,000 ms (120 seconds)
  })

  // Click the download button
  await page.click('#downloadVideo');

  // Wait for all requests to complete before closing the browser
  while (responseCounter < requestCounter) {
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  await browser.close();
})();
