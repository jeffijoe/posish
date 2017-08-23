// @flow
import * as React from 'react'
import { color } from 'csx'
import { observer } from 'inferno-mobx'
import type { RootStore } from '../../root-store'
import { withTheme } from '../../utils/theming'
import type { Theme } from '../../models/theme'
import { BodyClass } from '../ClassName'
import Link from '../Link'
import styled from 'emotion/react'
import * as styling from '../../styling'

type ThemeProps = {
  theme: Theme;
}

const Header = withTheme(styled('div')`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  color: #fff;
  box-shadow: 0 1px 2px ${({ theme }: ThemeProps) => color(theme.primaryColor).darken(0.3).fade(0.2)};
  height: ${styling.HEADER_HEIGHT};
  background-color: ${({ theme }: ThemeProps) => theme.primaryColor};
  background: ${({ theme }: ThemeProps) => `linear-gradient(to bottom, ${theme.primaryColor}, ${color(theme.primaryColor).darken(0.03)})`};
  color: #fff;
  display: flex;
  align-items: center;
  padding: 0 14px;
`)

const HeaderItem = withTheme(styled('div')`
  flex: 0 0 auto;
  padding: 0 10px;
  ${({ fill }) => fill && ({
    flex: '1 1 auto'
  })}
`)

const Title = withTheme(styled(Link)`
  text-decoration: none;
  font-size: 18px;
  color: inherit;
  font-weight: 300;
`)

const ThemeSelect = withTheme(styled('select')`
  background-color: ${({ theme }: ThemeProps) => color(theme.primaryColor).lighten(0.02).toHexString()};
  border-radius: 2px;
  outline: none;
  color: #fff;
  padding: 10px 16px;
  font-size: 13px;
  border: 1px solid ${({ theme }: ThemeProps) => color(theme.primaryColor).darken(0.05).desaturate(0.1).toHexString()};
`)

type Props = {
  rootStore: RootStore;
}

const HeaderContainer = ({ rootStore }: Props) =>
  <Header>
    <BodyClass css={`margin-top: ${styling.HEADER_HEIGHT}`}/>
    <HeaderItem>
      <Title to="/">Posish</Title>
    </HeaderItem>
    <HeaderItem fill></HeaderItem>
    <HeaderItem>
      <ThemeSelect value={rootStore.themeStore.theme.id} onChange={e => rootStore.themeStore.changeThemeById(e.target.value)}>
        {rootStore.themeStore.themes.map(t =>
          <option value={t.id}>{t.name}</option>
        )}
      </ThemeSelect>
    </HeaderItem>
  </Header>

export default (observer(HeaderContainer): typeof HeaderContainer)
