function isElement(element) {
  return element && (element.nodeType === 1 || element.nodeType === 9);
}

module.exports = isElement;
