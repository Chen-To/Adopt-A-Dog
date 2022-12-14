const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
// const webpack = require("webpack");

module.exports = {
    entry: {
        "main": "./src/home.jsx"
    },
    output: {
        publicPath: "/",
        path: path.join(__dirname, "/dist"),
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "src/home.html",
            inject: false
        }),
        new ESLintWebpackPlugin({ extensions: ['js', 'jsx', 'ts', 'tsx'] })
    ],
    devServer: {
        client: {
            overlay: {
                errors: true,
                warnings: false
            }
        },
        port: 3000,
        historyApiFallback: true,
        devMiddleware: {
            writeToDisk: true
        }
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                }
            },
            {
                test:/\.css$/i,
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            url: false
                        }
                    }
                ],
            },
            {
                test: /\.(woff|woff2|eot|ttf|svg)$/, 
                loader: "url-loader",
                options: { 
                    limit: 40000 
                },
            },
            {
                test: /\.(png|jpe?g|gif)$/,
                type: "javascript/auto",
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            limit: 40000,
                            name: '[name].[ext]',
                            outputPath: "images/",
                            publicPath: "./images/",
                        },
                    },
                ],
            },
        ]
    }
}