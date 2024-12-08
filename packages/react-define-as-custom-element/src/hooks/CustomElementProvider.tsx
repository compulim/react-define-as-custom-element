import React, { type ComponentType, createElement, memo, useMemo } from 'react';
import CustomElementContext, { type CustomElementContextType } from './private/CustomElementContext.ts';

type Props<T extends Record<string, string | undefined>> = {
  componentType: ComponentType<T>;
  customElement: HTMLElement | ShadowRoot;
  props: T;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setMethodCallback: (name: string, fn: ((...args: any[]) => any) | undefined) => void;
};

const CustomElementProvider = <T extends Record<string, string | undefined>>({
  componentType,
  customElement,
  props,
  setMethodCallback
}: Props<T>) => {
  const context = useMemo<CustomElementContextType>(
    () => ({
      customElementState: Object.freeze([customElement]),
      setMethodCallback
    }),
    [customElement, setMethodCallback]
  );

  return (
    <CustomElementContext.Provider value={context}>{createElement(componentType, props)}</CustomElementContext.Provider>
  );
};

CustomElementProvider.displayName = 'CustomElementProvider';

const MemoizedCustomElementProvider = memo(CustomElementProvider, (prevProps, nextProps): boolean => {
  return (
    Object.is(prevProps.componentType, nextProps.componentType) &&
    Object.is(prevProps.customElement, nextProps.customElement) &&
    Object.is(prevProps.setMethodCallback, nextProps.setMethodCallback) &&
    Array.from(new Set(Object.keys(prevProps.props)).union(new Set(Object.keys(nextProps.props)))).every(key =>
      Object.is(prevProps.props[key], nextProps.props[key])
    )
  );
  // Currently, @types/react@18 does not support generic exotic component, we need to force-cast it.
}) as typeof CustomElementProvider;

export default MemoizedCustomElementProvider;
