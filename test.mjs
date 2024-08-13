import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://www.makemytrip.com/hotels-international/united_arab_emirates/abu_dhabi-hotels/');
  
  await page.waitForSelector('#Listing_hotel_0');
  // Capture the currently open pages
  const pagesBeforeClick = await browser.pages();
  // Perform the click that opens a new tab
  await page.click('#Listing_hotel_0');

  // Wait for the new tab to open (we compare the pages before and after the click)
  const newPage = await new Promise(resolve => {
    browser.once('targetcreated', async target => {
      const newPages = await browser.pages();
      const newTab = newPages.find(p => !pagesBeforeClick.includes(p));
      resolve(newTab);
    });
  });

  // Wait for the new tab to fully load
  await newPage.waitForSelector('body', { timeout: 10000 });
  console.log("Navigation to new tab successful.");

  // Click the "BOOK THIS NOW" button
  await newPage.waitForSelector('.bkngOption__cta');
  await newPage.click('.bkngOption__cta');
  console.log("BOOK THIS NOW button clicked.");

  // Optionally take a screenshot after clicking
  await newPage.screenshot({ path: 'book_now_clicked.png', fullPage: true });

  // Wait for the form fields to appear
  await newPage.waitForSelector('#fName');
  await newPage.waitForSelector('#lName');

  // Type the first name, last name, email, and mobile number
  await newPage.type('#fName', 'Damandeep', { delay: 100 });
  await newPage.type('#lName', 'Singh', { delay: 200 });
  await newPage.type('#email', 'damandeepsingh24090@gmail.com', { delay: 100 });
  await newPage.type('#mNo', '8307039599', { delay: 100 });
  console.log("Form details entered.");

  // Optionally take a screenshot after filling the form
  await newPage.screenshot({ path: 'form_filled.png', fullPage: true });

  // Click the checkbox
  await newPage.click('.checkboxWithLblWpr__label');

  // Click the "Pay Now" button
  await newPage.waitForSelector('.btnContinuePayment.primaryBtn.capText', { visible: true });
  console.log("Pay Now button is visible.");

  try {
    await newPage.click('.btnContinuePayment.primaryBtn.capText');
    console.log("Pay Now button clicked.");
  } catch (error) {
    console.error("Failed to click the Pay Now button:", error);
  }

  // Optionally take a screenshot to verify
  await newPage.screenshot({ path: 'pay_now_clicked.png', fullPage: true });

  //------------PAN CARD-------------//
  // Click "Pay Now" button and wait for the new page
  await newPage.waitForSelector('.btnContinuePayment');
  await Promise.all([
    newPage.click('.btnContinuePayment'),
    newPage.waitForNavigation({ waitUntil: 'networkidle0' }) // Ensure the new page has loaded
  ]);

  // Interact with the new page
  await newPage.waitForSelector('.tcsPanInputField', { visible: true });
  await newPage.type('.tcsPanInputField', 'OFRPS7700R', { delay: 100 });
  console.log("PAN number entered.");

  // Scroll down to the bottom of the page
  await newPage.evaluate(() => {
    window.scrollBy(0, 2 * window.innerHeight); // Scroll down
  });
  console.log("Page scrolled down.");

  // Optionally take a screenshot to verify
  await newPage.screenshot({ path: 'pan_card_filled.png', fullPage: true });

  //-----------UPI OPTIONS SECTION-----------//
  // Click UPI Options in the Payment section
  await newPage.waitForSelector('.payment__options__tab',{delay:10000});
  await newPage.click('.payment__options__tab ul li.box-padding.paymode-item:first-child');
  console.log("UPI Option clicked.");

  // Optionally take a screenshot to verify
  await newPage.screenshot({ path: 'upi_option_clicked.png', fullPage: true });

  // Optionally close the browser
  // await browser.close();
})();
