// @flow
import createTheme from '../models/theme'
import type { Theme } from '../models/theme'
import { observable, action, reaction } from 'mobx'

export type ThemeStore = {
  theme: Theme;
  themes: Array<Theme>;
  changeTheme(theme: Theme): void;
  changeThemeById(themeId: string): void;
}

const themes = [
  createTheme('light', 'Light', '#2395f3', '#454552'),
  createTheme('dark', 'Dark', '#EC6A5C', '#fff')
]

export default function createThemeStore (): ThemeStore {
  const store = observable({
    themes: observable.ref(themes),
    theme: observable.shallow(_themeById(localStorage.getItem('selectedTheme')) || themes[0]),
    changeTheme: action((theme: Theme) => {
      store.theme = theme
    }),
    changeThemeById (themeId: string) {
      store.changeTheme(_themeById(themeId))
    }
  })

  reaction(() => store.theme, (theme) => {
    localStorage.setItem('selectedTheme', theme.id)
  })

  return store
}

function _themeById (id: ?string): Theme {
  const theme = themes.find(x => x.id === id)
  if (!theme) {
    return themes[0]
  }

  return theme
}
