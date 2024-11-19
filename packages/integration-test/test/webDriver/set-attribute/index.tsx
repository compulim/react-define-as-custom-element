import React from 'react';
import { defineAsCustomElement } from 'react-define-as-custom-element';

const MyInput = ({
  className,
  something,
  value
}: {
  className?: string | undefined;
  something?: string | undefined;
  value?: string | undefined;
}) => (
  <span>
    {className} {something} {value}
  </span>
);

defineAsCustomElement(MyInput, 'set-attribute--my-badge', {
  class: 'className',
  'data-value': 'value',
  something: 'something'
});
