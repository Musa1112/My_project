const puppeteer = require('puppeteer');

(async () => {
    const url = 'https://apify.com';

    const browser = await puppeteer.launch({
        headless:false,
        executablePath: `C:/\Program Files/\Google/\Chrome/\Application/\chrome.exe`
    })
    
    const page = await browser.newPage()
    await page.goto(url, {
        waitUntil: `domcontentloaded`,
        timeout: 60 * 1000
    })

    //
    console.log(await page.content());
    
    await browser.close()
})()





