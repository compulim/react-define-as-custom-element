import React, { useState } from 'react';
import { defineAsCustomElementWithPortal, useMethodCallback } from 'react-define-as-custom-element';
import { render } from 'react-dom';

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

const { Portal } = defineAsCustomElementWithPortal(
  MyLabel,
  'use-method-callback--my-label',
  {},
  { methodNames: ['setLabel', 'setValue'] }
);

window.__run__ = () => {
  const mainElement = document.querySelector('main') || undefined;

  return mainElement && new Promise<void>(resolve => render(<Portal />, mainElement, resolve));
};

// @ts-expect-error Ignore __run__
navigator.webdriver || window.addEventListener('load', () => window.__run__());
