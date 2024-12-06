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
  await driver.get('http://web/dispatch-event-with-portal/');

  await driver.executeScript(
    /** @type {() => Promise<void> | void} */
    done => Promise.resolve(window['__run__']?.()).then(done)
  );

  await driver.wait(() =>
    driver.executeScript(() => {
      const customElement = document.body.querySelector('main');

      return customElement && '_reactRootContainer' in (customElement.shadowRoot || customElement);
    })
  );

  await driver.findElement(By.css('button')).click();

  // @ts-ignore
  await driver.wait(() => driver.executeScript(() => !!window.__lastTelemetryEvent__, 1000));

  await expect(
    driver.executeScript(() => {
      const {
        detail,
        srcElement: { tagName },
        type
        // @ts-ignore
      } = window.__lastTelemetryEvent__;

      return { detail, tagName, type };
    })
  ).resolves.toEqual(
    expect.objectContaining({ detail: 'Click me', tagName: 'DISPATCH-EVENT-WITH-PORTAL--MY-BUTTON', type: 'telemetry' })
  );
});
