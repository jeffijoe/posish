// @flow
export type Theme = {
  id: string;
  name: string;
  primaryColor: string;
  textColor: string;
}

export default function createTheme (
  id: string,
  name: string,
  primaryColor: string,
  textColor: string
): Theme {
  return { id, name, primaryColor, textColor }
}
