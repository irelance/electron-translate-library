const charTypes = {
    'A': 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    'a': 'abcdefghijklmnopqrstuvwxyz',
    '1': '1234567890',
    '!': '!@#$%&*()'
};

function randomString(length, types) {
    let chars = types.map(type => charTypes[type]).join('');
    return [...new Array(length).keys()].map(_ => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export {randomString}
