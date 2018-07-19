// @flow
import * as React from "react";
import { observer } from "inferno-mobx";
// $FlowFixMe
import { darken, lighten, transparentize } from "polished";
import { css } from "emotion";
import type { RootStore } from "../../root-store";
import { withTheme } from "../../utils/theming";
import type { Theme } from "../../models/theme";
import MdAdd from "react-icons/lib/md/add";
import MdClose from "react-icons/lib/md/close";
import { BodyClass } from "../ClassName";
import Link from "../Link";
import styled from "react-emotion";
import * as styling from "../../styling";

type ThemeProps = {
  theme: Theme
};

const Header = withTheme(styled("div")`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  color: #fff;
  box-shadow: 0 1px 2px
    ${({ theme }: ThemeProps) =>
      transparentize(0.8, darken(0.3, theme.primaryColor))};
  height: ${styling.HEADER_HEIGHT}px;
  background-color: ${({ theme }: ThemeProps) => theme.primaryColor};
  background: ${({ theme }: ThemeProps) =>
    `linear-gradient(to bottom, ${theme.primaryColor}, ${darken(
      0.03,
      theme.primaryColor
    )})`};
  color: #fff;
  display: flex;
  align-items: center;
  padding: 0 14px;
  z-index: 1;
`);

const HeaderItem = withTheme(styled("div")`
  flex: 0 0 auto;
  padding: 0 10px;
  ${({ fill }) =>
    fill && {
      flex: "1 1 auto"
    }};
`);

const Title = withTheme(styled(Link)`
  text-decoration: none;
  font-size: 18px;
  color: inherit;
  font-weight: 300;
`);

const ThemeSelect = withTheme(styled("select")`
  background-color: ${({ theme }: ThemeProps) =>
    lighten(0.02, theme.primaryColor)};
  border-radius: 2px;
  outline: none;
  color: #fff;
  padding: 10px 16px;
  font-size: 13px;
  border: 1px solid
    ${({ theme }: ThemeProps) => darken(0.05, theme.primaryColor)};
`);

const WorkspaceTabs = styled("div")`
  display: flex;
  align-items: stretch;
  padding: 0 30px;
`;

const WorkspaceTab = styled(Link)`
  flex: 0 0 auto;
  border-bottom: 4px solid ${props => (props.active ? "#fff" : "transparent")};
  height: ${styling.HEADER_HEIGHT}px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  padding-top: 4px;
  padding-right: 10px;
  text-decoration: none;
  color: #fff;
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    & > div {
      opacity: 1;
    }
  }
`;

const NewWorkspaceButton = styled("a")`
  display: inline-flex;
  align-self: center;
  align-items: center;
  justify-content: center;
  border: 0;
  font-size: 24px;
  line-height: 0;
  text-decoration: none;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  cursor: pointer;
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const CloseWorkspaceButton = ({ onClick }) => {
  return (
    <div
      className={css`
        color: #fff;
        opacity: 0;
        padding-left: 4px;
      `}
      onClick={e => e.preventDefault() || e.stopPropagation() || onClick()}
    >
      <MdClose />
    </div>
  );
};

type Props = {
  rootStore: RootStore
};

const HeaderContainer = ({ rootStore }: Props) => (
  <Header>
    <BodyClass
      css={`
        margin-top: ${styling.HEADER_HEIGHT}px;
      `}
    />
    <HeaderItem>
      <Title to="/">Posish</Title>
    </HeaderItem>
    <HeaderItem fill>
      <WorkspaceTabs>
        {rootStore.workspaceStore.workspaces.map(w => (
          <WorkspaceTab
            key={w.id}
            active={rootStore.workspaceStore.workspace === w}
            to={`/w/${w.id}`}
          >
            {w.name}
            <CloseWorkspaceButton
              onClick={() =>
                window.confirm(
                  "Do you really want to remove this workspace?"
                ) && rootStore.workspaceStore.removeWorkspace(w)
              }
            />
          </WorkspaceTab>
        ))}
        <NewWorkspaceButton onClick={rootStore.workspaceStore.newWorkspace}>
          <MdAdd />
        </NewWorkspaceButton>
      </WorkspaceTabs>
    </HeaderItem>
    <HeaderItem>
      <ThemeSelect
        value={rootStore.themeStore.theme.id}
        onChange={e => rootStore.themeStore.changeThemeById(e.target.value)}
      >
        {rootStore.themeStore.themes.map(t => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </ThemeSelect>
    </HeaderItem>
  </Header>
);

export default (observer(HeaderContainer): typeof HeaderContainer);
