import { useContext } from 'react';

import AppContext from './AppContext.js';

export default function useAppContext() {
  return useContext(AppContext);
}
