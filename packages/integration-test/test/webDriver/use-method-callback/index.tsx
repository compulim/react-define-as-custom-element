import React, { useState } from 'react';
import { defineAsCustomElement, useMethodCallback } from 'react-define-as-custom-element';

const MyLabel = () => {
  const [label, setLabel] = useState<string>('');
  const [value, setValue] = useState<string>('');

  useMethodCallback<(label: string) => void>('setLabel', label => {
    setLabel(label);

    return `${label}\n${value}`;
  });

  useMethodCallback<(value: string) => void>('setValue', value => {
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

defineAsCustomElement(MyLabel, 'use-method-callback--my-label', {});
