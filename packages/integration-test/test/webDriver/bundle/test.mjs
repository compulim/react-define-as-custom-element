import { expect } from 'expect';
import { afterEach, beforeEach, it } from 'mocha';
import { Browser, Builder } from 'selenium-webdriver';

/** @type {import("selenium-webdriver").WebDriver} */
let driver;

beforeEach(async () => {
  driver = await new Builder().forBrowser(Browser.CHROME).usingServer('http://localhost:4444/wd/hub').build();
});

afterEach(() => driver?.quit());

it('should mount as custom elements and observe attribute change', async () => {
  await driver.get('http://web/bundle/');

  await expect(driver.executeScript(() => document?.querySelector('body')?.getHTML().trim())).resolves.toBe(
    '<bundle--my-input value="Hello, World!"><input type="text" value="Hello, World!"></bundle--my-input>'
  );

  await driver.executeScript(
    /** @type {() => Promise<void> | void} */
    () => document.querySelector('bundle--my-input')?.setAttribute('value', 'Aloha!')
  );

  await expect(driver.executeScript(() => document?.querySelector('body')?.getHTML().trim())).resolves.toBe(
    '<bundle--my-input value="Aloha!"><input type="text" value="Aloha!"></bundle--my-input>'
  );
});
