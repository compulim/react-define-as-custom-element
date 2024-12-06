import { expect } from 'expect';
import { afterEach, beforeEach, it } from 'mocha';
import { Browser, Builder } from 'selenium-webdriver';

/** @type {import("selenium-webdriver").WebDriver} */
let driver;

beforeEach(async () => {
  driver = await new Builder().forBrowser(Browser.CHROME).usingServer('http://localhost:4444/wd/hub').build();
});

afterEach(() => driver?.quit());

it('should work with shadowRoot', async () => {
  await driver.get('http://web/shadow-root/');

  await expect(
    driver.executeScript(() =>
      document
        ?.querySelector('body')
        ?.getHTML({
          serializableShadowRoots: true
        })
        .trim()
    )
  ).resolves.toBe(
    `<shadow-root--my-description-list><template shadowrootmode="open" shadowrootserializable=""><dl><dt><slot name="title"></slot></dt><dd><slot name="value"></slot></dd></dl></template>
      <span slot="title">Name</span>
      <span slot="value">John Doe</span>
    </shadow-root--my-description-list>`
  );
});
