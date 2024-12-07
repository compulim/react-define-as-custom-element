import { createContext, type MutableRefObject } from 'react';

type CustomElementContextType = {
  customElementState: readonly [HTMLElement | ShadowRoot];
  methodCallbackRef: MutableRefObject<((...args: any[]) => any) | null>;
};

const CustomElementContext = createContext<CustomElementContextType>(
  new Proxy({} as CustomElementContextType, {
    get() {
      throw new Error('This hook cannot be used outside of the custom element.');
    }
  })
);

export default CustomElementContext;

export { type CustomElementContextType };
