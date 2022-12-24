const path = require('path');
const HWP = require('html-webpack-plugin');

module.exports = {
    entry: path.join(__dirname, '/src/index.js'),
    output: {
        filename: 'build.js',
        path: path.join(__dirname, '/dist'),
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader',
                options: {
                  presets: [
                    '@babel/preset-env',
                    ['@babel/preset-react', { runtime: 'automatic' }],
                  ],
                },
                resolve: { extensions: ['.js', '.jsx'] },
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|svg|ttf|woff|jpg|gif)$/,
                use: ["file-loader"]
            }
        ],
    },
    plugins: [
        new HWP({template: path.join(__dirname,'/public/index.html')})
    ],
    devServer: {
        historyApiFallback: true,
    }
}