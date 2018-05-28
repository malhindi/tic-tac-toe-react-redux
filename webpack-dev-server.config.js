var path = require('path');
var webpack = require('webpack');
var nodeModulesPath = path.resolve(__dirname, 'node_modules');
var TransferWebpackPlugin = require('transfer-webpack-plugin');

var buildPath = path.resolve(__dirname, 'build');
var config = {
    devtool: 'inline-source-map',

    entry: [
            'webpack-dev-server/client?http://0.0.0.0:3000',
            'webpack/hot/only-dev-server',
            path.join(__dirname, '/src/app/app')
    ],
    devServer: {
        contentBase: 'src/www',  //Relative directory for base of server
        devtool: 'inline-source-map',
        hot: true,        //Live-reload
        inline: true,
        port: 3000,
        host: '0.0.0.0',
        headers: {
            "Access-Control-Allow-Origin": "http://localhost:3000",
            "Access-Control-Allow-Credentials": "true"
        }
    },

    output: {
        path: buildPath,
        filename: 'app.js'
    },
    node: {
        fs: 'empty'
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify('development')
            }
        }),
        new TransferWebpackPlugin([
            {from: 'www'}
        ], path.resolve(__dirname, "src")),
    ],

    
    resolve: {
        extensions: ['', '.js'],
    },

    module: {
        loaders: [

            {
                //React-hot loader and
                test: /\.(js)$/,  //All .js and .jsx files
                loaders: ['babel'], //react-hot is like browser sync and babel loads jsx and es6-7
                exclude: [nodeModulesPath]
            },
            // LESS
            {
                test: /\.less$/,
                loader: 'style!css!less'
            },
            // CSS
            {
                test: /\.css$/, // Only .css files
                loader: 'style!css' // Run both loaders
            },

            // Files
            {
                test: /\.(jpe?g|gif|png|svg|woff2|woff|ttf|eot)$/,
                loader: 'file'
            }
        ]
    }
};

module.exports = config;