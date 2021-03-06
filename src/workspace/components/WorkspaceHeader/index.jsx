// @flow
import * as React from "react";
import { observer } from "inferno-mobx";
import type { WorkspaceStore } from "../../workspace-store";
import { css } from "emotion";
import styled from "react-emotion";
// $FlowFixMe
import { lighten, desaturate } from "polished";
import { withTheme } from "../../../utils/theming";
import Button from "../../../components/Button";
import type { Theme } from "../../../models/theme";
import cx from "classnames";
import * as styling from "../../../styling";

type Props = {
  workspaceStore: WorkspaceStore,
  theme: Theme
};

const SideBlock = styled("div")`
  padding: 0 10px;
  flex: 1 1 auto;
`;

const WorkspaceNameEditor = withTheme(styled("input")`
  border-radius: 3px;
  padding: 8px 10px;
  font-size: 14px;
  display: block;
  width: 100%;
  max-width: 300px;
  border: 1px solid transparent;
  outline: none;
  ${({ theme }: { theme: Theme }) =>
    ({
      light: css`
        background-color: rgba(220, 230, 248, 0.3);
        box-shadow: 0 1px 1px rgba(100, 120, 130, 0.06);
        border-color: rgba(180, 190, 208, 0.2);
      `,
      dark: css`
        background-color: rgba(255, 255, 255, 0.1);
      `
    }[theme.id])};
`);

const ToggleBlock = styled("div")`
  flex: 0 0 auto;
  display: flex;
  align-items: center;
`;

const Toggler = withTheme(styled("a")`
  height: 28px;
  padding: 0 12px;
  display: inline-flex;
  line-height: 0;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  text-decoration: none;
  cursor: pointer;
  user-select: none;
  &:first-child {
    border-radius: 4px 0 0 4px;
  }
  &:last-child {
    border-radius: 0 4px 4px 0;
  }
  ${({ theme, active }: { theme: Theme, active: boolean }) =>
    ({
      light: css`
        background-color: ${active ? theme.primaryColor : "#e7e7ef"};
        color: ${active ? "#fff" : theme.textColor};
        ${active &&
          css`
            box-shadow: inset 0 1px 1px rgba(100, 110, 120, 0.3);
          `};
      `,
      dark: css`
        background-color: ${active
          ? theme.primaryColor
          : "rgba(255, 255, 255, 0.1)"};
        color: ${theme.textColor};
        ${active &&
          css`
            box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.3);
          `};
      `
    }[theme.id])};
`);

const Actions = styled("div")`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const styles = {
  header: {
    base: css`
      height: ${styling.WORKSPACE_HEADER_HEIGHT}px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #eee;
      padding: 0 20px;
    `,
    light: (theme: Theme) => css`
      background-color: #fafafe;
      color: ${theme.textColor};
      border-bottom-color: ${desaturate(
        0.2,
        lighten(0.38, theme.primaryColor)
      )};
    `,
    dark: (theme: Theme) => css`
      background-color: #404049;
      color: ${theme.textColor};
      border-bottom-color: #292939;
    `
  }
};

const WorkspaceHeader = ({ workspaceStore, theme }: Props) => {
  const { workspace } = workspaceStore;
  if (!workspace) {
    return null;
  }

  const renderToggler = name => (
    <Toggler
      key={name}
      onClick={() => workspaceStore.togglePane(name)}
      active={workspaceStore.isPaneActive(name)}
    >
      {name}
    </Toggler>
  );

  return (
    <div className={cx(styles.header.base, styles.header[theme.id](theme))}>
      <SideBlock>
        <WorkspaceNameEditor
          value={workspace.name}
          onChange={e => workspace.set({ name: e.target.value })}
        />
      </SideBlock>
      <ToggleBlock>{workspaceStore.panes.map(renderToggler)}</ToggleBlock>
      <SideBlock>
        <Actions>
          <Button
            small
            title="Shortcut: Ctrl+M"
            onMouseDown={() => {
              workspaceStore.highlight();
              return false;
            }}
          >
            Highlight
          </Button>
          &nbsp;
          <Button small onClick={workspace.copyAll}>
            Copy all
          </Button>
          &nbsp;
          <Button small onClick={workspace.invalidate}>
            Clear all
          </Button>
        </Actions>
      </SideBlock>
    </div>
  );
};

export default (withTheme(observer(WorkspaceHeader)): typeof WorkspaceHeader);
