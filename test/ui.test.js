import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import { expect } from 'chai';

describe('UI Test with Selenium (Headless Chrome)', function () {
  this.timeout(20000);

  let driver;

  before(async () => {
    const options = new chrome.Options();
    options.addArguments('--headless', '--no-sandbox', '--disable-dev-shm-usage');
    options.setChromeBinaryPath('/usr/bin/google-chrome');

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();

    await driver.get('http://localhost:3000');
  });

  after(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  it('should display the form on the home page', async () => {
    const form = await driver.findElement(By.tagName('form'));
    expect(form).to.not.be.null;
  });
});
