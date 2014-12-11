var prefixes = ['moz', 'webkit', 'ms', 'o'];

function getPrefix (key, obj) {
  var result;
  var upcased;
  var prefix;

  obj = obj || window;

  if (result = obj[key]){
    return result;
  }

  upcased = key[0].toUpperCase() + key.substring(1);

  // No pretty array methods here :(
  // http://jsperf.com/everywhile
  while(prefix = prefixes.shift()){
    if (result = obj[prefix + upcased]){
      break;
    }
  }

  return result;
}

module.exports = getPrefix;
