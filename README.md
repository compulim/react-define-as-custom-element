# `react-define-as-custom-element`

Wraps a React component as custom element for packaging and delivering.

## Background

Web Components defines the modern era of web extensible UI elements. It reduces the burden of UI component developers to package and deliver their UI components to customers.

However, custom elements are very barebone. It requires a lot of attention on UI state transitioning, which React excels at.

By writing web UI component using React and delivering it as a custom element, we are enjoying the best of both worlds.

## How to use

### Basic

Assume the following React component.

```tsx
const MyInput = ({ value }: { value?: string | undefined }) => <input type="text" value={value} />;
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

Rendering to shadow root is supported by passing `shadowRoot` options, which is equivalent to the options passed to `HTMLElement.attachShadow()` function.

```ts
import { defineAsCustomElement } from 'react-define-as-custom-element';

defineAsCustomElement(MyInput, 'my-input', { 'data-value': 'value' }, { shadowRoot: { mode: 'open' } });
```

### Connecting to React context

> This approach should be rarely used. This approach assumes the host know its UI component is written in React, and vice versa. They should be integrated by using React directly when possible.

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

Note: you must mount exactly one instance of `<Portal>` in your React tree, where it will be receiving React context values from its ancestors.

Then, in the HTML:

```html
<my-input data-value="Hello, World!"></my-input>
```

The underlying React component will be able to access the React context provided by `<MyAppContextProvider>` while rendering as a custom element. This is done by using `createPortal` feature from React.

### Retrieving the custom element instance

Call the `useCustomElement` hook inside the converted React component to retrieve the instance of the custom element.

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

## Behaviors

### Differences between React component and custom element

There are some key differences between React component and a custom element:

- All props must be an optional string
  - Attributes are optional and must be of type string
- When 2+ attributes are changed at the same time, its underlying React component will be re-rendered 2+ times
  - For every attribute change, browser would call `attributeChangedCallback()`
  - There will be a brief moment and re-render that one prop is using a new value, while the other prop is using an old value

### Given major differences between React and custom element, why should I still wrap it?

Consider this factors: cost of writing a new UI component, making them parity, and maintaining both of them.

### Some of the props need to be a number instead of string

Writes an adapter component that parses the string into a number.

### Does it support React Native?

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

## Roadmap

- API to support `formAssociated`, HTML Constraint Validation and Accessibility Object Model

## Contributions

Like us? [Star](https://github.com/compulim/react-define-as-custom-element/stargazers) us.

Want to make it better? [File](https://github.com/compulim/react-define-as-custom-element/issues) us an issue.

Don't like something you see? [Submit](https://github.com/compulim/react-define-as-custom-element/pulls) a pull request.
