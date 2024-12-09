import { createContext } from 'react';

type CustomElementContextType = {
  customElementState: readonly [HTMLElement | ShadowRoot];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setMethodCallback: (name: string, nonce: number, fn: ((...args: any[]) => any) | undefined) => void;
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
