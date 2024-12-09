import { expect } from 'expect';
import { afterEach, beforeEach, it } from 'mocha';
import { Browser, Builder } from 'selenium-webdriver';
import { Level } from 'selenium-webdriver/lib/logging.js';

/** @type {import("selenium-webdriver").WebDriver} */
let driver;

beforeEach(async () => {
  driver = await new Builder().forBrowser(Browser.CHROME).usingServer('http://localhost:4444/wd/hub').build();
});

afterEach(() => driver?.quit());

it('should work', async () => {
  await driver.get('http://web/use-method-callback-dupe/');

  await expect(driver.manage().logs().get('browser')).resolves.toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        level: Level.SEVERE,
        message: expect.stringContaining(`useMethodCallback('setValue') already registered to another function.`)
      })
    ])
  );
});
