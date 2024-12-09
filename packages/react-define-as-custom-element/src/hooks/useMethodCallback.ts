import mathRandom from 'math-random';
import { useRef } from 'react';
import useCustomElementContext from './private/useCustomElementContext.ts';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function useMethodCallback<F extends (...args: any[]) => any>(name: string, fn?: F | undefined) {
  const nonceRef = useRef(mathRandom());

  useCustomElementContext().setMethodCallback(name, nonceRef.current, fn);
}
