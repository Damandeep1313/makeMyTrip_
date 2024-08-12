// server.js
import express from 'express';
import puppeteer from 'puppeteer';

const app = express();
const port = 3000; // You can choose any port you prefer

app.get('/healthCheck', async (req, res) => {
  return res.json({message:"server working fine"});
});
  


// Endpoint to run the Puppeteer script
app.get('/scrape', async (req, res) => {
  try {
    // Launch Puppeteer
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('https://www.makemytrip.com/hotels-international/united_arab_emirates/abu_dhabi-hotels/');
    
    // Click on the first hotel
    await page.waitForSelector('#Listing_hotel_0');
    const pagesBeforeClick = await browser.pages();
    await page.click('#Listing_hotel_0');
    
    // Wait for the new tab to open
    const newPage = await new Promise(resolve => {
      browser.once('targetcreated', async target => {
        const newPages = await browser.pages();
        const tab = newPages.find(p => !pagesBeforeClick.includes(p));
        resolve(tab);
      });
    });

    await newPage.waitForSelector('body', { delay: 2000 });
    await newPage.screenshot({ path: 'hotel_clicked.png', fullPage: true });
    console.log("Navigation to new tab successful.");

    // Click on the search button
    await newPage.waitForSelector('#hsw_search_button');
    await newPage.click('#hsw_search_button');
    console.log("Search button clicked.");
    await newPage.screenshot({ path: 'after_clicking_search_button.png', fullPage: true });

    // Click the "BOOK THIS NOW" button
    await newPage.waitForSelector('.bkngOption__cta');
    await newPage.click('.bkngOption__cta');
    console.log("BOOK THIS NOW button clicked.");
    await newPage.screenshot({ path: 'book_now_clicked.png', fullPage: true });

    // Fill in the form details
    await newPage.waitForSelector('#fName');
    await newPage.waitForSelector('#lName');
    await newPage.type('#fName', 'Damandeep', { delay: 100 });
    await newPage.type('#lName', 'Singh', { delay: 200 });
    await newPage.type('#email', 'damandeepsingh24090@gmail.com', { delay: 100 });
    await newPage.type('#mNo', '8307039599', { delay: 100 });
    console.log("Form details entered.");
    await newPage.screenshot({ path: 'form_filled.png', fullPage: true });

    // Click the checkbox
    await newPage.click('.checkboxWithLblWpr__label');

    // Click the "Pay Now" button
    await newPage.waitForSelector('.btnContinuePayment.primaryBtn.capText', { visible: true });
    await newPage.click('.btnContinuePayment.primaryBtn.capText');
    console.log("Pay Now button clicked.");
    await newPage.screenshot({ path: 'pay_now_clicked.png', fullPage: true });

    // Handle PAN card details and payment options
    await newPage.waitForSelector('.btnContinuePayment');
    await Promise.all([
      newPage.click('.btnContinuePayment'),
      newPage.waitForNavigation({ waitUntil: 'networkidle0' })
    ]);

    await newPage.waitForSelector('.tcsPanInputField', { visible: true });
    await newPage.type('.tcsPanInputField', 'OFRPS7700R', { delay: 100 });
    console.log("PAN number entered.");

    await newPage.evaluate(() => {
      window.scrollBy(0, 2 * window.innerHeight);
    });
    console.log("Page scrolled up.");

    const elements = await newPage.evaluate(() => Array.from(document.querySelectorAll('li.box-padding.paymode-item'), e => e.innerText));
    console.log(elements);

    await newPage.waitForSelector('p.make-flex .font12.blue-text.cursor-pointer');
    await newPage.click('p.make-flex .font12.blue-text.cursor-pointer');
    console.log("View Details clicked.");

    await newPage.waitForSelector('.blue-text.line-height17');
    await newPage.click('.blue-text.line-height17');
    console.log("Yes, Add 20% TCS clicked.");
    await newPage.screenshot({ path: 'tcs_added.png', fullPage: true });

    await newPage.waitForSelector('.payment__options__tab');
    await newPage.click('.payment__options__tab ul li.box-padding.paymode-item:first-child');
    console.log("UPI Option clicked.");
    await newPage.screenshot({ path: 'upi_option_clicked.png', fullPage: true });

    // Send a response indicating success
    res.status(200).send('Scraping and booking completed successfully.');

    // Close the browser
    await browser.close();
  } catch (error) {
    console.error("Error during scraping and booking:", error);
    res.status(500).send('An error occurred during scraping and booking.');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
