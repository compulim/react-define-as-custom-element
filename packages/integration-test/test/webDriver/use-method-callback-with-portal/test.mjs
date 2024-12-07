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
      /** @type {(Element & { setProps: (props: { label: string; value: string; }) => void }) | null} */
      const element = document?.querySelector('use-method-callback--my-label');

      return element && element.setProps({ label: 'Name', value: 'John Doe' });
    })
  ).resolves.toBe('Name\nJohn Doe');

  await expect(driver.executeScript(() => document?.querySelector('body')?.getHTML().trim())).resolves.toBe(
    '<main></main>\n    <use-method-callback--my-label><dl><dt>Name</dt><dd>John Doe</dd></dl></use-method-callback--my-label>'
  );
});
