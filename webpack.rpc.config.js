const path = require('path');

module.exports = [...[
    'tencent.remote.js',
    'youdao.remote.js',
].map(filepath => {
    return {
        entry: path.resolve('library/translators', filepath),
        output: {
            filename: path.basename(filepath),
            path: path.resolve(__dirname, 'dist/rpc'),
            libraryTarget: "amd"
        },
        mode: 'production',
    }
}),];

