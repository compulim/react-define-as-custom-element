import useCustomElementContext from './private/useCustomElementContext.ts';

export default function useCustomElement(): readonly [HTMLElement | ShadowRoot] {
  return useCustomElementContext().customElementState;
}
