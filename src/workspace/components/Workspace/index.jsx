// @flow
import * as React from 'react'
import { observer } from 'inferno-mobx'
import type { WorkspaceStore } from '../../workspace-store'

type Props = {
  workspaceStore: WorkspaceStore
}

const Workspace = ({ workspaceStore }: Props) => {
  return (
    <div>Hello</div>
  )
}

export default (observer(Workspace): typeof Workspace)
