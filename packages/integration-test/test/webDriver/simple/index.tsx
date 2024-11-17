import React, { type HTMLAttributes } from 'react';
import { render } from 'react-dom';
import { defineAsCustomElement } from 'react-define-as-custom-element';

declare global {
  interface Window {
    __run_1__: (() => Promise<void> | void) | undefined;
    __run_2__: (() => Promise<void> | void) | undefined;
  }
}

const MyInput = ({ value }: { value?: string | undefined }) => <input type="text" value={value} />;

defineAsCustomElement(MyInput, 'simple--my-input', { value: 'value' });

window.__run_1__ = () => {
  const mainElement = document.querySelector('main') || undefined;

  return (
    mainElement &&
    new Promise<void>(resolve => render(<simple--my-input value="Hello, World!" />, mainElement, resolve))
  );
};

window.__run_2__ = () => {
  const mainElement = document.querySelector('main') || undefined;

  return mainElement && new Promise<void>(resolve => render(<simple--my-input value="Aloha!" />, mainElement, resolve));
};

navigator.webdriver || window.__run_1__();
navigator.webdriver || window.__run_2__();

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface IntrinsicElements {
      'simple--my-input': HTMLAttributes<HTMLElement> & { value?: string | undefined };
    }
  }
}
