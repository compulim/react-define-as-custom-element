import { type AttributeAsProps, type AttributesMap } from '../types.ts';

type MountCallback<P extends object> = (
  props: P,
  element: HTMLElement | ShadowRoot,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setMethodCallback: (name: string, fn: ((...args: any[]) => any) | undefined) => void
) => void;
type UnmountCallback = (element: HTMLElement | ShadowRoot) => void;

export default function createReactCustomElement<T extends string>(
  customElementConstructor: CustomElementConstructor | undefined
) {
  const registry = new FinalizationRegistry((dispose: () => void) => dispose());

  return class ReactCustomElement extends (customElementConstructor || HTMLElement) {
    constructor(
      attributesMap: AttributesMap<T>,
      shadowRootInit: ShadowRootInit | undefined,
      mountCallback: MountCallback<AttributeAsProps<T>>,
      unmountCallback: UnmountCallback
    ) {
      super();

      this.#attributesMap = attributesMap;
      this.#mountCallback = mountCallback;
      this.#unmountCallback = unmountCallback;

      this.#element = shadowRootInit ? this.attachShadow(shadowRootInit) : this;

      registry.register(new WeakRef(this), this[Symbol.dispose].bind(this));
    }

    #attributesMap: AttributesMap<T>;
    #connected: boolean = false;
    #element: ReactCustomElement | ShadowRoot;
    #mountCallback: MountCallback<AttributeAsProps<T>>;
    #propsMap: Map<T, string | undefined> = new Map();
    #setMethodCallbackBound = this.#setMethodCallback.bind(this);
    #unmountCallback: UnmountCallback | undefined;
    #version: number = 0;

    [Symbol.dispose]() {
      this.#unmountCallback?.(this.#element);
      this.#unmountCallback = undefined;
    }

    #getProps(): AttributeAsProps<T> {
      return Object.freeze(Object.fromEntries(this.#propsMap.entries()) as AttributeAsProps<T>);
    }

    #refresh() {
      if (this.#connected) {
        const version = ++this.#version;

        queueMicrotask(() => {
          if (version === this.#version) {
            const element = this.#element;

            element && this.#mountCallback(this.#getProps(), element, this.#setMethodCallbackBound);
          }
        });
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    #setMethodCallback(name: string, fn: ((...args: any) => any) | undefined) {
      if (fn) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (this as any)[name] = (...args: any[]) => {
          return fn(...args);
        };
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (this as any)[name];
      }
    }

    attributeChangedCallback(name: string, _oldValue: string | undefined, newValue: string | undefined) {
      const propName = this.#attributesMap[name];

      if (propName) {
        this.#propsMap.set(propName, newValue);
        this.#refresh();
      }
    }

    connectedCallback() {
      this.#connected = true;
      this.#refresh();
    }

    disconnectedCallback() {
      this.#connected = false;
    }
  };
}
