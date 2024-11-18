import { expect } from 'expect';
import { afterEach, beforeEach, it } from 'mocha';
import { Browser, Builder, By } from 'selenium-webdriver';

/** @type {import("selenium-webdriver").ThenableWebDriver} */
let driver;

beforeEach(() => {
  driver = new Builder().forBrowser(Browser.CHROME).usingServer('http://localhost:4444/wd/hub').build();
});

afterEach(() => driver?.quit());

it('should have dispatchEvent prop', async () => {
  await driver.get('http://web/dispatch-event/');

  await driver.findElement(By.css('button')).click();

  // @ts-ignore
  await driver.wait(() => driver.executeScript(() => !!window.__lastTelemetryEvent__, 1000));

  await expect(
    driver.executeScript(() => {
      const {
        detail,
        type
        // @ts-ignore
      } = window.__lastTelemetryEvent__;

      return { detail, type };
    })
  ).resolves.toEqual(expect.objectContaining({ detail: 'Click me', type: 'telemetry' }));
});
