import React, { useState } from 'react';
import { defineAsCustomElement, useMethodCallback } from 'react-define-as-custom-element';

const MyLabel = () => {
  const [label, setLabel] = useState<string>('');
  const [value, setValue] = useState<string>('');

  useMethodCallback<(props: { label: string; value: string }) => void>(({ label, value }) => {
    setLabel(label);
    setValue(value);

    return `${label}\n${value}`;
  });

  return (
    <dl>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </dl>
  );
};

defineAsCustomElement(MyLabel, 'use-method-callback--my-label', {}, { methodName: 'setProps' });
