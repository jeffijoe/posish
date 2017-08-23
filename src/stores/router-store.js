// @flow
import { Router } from 'director/build/director'
import { autorun, observable, action } from 'mobx'

export interface View {
  +currentPath?: string;
}

export interface RouterStore {
  currentView: ?View;
  currentPath(): string;
  navigate (path: string, force?: boolean): void;
  setView (view: ?View): void;
  start (): void;
}

export type Routes = {
  [path: string]: (...params: Array<string>) => mixed;
}

export default function createRouterStore (routes: Routes): RouterStore {
  const mapped = Object.keys(routes).reduce((memo, key) => {
    return {
      ...memo,
      [key]: action(key, (...params: Array<string>) => {
        routes[key](...params)
      })
    }
  }, {})
  const router = new Router(mapped).configure({
    html5history: true,
    notfound: () => store.setView(null)
  })
  const store: RouterStore = observable({
    currentView: observable.ref(null),
    currentPath () {
      return (store.currentView && store.currentView.currentPath) || '/'
    },
    navigate (path, force = false) {
      if (window.location.pathname !== path || force) {
        window.history.pushState(null, null, path)
        router.handler()
      }
    },
    setView: action('setView', (view: ?View) => {
      store.currentView = view
    }),
    start () {
      router.init()

      autorun(() => {
        const path = store.currentPath()
        if (path === window.location.pathname) {
          return
        }
        window.history.pushState(null, null, path)
      })
    }
  })

  return store
}
