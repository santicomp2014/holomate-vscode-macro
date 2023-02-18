import { ExtensionContext } from "vscode";

export function  stateManager (globalState: ExtensionContext['globalState'])  {
    return {
      read,
      write
    };
    function read () {
      return {
        lastPaletteTitleApplied: globalState.get('lastPaletteApplied')
      };
    }
    async function write (newState: { lastPaletteTitleApplied: any }) {
      await globalState.update('lastPaletteApplied', newState.lastPaletteTitleApplied);
    }
  }