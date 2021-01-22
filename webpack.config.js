const path = require('path');
const webpack = require('webpack');
module.exports = {
    mode: 'none',
    target: 'web',
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
        },*/
        fallback: {
            "dns": false, // require.resolve("dns"),
            "fs": require.resolve("browserify-fs"),
            "util": false, //require.resolve("util/"),
            "tls": require.resolve("tls"),
            "net": false, // require.resolve("net"),
            "path": require.resolve("path"),
            "zlib": require.resolve("zlib"),
            "http": require.resolve("stream-http"),//("http"),
            "https": require.resolve("https-browserify"),
            "stream": require.resolve("stream-browserify"),//"stream"),
            "child_process": false, //require.resolve("child_process"),
            "url": require.resolve("url"),
            "crypto": require.resolve("crypto-browserify"), //"crypto"),
            "crypto-browserify": require.resolve("crypto-browserify"),
            "path": require.resolve("path-browserify"),
            "zlib": require.resolve("browserify-zlib"),
            "buffer": require.resolve("browserify-buffer"),//"buffer"),
            "constants": require.resolve("constants-browserify"),
            "assert": false
        }
    },
    plugins: [
        // fix "process is not defined" error:
        // (do "npm install process" before running the build)
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        })
    ]
};
