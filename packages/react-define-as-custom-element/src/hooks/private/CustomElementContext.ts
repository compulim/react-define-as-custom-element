import { createContext } from 'react';

type CustomElementContextType = {
  dispatchEvent: (event: Event) => boolean;
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
