// file: src/webview/main.ts

import { provideVSCodeDesignSystem, vsCodeButton, Button, vsCodeTextField, vsCodeRadio, vsCodeRadioGroup } from "@vscode/webview-ui-toolkit";


provideVSCodeDesignSystem().register(vsCodeButton(), vsCodeTextField(), vsCodeRadio(), vsCodeRadioGroup());

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
  const radioValues: Record<string, string> = {};

  for (let i = 1; i <= 12; i++) {
    const buttonKey = `button_${i}`;
    const radioYesKey = `radio_yes_${i}`;
    const radioNoKey = `radio_no_${i}`;

    buttonValues[buttonKey] = formData.get(buttonKey) as string;
    radioValues[radioYesKey] = formData.get(radioYesKey) as string;
    radioValues[radioNoKey] = formData.get(radioNoKey) as string;
  }

  vscode.postMessage({
    command: "save",
    ...buttonValues,
    ...radioValues,
  });
}