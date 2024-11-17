import React, { useEffect, type HTMLAttributes } from 'react';
import { defineAsCustomElement, useDispatchEvent } from 'react-define-as-custom-element';
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

defineAsCustomElement(MyButton, 'dispatch-event--my-button', {});

window.__clicked__ = false;

window.__run__ = () => {
  window.addEventListener('click', () => {
    window.__clicked__ = true;
  });

  const mainElement = document.querySelector('main') || undefined;

  return mainElement && new Promise<void>(resolve => render(<dispatch-event--my-button />, mainElement, resolve));
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
