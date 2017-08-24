// @flow
import { observable, action } from 'mobx'
import { task } from 'mobx-task'
import { v4 } from 'uuid'
import type { RouterStore } from '../stores/router-store'
import type { Collection } from 'libx'
import { collection } from '../utils/collection'
import createWorkspace from './workspace'
import type { Workspace } from './workspace'

export type WorkspaceStore = {
  workspaceId: string;
  workspaces: Collection<Workspace>;
  +workspace: ?Workspace;
  openWorkspace (workspaceId: string): Promise<mixed>;
  newWorkspace (): Promise<mixed>;
  removeWorkspace (workspace: Workspace): void
}

export default function createWorkspaceStore (
  routerStore: RouterStore
): WorkspaceStore {
  const setWorkspaceId = action((id: string) => {
    store.workspaceId = id
  })

  const store = observable({
    workspaceId: '',
    workspaces: collection({ model: createWorkspace }),
    // $FlowFixMe
    get currentPath () {
      return `/w/${store.workspaceId}`
    },
    // $FlowFixMe
    get workspace () {
      if (routerStore.currentView !== this) {
        return null
      }
      return store.workspaces.get(store.workspaceId)
    },
    openWorkspace: task(async (workspaceId: string) => {
      setWorkspaceId(workspaceId)
      routerStore.setView(store)
    }),
    newWorkspace: task(async () => {
      store.workspaces.set({
        id: v4()
      })
    })
  })

  return store
}
