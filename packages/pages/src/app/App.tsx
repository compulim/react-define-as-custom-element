import React, { DetailedHTMLProps, Fragment, HTMLAttributes, useCallback, useState } from 'react';
import InputBox from './InputBox.tsx';

import { defineAsCustomElement, defineAsCustomElementWithPortal } from 'react-define-as-custom-element';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface IntrinsicElements {
      'input-box': DetailedHTMLProps<HTMLAttributes<HTMLElement> & { color?: string | undefined }, HTMLElement>;
      'input-box-with-portal': DetailedHTMLProps<
        HTMLAttributes<HTMLElement> & { color?: string | undefined },
        HTMLElement
      >;
    }
  }
}

defineAsCustomElement(InputBox, 'input-box', { color: 'color' }, { shadowRoot: { mode: 'open' } });

const { Portal: InputBoxPortal } = defineAsCustomElementWithPortal(
  InputBox,
  'input-box-with-portal',
  { color: 'color' },
  { shadowRoot: { mode: 'open' } }
);

const App = () => {
  const [index, setIndex] = useState(0);

  const color = index % 2 ? 'red' : 'blue';

  const handleClick = useCallback(() => setIndex(index => index + 1), [setIndex]);

  return (
    <Fragment>
      <button onClick={handleClick} type="button">
        Click to change color
      </button>
      <h1>Normal React component</h1>
      <InputBox color={color} />
      <h1>React component as custom element</h1>
      <input-box color={color}>
        <span slot="header">The time now is</span>
      </input-box>
      <h1>React component as custom element with portal</h1>
      <InputBoxPortal />
      <input-box-with-portal color={color}>
        <span slot="header">The time now is</span>
      </input-box-with-portal>
    </Fragment>
  );
};

export default App;
