// file: src/panels/HolomatePanel.ts

import * as vscode from "vscode";
import {
  getUri
} from "../utilities/getUri";
import {
  getNonce
} from "../utilities/getNonce";
import { stateManager } from '../utilities/stateManager';


export class HolomatePanel {
  public static currentPanel: HolomatePanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private _disposables: vscode.Disposable[] = [];
  private static _state: any;

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this._panel = panel;
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
    this._panel.webview.html = this._getWebviewContent(this._panel.webview, extensionUri);
    this._setWebviewMessageListener(this._panel.webview);
  }

  private _setWebviewMessageListener(webview: vscode.Webview) {
    
    webview.onDidReceiveMessage(
      async (message: any) => {
        const command = message.command;
        switch (command) {
          case "save":
            for (const key in message ) {
              if (Object.prototype.hasOwnProperty.call(message, key)) {
                if (key === "command" || "newline_".includes(key)) {
                  continue;
                }
                const value = message[key];
                const number = key.split("_")[1];
                const buttonData = {
                  value,
                  newLine: false,
                };

                if ('newline_' + number in message && message['newline_' + number] === 'on' ) {
                  buttonData.newLine = true;
                }
                await HolomatePanel._state.write(key, {buttonData: buttonData});
              }
            }
            vscode.window.showInformationMessage("BUTTONS SAVED");
            return;
        }
      },
      undefined,
      this._disposables
    );
  }

  public static render(extensionUri: vscode.Uri, globalState: vscode.ExtensionContext['globalState']) {
    if (HolomatePanel.currentPanel) {
      HolomatePanel.currentPanel._panel.reveal(vscode.ViewColumn.One);
    } else {
      HolomatePanel._state = stateManager(globalState);
      const panel = vscode.window.createWebviewPanel("holomate", "holomate", vscode.ViewColumn.One, {
        // Enable javascript in the webview
        enableScripts: true,
        // Restrict the webview to only load resources from the `out` directory
        localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'out')]
      });

      HolomatePanel.currentPanel = new HolomatePanel(panel, extensionUri);
    }
  }

  public dispose() {
    HolomatePanel.currentPanel = undefined;

    this._panel.dispose();

    while (this._disposables.length) {
      const disposable = this._disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }

  private _getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri) {
    const webviewUri = getUri(webview, extensionUri, ["out", "webview.js"]);
    const styleUri = getUri(webview, extensionUri, ["out", "style.css"]);
    const buttons: any[] = [];
    for (let i = 1; i <= 12; i++) {
      buttons.push(HolomatePanel._state.read('button_' + i).buttonData);
    }
    //ADD DEFAULT VALUES

    const nonce = getNonce();
    // Tip: Install the es6-string-html VS Code extension to enable code highlighting below
    return /*html*/ `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="Content-Security-Policy"
        content="default-src 'none'; style-src ${webview.cspSource}; font-src ${webview.cspSource}; img-src ${webview.cspSource} https:; script-src 'nonce-${nonce}';">
      <link rel="stylesheet" href="${styleUri}">
      <title>Holomate Editor</title>
    </head>

    <body>
      <h1>Holomate Editor</h1>
      <section class="component-row">
        <section class="component-container">
          <form id="form">
          ${Array.from({ length: 12 }, (_, i) => i+1).map(
            (buttonNumber) => `
              <section class="component-example">
                <vscode-text-field
                  name="button_${buttonNumber}"
                  label="${buttonNumber}"
                  value="${buttons[buttonNumber-1]?.value || ""}"
                >
                  <span slot="start">${buttonNumber}</span>
                </vscode-text-field>
                <vscode-checkbox name="newline_${buttonNumber}" ${buttons[buttonNumber-1]?.newLine ? "checked" : "" }>Add NewLine</vscode-checkbox>
              </section>
            `
            )}
            <section class="component-example">
              <vscode-button id="save">Save</vscode-button>
            </section>
          </form>
        </section>
        <section class="component-container">
          <section class="component-example">
            <img style="width: 240px;" src="${webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'out', 'holomate_frontal.png'))}" />
          </section>
        </section>
      </section>
      <script type="module" nonce="${nonce}" src="${webviewUri}"></script>
    </body>

    </html>
    `;
  }

}