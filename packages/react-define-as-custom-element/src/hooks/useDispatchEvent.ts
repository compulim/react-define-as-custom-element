import useCustomElementContext from './private/useCustomElementContext';

export default function useDispatchEvent(): (event: Event) => boolean {
  return useCustomElementContext().dispatchEvent;
}
