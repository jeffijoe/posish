// @flow
import styled from 'emotion/react'
import { css } from 'emotion'
import type { Theme } from '../../models/Theme'
import { withTheme } from '../../utils/theming'
import type { Props as LinkProps } from '../Link'
import Link from '../Link'

const buttonBase = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 60px;
  height: 36px;
  border: 0;
  border-radius: 2px;
  font-size: 12px;
  padding: 0 30px;
  line-height: 0;
  text-decoration: none;
`

const themes = {
  light: css`
    box-shadow: 0 2px 2px rgba(50, 60, 70, 0.2);
    background-color: #2395f3;
    color: #fff;
  `,
  dark: css`
    box-shadow: 0 2px 2px rgba(50, 60, 70, 0.2);
    background-color: #4A148C;
    color: #fff;
  `
}

type Props = LinkProps & {
  theme: Theme
}

const Button = withTheme(styled(Link)`
  ${buttonBase};
  ${(p: Props) => themes[p.theme.id] || themes.light};
`)

export default Button
