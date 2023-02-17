/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { window, commands, ExtensionContext } from 'vscode';
import { WebMidi } from 'webmidi';

//import { showQuickPick, showInputBox } from './basicInput';
//import { multiStepInput } from './multiStepInput';
//import { quickOpen } from './quickOpen';

// export function activate(context: ExtensionContext) {
// 	context.subscriptions.push(commands.registerCommand('samples.quickInput', async () => {
// 		const options: { [key: string]: (context: ExtensionContext) => Promise<void> } = {
// 			showQuickPick,
// 			showInputBox,
// 			multiStepInput,
// 			quickOpen,
// 		};
// 		const quickPick = window.createQuickPick();
// 		quickPick.items = Object.keys(options).map(label => ({ label }));
// 		quickPick.onDidChangeSelection(selection => {
// 			if (selection[0]) {
// 				options[selection[0].label](context)
// 					.catch(console.error);
// 			}
// 		});
// 		quickPick.onDidHide(() => quickPick.dispose());
// 		quickPick.show();
// 	}));
// }

export function activate(context: ExtensionContext) {
	console.log('MIDI extension activated');

	console.log("Supported",WebMidi.supported);

	WebMidi
	.enable()
	.then(() => {
		console.log("WebMidi enabled!");
		const holomate = WebMidi.getInputByName("Holomate");
		if (!holomate) {
			console.log("Holomate not found");
			return;
		}
		holomate.addListener("noteon", e => {
			console.log(e.note.identifier);
		});
	})
	.catch(err => console.error("WebMidi Error!",err));

	
}
export function deactivate(context: ExtensionContext) {
	console.log('MIDI extension deactivated');	
}
