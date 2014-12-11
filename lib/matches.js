var isElement = require('./is-element');
var getPrefix = require('./get-prefix');
var qsa = require('./qsa');
var dummyDiv = document.createElement('div');

function matches(element, selector) {
  var matchesSelector, match;

  if (!element || !isElement(element) || !selector) {
    return false;
  }

  if (selector.nodeType) {
    return element === selector;
  }

  if (element === document) {
    return false;
  }

  matchesSelector = getPrefix('matchesSelector', dummyDiv);

  if (matchesSelector) {
    return matchesSelector.call(element, selector)
  }

  // fall back to performing a selector:
  if (!element.parentNode) {
    dummyDiv.appendChild(element);
  }

  match = ~qsa(element.parentNode, selector).indexOf(element);

  if (element.parentNode === dummyDiv) {
    dummyDiv.removeChild(element);
  }

  return match;
}

module.exports = matches
