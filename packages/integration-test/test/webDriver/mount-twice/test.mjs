import { expect } from 'expect';
import { afterEach, beforeEach, it } from 'mocha';
import { Browser, Builder, logging } from 'selenium-webdriver';

/** @type {import("selenium-webdriver").WebDriver} */
let driver;

beforeEach(async () => {
  driver = await new Builder().forBrowser(Browser.CHROME).usingServer('http://localhost:4444/wd/hub').build();
});

afterEach(() => driver?.quit());

it('should throw when mounting Portal twice', async () => {
  await driver.get('http://web/mount-twice/');

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

  await expect(driver.executeScript(() => document.querySelector('main')?.childElementCount)).resolves.toBe(0);

  await expect(driver.manage().logs().get('browser')).resolves.toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        level: logging.Level.SEVERE,
        message: expect.stringContaining('Portal already mounted.')
      })
    ])
  );
});
