// @flow
import { observable, action } from 'mobx'
import { task } from 'mobx-task'
import type { RouterStore } from '../stores/router-store'

export type WorkspaceStore = {
  workspaceId: string;
  openWorkspace (workspaceId: string): Promise<mixed>;
}

export default function createWorkspaceStore (
  routerStore: RouterStore
): WorkspaceStore {
  const setWorkspaceId = action((id: string) => {
    store.workspaceId = id
  })

  const store = observable({
    workspaceId: '',
    // $FlowFixMe
    get currentPath () {
      return `/w/${store.workspaceId}`
    },
    openWorkspace: task(async (workspaceId: string) => {
      console.log('haha', workspaceId)
      setWorkspaceId(workspaceId)
      routerStore.setView(store)
    })
  })

  return store
}
