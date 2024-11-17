import useCustomElementContext from './private/useCustomElementContext.ts';

export default function useDispatchEvent(): (event: Event) => boolean {
  return useCustomElementContext().dispatchEvent;
}
