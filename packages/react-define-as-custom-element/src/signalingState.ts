type SignalingState<T> = {
  getState(): T | undefined;
  next(): Promise<void>;
  patchState(next: (state: T | undefined) => T): void;
};

export default function signalingState<T>(initialState?: T | undefined): SignalingState<T> {
  let resolvers = Promise.withResolvers<void>();
  let state = initialState;

  return {
    getState(): T | undefined {
      return state;
    },

    async next(): Promise<void> {
      return resolvers.promise;
    },

    patchState(next: (state: T | undefined) => T) {
      state = next(state);

      const resolve = resolvers.resolve.bind(resolvers);

      resolvers = Promise.withResolvers();
      resolve();
    }
  };
}

export type { SignalingState };
