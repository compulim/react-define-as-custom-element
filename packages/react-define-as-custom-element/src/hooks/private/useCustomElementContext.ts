import { useContext } from 'react';
import CustomElementContext from './CustomElementContext.ts';

export default function useCustomElementContext() {
  return useContext(CustomElementContext);
}
