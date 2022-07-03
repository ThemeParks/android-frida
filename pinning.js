// This script is designed to be run from Python with included run.py script
// eg: 
//  python run.py <app_id>
//
// (for reference only) manually start scripts through:
//   frida -U -l pinning.js -f <app_id> --no-pause>

// delay until Java is ready for injection
while (!Java.available) {
    console.log('Waiting for Java to be available...');
}

Java.perform(function () {
    console.log('===');
    console.log(' ! Frida Android Helper Script !');
    console.log(' Intercept common certificate pinning techniques');
    console.log(' Developed by Jamie Holding - @cube');
    console.log(' https://github.com/sponsors/cubehouse');
    console.log('===');
});
