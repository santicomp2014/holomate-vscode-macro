// file: src/webview/main.ts

import { provideVSCodeDesignSystem, vsCodeButton, Button } from "@vscode/webview-ui-toolkit";


provideVSCodeDesignSystem().register(vsCodeButton());

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const vscode = acquireVsCodeApi();

window.addEventListener("load", main);

function main() {
  // To get improved type annotations/IntelliSense the associated class for
  // a given toolkit component can be imported and used to type cast a reference
  // to the element (i.e. the `as Button` syntax)
  const saveButton = document.getElementById("save") as Button;
  saveButton?.addEventListener("click", handleSaveClick);
}

function handleSaveClick() {
  vscode.postMessage({
    command: "hello",
    text: "Saved Correctly 👌",
  });
}