import React from 'react';
import { defineAsCustomElement } from 'react-define-as-custom-element';

const MyInput = ({ value }: { value?: string | undefined }) => <input type="text" value={value} />;

defineAsCustomElement(MyInput, 'simple--my-input', { value: 'value' });
