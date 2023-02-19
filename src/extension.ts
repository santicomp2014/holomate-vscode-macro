/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { commands, window, ExtensionContext, Terminal } from 'vscode';
import { HolomatePanel } from "./panels/HolomatePanel";
import { stateManager } from './utilities/stateManager';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import navigator = require('web-midi-api');

type Command = {
	note: number,
	velocity: number
};

export function activate(context: ExtensionContext) {
	const state = stateManager(context.globalState);

	const holomateCommand = commands.registerCommand("holomate.holomate", () => {
		HolomatePanel.render(context.extensionUri, context.globalState);
	});

	context.subscriptions.push(holomateCommand);

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
			sendParams(command, state);
			break;
			// Add cases for other MIDI message types as needed
		}
		};
	}

	// Function to handle MIDI access failure
	function onMIDIFailure(error: string) {
		output.appendLine("Failed to get MIDI access - " + error);
	}

	const sendParams = (command: Command, state: { read: any; write?: (button: "button_1" | "button_2" | "button_3" | "button_4" | "button_5" | "button_6" | "button_7" | "button_8" | "button_9" | "button_10" | "button_11" | "button_12", newState: { buttonData: any; }) => Promise<void>; }) => {
		output.appendLine("sendParams: " + command);
		const termName = "TERMINAL";
		const term = window.terminals.find(t => t.name === termName);

		const handleSendText = (term: Terminal ,command: Command) => {
			if (command.velocity > 0) {
				switch (command.note) {
					case 36:
						term.sendText(state.read("button_1").buttonData);
						output.appendLine("sendParams: " + state.read("button_1").buttonData);
						break;
					case 37:
						term.sendText(state.read("button_2").buttonData);
						output.appendLine("sendParams: " + state.read("button_2").buttonData);
						//term.sendText("git add .");
						break;
					case 38:
						term.sendText(state.read("button_3").buttonData);
						output.appendLine("sendParams: " + state.read("button_3").buttonData);
						//term.sendText('git commit -m "',false);
						break;
					case 39:
						term.sendText(state.read("button_4").buttonData);
						output.appendLine("sendParams: " + state.read("button_4").buttonData);
						//term.sendText('git push');
						break;
					case 40:
						term.sendText(state.read("button_5").buttonData);
						output.appendLine("sendParams: " + state.read("button_5").buttonData);
						//term.sendText('git merge stage');
						break;
					case 41:
						term.sendText(state.read("button_6").buttonData);
						output.appendLine("sendParams: " + state.read("button_6").buttonData);
						//term.sendText('NOP');
						break;
					case 42:
						term.sendText(state.read("button_7").buttonData);
						output.appendLine("sendParams: " + state.read("button_7").buttonData);
						//term.sendText('NOP');
						break;
					case 43:
						term.sendText(state.read("button_8").buttonData);
						output.appendLine("sendParams: " + state.read("button_8").buttonData);
						//term.sendText('NOP');
						break;
					case 44:
						term.sendText(state.read("button_9").buttonData);
						output.appendLine("sendParams: " + state.read("button_9").buttonData);
						//term.sendText('NOP');
						break;
					case 45:
						term.sendText(state.read("button_10").buttonData);
						output.appendLine("sendParams: " + state.read("button_10").buttonData);
						//term.sendText('NOP');
						break;
					case 46:
						term.sendText(state.read("button_11").buttonData);
						output.appendLine("sendParams: " + state.read("button_11").buttonData);
						//term.sendText('NOP');
						break;
					case 47:
						term.sendText(state.read("button_12").buttonData);
						output.appendLine("sendParams: " + state.read("button_12").buttonData);
						//term.sendText('NOP');
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
