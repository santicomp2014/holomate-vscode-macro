/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { window, ExtensionContext, Terminal } from 'vscode';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import navigator = require('web-midi-api');

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

type Command = {
	note: number,
	velocity: number
};

export function activate(context: ExtensionContext) {
	const output = window.createOutputChannel("Holomate");
	output.appendLine('MIDI extension activated');
	//Request MIDI access
	navigator.requestMIDIAccess()
		.then(onMIDISuccess, onMIDIFailure)
		.catch((e: any) => {
			console.error(e);
		});

	// Function to handle MIDI access success
	function onMIDISuccess(midiAccess: { inputs: { values: () => { (): any; new(): any; next: { (): { (): any; new(): any; value: any; }; new(): any; }; }; }; }) {
		output.appendLine("MIDI access available");

		// Get the first MIDI input device
		const input = midiAccess.inputs.values().next().value;

		// If there is no input device, show an error message
		if (!input) {
			output.appendLine("No MIDI input devices found");
			return;
		}

		// Set up a listener for MIDI messages
		input.onmidimessage = function(message: { data: any[]; }) {
		// Extract the MIDI message data
		const status = message.data[0] & 0xf0;
		const channel = message.data[0] & 0x0f;
		const data1 = message.data[1];
		const data2 = message.data[2];

		// Handle the MIDI message based on the status byte
		const command = {
			note: data1,
			velocity: data2
		};
		switch (status) {
			case 0x90: // Note on
			// Display a message box with the note number and velocity
			//vscode.window.showInformationMessage("Note on: channel=" + channel + ", note=" + data1 + ", velocity=" + data2);
			output.appendLine("Note on: channel=" + channel + ", note=" + data1 + ", velocity=" + data2);
			sendParams(command);
			break;
			// Add cases for other MIDI message types as needed
		}
		};
	}

	// Function to handle MIDI access failure
	function onMIDIFailure(error: string) {
		output.appendLine("Failed to get MIDI access - " + error);
	}

	const sendParams = (command: Command) => {
		output.appendLine("sendParams: " + command);
		const termName = "TERMINAL";
		const term = window.terminals.find(t => t.name === termName);

		const handleSendText = (term: Terminal ,command: Command) => {
			if (command.velocity > 0) {
				switch (command.note) {
					case 36:
						term.sendText("git checkout stage");
						break;
					case 37:
						term.sendText("git add .");
						break;
					case 38:
						term.sendText('git commit -m "',false);
						break;
					case 39:
						term.sendText('git push');
						break;
					case 40:
						term.sendText('git merge stage');
						break;
					default:
						break;
				}
			}
		};

		if (term) {
			term.show();
			handleSendText(term, command);
		} else {
			const newTerm = window.createTerminal(termName);
			newTerm.show();
			handleSendText(newTerm, command);
		}
	};


}
export function deactivate(context: ExtensionContext) {
	const output = window.createOutputChannel("Holomate");
	output.appendLine('MIDI extension deactivated');
}
