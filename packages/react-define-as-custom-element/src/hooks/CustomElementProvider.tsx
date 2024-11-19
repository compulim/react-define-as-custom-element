import React, { memo, type ReactNode, useMemo } from 'react';
import CustomElementContext, { type CustomElementContextType } from './private/CustomElementContext.ts';

type Props = {
  children?: ReactNode | undefined;
  customElement: HTMLElement | ShadowRoot;
};

const CustomElementProvider = memo(({ children, customElement }: Props) => {
  const context = useMemo<CustomElementContextType>(
    () => ({
      customElementState: Object.freeze([customElement])
    }),
    [customElement]
  );

  return <CustomElementContext.Provider value={context}>{children}</CustomElementContext.Provider>;
});

CustomElementProvider.displayName = 'CustomElementProvider';

export default CustomElementProvider;
