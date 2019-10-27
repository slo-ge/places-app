fs = require('fs');
versions = require('./versions.js');
new_version = version.build+1;
versionString = JSON.stringify({build: new_version});

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


