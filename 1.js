  // Wait for the specific payment option to be visible
  await newPage.waitForSelector('li.box-padding.paymode-item[data-cy="UPI-paymode-icon"]', { visible: true });

  // Scroll the payment option into view
  // Increase timeout and wait for UPI Options section
  await newPage.waitForSelector('li.box-padding.paymode-item[data-cy="UPI-paymode-icon"]', { visible: true, timeout: 60000 });
  
  
  // Query for the UPI Options element handle.
  const upiOptionsElement = await newPage.waitForSelector('li.box-padding.paymode-item[data-cy="UPI-paymode-icon"]', { visible: true, timeout: 60000 });
  
  // Click on the UPI Options element.
  await upiOptionsElement.click();
  console.log("UPI Options clicked.");
  
  








   // Click UPI Options in the Payment section
   await page.waitForSelector('.payment__options__tab');
   await page.click('.payment__options__tab ul li.box-padding.paymode-item:first-child');
   console.log("UPI Option clicked.");
   await page.screenshot({ path: 'upi_option_clicked.png', fullPage: true });
 