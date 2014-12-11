var isElement = require('./is-element');
var getTypeof = require('./get-typeof');
var selectorRE = /^([.#]?)([\w\-]+)$/;
var selectorType = {
  '.': 'getElementsByClassName',
  '#': 'getElementById',
  '' : 'getElementsByTagName',
  '_': 'querySelectorAll'
};
var nodeListTypes = ['nodelist', 'htmlcollection', 'htmlformcontrolscollection'];

function contains(list, item) {
  return ~list.indexOf(item);
}

function isNodeList(obj) {
  return obj && contains(nodeListTypes, getTypeof(obj));
}

function qsa (element, selector) {
  var method;
  var result;

  element = element || document;

  // http://jsperf.com/getelementbyid-vs-queryselector/11
  if (!selector.match(selectorRE) || (RegExp.$1 === '#' && element !== document)) {
    method = selectorType._;
  }
  else {
    method = selectorType[RegExp.$1];
    selector = RegExp.$2;
  }

  result = element[method](selector);

  if (isNodeList(result)){
    return Array.prototype.slice.call(result);
  }

  if (isElement(result)){
    return [result];
  }

  return [];
}

module.exports = qsa;
