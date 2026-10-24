import { lazy, type ComponentType } from "react";

/**
 * A route component that renders synchronously once its chunk has been loaded.
 *
 * `React.lazy` alone cannot do this: its initialiser always returns a thenable on
 * the first render, so the component suspends even when the module is already in
 * the registry. The `Suspense` boundary then commits its fallback, and React
 * throttles replacing a committed fallback for ~300ms — which is why a page that
 * was already painted from the prerendered HTML went blank and stayed blank for a
 * third of a second.
 *
 * Preloading the chunk before the first render sidesteps that entirely: `Loaded` is
 * set, nothing suspends, no fallback commits, nothing is throttled. The lazy path
 * remains for routes reached before their preload finishes.
 */
export type RouteComponent<P> = ComponentType<P> & {
  preload: () => Promise<ComponentType<P>>;
};

export function lazyRoute<P extends object>(
  load: () => Promise<ComponentType<P>>,
): RouteComponent<P> {
  let Loaded: ComponentType<P> | undefined;
  let pending: Promise<ComponentType<P>> | undefined;

  const preload = () => {
    pending ??= load().then((Component) => {
      Loaded = Component;
      return Component;
    });
    return pending;
  };

  const Pending = lazy(() =>
    preload().then((Component) => ({ default: Component })),
  );

  const Route = (props: P) => {
    const Resolved = Loaded ?? Pending;
    return <Resolved {...props} />;
  };
  Route.preload = preload;

  return Route as RouteComponent<P>;
}
