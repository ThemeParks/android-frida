#
# This script wraps running Frida into Python
# We will load "pinning.js" into Frida for injection
#  Will also load any injections/<app_id>.js scripts that exist matching target app
#
# Run with python run.py <app_id>
#
# By using this file, you can also send messages back from Android to the host machine
#  Send a message with "data" and "file" fields to write to a file on the host
# Eg.
#  send({data: 'test', file: 'filename.txt'});

# Setup Frida:
# https://frida.re/docs/android/
# 
# Running Frida on device
# adb shell
# cd /data/local/tmp/
# ./serve
# 

import frida, sys, os

def check_directory_exists(dir):
    if not os.path.exists(dir):
        os.makedirs(dir)

# make sure any required directories exist
check_directory_exists("frida_messages")
check_directory_exists("injections")

# check we have a target app ID to inject into
if len(sys.argv) < 2:
    print("[!] No app ID specified. Use python run.py <app_id>")
    sys.exit(1)
app_id = sys.argv[1]
if app_id == "" or app_id == None:
    print("[!] Please provide a valid app id. Use python run.py <app_id>")
    sys.exit(1)

# detect if we're trying to use the injection script as our app id (convenience)
#  if app_id contains .js, use the basename without the .js extension
if app_id.endswith(".js"):
    app_id = os.path.basename(app_id)[:-3]

# on message callback
def on_message(message, data):
    if message['type'] == 'send':
        p = message['payload']
        
        # try and parse an object containing:
        #  {
        #    "file": filename to save data to
        #    "data": data to write to file
        #  }
        try:
            # extract the target filename from the message
            filename = p.get('file')
            filepath = "frida_messages/" + p.get('file')

            # write result
            f = open(filepath, "w")
            # convert bytearray into a string
            #f.write("".join(map(chr, p.get('data'))))
            # write string
            f.write(p.get('data'))
            f.close()
            print("[!] Written content to file " + filename)
        except Exception as inst:
            # print(inst)
            print("[*] {0}".format(p))
    else:
        print(message)

# wrap an injection script in a function
#  simplifies running in the Java context and catching errors
def load_app_script(script_id, directory = "injections"):
    # load the app script
    script_data = open(directory + "/" + script_id).read()
    # wrap script in a function
    script_data = "\n\n// Include: " + directory + "/" + script_id + "\n\nJava.perform(function () {\nconsole.log('[+] Loading " + script_id + " injection script');\ntry {\n" + script_data + "\n} catch(e) {\nconsole.error('[!] Error in " + script_id + " injection script!');\nconsole.error(e);\nconsole.error(e.stack);\n}\n}\n)"
    return script_data

# setup device
devices = frida.get_device_manager().enumerate_devices()
device = None
for d in devices:
    # ignore anything not connected via USB
    if d.type != 'usb':
        continue
    # ignore any devices with "Emulator" in the name
    if "Emulator" in d.name:
        continue
    device = d
    break
if device is None:
    print("[!] No device found")
    sys.exit(1)
print("[*] Connecting to device: " + device.name)
pid = device.spawn([app_id])
session = device.attach(pid)

# create our script data
pinning_script = open("pinning.js").read()
# look for app specific pinning script in injections/{app_id}.js
if os.path.isfile("injections/" + app_id + ".js"):
    print("[*] Found injection script for " + app_id)
    pinning_script += load_app_script(app_id + ".js")
else:
    print("[!] No injection script found for " + app_id)

# load all scripts in common/
common_scripts = []
for f in os.listdir("common/"):
    if f.endswith(".js"):
        common_scripts.append(load_app_script(f, "common"))
# add all common scripts to the pinning script
pinning_script += "\n\n".join(common_scripts)

# write pinning script to file for easier debugging
f = open("frida_messages/debug_script.js", "w")
f.write(pinning_script)
f.close()

script = session.create_script(pinning_script)
# subscribe to messages from process
script.on('message', on_message)
# load script
script.load()

# start process
device.resume(pid)
sys.stdin.read()
