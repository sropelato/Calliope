/**
 * WallClock sender example for the Calliope mini
 * February 2024, Sandro Ropelato
 * https://github.com/sropelato/Calliope
 *
 * This example reads the current time (in format hh:mm:ss) from the USB serial
 * port and sends it via radio to all receiving Calliope minis.
 */

// read serial from USB
serial.redirectToUSB()

// set radio group
radio.setGroup(93)

// variables
let hour = 0
let minute = 0
let second = 0
let oldHour = -1
let oldMinute = -1
let oldSecond = -1

// when second greater or equal to the given threshold, turn the led at
// coordinates ledX / ledY on, otherwise turn it off
function displaySeconds(ledX: number, ledY: number, second: number, threshold: number) {
    if (second >= threshold)
        led.plot(ledX, ledY)
    else
        led.unplot(ledX, ledY)
}

// receive data from serial
serial.onDataReceived(serial.delimiters(Delimiters.NewLine), function () {
    let receivedData = serial.readUntil(serial.delimiters(Delimiters.NewLine));
    if (receivedData.length == 8) {
        let hour = parseInt(receivedData.substr(0, 2));
        let minute = parseInt(receivedData.substr(3, 5));
        let second = parseInt(receivedData.substr(6, 8));

        // update if hour, minute or second has changed
        if (hour != oldHour || minute != oldMinute || second != oldSecond) {
            // send time as string (hh:mm) via radio
            oldHour = hour
            oldMinute = minute
            oldSecond = second
            let sendData = ''
            if (hour < 10)
                sendData += '0'
            sendData += hour
            sendData += ':'
            if (minute < 10)
                sendData += '0'
            sendData += minute
            radio.sendString(sendData)

            // display seconds on display
            if (second % 2 == 0)
                led.plot(2, 2)
            else
                led.unplot(2, 2)
            displaySeconds(2, 0, second, 60 / 16 * 0)
            displaySeconds(3, 0, second, 60 / 16 * 1)
            displaySeconds(4, 0, second, 60 / 16 * 2)
            displaySeconds(4, 1, second, 60 / 16 * 3)
            displaySeconds(4, 2, second, 60 / 16 * 4)
            displaySeconds(4, 3, second, 60 / 16 * 5)
            displaySeconds(4, 4, second, 60 / 16 * 6)
            displaySeconds(3, 4, second, 60 / 16 * 7)
            displaySeconds(2, 4, second, 60 / 16 * 8)
            displaySeconds(1, 4, second, 60 / 16 * 9)
            displaySeconds(0, 4, second, 60 / 16 * 10)
            displaySeconds(0, 3, second, 60 / 16 * 11)
            displaySeconds(0, 2, second, 60 / 16 * 12)
            displaySeconds(0, 1, second, 60 / 16 * 13)
            displaySeconds(0, 0, second, 60 / 16 * 14)
            displaySeconds(1, 0, second, 60 / 16 * 15)
        }
    }
});
