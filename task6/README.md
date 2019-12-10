PI Installations
=====================================


I installed the following for IoT lab.

## Installations
### OS
  * Download Raspbian Buster with Desktop from `https://www.raspberrypi.org/downloads/raspbian/`.
  * Extract the image from the above step and write to SD card using Ubuntu Image Writer or Etcher.
  * In the boot partition of SD card `touch ssh` to enable ssh.
  * Auto connect to wifi, nano `/etc/wpa_supplicant/wpa_supplicant.conf` and add the following at the end
```bash
network={
   ssid="your-wifi"
   psk="your-wifi-password"
}
``` 
  * Eject SD card from computer and place in PI, power up PI.
  * To ssh to PI you need to find IP and may scan network by using `nmap -sP 192.168.0.0/24` or whatever is your network.
  * ssh pi@192.168.0.11, assuming this is your ip, default username is pi and password is raspberry. Change it by `sudo passwd pi`'
  * Install required packages `sudo apt install bluetooth bluez libbluetooth-dev libbluetooth-dev libudev-dev`
  
  
### Node
  * Install Node Version Manager (NVM)
    `curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash`
  * Source profile
    `source ~/.bashrc`
  * Install node v8 `nvm install 8`
  * Set as default `nvm use 8` 
  * If you want to use latest npm `npm install npm@latest -g`
  
     
### VNC Server
  * Run `sudo raspi-config` and then choose Interfacing Options, enable VNC.
  * Connect from a VNC client from your computer.



### Issues and solution
   * To set the display resolution `nano /boot/config.txt`, and set `hdmi_mode	16`.
