// @flow
export type Theme = {
  id: string;
  name: string;
}

export default function createTheme (id: string, name: string): Theme {
  return { id, name }
}
