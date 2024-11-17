import React, { Fragment, useEffect, type HTMLAttributes } from 'react';
import { defineAsCustomElementWithPortal, useDispatchEvent } from 'react-define-as-custom-element';
import { render } from 'react-dom';

declare global {
  interface Window {
    __clicked__: boolean;
    __run__: (() => Promise<void> | void) | undefined;
  }
}

const MyButton = () => {
  const dispatchEvent = useDispatchEvent();

  useEffect(() => {
    dispatchEvent(new CustomEvent('click', { bubbles: true }));
  }, [dispatchEvent]);

  return null;
};

const { Portal } = defineAsCustomElementWithPortal(MyButton, 'dispatch-event--my-button', {});

window.__clicked__ = false;

window.__run__ = () => {
  window.addEventListener('click', () => {
    window.__clicked__ = true;
  });

  const mainElement = document.querySelector('main') || undefined;

  return (
    mainElement &&
    new Promise<void>(resolve =>
      render(
        <Fragment>
          <Portal />
          <dispatch-event--my-button />
        </Fragment>,
        mainElement,
        resolve
      )
    )
  );
};

navigator.webdriver || window.__run__();

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface IntrinsicElements {
      'dispatch-event--my-button': HTMLAttributes<HTMLElement>;
    }
  }
}
