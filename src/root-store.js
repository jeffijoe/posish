// @flow
import { configure, reaction } from "mobx";

import type { ThemeStore } from "./stores/theme-store";
import createThemeStore from "./stores/theme-store";

import type { RouterStore } from "./stores/router-store";
import createRouterStore from "./stores/router-store";

import type { WorkspaceStore } from "./workspace/workspace-store";
import createWorkspaceStore from "./workspace/workspace-store";

import type { SelectionProvider } from "./workspace/selection-provider";
import createSelectionProvider from "./workspace/selection-provider";

export type RootStore = {
  themeStore: ThemeStore,
  routerStore: RouterStore,
  workspaceStore: WorkspaceStore,
  selectionProvider: SelectionProvider
};

configure({
  enforceActions: true
});

export default function createRootStore(): RootStore {
  const routerStore = createRouterStore({
    "(/)": () => routerStore.setView(null),
    "/w/:workspaceId": id => workspaceStore.openWorkspace(id)
  });
  const selectionProvider = createSelectionProvider();
  const workspaceStore = createWorkspaceStore(routerStore, selectionProvider);
  const themeStore = createThemeStore();
  const store = {
    themeStore,
    workspaceStore,
    routerStore,
    selectionProvider
  };

  // Deserialize state
  const data = JSON.parse(localStorage.getItem("data") || "{}");
  workspaceStore.deserialize(data.workspaceStoreData || {});
  themeStore.deserialize(data.themeStoreData || {});

  routerStore.start();

  reaction(
    () =>
      JSON.stringify({
        workspaceStoreData: workspaceStore.serialize(),
        themeStoreData: themeStore.serialize()
      }),
    data => {
      localStorage.setItem("data", data);
    },
    { delay: 1000 }
  );
  return store;
}
