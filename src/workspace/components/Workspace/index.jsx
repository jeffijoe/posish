// @flow
import * as React from 'react'
import { observer } from 'inferno-mobx'
import type { WorkspaceStore } from '../../workspace-store'
import { css } from 'emotion'
import styled from 'emotion/react'
import WorkspaceHeader from '../WorkspaceHeader'
import * as styling from '../../../styling'
import { withTheme } from '../../../utils/theming'
import { Editor, Highlighter } from '../Editor'
import Output from '../Output'

type Props = {
  workspaceStore: WorkspaceStore;
}

const WorkspaceLayout = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  height: calc(100vh - ${styling.HEADER_HEIGHT}px);
`

const WorkspaceLayoutItem = styled('div')`
  flex: ${props => props.fill ? '1 1 auto' : '0 0 auto'};
  display: flex;
  align-items: stretch;
  flex-direction: column;
  width: 100%;
  position: relative;
`

const Panes = styled('div')`
  display: flex;
  align-items: stretch;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
`

const Pane = withTheme(styled('div')`
  flex: 1 1 auto;
  height: 100%;
  border-right: 3px solid transparent;
  position: relative;
  ${({ theme }) => ({
    light: css`
      border-color: #e9e9ef;
    `,
    dark: css`
      border-color: rgba(255, 255, 255, 0.2);
    `
  }[theme.id])}
`)

const Footer = withTheme(styled('div')`
  text-align: center;
  padding: 10px;
  font-size: 12px;
  & a {
    text-decoration: none;
  }
  ${({ theme }) => ({
    light: css`
      border-top: 1px solid #e0e0ef;
      & a {
        color: ${theme.primaryColor};
      }
    `,
    dark: css`
      border-top: 1px solid rgba(255, 255, 255, 0.2);
      & a {
        color: ${theme.primaryColor};
      }
    `
  })[theme.id]};
  `)

const paneViews = {
  Template: ({ workspace }) => (
    <Editor onChange={(value) => workspace.set({ template: value })} value={workspace.template} placeholder="Write a template here" />
  ),
  Edit: ({ workspace }) => <Editor onChange={(value) => workspace.set({ code: value })} value={workspace.code} placeholder="Write code to highlight here" />,
  Highlight: ({ workspace, workspaceStore }) => <Highlighter workspace={workspace} workspaceStore={workspaceStore} />,
  Output: ({ workspace }) => <Output workspace={workspace} />
}

const Workspace = ({ workspaceStore }: Props) => {
  if (!workspaceStore.workspace) {
    return null
  }
  return (
    <WorkspaceLayout>
      <WorkspaceLayoutItem>
        <WorkspaceHeader workspaceStore={workspaceStore}/>
      </WorkspaceLayoutItem>
      <WorkspaceLayoutItem fill>
        <Panes>
          {workspaceStore.panes.filter(workspaceStore.isPaneActive).map(p =>
            <Pane key={p}>
              {React.createElement(paneViews[p], {
                workspace: workspaceStore.workspace,
                workspaceStore
              })}
            </Pane>
          )}
        </Panes>
      </WorkspaceLayoutItem>
      <WorkspaceLayoutItem>
        <Footer>
          Created with <span role="img" aria-label="love">❤️</span> + a <a target="_blank" rel="noopener noreferrer" href="https://www.instagram.com/p/BYLNI6jDFri/">cat on my shoulder</a> by <a target="_blank" rel="noopener noreferrer" href="https://twitter.com/Jeffijoe">@jeffijoe</a>.
        </Footer>
      </WorkspaceLayoutItem>
    </WorkspaceLayout>
  )
}

export default (observer(Workspace): typeof Workspace)
