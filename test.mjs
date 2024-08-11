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
  await newPage.waitForSelector('body',{delay:2000});
  // Take a screenshot of the new tab
  await newPage.screenshot({ path: 'hotel_clicked.png', fullPage: true });
  console.log("Navigation to new tab successful.");//--------just to confirm code runs--------









  //  // Click on the check-in date
  //  await newPage.waitForSelector('.DayPicker-Day[aria-label="Mon Aug 12 2024"]');
  //  await newPage.click('.DayPicker-Day[aria-label="Mon Aug 12 2024"]');
  //  console.log("Check-in date selected.");
 
  //  // Click on the check-out date
  //  await newPage.waitForSelector('.DayPicker-Day[aria-label="Tue Aug 13 2024"]');
  //  await newPage.click('.DayPicker-Day[aria-label="Tue Aug 13 2024"]');
  //  console.log("Check-out date selected.");
 
  //  // Optionally take a screenshot to verify
  //  await newPage.screenshot({ path: 'dates_selected.png', fullPage: true });
 
  //  // Click on apply
  //  await newPage.waitForSelector('.rmsGst__footer .primaryBtn.btnApplyNew');
  //  await newPage.click('.rmsGst__footer .primaryBtn.btnApplyNew');
  //  console.log("Apply button clicked.",{ delay: 1000 });
  //  await newPage.screenshot({ path: 'after_clicking_apply_button.png', fullPage: true });
 











   // Click on search button
  await newPage.waitForSelector('#hsw_search_button');
  await newPage.click('#hsw_search_button');
  console.log("Search button clicked.");
  await newPage.screenshot({ path: 'after_clicking_search_button.png', fullPage: true });
  //await newPage.waitForSelector('.bkngOption__cta');
















  // Click the "BOOK THIS NOW" button
  await newPage.waitForSelector('.bkngOption__cta');
  await newPage.click('.bkngOption__cta');

  console.log("BOOK THIS NOW button clicked.");

  // Optionally take a screenshot after clicking
  await newPage.screenshot({ path: 'book_now_clicked.png', fullPage: true });





  // Wait for the first name and last name fields to appear
  await newPage.waitForSelector('#fName');
  await newPage.waitForSelector('#lName');

  // Type the first name and last name
  await newPage.type('#fName', 'Damandeep', { delay: 100 });
  await newPage.type('#lName', 'Singh', { delay: 200 });
  //email
  await newPage.type('#email', 'damandeepsingh24090@gmail.com', { delay: 100 });
  await newPage.type('#mNo', '8307039599', { delay: 100 });
  console.log("Form details entered.");

  // Optionally take a screenshot after filling the form
  await newPage.screenshot({ path: 'form_filled.png', fullPage: true });





  //----------CHECKBOX------------//
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


  await newPage.evaluate(() => {
    window.scrollBy(0, 2*window.innerHeight); // Scroll down to the bottom
  });
  console.log("Page scrolled up.");




  const elements = await newPage.evaluate(() => Array.from(document.querySelectorAll('li.box-padding.paymode-item'), e => e.innerText));
console.log(elements);





// Click "View Details"
await newPage.waitForSelector('p.make-flex .font12.blue-text.cursor-pointer');
await newPage.click('p.make-flex .font12.blue-text.cursor-pointer');
console.log("View Details clicked.");




   // // Click "Yes, Add 20% TCS"
    await newPage.waitForSelector('.blue-text.line-height17');
    await newPage.click('.blue-text.line-height17');
    console.log("Yes, Add 20% TCS clicked.");
 
   // // Optionally take a screenshot after clicking
    await newPage.screenshot({ path: 'tcs_added.png', fullPage: true });
 




     // Click UPI Options in the Payment section
   await page.waitForSelector('.payment__options__tab');
   await page.click('.payment__options__tab ul li.box-padding.paymode-item:first-child');
   console.log("UPI Option clicked.");
   await page.screenshot({ path: 'upi_option_clicked.png', fullPage: true });
 

  

















//inputVpa



// await newPage.waitForSelector('#inputVpa');
//   await newPage.type('#inputVpa', '8307039599315@ptyes', { delay: 100 });
//   console.log("Payment Request Sent.");















  // Optionally close the browser
  // await browser.close();
})();