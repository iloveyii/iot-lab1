IoT Lab 01 - Task 6
=====================================

In this task we implement a trigger, for example if temperature ( sensor data from thingy) goes below 22, then a video clip should be taken and shown on the web page, and also switch on a smart plug.

![Screenshot](https://github.com/iloveyii/iot-lab1/blob/demo/task6/src/public/images/screenshot1.png)


## Implementation
* It implementation involves using camera API, sensor data from thingy and using HS100 API. All of these have been used in the previous tasks except camera. We used both python based script and node js Open CV based approach for real time video.

## Run

Run the node server:
```bash
cd task6/server
npm i
npm start

```
