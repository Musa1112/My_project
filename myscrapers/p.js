const puppeteer = require ('puppeteer');
const fs = require ('fs/promises');async function bot (){
    const browser = await puppeteer.launch({headless:false,  executablePath: `C:/\Program Files/\Google/\Chrome/\Application/\chrome.exe` })
    
    const urls = [`https://www.ciceksepeti.com/taki-modelleri`,`https://www.ciceksepeti.com/taki-modelleri?page=`]


    for (const url of urls) {
      if (!url.includes(`page`)) {
        const page = await browser.newPage()
        await page.goto(url,{
            waitUntil: `domcontentloaded`,
            timeout: 60 * 1000
          });
          

          //evaluating
          const priceElement = await page.evaluate(() => {
          const productElements = Array.from(document.querySelectorAll('.products__item-details'));
          const imageElements = Array.from(document.querySelectorAll('.products__item-img')); // Separate selector
        
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
        

      // Now you have an array of objects with the extracted data:


      console.log(priceElement);
      page.close()
      } else if (url.includes(`page`)) {
        for (let index = 2; index < 10; index++) {
          const new_url = `https://www.ciceksepeti.com/taki-modelleri?page=${index}`
          
          const page = await browser.newPage()
      await page.goto(new_url,{
          waitUntil: `domcontentloaded`,
          timeout: 60 * 1000
      });
      

      //evaluating
      const priceElement = await page.evaluate(() => {
      const productElements = Array.from(document.querySelectorAll('.products__item-details'));
      const imageElements = Array.from(document.querySelectorAll('.products__item-img')); // Separate selector
    
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
    

  // Now you have an array of objects with the extracted data:


    console.log(priceElement);
    page.close()
          
        }      
      }      
    }

    

    await browser.close();

}

bot();