IoT Lab 01 - Task 3
=====================================

In this task we are supposed to develop a Node JS server on Raspberry PI (3), fetch the sensor data from Nordich Thingy 52 and then display it on a web page.

![DEMO](https://github.com/iloveyii/iot-lab1/blob/demo/task1/images/demo1.gif)


## Implementation
  * We developed a web server using node and express. We wrote a class MyThingy which reads all sensor data from thingy. We then make ajax calls from our web page to show that data periodically.

## Run
```bash
cd task3
npm i
npm start

```
