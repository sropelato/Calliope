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

let charIndex = 0
let maxMsgLength = 5
let ledOn = false
let disableRadio = false
let lastDataReceived = -10000

radio.onReceivedString(function (receivedString: string) {
    if (!disableRadio) {
        if (receivedString.length >= charIndex + 1) {
            basic.showString(receivedString.charAt(charIndex))
        }
        lastDataReceived = control.millis()
    }
})

input.onButtonEvent(Button.B, input.buttonEventClick(), function () {
    disableRadio = true
    lastDataReceived = -10000
    basic.setLedColor(Colors.Red)
    music.playTone(Note.C5, 50)
    music.playTone(Note.G5, 100)
    basic.clearScreen()
    basic.pause(200)
    charIndex = (charIndex + 1) % (maxMsgLength)
    basic.showNumber(charIndex)
    basic.pause(500)
    basic.clearScreen()
    basic.pause(200)
    disableRadio = false
})

input.onButtonEvent(Button.A, input.buttonEventClick(), function () {
    disableRadio = true
    lastDataReceived = -10000
    basic.setLedColor(Colors.Red)
    basic.clearScreen()
    basic.pause(200)
    charIndex = (charIndex - 1 + maxMsgLength) % (maxMsgLength)
    music.playTone(Note.G5, 50)
    music.playTone(Note.C5, 100)
    basic.showNumber(charIndex)
    basic.pause(500)
    basic.clearScreen()
    basic.pause(200)
    disableRadio = false
})

// main loop
basic.forever(function () {
    if (control.millis() > lastDataReceived + 5000)
        basic.setLedColor(Colors.Red)
    else
        basic.turnRgbLedOff()
    basic.pause(1000)
})
