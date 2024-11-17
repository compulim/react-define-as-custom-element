export default function signalingState<T>(initialState?: T | undefined) {
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
