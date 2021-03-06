/**
 * Morse Code example for the Calliope mini
 * October 2021, Sandro Ropelato
 * https://github.com/sropelato/Calliope
 * 
 * The MorseCode project is intended to be run on two Calliope minis. Each mini
 * can be used as a sender or as a receiver. Use the B button to switch between
 * receive mode (green led) and send mode (red led). When in send mode, use the
 * A button to enter a morse code (see table below). If a valid code has been
 * entered, its corresponding character is displayed on the display of the
 * sender and transmitted to all nearby minis in receive mode.
 */

// button states
let buttonA = false;
let oldButtonA = false;
let buttonB = false;
let oldButtonB = false;

// button timing
let buttonAPressTime = -1
let buttonAReleaseTime = -1

// code timing
let dotDashThreshold = 150
let intraCharacterGap = 250

// frequency in Hz for morse code sound
let audioFrequency = 500

// buffer for code being entered
let code = ''

// buffer for received codes
let receivedCodeBuffer: string[] = []

// diplay timing
let displayTimePerSymbol = 1000
let displayTimeBetweenSymbols = 200
let displayTimeTurnOff = 3000

// store if screen is on (is displaying a character)
// and time since when the character was displayed
let screenOn = false
let screenOnTime = -1

// mode
enum Mode {
    RECEIVE = 0,
    SEND = 1,
}
let mode = Mode.RECEIVE;

// dictionary mapping morse code to character
let morseCode: { [code: string]: string } = {};
morseCode['.-'] = 'A'
morseCode['-...'] = 'B'
morseCode['-.-.'] = 'C'
morseCode['-..'] = 'D'
morseCode['.'] = 'E'
morseCode['..-.'] = 'F'
morseCode['--.'] = 'G'
morseCode['....'] = 'H'
morseCode['..'] = 'I'
morseCode['.---'] = 'J'
morseCode['-.-'] = 'K'
morseCode['.-..'] = 'L'
morseCode['--'] = 'M'
morseCode['-.'] = 'N'
morseCode['---'] = 'O'
morseCode['.--.'] = 'P'
morseCode['--.-'] = 'Q'
morseCode['.-.'] = 'R'
morseCode['...'] = 'S'
morseCode['-'] = 'T'
morseCode['..-'] = 'U'
morseCode['...-'] = 'V'
morseCode['.--'] = 'W'
morseCode['-..-'] = 'X'
morseCode['-.--'] = 'Y'
morseCode['--..'] = 'Z'
morseCode['.----'] = '1'
morseCode['..---'] = '2'
morseCode['...--'] = '3'
morseCode['....-'] = '4'
morseCode['.....'] = '5'
morseCode['-....'] = '6'
morseCode['--...'] = '7'
morseCode['---..'] = '8'
morseCode['----.'] = '9'
morseCode['-----'] = '0'

// set radio group
radio.setGroup(94)

// set to receive mode
setMode(Mode.RECEIVE)

// main loop
basic.forever(function () {

    // check state of button B (mode switch)
    if (input.buttonIsPressed(Button.B))
        buttonB = true
    else
        buttonB = false

    // button B was pressed in this frame => change mode
    if (buttonB && !oldButtonB) {
        if (mode == Mode.RECEIVE)
            setMode(Mode.SEND)
        else
            setMode(Mode.RECEIVE)
    }

    // store old state of button B
    oldButtonB = buttonB

    // handle RECEIVE or SEND mode
    if (mode == Mode.RECEIVE)
        receive()
    else
        send()

    // clear screen after timeout
    if (screenOn && control.millis() > screenOnTime + displayTimeTurnOff) {
        basic.clearScreen()
        screenOn = false
    }
})

function setMode(newMode: Mode) {
    mode = newMode;

    // clear screen
    basic.clearScreen()
    screenOn = false

    // clear buffers
    code = ''
    receivedCodeBuffer = []

    // stop playing tone
    music.rest(1)

    if (mode == Mode.RECEIVE) {
        // RECEIVE mode

        // define function to react to received code
        radio.onReceivedString(function (receivedCode: string) {
            receivedCodeBuffer.push(receivedCode)
        })

        // change led color to green
        basic.setLedColor(Colors.Green)

        // play melody to indicate mode change to RECEIVE
        music.playMelody(music.melodyEditor('C6 G5 C5'), 600)
    }
    else {
        // SEND mode

        // clear function to process received code
        radio.onReceivedString(null)

        // change led color to red
        basic.setLedColor(Colors.Red)

        // play melody to indicate mode change to RECEIVE
        music.playMelody(music.melodyEditor('C5 G5 C6'), 600)
    }
}

// handle RECEIVE mode
function receive() {
    if (receivedCodeBuffer.length > 0) {

        // display symbol if screen is ready
        if (!screenOn || (screenOn && control.millis() - screenOnTime > displayTimePerSymbol)) {
            // clear screen to indicate start of next symbol
            if (screenOn) {
                basic.clearScreen()
                basic.pause(displayTimeBetweenSymbols)
            }

            // remove code from buffer
            let receivedCode = receivedCodeBuffer.shift()
            let character = parseMorseCode(receivedCode)

            // check if valid character
            if (character != '?') {
                // display character
                displayCharacter(character)

                // play sound for code
                for (let i = 0; i < receivedCode.length; i++) {
                    if (receivedCode[i] == '.')
                        music.playTone(audioFrequency, dotDashThreshold * 0.5)
                    else if (receivedCode[i] == '-')
                        music.playTone(audioFrequency, dotDashThreshold * 2)
                    basic.pause(dotDashThreshold * 0.5)
                }
            }
        }
    }

    if (screenOn && control.millis() - screenOnTime > displayTimeTurnOff) {
        basic.clearScreen()
        screenOn = false
    }
}

// handle SEND mode
function send() {
    // check state of button A
    if (input.buttonIsPressed(Button.A)) {
        buttonA = true
    } else {
        buttonA = false
    }

    // button A was pressed in this frame
    if (buttonA && !oldButtonA) {
        // store time when button A was pressed
        buttonAPressTime = control.millis()

        // play tone
        music.ringTone(audioFrequency)
    }

    // button A was released in this frame
    if (!buttonA && oldButtonA) {
        // store time when button A was released
        buttonAReleaseTime = control.millis()

        // stop tone
        music.rest(1)

        // determine whether we entered a dot or a dash
        if (buttonAReleaseTime - buttonAPressTime < dotDashThreshold) {
            code += '.'
        } else {
            code += '-'
        }
    }

    // store old state of button A
    oldButtonA = buttonA

    // parse morse code if button has been released long enough
    if (!buttonA && code != '' && control.millis() - buttonAReleaseTime > intraCharacterGap) {
        // parse code and reset code buffer
        let character = parseMorseCode(code)

        // send code (only if valid)
        if (character != '?')
            radio.sendString(code)

        // reset code buffer
        code = ''

        // display character
        displayCharacter(character)
    }
}

// function to display a character on the 5 x 5 display
// if a character is already being displayed, clear screen before displayin
// the new character
function displayCharacter(character: string) {
    // display character in background so the main loop is not blocked
    control.inBackground(function () {
        // clear screen
        if (screenOn) {
            basic.clearScreen()
            basic.pause(displayTimeBetweenSymbols)
        }
        // display character
        basic.showString(character)
    })

    // store time when character is displayed
    screenOn = true
    screenOnTime = control.millis()
}

// function to convert morse code into a displayable character
// if code is not a valid morse code, this function returns a '?'
function parseMorseCode(code: string) {
    let character = morseCode[code]
    if (character !== undefined)
        return character
    return '?'
}
