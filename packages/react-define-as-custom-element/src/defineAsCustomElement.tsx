import React, { type ComponentType } from 'react';
// Supports react@>=16.8<=18.
/* eslint-disable-next-line react/no-deprecated */
import { render, unmountComponentAtNode } from 'react-dom';
import CustomElementProvider from './hooks/CustomElementProvider.tsx';
import createReactCustomElement from './private/createReactCustomElement.ts';
import { AttributeAsProps, type AttributesMap, type DefineAsCustomElementInit } from './types.ts';

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
    class extends createReactCustomElement<T>(init?.builtInElement?.customElementConstructor) {
      static get observedAttributes(): readonly string[] {
        return observedAttributes;
      }

      constructor() {
        super(
          attributesMap,
          init?.methodName,
          init?.shadowRoot,
          (props, element, setMethodCallback) =>
            render(
              <CustomElementProvider<typeof props>
                componentType={componentType}
                customElement={element}
                props={props}
                setMethodCallback={setMethodCallback}
              />,
              element
            ),
          element => unmountComponentAtNode(element)
        );
      }
    },
    init?.builtInElement?.extends ? { extends: init?.builtInElement?.extends } : {}
  );
}
