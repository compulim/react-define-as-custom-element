import { createContext, type MutableRefObject } from 'react';

type CustomElementContextType = {
  customElementState: readonly [HTMLElement | ShadowRoot];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  methodCallbackRef: MutableRefObject<{ [name: string]: ((...args: any[]) => any) | null | undefined }>;
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
