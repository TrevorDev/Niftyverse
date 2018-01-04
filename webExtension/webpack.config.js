// var webpack = require('webpack');
// const Uglify = require("uglifyjs-webpack-plugin");
// var PROD = false;

module.exports = {
    entry: {
        "dist/niftyverse": "./niftyverse.ts"
    },
    output: {
        filename: '[name].js',
        path: __dirname
    },
    // target: 'node',
    resolve: {
        // Add '.ts' and '.tsx' as a resolvable extension.
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },
    module: {
        loaders: [
            // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
            { test: /\.tsx?$/, loader: "ts-loader" }
        ]
    }
    // ,
    // plugins: PROD ? [
    //     new Uglify()
    // ] : []
    // ,
    // externals: {
    //     "sequelize": "require('sequelize')",
    //     "socket.io": "require('socket.io')"
    // }
};
