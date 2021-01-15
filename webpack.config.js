const path = require('path');

module.exports = {
    entry: {
        'background':'./src/background/background.js',
        'contentScript':'./src/contentScript.js',
        'genPassword':'./src/genPassword.js',
        'popup':'./src/popup/popup.js'
    },
    output: {
        path: path.join(__dirname, '/dist'),
        filename: '[name].js',
        sourceMapFilename: '[name].js.map' // always generate source maps
    },
    resolve: {
        modules: ['./src', './node_modules'],
        /*alias: {
            react: 'preact/compat',
            'react-dom': 'preact/compat'
        }*/
    },
};
