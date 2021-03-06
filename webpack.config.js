const path = require('path');

module.exports = [...[
    './index.js',
].map(filepath => {
    return {
        entry: filepath,
        output: {
            filename: path.basename(filepath),
            path: path.resolve(__dirname, 'dist'),
            library: "ElectronTranslateLibrary",
            libraryTarget: "umd"
        },
        module: {
            rules: [
                {
                    test: /\.remote\.js$/i,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: true,
                            },
                        },
                    ],
                },
            ],
        },
        mode: 'production',
        target: 'electron-renderer'
    }
}),];

