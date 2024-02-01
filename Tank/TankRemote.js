// main loop

let motorA = false
let motorB = false

// set radio group
radio.setGroup(89)

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

