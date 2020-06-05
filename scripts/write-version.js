fs = require('fs');

new_version = new Date();
versionString = JSON.stringify({buildDate: new_version});

// write js file
fs.writeFile('scripts/versions.js',
    'version=' + versionString + ';',
    function(err) {
    if (err) {
        return console.log(err);
    }
});

// write app readable versions.ts
fs.writeFile('version.ts',
    'export const VERSION=' + versionString + ';',
    function(err) {
        if (err) {
            return console.log(err);
        }
});


