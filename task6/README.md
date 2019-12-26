TASK 2
=====================================
In this task we use IFTTT to send a sensor event to a remote device (Netio4). IFTTT (If This Then That) is a free web service which triggers different services based on events. For Example if a user tweets then send an email. 


## Implementation

* You first need to register on https://ifttt.com/
* Then navigate to User Avatar and click Create. (or simply https://ifttt.com/create)
* Click + in the page as shown below

* In the box ‘Search services’ type ‘webhooks’ and click it in the list.
* Click ‘Receive a web request’ and type a name (netio4-on) for your event in the box.
* Now click again + symbol in front of ‘That’ as shown below.

* Type webhooks (once again) in the search box and choose webhooks.
* Click ‘Make a web request’
* Here you need to type exactly (a globally accessible) url for your node server endpoint. Please note that IFTTT can make request to public ips (domains) only.
* Choose GET in method, application/json for Content Type and click ‘Create Action’.
* Now when ever your fire your event to IFTTT (https://maker.ifttt.com/trigger/netio/with/key/dAYI-truncated) the IFTTT service will make a get request to your node endpoint, which in turn switches ON/OFF netio4.


### Run
 To run the code for this task. 

```bash
cd task2
npm i
npm start
``` 
   
