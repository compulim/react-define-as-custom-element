import { useContext } from 'react';

import AppContext from './AppContext.ts';

export default function useAppContext() {
  return useContext(AppContext);
}
