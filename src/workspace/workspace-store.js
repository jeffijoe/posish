// @flow
import { observable, action, computed } from 'mobx'
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
  +panes: Array<string>;
  +workspace: ?Workspace;
  openWorkspace (workspaceId: string): Promise<mixed>;
  newWorkspace (): Promise<mixed>;
  removeWorkspace (workspace: Workspace): void;
  togglePane (pane: string): void;
  isPaneActive (pane: string): boolean;
  serialize (): Object;
  deserialize (data: Object): void
}

export default function createWorkspaceStore (
  routerStore: RouterStore
): WorkspaceStore {
  const _setWorkspaceId = action((id: string) => {
    store.workspaceId = id
  })

  const _removeWorkspace = action((workspace: Workspace) => {
    store.workspaces.remove(workspace)
  })
  const panes = ['Template', 'Edit', 'Highlight', 'Output']
  const store = observable({
    workspaceId: '',
    _activePanes: panes.slice(),
    panes,
    workspaces: collection({ model: createWorkspace }),
    currentPath: computed(() => {
      return `/w/${store.workspaceId}`
    }),
    workspace: computed(() => {
      if (routerStore.currentView !== store) {
        return null
      }
      return store.workspaces.get(store.workspaceId)
    }),
    openWorkspace: task(async (workspaceId: string) => {
      _setWorkspaceId(workspaceId)
      routerStore.setView(store)
      if (!store.workspace) {
        routerStore.navigate('/')
      }
    }),
    newWorkspace: task(async () => {
      const created = store.workspaces.set({
        id: v4()
      })
      if (created) {
        store.openWorkspace(created.id)
      }
    }),
    removeWorkspace: task(async (workspace: Workspace) => {
      const current = store.workspace
      _removeWorkspace(workspace)
      if (routerStore.currentView === store && workspace === current) {
        routerStore.navigate('/')
      }
    }),
    togglePane: action((pane: string) => {
      if (store.isPaneActive(pane)) {
        store._activePanes.splice(store._activePanes.indexOf(pane), 1)
      } else {
        store._activePanes.push(pane)
      }
    }),
    isPaneActive: (pane) => {
      return store._activePanes.indexOf(pane) > -1
    },
    serialize: () => {
      return {
        workspaces: store.workspaces.map(x => x.serialize()),
        activePanes: store._activePanes.slice()
      }
    },
    deserialize (data) {
      store.workspaces.set(data.workspaces)
      store._activePanes = (data.activePanes || panes).slice()
    }
  })

  return store
}
