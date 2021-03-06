const path = require('path');

module.exports = [...[
    './test/test.js',
    'electron-webview-rpc-framework/client.js'
].map(filepath => {
    return {
        entry: filepath,
        output: {
            filename: path.basename(filepath),
            path: path.resolve(__dirname, 'dist'),
        },
        mode:'production',
        target: 'electron-renderer'
    }
}),];

