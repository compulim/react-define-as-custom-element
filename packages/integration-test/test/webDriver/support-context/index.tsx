import React, { createContext, useContext } from 'react';
import { defineAsCustomElementWithPortal } from 'react-define-as-custom-element';
// eslint-disable-next-line react/no-deprecated
import { render } from 'react-dom';

declare global {
  interface Window {
    __run_1__: (() => Promise<void> | void) | undefined;
    __run_2__: (() => Promise<void> | void) | undefined;
  }
}

const MyContext = createContext<{ value: string }>({ value: 'NOT CONNECTED' });
const MyInput = () => {
  const { value } = useContext(MyContext);

  return <input type="text" value={value} />;
};

const { Portal } = defineAsCustomElementWithPortal(MyInput, 'support-context--my-input', {});

window.__run_1__ = async () => {
  const mainElement = document.querySelector('main') || undefined;

  return (
    mainElement &&
    new Promise(resolve =>
      render(
        <MyContext.Provider value={{ value: 'Hello, World!' }}>
          <Portal />
        </MyContext.Provider>,
        mainElement,
        resolve
      )
    )
  );
};

window.__run_2__ = async () => {
  const mainElement = document.querySelector('main') || undefined;

  return (
    mainElement &&
    new Promise(resolve =>
      render(
        <MyContext.Provider value={{ value: 'Aloha!' }}>
          <Portal />
        </MyContext.Provider>,
        mainElement,
        resolve
      )
    )
  );
};

navigator.webdriver || window.__run_1__?.();
navigator.webdriver || window.__run_2__?.();
