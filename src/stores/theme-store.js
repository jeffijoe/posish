// @flow
import createTheme from "../models/theme";
import type { Theme } from "../models/theme";
import { observable, action } from "mobx";

export type ThemeStore = {
  theme: Theme,
  themes: Array<Theme>,
  changeTheme(theme: Theme): void,
  changeThemeById(themeId: string): void,
  serialize(): Object,
  deserialize(data: Object): void
};

const themes = [
  createTheme("light", "Light theme", "#2395f3", "#454552"),
  createTheme("dark", "Dark theme", "#EC6A5C", "#fff")
];

export default function createThemeStore(): ThemeStore {
  const store = observable(
    {
      themes,
      theme: themes[0],
      changeTheme: action((theme: Theme) => {
        store.theme = theme;
      }),
      changeThemeById(themeId: string) {
        store.changeTheme(_themeById(themeId));
      },
      serialize() {
        return {
          selectedTheme: store.theme.id
        };
      },
      deserialize(data) {
        store.changeThemeById(data.selectedTheme);
      }
    },
    {
      themes: observable.ref,
      theme: observable.shallow
    }
  );

  return store;
}

function _themeById(id: ?string): Theme {
  const theme = themes.find(x => x.id === id);
  if (!theme) {
    return themes[0];
  }

  return theme;
}
