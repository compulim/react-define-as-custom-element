import useCustomElementContext from './private/useCustomElementContext';

export default function useMethodCallback<F extends (...args: any[]) => any>(fn: F | undefined) {
  useCustomElementContext().methodCallbackRef.current = fn || null;
}
