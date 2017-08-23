// @flow
import createTheme from '../models/theme'
import type { Theme } from '../models/theme'
import { observable, action } from 'mobx'

export type ThemeStore = {
  theme: Theme;
  themes: Array<Theme>;
  changeTheme(theme: Theme): void;
}

export default function createThemeStore (): ThemeStore {
  const themes = [
    createTheme('light', 'Light'),
    createTheme('dark', 'Dark')
  ]
  const store = observable({
    themes,
    theme: observable.shallow(themes[0]),
    changeTheme: action((theme: Theme) => {
      store.theme = theme
    })
  })

  return store
}
