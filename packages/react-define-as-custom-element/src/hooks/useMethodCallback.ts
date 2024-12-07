import useCustomElementContext from './private/useCustomElementContext.ts';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function useMethodCallback<F extends (...args: any[]) => any>(name: string, fn: F | undefined) {
  useCustomElementContext().methodCallbackRef.current[name] = fn || null;
}
