import React, { createElement, type ComponentType } from 'react';
// Supports react@>=16.8<=18.
/* eslint-disable-next-line react/no-deprecated */
import { render, unmountComponentAtNode } from 'react-dom';
import ReactCustomElement from './ReactCustomElement.ts';
import { AttributeAsProps, type AttributesMap, type DefineAsCustomElementInit } from './types.ts';
import CustomElementProvider from './hooks/CustomElementProvider.tsx';

// export default function defineAsCustomElement<N extends string, P extends Record<N, string | undefined>>(
export default function defineAsCustomElement<T extends string>(
  componentType: ComponentType<AttributeAsProps<T>>,
  tagName: string,
  attributesMap: AttributesMap<T>,
  init?: DefineAsCustomElementInit | undefined
): void {
  const observedAttributes = Object.freeze(Object.keys(attributesMap));

  customElements.define(
    tagName,
    class extends ReactCustomElement<T> {
      static get observedAttributes(): readonly string[] {
        return observedAttributes;
      }

      constructor() {
        super(
          attributesMap,
          init?.shadowRoot,
          (props, element) =>
            render(
              <CustomElementProvider element={element}>{createElement(componentType, props)}</CustomElementProvider>,
              element
            ),
          element => unmountComponentAtNode(element)
        );
      }
    }
  );
}
