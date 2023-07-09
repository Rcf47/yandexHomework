import * as path from 'path';
import * as webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import StatoscopePlugin from '@statoscope/webpack-plugin';

// @todo загрузить переводы из файла
const i18nData = require('./i18n.json');

const i18nLoader = {
    loader: 'i18n-loader',
    options: {
        i18nData,
    },
};
const config: webpack.Configuration = {
    mode: 'production',
    entry: {
        main: './src/pages/root.tsx',
        main2: './src/pages/root2.tsx',
        // @todo настроить entry
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash].js',
    },
    plugins: [
        new HtmlWebpackPlugin(),
        new StatoscopePlugin({
            saveStatsTo: 'stats.json',
            saveOnlyStats: false,
            open: false,
        }),
    ],

    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        alias: {
            '@': path.resolve(__dirname, 'src'),
        }, // @todo настроить resolve
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: ['ts-loader', i18nLoader],
                exclude: /node_modules/,
            }, // @todo настроить загрузчик
        ],
    },
    resolveLoader: {
        alias: {
            'i18n-loader': path.resolve(__dirname, 'loaders/i18n-loader.cjs'),
        },
    },
};

export default config;
