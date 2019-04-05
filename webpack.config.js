const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = env => {
    const mode = env.dev  ? 'development' :
                 env.prod ? 'production'  :
                            ''
    
    if (mode === '') {
        throw 'must specify --env.dev or --env.prod'
    }

    return {
        mode: mode,
        entry: './src/main.tsx',
        output: {
            path: path.resolve(__dirname, `./dist/${mode}/`),
            publicPath: '',
            filename: 'bundle.js'
        },
        resolve: {
            extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
        },
        devServer: {
            contentBase: './dist/development/'
        },
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/,
                },
                {
                    test: /\.tsx?$/,
                    loaders: [
                        'babel-loader',
                        'ts-loader'
                    ]
                },
                {
                    test: /\.css$/,
                    loaders: [
                        'style-loader',
                        'css-loader?sourceMap',
                        'postcss-loader?sourceMap'
                    ]
                },
                {
                    test: /\.styl(us)?$/,
                    loaders: [
                        'style-loader',
                        'css-loader',
                        'postcss-loader?sourceMap',
                        'stylus-loader?sourceMap'
                    ]
                },
                {
                    test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: 'img/[name].[hash:7].[ext]'
                    }
                },
                {
                    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: 'fonts/[name].[hash:7].[ext]'
                    }
                }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './public/index.html'
            }),
            new CopyWebpackPlugin([
                {
                    from: './public/static/*',
                    to: './static/[name].[ext]'
                }
            ])
        ]
    }
}
