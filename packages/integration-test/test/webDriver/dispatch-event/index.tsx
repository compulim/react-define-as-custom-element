import React, { useCallback, useMemo } from 'react';
import { defineAsCustomElement, useCustomElement } from 'react-define-as-custom-element';

const MyButton = () => {
  const [element] = useCustomElement();

  const dispatchEvent = useMemo(() => element.dispatchEvent.bind(element), [element]);

  const handleClick = useCallback(
    () => dispatchEvent(new CustomEvent('telemetry', { bubbles: true, detail: 'Click me' })),
    [dispatchEvent]
  );

  return <button onClick={handleClick}>Click me</button>;
};

defineAsCustomElement(MyButton, 'dispatch-event--my-button', {});
