var EventEmitter = require('events').EventEmitter;
var util = require('util');
var matches = require('./lib/matches');

function getType (event) {
  var index = event.indexOf(' ');
  return index > 0 ? event.substr(0, index) : event;
}

function getSelector (event) {
  var index = event.indexOf(' ');
  return index > 0 ? event.substr(index) : '';
}

function createEvent (type, properties) {
  if (typeof type != 'string') {
    type = type.type;
  }
  var isMouse = ['click', 'mousedown', 'mouseup', 'mousemove'].indexOf(type) != -1;
  var event = document.createEvent(isMouse ? 'MouseEvent' : 'Event');

  if (properties) {
    util.extend(event, properties);
  }

  event.initEvent(type, true, true);
  return event;
}

function DOMEventEmitter (element) {
  EventEmitter.call(this);
  this.element = element;
  this.proxied = {};
}

DOMEventEmitter.prototype = Object.create(EventEmitter.prototype, {constructor: {value: DOMEventEmitter}});

DOMEventEmitter.prototype._proxy = function (event) {
  return function (DOMEvent) {
    var selector = getSelector(event);
    var context = this.element;

    // delegate behavior
    if (selector) {
      context = DOMEvent.target;

      while (context && !matches(context, selector)) {
        context = context !== this.element && context.parentNode;
      }

      if (!context || context == this.element) {
        return;
      }
    }

    this.context = context;
    this.emit(event, DOMEvent, this.element);
  }.bind(this);
}

DOMEventEmitter.prototype.proxy = function (event) {
  return this.proxied[event] || (this.proxied[event] = this._proxy(event));
}

DOMEventEmitter.prototype.addListener = function (event, handler) {
  EventEmitter.prototype.addListener.call(this, event, handler);

  if (!this.proxied[event]) {
    this.element.addEventListener(getType(event), this.proxy(event), false);
  }

  return this;
}

DOMEventEmitter.prototype.on = DOMEventEmitter.prototype.addListener;

DOMEventEmitter.prototype.removeListener = function (event, handler) {
  var proxy = this.proxied[event];

  EventEmitter.prototype.removeListener.call(this, event, handler);

  if (!this.listeners(event).length && proxy) {
    this.element.removeEventListener(getType(event), proxy, false);
    delete this.proxied[event];
  }

  return this;
}

DOMEventEmitter.prototype.emitDOMEvent = function (event, data) {
  if (!(event instanceof window.Event)) {
    event = createEvent(event);
  }

  event.data = data;
  this.element.dispatchEvent(event);

  return this
}

module.exports = DOMEventEmitter;
