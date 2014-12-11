var test = require('tape');
var DOMEventEmitter = require('..');

test('addListener', function(t) {
  t.plan(1);

  var div = document.createElement('div');
  var fn = function(event) {
    t.equal(event.data, 55, 'Received event data');
  };
  var emitter = new DOMEventEmitter(div);

  emitter.addListener('click', fn);
  emitter.emitDOMEvent('click', 55);
});

test('once', function(t) {
  t.plan(1);

  var div = document.createElement('div');
  var emitter = new DOMEventEmitter(div);
  var fn = function (event) {
    t.pass('Handled event once');
  };

  emitter.once('click', fn);
  emitter.emitDOMEvent('click');
  emitter.emitDOMEvent('click');
});

test('remove listener', function(t) {
  t.plan(1);

  var div = document.createElement('div');
  var emitter = new DOMEventEmitter(div);

  function failIfCalled() {
    t.fail('Handler should not be called');
  }

  function barListener() {
    t.pass('Handler called');
  }

  emitter.addListener('foo', failIfCalled);
  emitter.addListener('buz', failIfCalled);
  emitter.addListener('bar', barListener);
  emitter.removeListener('foo', failIfCalled);
  emitter.removeAllListeners('buz');
  emitter.emitDOMEvent('bar');
  emitter.emitDOMEvent('buz');
  emitter.emitDOMEvent('foo');
});

test('remove listener in element without emitter', function(t) {
  t.plan(1);

  var div = document.createElement('div');
  var emitter = new DOMEventEmitter(div);

  emitter.removeAllListeners('foo');
  t.pass('No issues removing listener from element with no emitter');
});

test('Handle delegated events', function(t) {
  t.plan(1);

  var el = document.createElement('div');
  var ul = document.createElement('ul');
  var li = document.createElement('li');
  var emitter = new DOMEventEmitter(el);
  var ulEmitter = new DOMEventEmitter(ul);
  var liEmitter = new DOMEventEmitter(li);

  function failIfCalled() {
    t.fail('Listener should not be called');
  }

  function clickListItemHandler() {
    t.pass('List item handler called');
  }

  el.appendChild(ul);
  ul.appendChild(li);
  document.body.appendChild(el);

  emitter.addListener('click li', clickListItemHandler);
  emitter.addListener('click ul', failIfCalled);
  emitter.addListener('blur li', failIfCalled);
  emitter.addListener('focus li', failIfCalled);
  emitter.removeAllListeners('click ul');
  emitter.removeAllListeners('blur li');
  emitter.removeAllListeners('focus li');

  function mockEvent(type, element) {
    var eventType = type === 'click' ? 'MouseEvent' : 'Event';
    var event = document.createEvent(eventType);

    event.initEvent(type, true, true);
    element.dispatchEvent(event);
  }

  mockEvent('click', li);
  mockEvent('blur', li);
  mockEvent('focus', li);

  document.body.removeChild(el);
});

test('Remove individual handler for specific event', function(t) {
  t.plan(1);

  var div = document.createElement('div');
  var emitter = new DOMEventEmitter(div);

  function failIfCalled() {
    t.fail('Handler should not be called');
  }

  function shouldBeCalled() {
    t.pass('Handler should be called once');
  }

  emitter.addListener('click', failIfCalled);
  emitter.addListener('click', shouldBeCalled);
  emitter.removeListener('click', failIfCalled);
  emitter.emitDOMEvent('click');
});

test('Remove all listeners', function(t) {
  t.plan(1);

  var div = document.createElement('div');
  var emitter = new DOMEventEmitter(div);

  function failIfCalled() {
    t.fail('Handler should not be called');
  }

  emitter.addListener('click', failIfCalled);
  emitter.addListener('focus', failIfCalled);
  emitter.addListener('blur', failIfCalled);
  emitter.removeAllListeners();
  emitter.emitDOMEvent('click');
  emitter.emitDOMEvent('focus');
  emitter.emitDOMEvent('blur');
  t.pass('No handlers called');
});

test('Handler context', function(t) {
  t.plan(2);

  var list = document.createElement('div');
  var a = document.createElement('span');
  var listEmitter = new DOMEventEmitter(list);
  var aEmitter = new DOMEventEmitter(a);

  list.className = 'list';
  a.className = 'a';
  list.appendChild(a);
  document.body.appendChild(list);

  listEmitter.addListener('click .a', function() {
    t.equal(this.context, a);
  });
  listEmitter.addListener('click', function() {
    t.equal(this.context, list);
  });
  aEmitter.emitDOMEvent('click');
});
