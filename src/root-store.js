// @flow
import { useStrict } from 'mobx'

import type { ThemeStore } from './stores/theme-store'
import createThemeStore from './stores/theme-store'

import type { RouterStore } from './stores/router-store'
import createRouterStore from './stores/router-store'

import type { WorkspaceStore } from './workspace/workspace-store'
import createWorkspaceStore from './workspace/workspace-store'

export type RootStore = {
  themeStore: ThemeStore;
  routerStore: RouterStore;
  workspaceStore: WorkspaceStore;
}

useStrict(true)

export default function createRootStore (): RootStore {
  const routerStore = createRouterStore({
    '(/)': () => routerStore.setView(null),
    '/w/:workspaceId': (id) => workspaceStore.openWorkspace(id)
  })
  const workspaceStore = createWorkspaceStore(routerStore)
  const store = {
    themeStore: createThemeStore(),
    workspaceStore,
    routerStore
  }

  routerStore.start()
  return store
}
