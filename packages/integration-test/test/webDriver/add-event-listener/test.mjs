import { expect } from 'expect';
import { afterEach, beforeEach, it } from 'mocha';
import { Browser, Builder, By } from 'selenium-webdriver';

/** @type {import("selenium-webdriver").ThenableWebDriver} */
let driver;

beforeEach(() => {
  driver = new Builder().forBrowser(Browser.CHROME).usingServer('http://localhost:4444/wd/hub').build();
});

afterEach(() => driver?.quit());

it('should have called event listener', async () => {
  await driver.get('http://web/add-event-listener/');

  await driver.findElement(By.css('button')).click();

  // @ts-ignore
  await driver.wait(() => driver.executeScript(() => window.__handleClick__.mock.calls.length, 1000));

  // @ts-ignore
  const mock = await driver.executeScript(() => window.__handleClick__.mock);

  expect(mock.calls).toHaveLength(1);
  expect(mock.calls[0]).toEqual([{ tagName: 'BUTTON', type: 'click' }]);
});
