const Browser = require('zombie');
const browser = new Browser();
const url = 'https://vm1.research.letswhirl.com';

browser.visit(url, function() {
  console.log('Visited the page:', url);

  const images = browser.queryAll('img');
  const imageLoadTimings = [];

  if (images.length < 3) {
    console.error('At least 3 images are expected to be on the page');
    process.exit(1);
  }

  let imagesLoaded = 0;

  images.forEach((img, index) => {
    const imgElement = new Image();
    const startTime = new Date().getTime();

    imgElement.onload = function() {
      const endTime = new Date().getTime();
      const loadTime = endTime - startTime;

      imageLoadTimings[index] = loadTime;
      imagesLoaded++;

      if (imagesLoaded === 3) {
        console.log('Image load timings:', imageLoadTimings);
        process.exit(0);
      }
    };

    imgElement.src = img.src;
  });
});
