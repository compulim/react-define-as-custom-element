import mathRandom from 'math-random';
import React, { Fragment, memo, useEffect, useState, type ComponentType } from 'react';
import { createPortal } from 'react-dom';
import createReactCustomElement from './private/createReactCustomElement.ts';
import CustomElementProvider from './hooks/CustomElementProvider.tsx';
import signalingState from './signalingState.ts';
import { type AttributeAsProps, type AttributesMap, type DefineAsCustomElementInit } from './types.ts';

type InstanceMapEntry<T extends object> = Readonly<[HTMLElement | ShadowRoot, Readonly<T>]>;
type InstanceMap<T extends string> = ReadonlyMap<string, InstanceMapEntry<AttributeAsProps<T>>>;

export default function defineAsCustomElement<T extends string>(
  componentType: ComponentType<AttributeAsProps<T>>,
  tagName: string,
  attributesMap: AttributesMap<T>,
  init?: DefineAsCustomElementInit | undefined
): { Portal: ComponentType } {
  const { getState, next, patchState } = signalingState<InstanceMap<T>>(new Map());
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
          init?.shadowRoot,
          (props, element) =>
            patchState(map => Object.freeze(new Map(map).set(this.#key, Object.freeze([element, props])))),
          () =>
            patchState(map => {
              const nextMap = new Map(map);

              nextMap.delete(this.#key);

              return Object.freeze(nextMap);
            })
        );
      }

      #key: string = mathRandom().toString(36).substring(2);
    },
    init?.builtInElement?.extends ? { extends: init?.builtInElement?.extends } : {}
  );

  let portalMounted = false;

  const CustomElementsWrapperPortal = memo(() => {
    const [instances, setInstances] = useState<InstanceMap<T>>(new Map());

    useEffect(() => {
      if (portalMounted) {
        throw new Error('Portal already mounted.');
      }

      portalMounted = true;

      let unmounted = false;

      (async () => {
        while (!unmounted) {
          const state = getState();

          typeof state !== 'undefined' && setInstances(state);

          await next();
        }
      })();

      return () => {
        unmounted = true;
        portalMounted = false;
      };
    }, [setInstances]);

    return (
      <Fragment>
        {Array.from(
          instances
            .entries()
            .map(([key, [element, props]]) =>
              createPortal(
                <CustomElementProvider componentType={componentType} customElement={element} props={props} />,
                element,
                key
              )
            )
        )}
      </Fragment>
    );
  });

  CustomElementsWrapperPortal.displayName = 'CustomElementsWrapperPortal';

  return { Portal: CustomElementsWrapperPortal };
}
