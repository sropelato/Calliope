from datetime import datetime
import time
import serial

# configure serial port
ser = serial.Serial('/dev/tty.usbmodemXYZ', 115200)

try:
    while True:
        # get current time
        current_time = datetime.now().strftime("%H:%M:%S")
        
        # send current time followed by a newline
        ser.write((current_time + '\n').encode())

        # wait for 100 ms
        time.sleep(0.1)
except KeyboardInterrupt:
    # close the serial connection
    ser.close()
    print("Serial connection closed.")
