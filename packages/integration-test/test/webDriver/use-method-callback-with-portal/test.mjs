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
  await driver.get('http://web/use-method-callback-with-portal/');

  // @ts-ignore
  await driver.executeAsyncScript(done => window.__run__().then(done));

  await expect(driver.executeScript(() => document?.querySelector('body')?.getHTML().trim())).resolves.toBe(
    '<main></main>\n    <use-method-callback--my-label><dl><dt></dt><dd></dd></dl></use-method-callback--my-label>'
  );

  await expect(
    driver.executeScript(() => {
      /** @type {(Element & { setLabel: (label: string) => string }) | null} */
      const element = document?.querySelector('use-method-callback--my-label');

      return element && element.setLabel('First name');
    })
  ).resolves.toBe('First name\n');

  await expect(
    driver.executeScript(() => {
      /** @type {(Element & { setValue: (value: string) => string }) | null} */
      const element = document?.querySelector('use-method-callback--my-label');

      return element && element.setValue('John');
    })
  ).resolves.toBe('First name\nJohn');

  await expect(driver.executeScript(() => document?.querySelector('body')?.getHTML().trim())).resolves.toBe(
    '<main></main>\n    <use-method-callback--my-label><dl><dt>First name</dt><dd>John</dd></dl></use-method-callback--my-label>'
  );

  await expect(
    driver.executeScript(() => {
      /** @type {(Element & { setLabel: (label: string) => string }) | null} */
      const element = document?.querySelector('use-method-callback--my-label');

      return element && element.setLabel('Last name');
    })
  ).resolves.toBe('Last name\nJohn');

  await expect(
    driver.executeScript(() => {
      /** @type {(Element & { setValue: (value: string) => string }) | null} */
      const element = document?.querySelector('use-method-callback--my-label');

      return element && element.setValue('Doe');
    })
  ).resolves.toBe('Last name\nDoe');

  await expect(driver.executeScript(() => document?.querySelector('body')?.getHTML().trim())).resolves.toBe(
    '<main></main>\n    <use-method-callback--my-label><dl><dt>Last name</dt><dd>Doe</dd></dl></use-method-callback--my-label>'
  );
});
