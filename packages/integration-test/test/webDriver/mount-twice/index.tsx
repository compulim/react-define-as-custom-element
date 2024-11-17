import React, { Fragment, type HTMLAttributes } from 'react';
import { defineAsCustomElementWithPortal } from 'react-define-as-custom-element';
import { render } from 'react-dom';

declare global {
  interface Window {
    __clicked__: boolean;
    __run__: (() => Promise<void> | void) | undefined;
  }
}

const MyDummy = () => null;

const { Portal } = defineAsCustomElementWithPortal(MyDummy, 'mount-twice--my-dummy', {});

window.__run__ = () => {
  const mainElement = document.querySelector('main') || undefined;

  return (
    mainElement &&
    new Promise<void>(resolve => {
      render(
        <Fragment>
          <Portal />
          <Portal />
          <mount-twice--my-dummy />
        </Fragment>,
        mainElement,
        resolve
      );
    })
  );
};

navigator.webdriver || window.__run__();

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface IntrinsicElements {
      'mount-twice--my-dummy': HTMLAttributes<HTMLElement>;
    }
  }
}
