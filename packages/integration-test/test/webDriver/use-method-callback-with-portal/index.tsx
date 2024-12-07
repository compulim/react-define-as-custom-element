import React, { useState } from 'react';
import { defineAsCustomElementWithPortal, useMethodCallback } from 'react-define-as-custom-element';
import { render } from 'react-dom';

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

const { Portal } = defineAsCustomElementWithPortal(MyLabel, 'use-method-callback--my-label', {}, { methodName: 'setProps' });

window.__run__ = () => {
  const mainElement = document.querySelector('main') || undefined;

  return mainElement && new Promise<void>(resolve => render(<Portal />, mainElement, resolve));
};

navigator.webdriver || window.__run__();
