import { GlobalKeyboardListener } from 'node-global-key-listener';
import nspell from 'nspell';
import dictionary from 'dictionary-en-au';
import five from 'johnny-five';

const listener = new GlobalKeyboardListener();

const board = new five.Board({ port: "COM3" });
let relay = null;

board.on("ready", function() {
    console.log("### Board ready!");
    relay = new five.Led(8);
});

const dict = await dictionary;
const spell = nspell(dict);

//Log every key that's pressed.
let currWord = "";
let allowedKeys = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
allowedKeys = allowedKeys.split("")

listener.addListener((e, down) => {
    // Only count the down-presses
    if (e.state == "UP") return;

    if (e.name == "SPACE") {
        if (!spell.correct(currWord))  {
            console.log("ZAPPY TIME");
            relay.on();
            setTimeout(() => {relay.off()}, 10);
        }
        currWord = "";
    } 
    
    else if (allowedKeys.includes(e.name)) {
        currWord += e.name.toLowerCase();
    }
});


