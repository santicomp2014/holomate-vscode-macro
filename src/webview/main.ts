// file: src/webview/main.ts

import { provideVSCodeDesignSystem, vsCodeButton, Button, vsCodeTextField } from "@vscode/webview-ui-toolkit";


provideVSCodeDesignSystem().register(vsCodeButton(), vsCodeTextField());

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
  const button_1 = formData.get("button_1") as string;
  const button_2 = formData.get("button_2") as string;
  const button_3 = formData.get("button_3") as string;
  const button_4 = formData.get("button_4") as string;
  const button_5 = formData.get("button_5") as string;
  const button_6 = formData.get("button_6") as string;
  const button_7 = formData.get("button_7") as string;
  const button_8 = formData.get("button_8") as string;
  const button_9 = formData.get("button_9") as string;
  const button_10 = formData.get("button_10") as string;
  const button_11 = formData.get("button_11") as string;
  const button_12 = formData.get("button_12") as string;

  vscode.postMessage({
    command: "save",
    button_1,
    button_2,
    button_3,
    button_4,
    button_5,
    button_6,
    button_7,
    button_8,
    button_9,
    button_10,
    button_11,
    button_12,
  });
}