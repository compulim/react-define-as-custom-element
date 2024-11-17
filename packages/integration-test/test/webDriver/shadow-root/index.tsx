import React, { type HTMLAttributes } from 'react';
import { defineAsCustomElement } from 'react-define-as-custom-element';
import { render } from 'react-dom';

declare global {
  interface Window {
    __run__: (() => Promise<void> | void) | undefined;
  }
}

const MyDescriptionList = () => {
  return (
    <dl>
      <dt>
        <slot name="title" />
      </dt>
      <dd>
        <slot name="value" />
      </dd>
    </dl>
  );
};

defineAsCustomElement(
  MyDescriptionList,
  'shadow-root--my-description-list',
  {},
  { shadowRoot: { mode: 'open', serializable: true } }
);

window.__run__ = async () => {
  const mainElement = document.querySelector('main') || undefined;

  return (
    mainElement &&
    new Promise(resolve =>
      render(
        <shadow-root--my-description-list>
          <span slot="title">Name</span>
          <span slot="value">John Doe</span>
        </shadow-root--my-description-list>,
        mainElement,
        resolve
      )
    )
  );
};

navigator.webdriver || window.__run__?.();

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface IntrinsicElements {
      'shadow-root--my-description-list': HTMLAttributes<HTMLElement>;
    }
  }
}
