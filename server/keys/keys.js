var keys;

try {
    keys = require('./localKeys');
} catch (e) {
    keys = require('./herokuKeys');
}

module.exports = keys