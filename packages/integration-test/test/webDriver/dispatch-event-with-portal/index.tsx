import React, { useCallback, useMemo } from 'react';
import { defineAsCustomElementWithPortal, useCustomElement } from 'react-define-as-custom-element';
import { render } from 'react-dom';

declare global {
  interface Window {
    __run__: (() => Promise<void> | void) | undefined;
  }
}

const MyButton = () => {
  const [element] = useCustomElement();

  const dispatchEvent = useMemo(() => element.dispatchEvent.bind(element), [element]);

  const handleClick = useCallback(
    () => dispatchEvent(new CustomEvent('telemetry', { bubbles: true, detail: 'Click me' })),
    [dispatchEvent]
  );

  return <button onClick={handleClick}>Click me</button>;
};

const { Portal } = defineAsCustomElementWithPortal(MyButton, 'dispatch-event-with-portal--my-button', {});

window.__run__ = () => {
  const mainElement = document.querySelector('main') || undefined;

  return mainElement && new Promise<void>(resolve => render(<Portal />, mainElement, resolve));
};

navigator.webdriver || window.__run__();
