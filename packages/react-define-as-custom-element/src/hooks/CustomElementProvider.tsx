import React, { type ComponentType, createElement, memo, useMemo, useRef } from 'react';
import CustomElementContext, { type CustomElementContextType } from './private/CustomElementContext.ts';

type Props<T extends Record<string, string | undefined>> = {
  componentType: ComponentType<T>;
  customElement: HTMLElement | ShadowRoot;
  props: T;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setMethodCallback: (fn: (name: string, ...args: any[]) => any) => void;
};

const CustomElementProvider = <T extends Record<string, string | undefined>>({
  componentType,
  customElement,
  props,
  setMethodCallback
}: Props<T>) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const methodCallbackRef = useRef<{ [name: string]: (...args: any[]) => any }>({});

  const context = useMemo<CustomElementContextType>(
    () => ({
      customElementState: Object.freeze([customElement]),
      methodCallbackRef
    }),
    [customElement, methodCallbackRef]
  );

  console.log({ setMethodCallback });

  useMemo(() => {
    setMethodCallback((name, ...args) => {
      const {
        current: { [name]: callback }
      } = methodCallbackRef;

      if (!callback) {
        throw new Error(`A callback function must be registered with useMethodCallback('${name}').`);
      }

      return callback(...args);
    });
  }, [methodCallbackRef, setMethodCallback]);

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
