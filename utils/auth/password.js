const crypto = require('crypto');

// For real world project we would use pbksf2 without sync as this blocks the server while it runs
function validPassword(password, hash, salt) {
    var hashVerify = crypto.pbkdf2Sync(password, salt, 210000, 64, 'sha512').toString('hex');

    return hash === hashVerify;
}
function genPassword(password) {
    var salt = crypto.randomBytes(32).toString('hex');
    var genHash = crypto.pbkdf2Sync(password, salt, 210000, 64, 'sha512').toString('hex');

    return {
        salt: salt,
        hash: genHash
    }
}

module.exports = {
    validPassword,
    genPassword
}