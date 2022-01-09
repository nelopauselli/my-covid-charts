const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        world: './src/index.js',
        arg: './src/argentina.js',
        //caba: './src/caba.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.[hash].js'
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            }, {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html', template: './src/index.html'
        }),
        // new HtmlWebpackPlugin({
        //     filename: 'argentina.html', template: './src/argentina.html'
        // }),
        // new HtmlWebpackPlugin({
        //     filename: 'caba.html', template: './src/caba.html'
        // }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "src","data"),
                    to: path.resolve(__dirname, "dist", "data")
                }
            ]
        }),
    ]
};