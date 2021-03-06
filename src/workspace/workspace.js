// @flow
import { model } from "libx";
import { toJS, reaction, observable } from "mobx";
import * as fragmentUtil from "../utils/fragments";
import * as templateUtil from "../utils/template";
import type { Output } from "../utils/template";
import sample from "lodash/sample";
import without from "lodash/without";
import { copyTextToClipboard } from "../utils/clipboard";

const COLORS = [
  "#58C9B9",
  "#30A9DE",
  "#D1B6E1",
  "#C5E99B",
  "#E57373",
  "#F06292",
  "#BA68C8",
  "#9575CD",
  "#7986CB",
  "#64B5F6",
  "#B388FF",
  "#4FC3F7",
  "#4DD0E1",
  "#4DB6AC",
  "#81C784",
  "#AED581",
  "#DCE775"
];

const defaultTemplate = `// Write a template here.
// Use {{}} syntax for interpolation.
// All available variables are present
// in this default template.
// All values start at zero.
{
  "startPos": {{POS_START}},
  "endPos": {{POS_END}},
  "loc": {
    "start": {
      "line": {{LINE_START + 1}},
      "col": {{COL_START + 1}}
    },
    "end": {
      "line": {{LINE_END + 1}},
      "col": {{COL_END + 1}}
    }
  }
}`;

export interface Workspace {
  id: string;
  name: string;
  serialize(): Object;
  set(attrs: Object, opts?: Object): Workspace;
  template: string;
  code: string;
  +output: Array<Output> | string;
  fragments: Array<fragmentUtil.Fragment>;
  invalidate(): Workspace;
  highlight(start: number, end: number): Workspace;
  removeHighlight(key: string): Workspace;
  copyAll(): Workspace;
  copyOutput(output: Output): Workspace;
}

/**
 * Creates a new workspace model.
 */
export default function createWorkspace(
  attrs: Object,
  opts?: Object
): Workspace {
  let _usedColors = [];

  /**
   * Find the next color to use.
   */
  const nextColor = () => {
    if (_usedColors.length === COLORS.length) {
      _usedColors = [];
    }

    const color = sample(without(COLORS, ..._usedColors));
    _usedColors.push(color);
    return color;
  };

  const workspace: Workspace = model({
    /**
     * Serializes the workspace state to be saved.
     */
    serialize() {
      return { ...toJS(workspace), usedColors: _usedColors };
    },
    /**
     * Deserializes the workspace state to be hydrated.
     */
    parse({ usedColors, ...json }) {
      _usedColors = usedColors || [];
      return json;
    }
  })
    .extendObservable(
      {
        /**
         * Workspace name, for display purposes only.
         */
        name: "Untitled",
        /**
         * The code to use for highlighting.
         */
        code: "",
        /**
         * Template to render.
         */
        template: defaultTemplate,
        /**
         * Current fragments state.
         */
        fragments: [],
        /**
         * Computed output, runs the template again the fragments.
         */
        get output() {
          try {
            return templateUtil.generateOutputs(
              workspace.code,
              workspace.fragments,
              workspace.template
            );
          } catch (err) {
            return err.message;
          }
        }
      },
      { fragments: observable.ref }
    )
    .withActions({
      /**
       * Highlights the specified range.
       */
      highlight(startPos: number, endPos: number) {
        if (startPos === 0 && endPos === 0) {
          return workspace;
        }
        workspace.fragments = fragmentUtil.highlight(
          workspace.fragments,
          this.code,
          startPos,
          endPos,
          nextColor()
        );
        return workspace;
      },
      /**
       * Removes the fragment with the specified key.
       */
      removeHighlight(key: string) {
        workspace.fragments = fragmentUtil.remove(
          workspace.fragments,
          workspace.code,
          key
        );
        if (workspace.fragments.length === 0) {
          workspace.invalidate();
        }
        return workspace;
      },
      /**
       * Removes all fragments and starts from scratch.
       */
      invalidate() {
        workspace.set({
          fragments: fragmentUtil.codeUpdated(
            workspace.fragments,
            workspace.code
          )
        });
        return workspace;
      },
      /**
       * Copies the specified output to the clipboard.
       */
      copyOutput(output: Output) {
        copyTextToClipboard(output.content);
      },
      /**
       * Copies all outputs to the clipboard, separated by newlines.
       */
      copyAll() {
        const outputs = workspace.output;
        if (typeof outputs === "string") {
          return workspace;
        }

        const contents = outputs.map(o => o.content).join("\n");
        copyTextToClipboard(contents);
      }
    });

  workspace.set(attrs, opts);
  reaction(
    () => workspace.code,
    code => {
      workspace.invalidate();
    }
  );
  return workspace;
}
