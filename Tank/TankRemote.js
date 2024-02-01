/**
 * RC tank example for the Calliope mini
 * February 2024, Sandro Ropelato
 * https://github.com/sropelato/Calliope
 * 
 * This project uses a Calliope mini to drive two motors. Motor A powers the
 * left track of the tank, Motor B drives the right one. Using a second
 * Calliope, the tank can be remote controlled by pressing the A and B buttons:
 * (A = turn left, B = turn right, A+B = go straight
 */

let motorA = false
let motorB = false

// set radio group
radio.setGroup(89)

// main loop
basic.forever(function () {
    motorA = input.buttonIsPressed(Button.A)
    motorB = input.buttonIsPressed(Button.B)

    let signal = 0
    if (motorA && !motorB)
        signal = 1
    else if (!motorA && motorB)
        signal = 2
    else if (motorA && motorB)
        signal = 3

    radio.sendNumber(signal)
    basic.pause(100)
})

