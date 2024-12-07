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
  await driver.get('http://web/use-method-callback/');

  await expect(driver.executeScript(() => document?.querySelector('body')?.getHTML().trim())).resolves.toBe(
    '<use-method-callback--my-label><dl><dt></dt><dd></dd></dl></use-method-callback--my-label>'
  );

  await expect(
    driver.executeScript(() => {
      /** @type {(Element & { setProps: (props: { label: string; value: string; }) => void }) | null} */
      const element = document?.querySelector('use-method-callback--my-label');

      return element && element.setProps({ label: 'First name', value: 'John' });
    })
  ).resolves.toBe('First name\nJohn');

  await expect(driver.executeScript(() => document?.querySelector('body')?.getHTML().trim())).resolves.toBe(
    '<use-method-callback--my-label><dl><dt>First name</dt><dd>John</dd></dl></use-method-callback--my-label>'
  );

  await expect(
    driver.executeScript(() => {
      /** @type {(Element & { setProps: (props: { label: string; value: string; }) => void }) | null} */
      const element = document?.querySelector('use-method-callback--my-label');

      return element && element.setProps({ label: 'Last name', value: 'Doe' });
    })
  ).resolves.toBe('Last name\nDoe');

  await expect(driver.executeScript(() => document?.querySelector('body')?.getHTML().trim())).resolves.toBe(
    '<use-method-callback--my-label><dl><dt>Last name</dt><dd>Doe</dd></dl></use-method-callback--my-label>'
  );
});
