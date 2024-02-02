/**
 * WallClock receiver example for the Calliope mini
 * February 2024, Sandro Ropelato
 * https://github.com/sropelato/Calliope
 * 
 * This example receives a string over the radio and displays one character. The
 * character index to be displayed can be selected using the A and B buttons.
 */

// set radio group
radio.setGroup(93)

// variables
let charIndex = 0
let maxMsgLength = 5
let ledOn = false
let disableRadio = false
let lastDataReceived = -10000
let blink = true
let displayOn = false
let oldDisplayOn = false
let currentCharacter = '-'
let displayedCharacter = '-'
let error = false
let oldError = false

// receive radio message and store selected character to be displayed
radio.onReceivedString(function (receivedString: string) {
    if (!disableRadio) {
        if (receivedString.length >= charIndex + 1) {
            currentCharacter = receivedString.charAt(charIndex)
            blink = currentCharacter == ':'
        }
        lastDataReceived = control.millis()
    }
})

// increase character index when button A is pressed
input.onButtonEvent(Button.B, input.buttonEventClick(), function () {
    disableRadio = true
    lastDataReceived = -10000
    basic.setLedColor(Colors.Red)
    music.playTone(Note.C5, 50)
    music.playTone(Note.G5, 100)
    basic.clearScreen()
    basic.pause(200)
    charIndex = (charIndex + 1) % (maxMsgLength)
    showCharacter(charIndex.toString())
    basic.pause(500)
    basic.clearScreen()
    basic.pause(200)
    disableRadio = false
})

// decrease character index when button A is pressed
input.onButtonEvent(Button.A, input.buttonEventClick(), function () {
    disableRadio = true
    lastDataReceived = -10000
    basic.setLedColor(Colors.Red)
    basic.clearScreen()
    basic.pause(200)
    charIndex = (charIndex - 1 + maxMsgLength) % (maxMsgLength)
    music.playTone(Note.G5, 50)
    music.playTone(Note.C5, 100)
    showCharacter(charIndex.toString())
    basic.pause(500)
    basic.clearScreen()
    basic.pause(200)
    disableRadio = false
})

// main loop
basic.forever(function () {
    // turn on red led if no data received for more than 5 seconds
    if (control.millis() > lastDataReceived + 5000)
        basic.setLedColor(Colors.Red)
    else
        basic.turnRgbLedOff()
    if (error && !oldError)
        basic.setLedColor(Colors.Red)
    else if (!error && oldError)
        basic.turnRgbLedOff()
    oldError = error

    // display character (toggle on/off if blink is true)
    displayOn = !blink || Math.round(control.millis() / 1000) % 2 == 0
    if (currentCharacter != displayedCharacter || (displayOn && !oldDisplayOn)) {
        showCharacter(currentCharacter)
        displayedCharacter = currentCharacter
    }
    else if (!displayOn && oldDisplayOn)
        basic.clearScreen()
    oldDisplayOn = displayOn

    basic.pause(20)
})

// draw custom characters
function showCharacter(character: string) {
    switch (character) {
        case '0':
            basic.showLeds(`
                # # # # #
                # . . . #
                # . . . #
                # . . . #
                # # # # #
                `)
            break;
        case '1':
            basic.showLeds(`
                . . # . .
                . . # . .
                . . # . .
                . . # . .
                . . # . .
                `)
            break;
        case '2':
            basic.showLeds(`
                # # # # #
                . . . . #
                # # # # #
                # . . . .
                # # # # #
                `)
            break;
        case '3':
            basic.showLeds(`
                # # # # #
                . . . . #
                . # # # #
                . . . . #
                # # # # #
                `)
            break;
        case '4':
            basic.showLeds(`
                # . . . #
                # . . . #
                # # # # #
                . . . . #
                . . . . #
                `)
            break;
        case '5':
            basic.showLeds(`
                # # # # #
                # . . . .
                # # # # #
                . . . . #
                # # # # #
                `)
            break;
        case '6':
            basic.showLeds(`
                # . . . .
                # . . . .
                # # # # #
                # . . . #
                # # # # #
                `)
            break;
        case '7':
            basic.showLeds(`
                # # # # #
                . . . . #
                . . . . #
                . . . . #
                . . . . #
                `)
            break;
        case '8':
            basic.showLeds(`
                # # # # #
                # . . . #
                # # # # #
                # . . . #
                # # # # #
                `)
            break;
        case '9':
            basic.showLeds(`
                # # # # #
                # . . . #
                # # # # #
                . . . . #
                . . . . #
                `)
            break;
        case ':':
            basic.showLeds(`
                . . . . .
                . . # . .
                . . . . .
                . . # . .
                . . . . .
                `)
            break;
        default:
            basic.showString(currentCharacter)
    }
}
