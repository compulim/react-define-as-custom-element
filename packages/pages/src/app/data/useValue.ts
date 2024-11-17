import { type Dispatch, type SetStateAction } from 'react';

import useAppContext from './private/useAppContext.ts';

export default function useValue(): readonly [string, Dispatch<SetStateAction<string>>] {
  const { setValue, value } = useAppContext();

  return Object.freeze([value, setValue]);
}
