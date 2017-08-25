// @flow
import { observable, action, computed } from 'mobx'
import { task } from 'mobx-task'
import { v4 } from 'uuid'
import type { RouterStore } from '../stores/router-store'
import type { Collection } from 'libx'
import { collection } from '../utils/collection'
import createWorkspace from './workspace'
import type { Workspace } from './workspace'
import type { SelectionProvider } from './selection-provider'

export type WorkspaceStore = {
  workspaceId: string;
  workspaces: Collection<Workspace>;
  +panes: Array<string>;
  +workspace: ?Workspace;
  +selectionProvider: SelectionProvider;
  openWorkspace (workspaceId: string): Promise<mixed>;
  newWorkspace (): Promise<Workspace>;
  loadExample (): Promise<mixed>;
  removeWorkspace (workspace: Workspace): void;
  togglePane (pane: string): void;
  isPaneActive (pane: string): boolean;
  serialize (): Object;
  deserialize (data: Object): void;
  highlight (): void;
}

const SAMPLE_CODE = `
if (stuff == true) {
  return 123
} else if (otherStuff === false) {
  return 456
}
`.trim()

export default function createWorkspaceStore (
  routerStore: RouterStore,
  selectionProvider: SelectionProvider
): WorkspaceStore {
  const _setWorkspaceId = action((id: string) => {
    store.workspaceId = id
  })

  const _removeWorkspace = action((workspace: Workspace) => {
    store.workspaces.remove(workspace)
  })
  const panes = ['Template', 'Editor', 'Highlighter', 'Output']
  const store = observable({
    selectionProvider: observable.ref(selectionProvider),
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
      return created
    }),
    loadExample: task(async () => {
      const created = store.workspaces.set({
        id: v4(),
        name: 'Example',
        code: SAMPLE_CODE
      })
      if (created) {
        // Funny story: I used Posish to generate these.
        created
          .invalidate()
          .highlight(4, 17)
          .highlight(4, 9)
          .highlight(13, 17)
          .highlight(30, 33)
          .highlight(45, 65)
          .highlight(45, 55)
          .highlight(60, 65)
          .highlight(78, 81)
        store.openWorkspace(created.id)
      }
      return created
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
        if (store._activePanes.length === 1) {
          return
        }
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
    },
    highlight () {
      const workspace = store.workspace
      if (workspace) {
        const { start, end } = selectionProvider.getSelection()
        workspace.highlight(start, end)
      }
    }
  })

  return store
}
