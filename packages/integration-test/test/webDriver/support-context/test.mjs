import { expect } from 'expect';
import { afterEach, beforeEach, it } from 'mocha';
import { Browser, Builder } from 'selenium-webdriver';

/** @type {import("selenium-webdriver").WebDriver} */
let driver;

beforeEach(async () => {
  driver = await new Builder().forBrowser(Browser.CHROME).usingServer('http://localhost:4444/wd/hub').build();
});

afterEach(() => driver?.quit());

it('should work with useContext with changing values', async () => {
  await driver.get('http://web/support-context/');

  await driver.executeScript(
    /** @type {() => Promise<void> | void} */
    done => Promise.resolve(window.__run_1__?.()).then(done)
  );

  // TODO: Should use waitUntil.
  await expect(driver.executeScript(() => document?.querySelector('body')?.getHTML())).resolves.toBe(
    `
    <main></main>
    <support-context--my-input><input type="text" value="Hello, World!"></support-context--my-input>
  \n\n`
  );

  await driver.executeScript(
    /** @type {() => Promise<void> | void} */
    done => Promise.resolve(window.__run_2__?.()).then(done)
  );

  // TODO: Should use waitUntil.
  await expect(driver.executeScript(() => document?.querySelector('body')?.getHTML())).resolves.toBe(
    `
    <main></main>
    <support-context--my-input><input type="text" value="Aloha!"></support-context--my-input>
  \n\n`
  );
});
