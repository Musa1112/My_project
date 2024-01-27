const puppeteer = require('puppeteer');
const fs = require('fs/promises');

async function bot() {
  try {
    const browser = await puppeteer.launch({ headless: false, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
    const page = await browser.newPage();

    await page.goto('https://www.ciceksepeti.com/taki-modelleri', {
      waitUntil: 'domcontentloaded',
      timeout: 60 * 1000,
    });

    // Evaluate function to scroll and scrape data
    const scrapeAndScroll = async () => {
      const results = [];
      let previousHeight;

      do {
        // Scroll to the bottom of the page
        await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
        await page.waitForTimeout(1000); // Wait for a second to let content load

        // Extract data
        const priceElement = await page.evaluate(() => {
          const productElements = Array.from(document.querySelectorAll('.products__item-details'));
          const imageElements = Array.from(document.querySelectorAll('.products__item-img'));

          return productElements.map((productElement, index) => {
            const titleElement = productElement.querySelector('.products__item-title');
            const priceElement = productElement.querySelector('.products__item-price');
            const ratingElement = productElement.querySelector('.products-stars__dropdown-evaluation');

            const title = titleElement?.textContent?.trim();
            const price = priceElement?.textContent?.trim();
            const rating = ratingElement?.textContent?.trim();

            // Associate image link using index:
            const imageLink = imageElements[index]?.src ?? null;

            return { title, price, rating, imageLink };
          });
        });

        results.push(...priceElement);

        // Get the updated height of the page
        const currentHeight = await page.evaluate('document.body.scrollHeight');

        // Continue scrolling if the height increases
        if (previousHeight && currentHeight !== previousHeight) {
          previousHeight = currentHeight;
        } else {
          break; // Exit the loop if no more content is loaded
        }
      } while (true);

      return results;
    };

    const scrapedData = await scrapeAndScroll();
    console.log(scrapedData);

    await browser.close();
  } catch (error) {
    console.error('An error occurred:', error.message);
  }
}

bot();
