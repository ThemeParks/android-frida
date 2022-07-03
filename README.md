# Frida Android Helper

Helper script that I use to speed up debugging applications on Android.

Run using:

```
python3 run.py <app_id>
```

Prerequisites:
* You must have Frida setup and running on the target device and host machine

YMMV, this is my local reverse engineering suite. Support will be limited.

## Features

Supports bypassing HTTPS SSL certificate pinning for common techniques.

Supports loading custom injection scripts for the target process. Place JavaScript file in folder called injections/ matching the app ID of the target app (but with a .js extension).

Scripts can dump data onto host machine by calling "send", which will write the data sent into a file in frida_messages/

Example:

```
send({data: 'test string', file: 'testfile.txt'})
```