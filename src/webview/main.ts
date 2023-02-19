// file: src/webview/main.ts

import { provideVSCodeDesignSystem, vsCodeButton, Button, vsCodeTextField, vsCodeCheckbox } from "@vscode/webview-ui-toolkit";


provideVSCodeDesignSystem().register(vsCodeButton(), vsCodeTextField(), vsCodeCheckbox());

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const vscode = acquireVsCodeApi();

window.addEventListener("load", main);

function main() {
  const saveButton = document.getElementById("save") as Button;
  saveButton?.addEventListener("click", handleSaveClick);
}

function handleSaveClick() {
  // get the value of the form field id form
  const form = document.getElementById("form") as HTMLFormElement;
  const formData = new FormData(form);

  const buttonValues: Record<string, string> = {};
  const newlineValues: Record<string, string> = {};

  for (let i = 1; i <= 12; i++) {
    const buttonKey = `button_${i}`;
    const newline = `newline_${i}`;

    buttonValues[buttonKey] = formData.get(buttonKey) as string;
    newlineValues[newline] = formData.get(newline) as string;
  }

  vscode.postMessage({
    command: "save",
    ...buttonValues,
    ...newlineValues,
  });
}