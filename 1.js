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
  
  









  