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

let motorA = false;
let motorB = false;

let lastSignalReceived = -10000

let ledOn = false
let lastBlinkChange = 0
let blinkDuration = 300

// set radio group
radio.setGroup(89)

// handle received signal
radio.onReceivedNumber(function (receivedNumber: number) {
    switch (receivedNumber) {
        case 1:
            motorA = true;
            motorB = false;
            break;
        case 2:
            motorA = false;
            motorB = true;
            break;
        case 3:
            motorA = true;
            motorB = true;
            break;
        default:
            motorA = false;
            motorB = false;
    }

    lastSignalReceived = control.millis()
    basic.setLedColor(Colors.Green)
})

// main loop
basic.forever(function () {
    // stop motors if no signal has been received for more than two seconds
    if (control.millis() > lastSignalReceived + 2000) {
        motorA = false;
        motorB = false;

        if (control.millis() > lastBlinkChange + blinkDuration) {
            ledOn = !ledOn
            lastBlinkChange = control.millis()
            basic.setLedColor(ledOn ? Colors.Red : Colors.Off)
        }
    }

    // drive motor A
    if (motorA)
        motors.dualMotorPower(Motor.A, __internal.__speedPicker(100))
    else
        motors.dualMotorPower(Motor.A, __internal.__speedPicker(0))

    // drive motor B
    if (motorB)
        motors.dualMotorPower(Motor.B, __internal.__speedPicker(100))
    else
        motors.dualMotorPower(Motor.B, __internal.__speedPicker(0))

    basic.pause(100)
})

