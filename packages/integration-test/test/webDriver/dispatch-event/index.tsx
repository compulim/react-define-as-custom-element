import React, { useCallback } from 'react';
import { defineAsCustomElement } from 'react-define-as-custom-element';

const MyButton = () => {
  const handleClick = useCallback(() => {
    dispatchEvent(new CustomEvent('telemetry', { bubbles: true, detail: 'Click me' }));
  }, [dispatchEvent]);

  return <button onClick={handleClick}>Click me</button>;
};

defineAsCustomElement(MyButton, 'dispatch-event--my-button', {});
