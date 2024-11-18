import React, { type HTMLAttributes } from 'react';
import { defineAsCustomElement } from 'react-define-as-custom-element';

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

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface IntrinsicElements {
      'shadow-root--my-description-list': HTMLAttributes<HTMLElement>;
    }
  }
}
