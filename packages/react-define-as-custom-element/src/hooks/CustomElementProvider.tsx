import React, { memo, type ReactNode, useMemo } from 'react';
import CustomElementContext, { type CustomElementContextType } from './private/CustomElementContext.ts';

type Props = {
  children?: ReactNode | undefined;
  element: HTMLElement | ShadowRoot;
};

const CustomElementProvider = memo(({ children, element }: Props) => {
  const context = useMemo<CustomElementContextType>(
    () => ({ dispatchEvent: element.dispatchEvent.bind(element) }),
    [element]
  );

  return <CustomElementContext.Provider value={context}>{children}</CustomElementContext.Provider>;
});

CustomElementProvider.displayName = 'CustomElementProvider';

export default CustomElementProvider;
