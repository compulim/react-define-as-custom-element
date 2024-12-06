import { expect } from 'expect';
import { afterEach, beforeEach, it } from 'mocha';
import { Browser, Builder } from 'selenium-webdriver';

/** @type {import("selenium-webdriver").WebDriver} */
let driver;

beforeEach(async () => {
  driver = await new Builder().forBrowser(Browser.CHROME).usingServer('http://localhost:4444/wd/hub').build();
});

afterEach(() => driver?.quit());

it('should mount as custom elements and observe attribute change', async () => {
  await driver.get('http://web/set-attribute/');

  await driver.wait(() =>
    driver.executeScript(() => {
      const customElement = document.body.querySelector('set-attribute--my-badge');

      return customElement && '_reactRootContainer' in (customElement.shadowRoot || customElement);
    })
  );

  await expect(driver.executeScript(() => document?.querySelector('body')?.getHTML().trim())).resolves.toBe(
    '<set-attribute--my-badge class="badge" data-value="Hello, World!" something="123"><span>badge 123 Hello, World!</span></set-attribute--my-badge>'
  );

  await driver.executeScript(() => {
    /** @type {HTMLElement | null} */
    const element = document?.querySelector('set-attribute--my-badge');

    if (element) {
      // Setting class will trigger `attributeChangedCallback`.
      element.classList.add('badge--highlight');

      // Setting `dataset` will trigger `attributeChangedCallback`.
      element.dataset['value'] = 'Aloha!';

      // Setting via `setAttribute` function will trigger `attributeChangedCallback`.
      element.setAttribute('something', '789');
    }
  });

  await expect(driver.executeScript(() => document?.querySelector('body')?.getHTML().trim())).resolves.toBe(
    '<set-attribute--my-badge class="badge badge--highlight" data-value="Aloha!" something="789"><span>badge badge--highlight 789 Aloha!</span></set-attribute--my-badge>'
  );
});
