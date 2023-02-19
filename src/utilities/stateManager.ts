import { ExtensionContext } from "vscode";

type ButtonType = 'button_1' | 'button_2' | 'button_3' | 'button_4' | 'button_5' | 'button_6' | 'button_7' | 'button_8' | 'button_9' | 'button_10' | 'button_11' | 'button_12';

export function stateManager(globalState: ExtensionContext['globalState']) {
  return {
    read,
    write
  };
  
  function read(button: ButtonType) {
    return {
      buttonData: globalState.get(button)
    };
  }
  
  async function write(button: ButtonType, newState: { buttonData: any }) {
    await globalState.update(button, newState.buttonData);
  }
}