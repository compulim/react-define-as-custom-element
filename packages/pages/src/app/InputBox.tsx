import React, { Fragment, type FormEventHandler, memo, useCallback, useMemo } from 'react';
import useValue from './data/useValue';

type InputBoxProps = { color?: string | undefined };

const InputBox = memo(({ color }: InputBoxProps) => {
  const [value, setValue] = useValue();

  const handleInput = useCallback<FormEventHandler<HTMLInputElement>>(
    ({ currentTarget: { value } }) => setValue(value),
    [setValue]
  );

  const style = useMemo(() => ({ color }), [color]);

  return (
    <Fragment>
      <h2><slot name="header" /></h2>
      <input onInput={handleInput} style={style} type="text" value={value} />
    </Fragment>
  );
});

InputBox.displayName = 'InputBox';

export default InputBox;
