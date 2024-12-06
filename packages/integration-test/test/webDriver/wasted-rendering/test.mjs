import { expect } from 'expect';
import { afterEach, beforeEach, it } from 'mocha';
import { Browser, Builder } from 'selenium-webdriver';

/** @type {import("selenium-webdriver").WebDriver} */
let driver;

beforeEach(async () => {
  driver = await new Builder().forBrowser(Browser.CHROME).usingServer('http://localhost:4444/wd/hub').build();
});

afterEach(() => driver?.quit());

it('should not render twice', async () => {
  await driver.get('http://web/wasted-rendering/');

  await driver.wait(() =>
    driver.executeScript(() => {
      const customElement = document.body.querySelector('wasted-rendering--header');

      return customElement && '_reactRootContainer' in (customElement.shadowRoot || customElement);
    })
  );

  await driver.wait(
    () =>
      driver.executeScript(
        () =>
          // @ts-ignore
          window.__done__
      ),
    2_000
  );

  await expect(driver.executeScript(() => window.__numRendered__)).resolves.toBe(1);
});
