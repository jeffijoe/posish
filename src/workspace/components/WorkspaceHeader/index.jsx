// @flow
import * as React from 'react'
import { observer } from 'inferno-mobx'
import type { WorkspaceStore } from '../../workspace-store'
import { css } from 'emotion'
import styled from 'emotion/react'
import { lighten, desaturate, darken, shade } from 'polished'
import { withTheme } from '../../../utils/theming'
import type { Theme } from '../../../models/theme'
import cx from 'classnames'
import * as styling from '../../../styling'

type Props = {
  workspaceStore: WorkspaceStore;
  theme: Theme;
}

const SideBlock = styled('div')`
  padding: 0 10px;
  flex: 1 1 auto;
`

const WorkspaceNameEditor = withTheme(styled('input')`
  border-radius: 3px;
  padding: 8px 10px;
  font-size: 14px;
  display: block;
  width: 100%;
  max-width: 300px;
  border: 1px solid transparent;
  outline: none;
  ${({ theme }: { theme: Theme }) => ({
    light: css`
      background-color: rgba(220, 230, 248, 0.3);
      box-shadow: 0 1px 1px rgba(100, 120, 130, 0.06);
      border-color: rgba(180, 190, 208, 0.2)
    `,
    dark: css`
      background-color: rgba(255, 255, 255, 0.1);
    `
  }[theme.id])}
`)

const ToggleBlock = styled('div')`
  flex: 0 0 auto;
  display: flex;
  align-items: center;
`

const Toggler = withTheme(styled('a')`
  height: 32px;
  padding: 0 12px;
  display: inline-flex;
  line-height: 0;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  text-decoration: none;
  cursor: pointer;
  &:first-child {
    border-radius: 4px 0 0 4px;
  }
  &:last-child {
    border-radius: 0 4px 4px 0;
  }
  ${({ theme, active }: { theme: Theme, active: boolean }) => ({
    light: css`
      background-color: ${active ? theme.primaryColor : '#e7e7ef'};
      color: ${active ? '#fff' : theme.textColor};
    `,
    dark: css`
      background-color: ${active ? theme.primaryColor : 'rgba(255, 255, 255, 0.1)'};
      color: ${theme.textColor};
    `
  }[theme.id])}
`)

const styles = {
  header: {
    base: css`
      height: ${styling.WORKSPACE_HEADER_HEIGHT};
      display: flex;
      align-items: center;
      border-bottom: 1px solid #eee;
      padding: 0 20px;
    `,
    light: (theme: Theme) => css`
      background-color: #fafafe;
      color: ${theme.textColor};
      border-bottom-color: ${desaturate(0.2, lighten(0.38, theme.primaryColor))}
      `,
    dark: (theme: Theme) => css`
      background-color: #404049;
      color: ${theme.textColor};
      border-bottom-color: #292939;
      `
  }
}

const WorkspaceHeader = ({ workspaceStore, theme }: Props) => {
  const { workspace } = workspaceStore
  if (!workspace) {
    return null
  }

  const renderToggler = (name) =>
    <Toggler
      key={name}
      onClick={() => workspaceStore.togglePane(name)} active={workspaceStore.isPaneActive(name)}
    >
      {name}
    </Toggler>

  return (
    <div
      className={cx(styles.header.base, styles.header[theme.id](theme))}
    >
      <SideBlock>
        <WorkspaceNameEditor
          value={workspace.name}
          onChange={e => workspace.set({ name: e.target.value })}
        />
      </SideBlock>
      <ToggleBlock>
        {workspaceStore.panes.map(renderToggler)}
      </ToggleBlock>
      <SideBlock></SideBlock>
    </div>
  )
}

export default (withTheme(observer(WorkspaceHeader)): typeof WorkspaceHeader)
