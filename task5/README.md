IoT Lab 01 - Task 5
=====================================

In this task we save the sensor data to Firebase and then display it on the web page in real time using Firebase library.

![Screenshot](https://github.com/iloveyii/iot-lab1/blob/demo/task5/public/images/screenshot1.png)


## Implementation
* To do this we simply add another endpoint into our express server. This endpoint has service (device) name and status ( ON/OFF, 1/0) which switches ON/OFF the devices accordingly.
When a user clicks a button on the page an ajax request is made to the node server which contains both service name and status (ON/OFF). The node server receives this request and then decides which service to switch ON/OFF.

## Run

Run the node server:
```bash
cd task4/server
npm i
npm start

```
