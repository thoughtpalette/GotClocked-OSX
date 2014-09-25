module.exports = {
    options: {
        platforms: ['win','osx'],
        buildDir: './webkitbuilds', // Where the build version of my node-webkit app is saved
    },
    src: [
        "./*"
    ] // Your node-webkit app
};