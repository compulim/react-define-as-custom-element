import { expect } from 'expect';
import { afterEach, beforeEach, it } from 'mocha';
import { Browser, Builder } from 'selenium-webdriver';

/** @type {import("selenium-webdriver").WebDriver} */
let driver;

beforeEach(async () => {
  driver = await new Builder().forBrowser(Browser.CHROME).usingServer('http://localhost:4444/wd/hub').build();
});

afterEach(() => driver?.quit());

it('should render once', async () => {
  await driver.get('http://web/batch-attribute-change/');

  // THEN: Should appear in DOM.
  await expect(driver.executeScript(() => document.body.outerHTML)).resolves.toBe(
    '<body>\n    <batch-attribute-change--my-input label="First name" value="John"><label><div>First name</div><input type="text" value="John"></label></batch-attribute-change--my-input>\n  \n\n</body>'
  );

  // THEN: Should render props once.
  await expect(driver.executeScript(() => window.__renderProps__)).resolves.toEqual([
    { label: 'First name', value: 'John' }
  ]);

  // WHEN: Changing 2 attributes consecutively.
  await driver.executeScript(() => {
    document.body.firstElementChild?.setAttribute('label', 'Last name');
    document.body.firstElementChild?.setAttribute('value', 'Doe');
  });

  // THEN: Should appear in DOM.
  await expect(driver.executeScript(() => document.body.outerHTML)).resolves.toBe(
    '<body>\n    <batch-attribute-change--my-input label="Last name" value="Doe"><label><div>Last name</div><input type="text" value="Doe"></label></batch-attribute-change--my-input>\n  \n\n</body>'
  );

  // THEN: Should batch props change.
  await expect(driver.executeScript(() => window.__renderProps__)).resolves.toEqual([
    { label: 'First name', value: 'John' },
    { label: 'Last name', value: 'Doe' }
  ]);
});
