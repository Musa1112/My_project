const puppeteer = require('puppeteer');
const fs = require('fs/promises');
const ExcelJS = require('exceljs');

async function bot() {
    const browser = await puppeteer.launch({ headless: false, executablePath: `C:/Program Files/Google/Chrome/Application/chrome.exe` });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Products');

    worksheet.columns = [
        { header: 'Title', key: 'title', width: 30 },
        { header: 'Price', key: 'price', width: 15 },
        { header: 'Rating', key: 'rating', width: 15 },
        { header: 'Image Link', key: 'imageLink', width: 50 },
    ];

    const urls = [`https://www.ciceksepeti.com/taki-modelleri`, `https://www.ciceksepeti.com/taki-modelleri?page=`];

    for (const url of urls) {
        if (!url.includes(`page`)) {
            const page = await browser.newPage();
            await page.goto(url, {
                waitUntil: `domcontentloaded`,
                timeout: 60 * 1000
            });

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
                    const imageLink = imageElements[index]?.src ?? null;

                    return { title, price, rating, imageLink };
                });
            });

            // Write data to Excel
            priceElement.forEach(product => {
                worksheet.addRow(product);
            });

            page.close();
        } else if (url.includes(`page`)) {
            for (let index = 2; index < 10; index++) {
                const new_url = `https://www.ciceksepeti.com/taki-modelleri?page=${index}`;

                const page = await browser.newPage();
                await page.goto(new_url, {
                    waitUntil: `domcontentloaded`,
                    timeout: 60 * 1000
                });

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
                        const imageLink = imageElements[index]?.src ?? null;

                        return { title, price, rating, imageLink };
                    });
                });

                // Write data to Excel
                priceElement.forEach(product => {
                    worksheet.addRow(product);
                });

                page.close();
            }
        }
    }

    // Save Excel file
    await workbook.xlsx.writeFile('products.xlsx');

    await browser.close();
}

bot();
