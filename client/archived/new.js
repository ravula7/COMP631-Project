const puppeteer = require('puppeteer');

async function measureRequestTime(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const client = await page.target().createCDPSession();

  await client.send('Network.enable');
  const requestTimes = {};
  const responseTimes = {};
  const responseURLs = {};

  client.on('Network.requestWillBeSent', (event) => {
    requestTimes[event.requestId] = event.timestamp;
  });

  client.on('Network.responseReceived', (event) => {
    responseURLs[event.requestId] = event.response.url;
  });

  client.on('Network.loadingFinished', (event) => {
    const startTime = requestTimes[event.requestId];
    if (startTime) {
      responseTimes[event.requestId] = (event.timestamp - startTime) * 1000;
    }
  });

  await page.goto(url, { waitUntil: 'networkidle0' });

  const imageRequestTimes = {};

  for (const [requestId, time] of Object.entries(responseTimes)) {
    const url = responseURLs[requestId];
    if (url && url.match(/\.(jpg|jpeg|png|gif)$/)) {
      imageRequestTimes[url] = time;
    }
  }

  const totalRequestTime = Object.values(responseTimes).reduce((sum, time) => sum + time, 0);

  console.log(`Total request time for ${url}: ${totalRequestTime.toFixed(2)} ms`);
  console.log('Request times for each image:');
  console.log(imageRequestTimes);

  await browser.close();
}

const url = 'https://vm1.research.letswhirl.com';

measureRequestTime(url);
