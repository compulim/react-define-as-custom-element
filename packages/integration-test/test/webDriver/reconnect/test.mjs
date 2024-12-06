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
  await driver.get('http://web/reconnect/');

  // THEN: Should appear in DOM.
  await expect(driver.executeScript(() => document.querySelector('main')?.outerHTML)).resolves.toEqual(
    '<main><reconnect--intercepted-header value="Hello, World!"><h1>Hello, World!</h1></reconnect--intercepted-header></main>'
  );

  await expect(driver.executeScript(() => window.__connectedCallback__)).resolves.toEqual({ mock: { calls: [[]] } });
  await expect(driver.executeScript(() => window.__disconnectedCallback__)).resolves.toEqual({ mock: { calls: [] } });
  await expect(driver.executeScript(() => window.__mount__)).resolves.toEqual({ mock: { calls: [[]] } });
  await expect(driver.executeScript(() => window.__render__)).resolves.toEqual({
    mock: { calls: [['Hello, World!']] }
  });
  await expect(driver.executeScript(() => window.__unmount__)).resolves.toEqual({ mock: { calls: [] } });

  // WHEN: Removed from DOM.
  await driver.executeScript(() => document.querySelector('main')?.replaceChildren());

  // THEN: Should be removed from DOM.
  await expect(driver.executeScript(() => document.querySelector('main')?.outerHTML)).resolves.toEqual('<main></main>');

  // THEN: Should disconnect but not unmount.
  await expect(driver.executeScript(() => window.__connectedCallback__)).resolves.toEqual({ mock: { calls: [[]] } });
  await expect(driver.executeScript(() => window.__disconnectedCallback__)).resolves.toEqual({ mock: { calls: [[]] } });
  await expect(driver.executeScript(() => window.__mount__)).resolves.toEqual({ mock: { calls: [[]] } });
  await expect(driver.executeScript(() => window.__render__)).resolves.toEqual({
    mock: { calls: [['Hello, World!']] }
  });
  await expect(driver.executeScript(() => window.__unmount__)).resolves.toEqual({ mock: { calls: [] } });

  // WHEN: Setting attribute while the element is disconnected.
  // @ts-expect-error
  await driver.executeScript(() => window.__element__.setAttribute('value', 'Aloha!'));

  // THEN: Should not trigger render as the element is not connected.
  await expect(driver.executeScript(() => window.__render__)).resolves.toEqual({
    mock: { calls: [['Hello, World!']] }
  });

  // WHEN: Reconnecting the element.
  // @ts-expect-error
  await driver.executeScript(() => document.querySelector('main')?.replaceChildren(window.__element__));

  // THEN: Should appear in DOM with updated value.
  await expect(driver.executeScript(() => document.querySelector('main')?.outerHTML)).resolves.toEqual(
    '<main><reconnect--intercepted-header value="Aloha!"><h1>Aloha!</h1></reconnect--intercepted-header></main>'
  );

  // THEN: Should connect again without additional mount.
  await expect(driver.executeScript(() => window.__connectedCallback__)).resolves.toEqual({
    mock: { calls: [[], []] }
  });
  await expect(driver.executeScript(() => window.__disconnectedCallback__)).resolves.toEqual({ mock: { calls: [[]] } });
  await expect(driver.executeScript(() => window.__mount__)).resolves.toEqual({ mock: { calls: [[]] } });
  await expect(driver.executeScript(() => window.__render__)).resolves.toEqual({
    mock: { calls: [['Hello, World!'], ['Aloha!']] }
  });
  await expect(driver.executeScript(() => window.__unmount__)).resolves.toEqual({ mock: { calls: [] } });

  // WHEN: Explicitly disposed.
  await driver.executeScript(() => {
    document.querySelector('main')?.replaceChildren();

    // @ts-expect-error
    window.__element__[Symbol.dispose]();

    // @ts-expect-error
    delete window.__element__;
  });

  // THEN: Should remove from DOM.
  await expect(driver.executeScript(() => document.querySelector('main')?.outerHTML)).resolves.toEqual('<main></main>');

  // THEN: Should be unmounted.
  await expect(driver.executeScript(() => window.__connectedCallback__)).resolves.toEqual({
    mock: { calls: [[], []] }
  });
  await expect(driver.executeScript(() => window.__disconnectedCallback__)).resolves.toEqual({
    mock: { calls: [[], []] }
  });
  await expect(driver.executeScript(() => window.__mount__)).resolves.toEqual({ mock: { calls: [[]] } });
  await expect(driver.executeScript(() => window.__render__)).resolves.toEqual({
    mock: { calls: [['Hello, World!'], ['Aloha!']] }
  });
  await expect(driver.executeScript(() => window.__unmount__)).resolves.toEqual({ mock: { calls: [[]] } });
});
