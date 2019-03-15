let dir = [
    'Nucleoid',
    'Packhouse'
]

for (let file of dir) {
    let exec = require('child_process').execSync
    exec( `gitbook build ./${file} ./${file}/static`)
}
