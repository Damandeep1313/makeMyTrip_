import express from 'express';
import puppeteer from 'puppeteer';

const app = express();
const port = 3000; // You can choose any port you prefer

app.get('/scrape', async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    mobile,
    panNumber,
    cardNumber,
    nameOnCard,
    expiryMonth,
    expiryYear,
    cvv
  } = req.query;

  if (!firstName || !lastName || !email || !mobile || !panNumber || !cardNumber || !nameOnCard || !expiryMonth || !expiryYear || !cvv) {
    return res.status(400).send("Missing required query parameters.");
  }

  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://www.makemytrip.com/hotels-international/united_arab_emirates/abu_dhabi-hotels/');
    
    await page.waitForSelector('#Listing_hotel_0');
    const pagesBeforeClick = await browser.pages();
    await page.click('#Listing_hotel_0');

    const newPage = await new Promise(resolve => {
      browser.once('targetcreated', async target => {
        const newPages = await browser.pages();
        const newTab = newPages.find(p => !pagesBeforeClick.includes(p));
        resolve(newTab);
      });
    });

    await newPage.waitForSelector('body', { delay: 2000 });
    await newPage.screenshot({ path: 'hotel_clicked.png', fullPage: true });
    console.log("Navigation to new tab successful.");

    await newPage.waitForSelector('#hsw_search_button');
    await newPage.click('#hsw_search_button');
    console.log("Search button clicked.");
    await newPage.screenshot({ path: 'after_clicking_search_button.png', fullPage: true });

    await newPage.waitForSelector('.bkngOption__cta');
    await newPage.click('.bkngOption__cta');
    console.log("BOOK THIS NOW button clicked.");
    await newPage.screenshot({ path: 'book_now_clicked.png', fullPage: true });

    await newPage.waitForSelector('#fName');
    await newPage.waitForSelector('#lName');
    await newPage.type('#fName', firstName, { delay: 100 });
    await newPage.type('#lName', lastName, { delay: 200 });
    await newPage.type('#email', email, { delay: 100 });
    await newPage.type('#mNo', mobile, { delay: 100 });
    console.log("Form details entered.");
    await newPage.screenshot({ path: 'form_filled.png', fullPage: true });

    await newPage.click('.checkboxWithLblWpr__label');
    await newPage.waitForSelector('.btnContinuePayment.primaryBtn.capText', { visible: true });
    console.log("Pay Now button is visible.");

    try {
      await newPage.click('.btnContinuePayment.primaryBtn.capText');
      console.log("Pay Now button clicked.");
    } catch (error) {
      console.error("Failed to click the Pay Now button:", error);
    }

    await newPage.screenshot({ path: 'pay_now_clicked.png', fullPage: true });

    await newPage.waitForSelector('.btnContinuePayment');
    await Promise.all([
      newPage.click('.btnContinuePayment'),
      newPage.waitForNavigation({ waitUntil: 'networkidle0' })
    ]);

    await newPage.waitForSelector('.tcsPanInputField', { visible: true });
    await newPage.type('.tcsPanInputField', panNumber, { delay: 100 });
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

    // Click on the Credit/Debit/ATM Card Option
    await newPage.waitForSelector('.payment__options__tab');
    await newPage.click('.payment__options__tab ul li.box-padding.paymode-item:nth-child(2)');
    console.log("Credit/Debit/ATM Card Option clicked.");
    await newPage.screenshot({ path: 'card_option_clicked.png', fullPage: true });

    await newPage.waitForSelector('#cardNumber');
    await newPage.type('#cardNumber', cardNumber, { delay: 100 });

    await newPage.waitForSelector('#nameOnCard');
    await newPage.type('#nameOnCard', nameOnCard, { delay: 100 });

    await newPage.waitForSelector('select[name="expiryMonth"]');
    await newPage.select('select[name="expiryMonth"]', expiryMonth);
    console.log(`${expiryMonth} selected.`);

    await newPage.waitForSelector('select[name="Year"]');
    await newPage.select('select[name="Year"]', expiryYear);
    console.log(`Year ${expiryYear} selected.`);

    await newPage.waitForSelector('#cardCvv');
    await newPage.type('#cardCvv', cvv, { delay: 100 });
    console.log(`CVV ${cvv} entered.`);

    await newPage.waitForSelector('.prime__btn');
    await newPage.click('.prime__btn');

    console.log("Payment Request Sent.");

    res.status(200).send("Scraping and booking completed successfully.");
  } catch (error) {
    console.error("Error during scraping and booking:", error);
    res.status(500).send("An error occurred during scraping and booking.");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
