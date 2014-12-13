# deemitter 1.0.1

DEEmitter is a module extracted from [Rye.js](http://ryejs.org/). It doesn't contain all of the features of the DOM Event Emitter from Rye but it is an implementation that is much closer to the standard EventEmitter API in node.js core.

## Usage

Usage is very similar to the standard usage of an EventEmitter:

    var DOMEventEmitter = require('deemitter');

First you identify an element by creating it or selecting it:

    var element = document.createElement('div');

Or:

    var element = document.getElementById('potato');

Then pass it in as a constructor parameter for the deemitter:

    var emitter = new DOMEventEmitter(element);

At which point, you can start adding listeners using the familiar `querySelectorAll` (or jQuery if that's your flavour) syntax:

    // Handling an event from the element itself
    emitter.addListener('click', function () { alert('You clicked on me!'); });

    // Handling an event bubbled up from a child of the main element
    emitter.addListener('click a', function () { alert('You clicked an anchor inside this div'); });

Additionally, you can use the standard EventEmitter methods such as `removeAllListeners` just as you would with any other EventEmitter.

**Note:** This syntax differs from the DOMEventEmitter syntax in the rye project which has the ability to accept a wider variety of parameters to `addListener` and has a number of other methods.

### Simulate event

Similar to the `trigger` method in the rye DOMEventEmitter, you may call `emitDOMEvent` with an event type (string) and a data parameter. This will trigger the event as if it really happened. This is really just some sugar around creating and dispatching an event using the standard DOM methods.

## Licence

This licence contains the same licence as the original rye project from which it was originally derived
