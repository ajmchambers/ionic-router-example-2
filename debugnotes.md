So 2 issues:

1. using back button forgets the query params set on the previous route.
2. using redirect to a url with query param set also does not include it. 

--------------------------

When page is freshly loaded with url of `localhost:3333/?search=test`, router runs this:

https://github.com/ionic-team/ionic/blob/master/core/src/components/router/router.tsx#L160-L162
```tsx
onRoutesChanged() {
  return this.writeNavStateRoot(this.getPath(), ROUTER_INTENT_NONE);
}
```

When button or anchor uses router's push method:

https://github.com/ionic-team/ionic/blob/master/core/src/components/router/router.tsx#L88-L105
```tsx
  /**
   * Navigate to the specified URL.
   *
   * @param url The url to navigate to.
   * @param direction The direction of the animation. Defaults to `"forward"`.
   */
  @Method()
  push(url: string, direction: RouterDirection = 'forward') {
    if (url.startsWith('.')) {
      url = (new URL(url, window.location.href)).pathname;
    }
    console.debug('[ion-router] URL pushed -> updating nav', url, direction);

    const path = parsePath(url);
    const queryString = url.split('?')[1];
    this.setPath(path, direction, queryString);
    return this.writeNavStateRoot(path, direction);
  }
```

When redirected using `localhost:3333/redirect` with router redirect setup like this:
```tsx
<ion-route-redirect from="/redirect" to="/?search=redirected"></ion-route-redirect>
```

https://github.com/ionic-team/ionic/blob/master/core/src/components/router/router.tsx#L153-L158
```tsx
  private onRedirectChanged() {
    const path = this.getPath();
    if (path && routeRedirect(path, readRedirects(this.el))) {
      this.writeNavStateRoot(path, ROUTER_INTENT_NONE);
    }
  }
```

-------------------------

Could maybe add the search string as an optional third parameter for `writeNavStateRoot`?

Then in `writeNavState` would probably need to pass it into the nav's `setRouteId`.

https://github.com/ionic-team/ionic/blob/master/core/src/components/router/utils/dom.ts#L23
```tsx
// find next navigation outlet in the DOM
const outlet = searchNavNode(root);

// make sure we can continue interacting the DOM, otherwise abort
if (index >= chain.length || !outlet) {
  return changed;
}
await outlet.componentOnReady();

const route = chain[index];
const result = await outlet.setRouteId(route.id, route.params, direction);
```


And eventually add it to the view alongside the component and props here:
https://github.com/ionic-team/ionic/blob/master/core/src/components/nav/nav.tsx#L321-L333
```tsx
/**
 * Set the root for the current navigation stack to a component.
 *
 * @param component The component to set as the root of the navigation stack.
 * @param componentProps Any properties of the component.
 * @param opts The navigation options.
 * @param done The transition complete function.
 */
@Method()
setRoot<T extends NavComponent>(
  component: T,
  componentProps?: ComponentProps<T> | null,
  opts?: NavOptions | null,
  done?: TransitionDoneFn
): Promise<boolean> {
  return this.setPages(
    [{ page: component, params: componentProps }],
    opts,
    done
  );
}
```

Then I'm kinda out of my element here, probably a lot of cascading changes required to actually use this stored search string wherever it is needed.