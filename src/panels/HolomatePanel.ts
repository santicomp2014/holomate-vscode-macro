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
                if (key === "command") {
                  continue;
                }
                const element = message[key];
                await HolomatePanel._state.write(key, {buttonData: element});
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
    const button_1 = HolomatePanel._state.read('button_1').buttonData;
    const button_2 = HolomatePanel._state.read('button_2').buttonData;
    const button_3 = HolomatePanel._state.read('button_3').buttonData;
    const button_4 = HolomatePanel._state.read('button_4').buttonData;
    const button_5 = HolomatePanel._state.read('button_5').buttonData;
    const button_6 = HolomatePanel._state.read('button_6').buttonData;
    const button_7 = HolomatePanel._state.read('button_7').buttonData;
    const button_8 = HolomatePanel._state.read('button_8').buttonData;
    const button_9 = HolomatePanel._state.read('button_9').buttonData;
    const button_10 = HolomatePanel._state.read('button_10').buttonData;
    const button_11 = HolomatePanel._state.read('button_11').buttonData;
    const button_12 = HolomatePanel._state.read('button_12').buttonData;
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
            <section class="component-example">
              <vscode-text-field name="button_1" label="1" value="${button_1}">
                <span slot="start">1</span>
              </vscode-text-field>
              <vscode-radio-group>
                <label slot="label">NewLine</label>
                <vscode-radio name="radio_yes_1">Yes</vscode-radio>
                <vscode-radio name="radio_no_1">No</vscode-radio>
              </vscode-radio-group>
            </section>

            <section class="component-example">
              <vscode-text-field name="button_2" label="2" value="${button_2}">
                <span slot="start">2</span>
              </vscode-text-field>
            </section>
            <section class="component-example">
              <vscode-text-field name="button_3" label="3" value="${button_3}">
                <span slot="start">3</span>
              </vscode-text-field>
            </section>
            <section class="component-example">
              <vscode-text-field name="button_4" label="4" value="${button_4}">
                <span slot="start">4</span>
              </vscode-text-field>
            </section>
            <section class="component-example">
              <vscode-text-field name="button_5" label="5" value="${button_5}">
                <span slot="start">5</span>
              </vscode-text-field>
            </section>

            <section class="component-example">
              <vscode-text-field name="button_6" label="6" value="${button_6}">
                <span slot="start">6</span>
              </vscode-text-field>
            </section>

            <section class="component-example">
              <vscode-text-field name="button_7" label="7" value="${button_7}">
                <span slot="start">7</span>
              </vscode-text-field>
            </section>
            <section class="component-example">
              <vscode-text-field name="button_8" label="8" value="${button_8}">
                <span slot="start">8</span>
              </vscode-text-field>
            </section>
            <section class="component-example">
              <vscode-text-field name="button_9" label="9" value="${button_9}">
                <span slot="start">9</span>
              </vscode-text-field>
            </section>
            <section class="component-example">
              <vscode-text-field name="button_10" label="10" value="${button_10}">
                <span slot="start">10</span>
              </vscode-text-field>
            </section>
            <section class="component-example">
              <vscode-text-field name="button_11" label="11" value="${button_11}">
                <span slot="start">11</span>
              </vscode-text-field>
            </section>

            <section class="component-example">
              <vscode-text-field name="button_12" label="12" value="${button_12}">
                <span slot="start">12</span>
              </vscode-text-field>
            </section>
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