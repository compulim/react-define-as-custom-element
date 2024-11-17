import { useContext } from 'react';
import CustomElementContext from './CustomElementContext';

export default function useCustomElementContext() {
  return useContext(CustomElementContext);
}
