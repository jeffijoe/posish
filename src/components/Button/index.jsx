// @flow
import styled from "react-emotion";
import { css } from "emotion";
import type { Theme } from "../../models/Theme";
import { withTheme } from "../../utils/theming";
import type { Props as LinkProps } from "../Link";
import Link from "../Link";

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
  cursor: pointer;
`;

const themes = {
  light: css`
    box-shadow: 0 1px 2px rgba(50, 60, 70, 0.2);
    color: #fff;
  `,
  dark: css`
    box-shadow: 0 1px 2px rgba(50, 60, 70, 0.2);
    color: #fff;
  `
};

type Props = LinkProps & {
  theme: Theme,
  small: boolean
};

const Button = withTheme(styled(Link)`
  ${buttonBase};
  ${(p: Props) => themes[p.theme.id] || themes.light};
  ${(p: Props) =>
    p.small &&
    css`
      font-size: 10px;
      height: 28px;
      padding: 0 16px;
    `};
  background-color: ${(p: Props) => p.theme.primaryColor};
`);

export default Button;
