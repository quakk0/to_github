import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import { expect } from 'chai';

describe('UI Test with Selenium (Headless Chrome)', function () {
  this.timeout(20000); // give browser time to load

  let driver;

  before(async () => {
    const options = new chrome.Options();
    options.addArguments('--headless', '--no-sandbox', '--disable-dev-shm-usage');

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

  it('should submit the form and redirect to the result page', async () => {
    const input = await driver.findElement(By.name('term'));
    await input.sendKeys('selenium test');

    const submit = await driver.findElement(By.css('button[type="submit"]'));
    await submit.click();

    await driver.wait(until.urlContains('/result'), 5000);
    const body = await driver.findElement(By.tagName('body'));
    const text = await body.getText();

    expect(text).to.include('selenium test');
  });
});
