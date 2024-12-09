# `react-define-as-custom-element`

Wraps a React component as custom element for packaging and delivering.

## Background

[Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) is a modern suite of technology for reusable web UI components. It reduces the burden of web UI component developers to package and deliver their UI components to their customers.

However, custom element is primal. It requires a lot of attention on UI state transitioning, which React excels at.

By writing the UI component using React and delivering it as a custom element, we are enjoying the best of both worlds.

## How to use

### Basic

Assumes the following React component.

```tsx
type MyInputProps = { value?: string | undefined };

const MyInput = ({ value }: MyInputProps) => <input type="text" value={value} />;
```

To define the React component as a custom element, with `data-value` attribute mapped to `value` prop.

```ts
import { defineAsCustomElement } from 'react-define-as-custom-element';

defineAsCustomElement(MyInput, 'my-input', { 'data-value': 'value' });
```

Then, in the HTML, render it as:

```html
<my-input data-value="Hello, World!"></my-input>
```

This would be equivalent to:

```jsx
<MyInput value="Hello, World!" />
```

### Rendering as shadow root

Rendering to shadow root is supported by passing `shadowRoot` options, which is equivalent to the options passed to the [`HTMLElement.attachShadow()` function](https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow).

```ts
import { defineAsCustomElement } from 'react-define-as-custom-element';

defineAsCustomElement(MyInput, 'my-input', { 'data-value': 'value' }, { shadowRoot: { mode: 'open' } });
```

### Extending built-in element

To [customize built-in elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#types_of_custom_element), use the `builtInElement` options.

```tsx
const MyButton = () => <span>Click me</span>;

defineAsCustomElement(
  MyButton,
  'my-button',
  {},
  {
    builtInElement: {
      customElementConstructor: HTMLButtonElement,
      extends: 'button'
    }
  }
);
```

Then, in the HTML, use the [`is` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/is) to specify the subclass custom element:

```html
<button is="my-button"></button>
```

### Connecting to React context

> This approach should be rarely used. It assumes the host know the UI component is written in React, and vice versa. They should be integrated using React directly when possible.

Assume the React component is updated to receive a `color` value from a React context:

```tsx
const MyInput = ({ value }: { value?: string | undefined }) => {
  const { color } = useContext(MyReactContext);

  return <input type="text" style={{ color }} value={value} />;
};
```

To connect the underlying React component to a React context, use the `defineAsCustomElementWithPortal` function:

```tsx
import { defineAsCustomElementWithPortal } from 'react-define-as-custom-element';

const { Portal } = defineAsCustomElementWithPortal(MyInput, 'my-input', { 'data-value': 'value' });

render(
  <MyReactContext.Provider value={{ color: 'Red' }}>
    <Portal />
  </MyReactContext.Provider>
);
```

The `<Portal>` component must be mounted exactly once in your React app, where it will be receiving React context values from its ancestors.

Then, in the HTML:

```html
<my-input data-value="Hello, World!"></my-input>
```

The underlying React component will be able to access the React context provided by `<MyReactContext.Provider>` while rendering as a custom element. This is done by the [`React.createPortal()` function](https://react.dev/reference/react-dom/createPortal).

### Retrieving the custom element instance

Call the `useCustomElement` hook inside the converted React component to retrieve the instance of the custom element. This is useful when listening for events dispatched by slotted elements.

The following example dispatch an event from the custom element:

```tsx
import { useCustomElement } from 'react-define-as-custom-element';

const MyInput = ({ value }: { value?: string | undefined }) => {
  const [customElement] = useCustomElement();

  const handleChange = useCallback(
    ({ currentTarget: { value } }) => customElement.dispatchEvent(new CustomEvent('input', { detail: { value } })),
    [customElement]
  );

  return <input onChange={handleChange} type="text" value={value} />;
};
```

### Defining custom methods

> Custom method is not an escape hatch for passing non-string data to the underlying React component. Attribute is the best practice for passing data. It [supports `<template>` and server-side rendering](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM#declaratively_with_html). In most cases, attributes should be used with serialization to pass non-string data.

Custom methods can be added to the custom element via the `useMethodCallback()` hook.

```tsx
import { defineAsCustomElement, useMethodCallback } from 'react-define-as-custom-element';

const MyCalculator = () => {
  const [left, setLeft] = useState<number>(0);
  const [right, setRight] = useState<number>(0);
  const [sum, setSum] = useState<number>(left + right);

  useMethodCallback('sum', (left: number, right: number): number => {
    setLeft(left);
    setRight(right);
    setSum(left + right);

    return left + right;
  });

  return (
    <div>
      {left} + {right} = {sum}
    </div>
  );
};

defineAsCustomElement('my-calculator', MyCalculator, {});
```

After calling the `useMethodCallback('sum')` hook, a `sum()` function will be added to the custom element.

```tsx
document.getElementsByTagName('my-calculator')[0].sum(1, 2); // Returns 3.
```

Only one callback function can be registered per method name. The hook will throw if called with the method names that are already registered with another callback function.

## Behaviors

### What do I need to know to start wrapping my component as custom element?

There are some key differences between React component and a custom element:

- Attributes in custom elements are optional, must be of type string, and not limited to subset of strings
  - Therefore, props in React component must be optional strings too and expect caller to pass unsupported or invalid values
- When using shadow DOM, the slotted element (denoted by the [`slot` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/slot)) is virtually relocated (a.k.a. shadowed) to the [`<slot>` placeholder element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot)
  - The parent of the slotted element is root of the custom element, not the `<slot>` element
  - Events propagated from the slotted element will not available to the `<slot>` element but only to the root of the custom element
- When updating multiple attributes/props synchronously
  - For custom element, browser will call `HTMLElement.attributeChangeCallback()` multiple times, therefore, component must support eventual consistency
  - For React component, all props changes will be updated at once
  - `defineAsCustomElement()` always batch multiple synchronous attribute changes into a single React render call using [`queueMicrotask`](https://developer.mozilla.org/en-US/docs/Web/API/Window/queueMicrotask)
- Custom elements must not be self-closing
- The name of custom elements must follow [requirements defined in the HTML Living Standard](https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name)

### Given major differences between React and custom element, why should I still wrap it?

Consider these factors: cost of writing a new UI component, making them on parity of each other, and maintaining both of them.

### Some of the props need to be a number instead of string

Writes an adapter component that parses the string into a number.

### Does it supports React Native?

No, custom elements is a HTML technology and is only available in modern browsers.

### TypeScript is complaining about the custom element

Adjusts and adds the following declaration to your project.

```ts
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'my-input': HTMLAttributes<HTMLElement> & { value?: string | undefined };
    }
  }
}
```

### Why are you still using the deprecated `ReactDOM.render` instead of `createRoot()`?

To support React version 16.8 to 18, we are using `ReactDOM.render`, which is available through out the supported versions.

### Can I add property to the custom element?

After defined the custom element, call `customElements.get()` to retrieve the custom element constructor and modify as needed.

## Roadmap

- API to support `formAssociated`, HTML Constraint Validation and Accessibility Object Model
- API to support [`CustomStateSet`](https://developer.mozilla.org/en-US/docs/Web/API/CustomStateSet)

## Contributions

Like us? [Star](https://github.com/compulim/react-define-as-custom-element/stargazers) us.

Want to make it better? [File](https://github.com/compulim/react-define-as-custom-element/issues) us an issue.

Don't like something you see? [Submit](https://github.com/compulim/react-define-as-custom-element/pulls) a pull request.
