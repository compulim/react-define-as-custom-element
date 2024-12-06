import { expect } from 'expect';
import { afterEach, beforeEach, it } from 'mocha';
import { Browser, Builder, By } from 'selenium-webdriver';

/** @type {import("selenium-webdriver").WebDriver} */
let driver;

beforeEach(async () => {
  driver = await new Builder().forBrowser(Browser.CHROME).usingServer('http://localhost:4444/wd/hub').build();
});

afterEach(() => driver?.quit());

it('should receive slot event from custom element', async () => {
  await driver.get('http://web/slot-event/');

  await driver.findElement(By.css('button')).click();

  await expect(
    driver.executeScript(() => ({
      tagName:
        window?.__lastClickEvent__?.target &&
        'tagName' in window.__lastClickEvent__.target &&
        window.__lastClickEvent__.target.tagName,
      type: window.__lastClickEvent__?.type
    }))
  ).resolves.toEqual(
    expect.objectContaining({
      tagName: 'BUTTON',
      type: 'click'
    })
  );
});
