var matchTypeFromToString = /\s(\w+)\]$/;

function getTypeof(obj) {
  var ref = Object.prototype.toString.call(obj).match(matchTypeFromToString);
  return ref && ref[1].toLowerCase();
}

module.exports = getTypeof;
