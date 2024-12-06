import { expect } from 'expect';
import { afterEach, beforeEach, it } from 'mocha';
import { Browser, Builder } from 'selenium-webdriver';

/** @type {import("selenium-webdriver").ThenableWebDriver} */
let driver;

beforeEach(() => {
  driver = new Builder().forBrowser(Browser.CHROME).usingServer('http://localhost:4444/wd/hub').build();
});

afterEach(() => driver?.quit());

it('should extend from built-in element', async () => {
  await driver.get('http://web/built-in-element/');

  await driver.wait(() =>
    driver.executeScript(() => {
      const customElement = document.body.querySelector('[is="built-in-element--my-button"]');

      return customElement && '_reactRootContainer' in (customElement.shadowRoot || customElement);
    })
  );

  await expect(driver.executeScript(() => document.querySelector('button')?.textContent)).resolves.toBe(
    'Hello, World!'
  );
});
