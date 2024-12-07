import React, { memo } from 'react';
import { defineAsCustomElement } from 'react-define-as-custom-element';

declare global {
  interface Window {
    __renderProps__: { label: string | undefined; value: string | undefined }[];
  }
}

window.__renderProps__ = [];

const MyInput = memo(({ label, value }: { label?: string | undefined; value?: string | undefined }) => {
  window.__renderProps__.push({ label, value });

  return (
    <label>
      <div>{label}</div>
      <input onChange={() => {}} type="text" value={value} />
    </label>
  );
});

defineAsCustomElement(MyInput, 'batch-attribute-change--my-input', {
  label: 'label',
  value: 'value'
});
