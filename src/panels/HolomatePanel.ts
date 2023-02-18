// file: src/panels/HolomatePanel.ts

import * as vscode from "vscode";
import {
  getUri
} from "../utilities/getUri";
import {
  getNonce
} from "../utilities/getNonce";

export class HolomatePanel {
  public static currentPanel: HolomatePanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private _disposables: vscode.Disposable[] = [];

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this._panel = panel;
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
    this._panel.webview.html = this._getWebviewContent(this._panel.webview, extensionUri);
    this._setWebviewMessageListener(this._panel.webview);
  }

  private _setWebviewMessageListener(webview: vscode.Webview) {
    webview.onDidReceiveMessage(
      (message: any) => {
        const command = message.command;
        const text = message.text;

        switch (command) {
          case "hello":
            vscode.window.showInformationMessage(text);
            return;
        }
      },
      undefined,
      this._disposables
    );
  }

  public static render(extensionUri: vscode.Uri) {
    if (HolomatePanel.currentPanel) {
      HolomatePanel.currentPanel._panel.reveal(vscode.ViewColumn.One);
    } else {
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
          <section class="component-example">
            <vscode-text-field label="1">
              <span slot="start">1</span>
            </vscode-text-field>
          </section>

          <section class="component-example">
            <vscode-text-field label="2">
              <span slot="start">2</span>
            </vscode-text-field>
          </section>
          <section class="component-example">
            <vscode-text-field label="3">
              <span slot="start">3</span>
            </vscode-text-field>
          </section>
          <section class="component-example">
            <vscode-text-field label="4">
              <span slot="start">4</span>
            </vscode-text-field>
          </section>
          <section class="component-example">
            <vscode-text-field label="5">
              <span slot="start">5</span>
            </vscode-text-field>
          </section>

          <section class="component-example">
            <vscode-text-field label="6">
              <span slot="start">6</span>
            </vscode-text-field>
          </section>

          <section class="component-example">
            <vscode-text-field label="7">
              <span slot="start">7</span>
            </vscode-text-field>
          </section>
          <section class="component-example">
            <vscode-text-field label="8">
              <span slot="start">8</span>
            </vscode-text-field>
          </section>
          <section class="component-example">
            <vscode-text-field label="9">
              <span slot="start">9</span>
            </vscode-text-field>
          </section>
          <section class="component-example">
            <vscode-text-field label="10">
              <span slot="start">10</span>
            </vscode-text-field>
          </section>
          <section class="component-example">
            <vscode-text-field label="11">
              <span slot="start">11</span>
            </vscode-text-field>
          </section>

          <section class="component-example">
            <vscode-text-field label="12">
              <span slot="start">12</span>
            </vscode-text-field>
          </section>
          <section class="component-example">
            <vscode-button id="save">Save</vscode-button>
          </section>
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