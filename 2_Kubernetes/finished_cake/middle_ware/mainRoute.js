const path = require('path');

module.exports = function (req, res, next) {
  return res.sendFile(path.join(__dirname, '../html/index.html'));
}