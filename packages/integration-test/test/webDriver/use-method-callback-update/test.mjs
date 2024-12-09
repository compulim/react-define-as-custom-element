import { expect } from 'expect';
import { afterEach, beforeEach, it } from 'mocha';
import { Browser, Builder } from 'selenium-webdriver';

/** @type {import("selenium-webdriver").WebDriver} */
let driver;

beforeEach(async () => {
  driver = await new Builder().forBrowser(Browser.CHROME).usingServer('http://localhost:4444/wd/hub').build();
});

afterEach(() => driver?.quit());

it('should work', async () => {
  await driver.get('http://web/use-method-callback-update/');

  // @ts-expect-error
  await expect(driver.executeScript(() => document.body.firstElementChild?.compute(1, 2))).resolves.toBe(3);

  driver.executeScript(() => document.body.firstElementChild?.setAttribute('operator', 'multiply'));

  await expect(driver.executeScript(() => document.body.textContent?.trim())).resolves.toBe('1 * 2 = 2');
});
