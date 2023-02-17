const vscode = require('vscode');
const navigator = require('web-midi-api');

function activate(context) {
  console.log('MIDI extension activated');

  // Request MIDI access
  navigator.requestMIDIAccess()
    .then(onMIDISuccess, onMIDIFailure);

  // Function to handle MIDI access success
  function onMIDISuccess(midiAccess) {
    console.log("MIDI access available");

    // Get the first MIDI input device
    var input = midiAccess.inputs.values().next().value;

    // If there is no input device, show an error message
    if (!input) {
      console.log("No MIDI input devices found");
      return;
    }

    // Set up a listener for MIDI messages
    input.onmidimessage = function(message) {
      // Extract the MIDI message data
      var status = message.data[0] & 0xf0;
      var channel = message.data[0] & 0x0f;
      var data1 = message.data[1];
      var data2 = message.data[2];

      // Handle the MIDI message based on the status byte
      switch (status) {
        case 0x90: // Note on
          // Display a message box with the note number and velocity
          vscode.window.showInformationMessage("Note on: channel=" + channel + ", note=" + data1 + ", velocity=" + data2);
          break;
        // Add cases for other MIDI message types as needed
      }
    };
  }

  // Function to handle MIDI access failure
  function onMIDIFailure(error) {
    console.log("Failed to get MIDI access - " + error);
  }
}

function deactivate() {
  console.log('MIDI extension deactivated');
}

module.exports = {
  activate,
  deactivate
};
