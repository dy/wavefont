(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var this$1 = this;

  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this$1, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var this$1 = this;

  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this$1.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this$1.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],2:[function(require,module,exports){
/**
 * @module  add-font
 *
 * Register font from url or arrayBuffer
 */
'use strict';

var style = require('insert-styles');
var isUrl = require('is-url');
var extname = require('get-ext');

module.exports = addFont;


var fontMap = {};
var _URL = window.URL || window.webkitURL;
var extensions = ['eot', 'woff', 'woff2', 'ttf', 'svg', 'otf'];
var format = {eot: 'embedded-opentype', woff2: 'woff2', woff: 'woff', ttf: 'truetype', svg: 'svg', otf: 'opentype'};


//main method
function addFont (src, desc) {
	desc = desc || '';

	//buffer case
	if (src instanceof ArrayBuffer) {
		return addFromBuffer(src, desc);
	}

	if (typeof src != 'string') throw 'Argument should be a font name string or ArrayBuffer';

	var name;
	var ext = extname(src);

	//insert css link
	if (ext === '.css') {
		if (document.querySelector(("[src=\"" + src + "\"]"))) return;
		var link = document.createElement('link');
		link.setAttribute('rel', 'stylesheet');
		link.setAttribute('type', 'text/css');
		link.setAttribute('src', src);
		document.head.appendChild(link);
		return;
	}


	name = getFamily(desc);

	//url case
	var urls = [];

	if (Array.isArray(src)) {
		urls = src;
	}

	//if no extension - include all font variants
	if (!format[ext.slice(1)]) {
		for (var i = 0; i < extensions.length; i++) {
			urls.push(src + '.' + extensions[i]);
		}
	}
	else {
		urls.push(src);
	}

	//create string of fonts
	var srcStr = 'src: ';
	for (var i$1 = 0; i$1 < urls.length; i$1++) {
		var url = urls[i$1];
		var ext$1 = extname(url);
		var filepath = url.slice(0, -ext$1.length);
		if (ext$1 === '.eot') {
			srcStr += "url(\"" + (filepath + '.eot') + "\");\n";
			srcStr += "src: url(\"" + (filepath+'.eot?#iefix') + "\") format(\"" + (format.eot) + "\"),\n";
		} else {
			srcStr += "url(\"" + (filepath + ext$1) + "\") format(\"" + (format[ext$1.slice(1)]) + "\"),\n";
		}
	}
	srcStr = srcStr.trim().slice(0, -1);

	var id = [name, getStyle(desc), getWeight(desc)].join('-');
	style(("\n\t@font-face {\n\t\tfont-family: \"" + name + "\";\n\t\t" + srcStr + ";\n\t\t" + desc + "\n\t}\n\t"), { id: id });
}


//buffer method
//FIXME: register proper style/weight here
function addFromBuffer (buffer, desc) {
	var name = getFamily(desc);

	//new style
	if (document.fonts) {
		if ( fontMap[name] ) {
			document.fonts.delete( fontMap[name] );
		}

		var fontFace = fontMap[name] = new window.FontFace(name, buffer);

		if ( fontface.status === 'error' ) {
			throw new Error('Fontface is invalid and cannot be displayed');
		}

		document.fonts.add(fontFace);
	}

	//old style
	else {
		var url = _URL.createObjectURL(new Blob(
			[ new DataView(buffer) ],
			{ type: 'font/opentype' }
		));

		if ( fontMap[name] ) {
			_URL.revokeObjectURL( fontMap[name] );
		}

		style(("\n\t\t@font-face {\n\t\t\tfont-family: \"" + name + "\";\n\t\t\tsrc: url(" + url + ");\n\t\t}\n\t\t"), { id: name });

		fontMap[name] = url;
	}
}

//get font name from string
function getFamily (cssString) {
	if (!/:/.test(cssString)) return cssString;
	var res = /font(?:-family)?\s*:\s*"?([^;,"']*)"?/ig.exec(cssString);
	if (!res || !res[1]) return cssString;
	return res[1];
}
function getStyle (cssString) {
	if (!/:/.test(cssString)) return 'normal';
	var res = /font-style\s*:\s*"?([^;,"']*)"?/ig.exec(cssString);
	if (!res || !res[1]) return 'normal';
	return res[1];
}
function getWeight (cssString) {
	if (!/:/.test(cssString)) return 'normal';
	var res = /font-weight\s*:\s*"?([^;,"']*)"?/ig.exec(cssString);
	if (!res || !res[1]) return 'normal';
	return res[1];
}
},{"get-ext":19,"insert-styles":29,"is-url":34}],3:[function(require,module,exports){
/* The following list is defined in React's core */
var IS_UNITLESS = {
  animationIterationCount: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridRow: true,
  gridColumn: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,

  // SVG-related properties
  fillOpacity: true,
  stopOpacity: true,
  strokeDashoffset: true,
  strokeOpacity: true,
  strokeWidth: true
};

module.exports = function(name, value) {
  if(typeof value === 'number' && !IS_UNITLESS[ name ]) {
    return value + 'px';
  } else {
    return value;
  }
};
},{}],4:[function(require,module,exports){
/*!
	Autosize 3.0.17
	license: MIT
	http://www.jacklmoore.com/autosize
*/
(function (global, factory) {
	if (typeof define === 'function' && define.amd) {
		define(['exports', 'module'], factory);
	} else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
		factory(exports, module);
	} else {
		var mod = {
			exports: {}
		};
		factory(mod.exports, mod);
		global.autosize = mod.exports;
	}
})(this, function (exports, module) {
	'use strict';

	var set = typeof Set === 'function' ? new Set() : (function () {
		var list = [];

		return {
			has: function has(key) {
				return Boolean(list.indexOf(key) > -1);
			},
			add: function add(key) {
				list.push(key);
			},
			'delete': function _delete(key) {
				list.splice(list.indexOf(key), 1);
			} };
	})();

	var createEvent = function createEvent(name) {
		return new Event(name);
	};
	try {
		new Event('test');
	} catch (e) {
		// IE does not support `new Event()`
		createEvent = function (name) {
			var evt = document.createEvent('Event');
			evt.initEvent(name, true, false);
			return evt;
		};
	}

	function assign(ta) {
		if (!ta || !ta.nodeName || ta.nodeName !== 'TEXTAREA' || set.has(ta)) return;

		var heightOffset = null;
		var clientWidth = ta.clientWidth;
		var cachedHeight = null;

		function init() {
			var style = window.getComputedStyle(ta, null);

			if (style.resize === 'vertical') {
				ta.style.resize = 'none';
			} else if (style.resize === 'both') {
				ta.style.resize = 'horizontal';
			}

			if (style.boxSizing === 'content-box') {
				heightOffset = -(parseFloat(style.paddingTop) + parseFloat(style.paddingBottom));
			} else {
				heightOffset = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
			}
			// Fix when a textarea is not on document body and heightOffset is Not a Number
			if (isNaN(heightOffset)) {
				heightOffset = 0;
			}

			update();
		}

		function changeOverflow(value) {
			{
				// Chrome/Safari-specific fix:
				// When the textarea y-overflow is hidden, Chrome/Safari do not reflow the text to account for the space
				// made available by removing the scrollbar. The following forces the necessary text reflow.
				var width = ta.style.width;
				ta.style.width = '0px';
				// Force reflow:
				/* jshint ignore:start */
				ta.offsetWidth;
				/* jshint ignore:end */
				ta.style.width = width;
			}

			ta.style.overflowY = value;

			resize();
		}

		function getParentOverflows(el) {
			var arr = [];

			while (el && el.parentNode && el.parentNode instanceof Element) {
				if (el.parentNode.scrollTop) {
					arr.push({
						node: el.parentNode,
						scrollTop: el.parentNode.scrollTop });
				}
				el = el.parentNode;
			}

			return arr;
		}

		function resize() {
			var originalHeight = ta.style.height;
			var overflows = getParentOverflows(ta);
			var docTop = document.documentElement && document.documentElement.scrollTop; // Needed for Mobile IE (ticket #240)

			ta.style.height = 'auto';

			var endHeight = ta.scrollHeight + heightOffset;

			if (ta.scrollHeight === 0) {
				// If the scrollHeight is 0, then the element probably has display:none or is detached from the DOM.
				ta.style.height = originalHeight;
				return;
			}

			ta.style.height = endHeight + 'px';

			// used to check if an update is actually necessary on window.resize
			clientWidth = ta.clientWidth;

			// prevents scroll-position jumping
			overflows.forEach(function (el) {
				el.node.scrollTop = el.scrollTop;
			});

			if (docTop) {
				document.documentElement.scrollTop = docTop;
			}
		}

		function update() {
			resize();

			var computed = window.getComputedStyle(ta, null);
			var computedHeight = Math.round(parseFloat(computed.height));
			var styleHeight = Math.round(parseFloat(ta.style.height));

			// The computed height not matching the height set via resize indicates that
			// the max-height has been exceeded, in which case the overflow should be set to visible.
			if (computedHeight !== styleHeight) {
				if (computed.overflowY !== 'visible') {
					changeOverflow('visible');
				}
			} else {
				// Normally keep overflow set to hidden, to avoid flash of scrollbar as the textarea expands.
				if (computed.overflowY !== 'hidden') {
					changeOverflow('hidden');
				}
			}

			if (cachedHeight !== computedHeight) {
				cachedHeight = computedHeight;
				var evt = createEvent('autosize:resized');
				ta.dispatchEvent(evt);
			}
		}

		var pageResize = function pageResize() {
			if (ta.clientWidth !== clientWidth) {
				update();
			}
		};

		var destroy = (function (style) {
			window.removeEventListener('resize', pageResize, false);
			ta.removeEventListener('input', update, false);
			ta.removeEventListener('keyup', update, false);
			ta.removeEventListener('autosize:destroy', destroy, false);
			ta.removeEventListener('autosize:update', update, false);
			set['delete'](ta);

			Object.keys(style).forEach(function (key) {
				ta.style[key] = style[key];
			});
		}).bind(ta, {
			height: ta.style.height,
			resize: ta.style.resize,
			overflowY: ta.style.overflowY,
			overflowX: ta.style.overflowX,
			wordWrap: ta.style.wordWrap });

		ta.addEventListener('autosize:destroy', destroy, false);

		// IE9 does not fire onpropertychange or oninput for deletions,
		// so binding to onkeyup to catch most of those events.
		// There is no way that I know of to detect something like 'cut' in IE9.
		if ('onpropertychange' in ta && 'oninput' in ta) {
			ta.addEventListener('keyup', update, false);
		}

		window.addEventListener('resize', pageResize, false);
		ta.addEventListener('input', update, false);
		ta.addEventListener('autosize:update', update, false);
		set.add(ta);
		ta.style.overflowX = 'hidden';
		ta.style.wordWrap = 'break-word';

		init();
	}

	function destroy(ta) {
		if (!(ta && ta.nodeName && ta.nodeName === 'TEXTAREA')) return;
		var evt = createEvent('autosize:destroy');
		ta.dispatchEvent(evt);
	}

	function update(ta) {
		if (!(ta && ta.nodeName && ta.nodeName === 'TEXTAREA')) return;
		var evt = createEvent('autosize:update');
		ta.dispatchEvent(evt);
	}

	var autosize = null;

	// Do nothing in Node.js environment and IE8 (or lower)
	if (typeof window === 'undefined' || typeof window.getComputedStyle !== 'function') {
		autosize = function (el) {
			return el;
		};
		autosize.destroy = function (el) {
			return el;
		};
		autosize.update = function (el) {
			return el;
		};
	} else {
		autosize = function (el, options) {
			if (el) {
				Array.prototype.forEach.call(el.length ? el : [el], function (x) {
					return assign(x, options);
				});
			}
			return el;
		};
		autosize.destroy = function (el) {
			if (el) {
				Array.prototype.forEach.call(el.length ? el : [el], destroy);
			}
			return el;
		};
		autosize.update = function (el) {
			if (el) {
				Array.prototype.forEach.call(el.length ? el : [el], update);
			}
			return el;
		};
	}

	module.exports = autosize;
});
},{}],5:[function(require,module,exports){
/**
 * @module  caret-position/get
 *
 * Adoption from code at
 * http://blogs.nitobi.com/alexei/wp-content/uploads/2008/01/getcaretselection3.js
 *
 * @return the caret position in a text field
 */
module.exports = function (input) {
	var docObj = input.ownerDocument,
		result = { start:0, end:0, caret:0 };

	if (navigator.appVersion.indexOf("MSIE")!=-1) {
		if (input.tagName == "TEXTAREA") {
			if (input.value.charCodeAt(input.value.length-1) < 14) {
				input.value = input.value.replace(/34/g,'') + String.fromCharCode(28);
			}
			var range = docObj.selection.createRange(),
				rangeCopy = range.duplicate();

			rangeCopy.moveToElementText(input);
			rangeCopy.setEndPoint('StartToEnd', range);
			result.end = input.value.length - rangeCopy.text.length;

			rangeCopy.setEndPoint('StartToStart', range);
			result.start = input.value.length-rangeCopy.text.length;
			result.caret = result.end;

			if (input.value.substr(input.value.length-1) == String.fromCharCode(28)) {
				input.value = input.value.substr(0, input.value.length-1);
			}
		} else {
			var range = docObj.selection.createRange(),
				rangeCopy = range.duplicate();

			result.start = 0 - rangeCopy.moveStart('character', -100000);
			result.end = result.start + range.text.length;
			result.caret = result.end;
		}
	} else {
		result.start = input.selectionStart;
		result.end = input.selectionEnd;
		result.caret = result.end;
	}
	if (result.start < 0) {
		 result = { start:0, end:0, caret:0 };
	}
	return result;
};
},{}],6:[function(require,module,exports){
/**
 * @module  caret-position
 */

module.exports = caret;

function caret(a,b,c){
	if (b !== undefined) return caret.get(a);
	return caret.set(a,b,c);
};

caret.get = require('./get');
caret.set = require('./set');
},{"./get":5,"./set":7}],7:[function(require,module,exports){
/**
 * @module  caret-position/set
 *
 * Adoption from code at http://blog.vishalon.net/index.php/javascript-getting-and-setting-caret-position-in-textarea/
 *
 * @param {string} input Select in that input
 * @param {int} start from character number
 * @param {int} end to character number
 */
module.exports = function(input, start, end) {
	if (end === undefined) { end = start; }

	if (input.setSelectionRange) {
		input.focus();
		input.setSelectionRange(start, end);
	} else {
		var range = input.createTextRange();
		range.collapse(true);
		range.moveEnd('character', start);
		range.moveStart('character', end);
		range.select();
	}
};
},{}],8:[function(require,module,exports){
/**
 * @module  color-interpolate
 * Pick color from palette by index
 */

var parse = require('color-parse');
var hsl = require('color-space/hsl');
var lerp = require('lerp');
var clamp = require('mumath/clamp');

module.exports = interpolate;

function interpolate (palette) {
	palette = palette.map(function (c) {
		c = parse(c);
		if (c.space != 'rgb') {
			if (c.space != 'hsl') throw ((c.space) + " space is not supported.");
			c.values = hsl.rgb(c.values);
		}
		c.values.push(c.alpha);
		return c.values;
	});

	return function (t, mix) {
		if ( mix === void 0 ) mix = lerp;

		t = clamp(t, 0, 1);

		var idx = ( palette.length - 1 ) * t,
			lIdx = Math.floor( idx ),
			rIdx = Math.ceil( idx );

		t = idx - lIdx;

		var lColor = palette[lIdx], rColor = palette[rIdx];

		var result = lColor.map(function (v, i) {
			v = mix(v, rColor[i], t);
			if (i < 3) v = Math.round(v);
			return v;
		});

		if (result[3] === 1) {
			return ("rgb(" + (result.slice(0,3)) + ")");
		}
		return ("rgba(" + result + ")");
	};
}
},{"color-parse":10,"color-space/hsl":11,"lerp":37,"mumath/clamp":50}],9:[function(require,module,exports){
module.exports = {
	"aliceblue": [240, 248, 255],
	"antiquewhite": [250, 235, 215],
	"aqua": [0, 255, 255],
	"aquamarine": [127, 255, 212],
	"azure": [240, 255, 255],
	"beige": [245, 245, 220],
	"bisque": [255, 228, 196],
	"black": [0, 0, 0],
	"blanchedalmond": [255, 235, 205],
	"blue": [0, 0, 255],
	"blueviolet": [138, 43, 226],
	"brown": [165, 42, 42],
	"burlywood": [222, 184, 135],
	"cadetblue": [95, 158, 160],
	"chartreuse": [127, 255, 0],
	"chocolate": [210, 105, 30],
	"coral": [255, 127, 80],
	"cornflowerblue": [100, 149, 237],
	"cornsilk": [255, 248, 220],
	"crimson": [220, 20, 60],
	"cyan": [0, 255, 255],
	"darkblue": [0, 0, 139],
	"darkcyan": [0, 139, 139],
	"darkgoldenrod": [184, 134, 11],
	"darkgray": [169, 169, 169],
	"darkgreen": [0, 100, 0],
	"darkgrey": [169, 169, 169],
	"darkkhaki": [189, 183, 107],
	"darkmagenta": [139, 0, 139],
	"darkolivegreen": [85, 107, 47],
	"darkorange": [255, 140, 0],
	"darkorchid": [153, 50, 204],
	"darkred": [139, 0, 0],
	"darksalmon": [233, 150, 122],
	"darkseagreen": [143, 188, 143],
	"darkslateblue": [72, 61, 139],
	"darkslategray": [47, 79, 79],
	"darkslategrey": [47, 79, 79],
	"darkturquoise": [0, 206, 209],
	"darkviolet": [148, 0, 211],
	"deeppink": [255, 20, 147],
	"deepskyblue": [0, 191, 255],
	"dimgray": [105, 105, 105],
	"dimgrey": [105, 105, 105],
	"dodgerblue": [30, 144, 255],
	"firebrick": [178, 34, 34],
	"floralwhite": [255, 250, 240],
	"forestgreen": [34, 139, 34],
	"fuchsia": [255, 0, 255],
	"gainsboro": [220, 220, 220],
	"ghostwhite": [248, 248, 255],
	"gold": [255, 215, 0],
	"goldenrod": [218, 165, 32],
	"gray": [128, 128, 128],
	"green": [0, 128, 0],
	"greenyellow": [173, 255, 47],
	"grey": [128, 128, 128],
	"honeydew": [240, 255, 240],
	"hotpink": [255, 105, 180],
	"indianred": [205, 92, 92],
	"indigo": [75, 0, 130],
	"ivory": [255, 255, 240],
	"khaki": [240, 230, 140],
	"lavender": [230, 230, 250],
	"lavenderblush": [255, 240, 245],
	"lawngreen": [124, 252, 0],
	"lemonchiffon": [255, 250, 205],
	"lightblue": [173, 216, 230],
	"lightcoral": [240, 128, 128],
	"lightcyan": [224, 255, 255],
	"lightgoldenrodyellow": [250, 250, 210],
	"lightgray": [211, 211, 211],
	"lightgreen": [144, 238, 144],
	"lightgrey": [211, 211, 211],
	"lightpink": [255, 182, 193],
	"lightsalmon": [255, 160, 122],
	"lightseagreen": [32, 178, 170],
	"lightskyblue": [135, 206, 250],
	"lightslategray": [119, 136, 153],
	"lightslategrey": [119, 136, 153],
	"lightsteelblue": [176, 196, 222],
	"lightyellow": [255, 255, 224],
	"lime": [0, 255, 0],
	"limegreen": [50, 205, 50],
	"linen": [250, 240, 230],
	"magenta": [255, 0, 255],
	"maroon": [128, 0, 0],
	"mediumaquamarine": [102, 205, 170],
	"mediumblue": [0, 0, 205],
	"mediumorchid": [186, 85, 211],
	"mediumpurple": [147, 112, 219],
	"mediumseagreen": [60, 179, 113],
	"mediumslateblue": [123, 104, 238],
	"mediumspringgreen": [0, 250, 154],
	"mediumturquoise": [72, 209, 204],
	"mediumvioletred": [199, 21, 133],
	"midnightblue": [25, 25, 112],
	"mintcream": [245, 255, 250],
	"mistyrose": [255, 228, 225],
	"moccasin": [255, 228, 181],
	"navajowhite": [255, 222, 173],
	"navy": [0, 0, 128],
	"oldlace": [253, 245, 230],
	"olive": [128, 128, 0],
	"olivedrab": [107, 142, 35],
	"orange": [255, 165, 0],
	"orangered": [255, 69, 0],
	"orchid": [218, 112, 214],
	"palegoldenrod": [238, 232, 170],
	"palegreen": [152, 251, 152],
	"paleturquoise": [175, 238, 238],
	"palevioletred": [219, 112, 147],
	"papayawhip": [255, 239, 213],
	"peachpuff": [255, 218, 185],
	"peru": [205, 133, 63],
	"pink": [255, 192, 203],
	"plum": [221, 160, 221],
	"powderblue": [176, 224, 230],
	"purple": [128, 0, 128],
	"rebeccapurple": [102, 51, 153],
	"red": [255, 0, 0],
	"rosybrown": [188, 143, 143],
	"royalblue": [65, 105, 225],
	"saddlebrown": [139, 69, 19],
	"salmon": [250, 128, 114],
	"sandybrown": [244, 164, 96],
	"seagreen": [46, 139, 87],
	"seashell": [255, 245, 238],
	"sienna": [160, 82, 45],
	"silver": [192, 192, 192],
	"skyblue": [135, 206, 235],
	"slateblue": [106, 90, 205],
	"slategray": [112, 128, 144],
	"slategrey": [112, 128, 144],
	"snow": [255, 250, 250],
	"springgreen": [0, 255, 127],
	"steelblue": [70, 130, 180],
	"tan": [210, 180, 140],
	"teal": [0, 128, 128],
	"thistle": [216, 191, 216],
	"tomato": [255, 99, 71],
	"turquoise": [64, 224, 208],
	"violet": [238, 130, 238],
	"wheat": [245, 222, 179],
	"white": [255, 255, 255],
	"whitesmoke": [245, 245, 245],
	"yellow": [255, 255, 0],
	"yellowgreen": [154, 205, 50]
};
},{}],10:[function(require,module,exports){
/**
 * @module color-parse
 */

module.exports = parse;


var names = require('color-name');
var pad = require('left-pad');
var isObject = require('is-plain-obj');


/**
 * Base hues
 * http://dev.w3.org/csswg/css-color/#typedef-named-hue
 */
//FIXME: use external hue detector
var baseHues = {
	red: 0,
	orange: 60,
	yellow: 120,
	green: 180,
	blue: 240,
	purple: 300
};

var channels = {
	r: 0,
	red: 0,
	g: 1,
	green: 1,
	b: 2,
	blue: 2
};


/**
 * Parse color from the string passed
 *
 * @return {Object} A space indicator `space`, an array `values` and `alpha`
 */
function parse (cstr) {
	var m, parts = [0,0,0], alpha = 1, space = 'rgb';

	//keyword
	if (names[cstr]) {
		parts = names[cstr].slice();
	}

	//reserved words
	else if (cstr === 'transparent') alpha = 0;

	//number (weird) case
	else if (typeof cstr === 'number') {
		parts = [cstr >>> 16, (cstr & 0x00ff00) >>> 8, cstr & 0x0000ff];
	}

	//object case - detects css cases of rgb and hsl
	else if (isObject(cstr)) {
		if (cstr.r != null) {
			parts = [cstr.r, cstr.g, cstr.b];
		}
		else if (cstr.red != null) {
			parts = [cstr.red, cstr.green, cstr.blue];
		}
		else if (cstr.h != null) {
			parts = [cstr.h, cstr.s, cstr.l];
			space = 'hsl';
		}
		else if (cstr.hue != null) {
			parts = [cstr.hue, cstr.saturation, cstr.lightness];
			space = 'hsl';
		}

		if (cstr.a != null) alpha = cstr.a;
		else if (cstr.alpha != null) alpha = cstr.alpha;
		else if (cstr.opacity != null) alpha = cstr.opacity / 100;
	}

	//array passed
	else if (Array.isArray(cstr) || ArrayBuffer.isView(cstr)) {
		parts = [cstr[0], cstr[1], cstr[2]];
		alpha = cstr.length === 4 ? cstr[3] : 1;
	}

	//hex
	else if (/^#[A-Fa-f0-9]+$/.test(cstr)) {
		var base = cstr.replace(/^#/,'');
		var size = base.length;
		var isShort = size <= 4;

		parts = base.split(isShort ? /(.)/ : /(..)/);
		parts = parts.filter(Boolean)
			.map(function (x) {
				if (isShort) {
					return parseInt(x + x, 16);
				}
				else {
					return parseInt(x, 16);
				}
			});

		if (parts.length === 4) {
			alpha = parts[3] / 255;
			parts = parts.slice(0,3);
		}
		if (!parts[0]) parts[0] = 0;
		if (!parts[1]) parts[1] = 0;
		if (!parts[2]) parts[2] = 0;
	}

	//color space
	else if (m = /^((?:rgb|hs[lvb]|hwb|cmyk?|xy[zy]|gray|lab|lchu?v?|[ly]uv|lms)a?)\s*\(([^\)]*)\)/.exec(cstr)) {
		var name = m[1];
		var base = name.replace(/a$/, '');
		space = base;
		var size = base === 'cmyk' ? 4 : base === 'gray' ? 1 : 3;
		parts = m[2].trim()
			.split(/\s*,\s*/)
			.map(function (x, i) {
				//<percentage>
				if (/%$/.test(x)) {
					//alpha
					if (i === size)	return parseFloat(x) / 100;
					//rgb
					if (base === 'rgb') return parseFloat(x) * 255 / 100;
					return parseFloat(x);
				}
				//hue
				else if (base[i] === 'h') {
					//<deg>
					if (/deg$/.test(x)) {
						return parseFloat(x);
					}
					//<base-hue>
					else if (baseHues[x] !== undefined) {
						return baseHues[x];
					}
				}
				return parseFloat(x);
			});

		if (name === base) parts.push(1);
		alpha = parts[size] === undefined ? 1 : parts[size];
		parts = parts.slice(0, size);
	}

	//named channels case
	else if (cstr.length > 10 && /[0-9](?:\s|\/)/.test(cstr)) {
		parts = cstr.match(/([0-9]+)/g).map(function (value) {
			return parseFloat(value);
		});

		space = cstr.match(/([a-z])/ig).join('').toLowerCase();
	}

	else {
		throw Error('Unable to parse ' + cstr);
	}

	return {
		space: space,
		values: parts,
		alpha: alpha
	};
}
},{"color-name":9,"is-plain-obj":33,"left-pad":36}],11:[function(require,module,exports){
/**
 * @module color-space/hsl
 */

var rgb = require('./rgb');

module.exports = {
	name: 'hsl',
	min: [0,0,0],
	max: [360,100,100],
	channel: ['hue', 'saturation', 'lightness'],
	alias: ['HSL'],

	rgb: function(hsl) {
		var h = hsl[0] / 360,
				s = hsl[1] / 100,
				l = hsl[2] / 100,
				t1, t2, t3, rgb, val;

		if (s === 0) {
			val = l * 255;
			return [val, val, val];
		}

		if (l < 0.5) {
			t2 = l * (1 + s);
		}
		else {
			t2 = l + s - l * s;
		}
		t1 = 2 * l - t2;

		rgb = [0, 0, 0];
		for (var i = 0; i < 3; i++) {
			t3 = h + 1 / 3 * - (i - 1);
			if (t3 < 0) {
				t3++;
			}
			else if (t3 > 1) {
				t3--;
			}

			if (6 * t3 < 1) {
				val = t1 + (t2 - t1) * 6 * t3;
			}
			else if (2 * t3 < 1) {
				val = t2;
			}
			else if (3 * t3 < 2) {
				val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
			}
			else {
				val = t1;
			}

			rgb[i] = val * 255;
		}

		return rgb;
	}
};


//extend rgb
rgb.hsl = function(rgb) {
	var r = rgb[0]/255,
			g = rgb[1]/255,
			b = rgb[2]/255,
			min = Math.min(r, g, b),
			max = Math.max(r, g, b),
			delta = max - min,
			h, s, l;

	if (max === min) {
		h = 0;
	}
	else if (r === max) {
		h = (g - b) / delta;
	}
	else if (g === max) {
		h = 2 + (b - r) / delta;
	}
	else if (b === max) {
		h = 4 + (r - g)/ delta;
	}

	h = Math.min(h * 60, 360);

	if (h < 0) {
		h += 360;
	}

	l = (min + max) / 2;

	if (max === min) {
		s = 0;
	}
	else if (l <= 0.5) {
		s = delta / (max + min);
	}
	else {
		s = delta / (2 - max - min);
	}

	return [h, s * 100, l * 100];
};
},{"./rgb":12}],12:[function(require,module,exports){
/**
 * RGB space.
 *
 * @module  color-space/rgb
 */

module.exports = {
	name: 'rgb',
	min: [0,0,0],
	max: [255,255,255],
	channel: ['red', 'green', 'blue'],
	alias: ['RGB']
};
},{}],13:[function(require,module,exports){

/**
 * Expose `Emitter`.
 */

if (typeof module !== 'undefined') {
  module.exports = Emitter;
}

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks['$' + event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks['$' + event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  var this$1 = this;

  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks['$' + event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this$1, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks['$' + event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};
},{}],14:[function(require,module,exports){
var prefix = require('prefix-style')
var toCamelCase = require('to-camel-case')
var cache = { 'float': 'cssFloat' }
var addPxToStyle = require('add-px-to-style')

function style (element, property, value) {
  var camel = cache[property]
  if (typeof camel === 'undefined') {
    camel = detect(property)
  }

  // may be false if CSS prop is unsupported
  if (camel) {
    if (value === undefined) {
      return element.style[camel]
    }

    element.style[camel] = addPxToStyle(camel, value)
  }
}

function each (element, properties) {
  for (var k in properties) {
    if (properties.hasOwnProperty(k)) {
      style(element, k, properties[k])
    }
  }
}

function detect (cssProp) {
  var camel = toCamelCase(cssProp)
  var result = prefix(camel)
  cache[camel] = cache[cssProp] = cache[result] = result
  return result
}

function set () {
  if (arguments.length === 2) {
    if (typeof arguments[1] === 'string') {
      arguments[0].style.cssText = arguments[1]
    } else {
      each(arguments[0], arguments[1])
    }
  } else {
    style(arguments[0], arguments[1], arguments[2])
  }
}

module.exports = set
module.exports.set = set

module.exports.get = function (element, properties) {
  if (Array.isArray(properties)) {
    return properties.reduce(function (obj, prop) {
      obj[prop] = style(element, prop || '')
      return obj
    }, {})
  } else {
    return style(element, properties || '')
  }
}

},{"add-px-to-style":3,"prefix-style":52,"to-camel-case":79}],15:[function(require,module,exports){
'use strict';

var trim = require('trim');
var prefix = require('prefix');
var prop = prefix('transform');
var propTransOrigin = prefix('transformOrigin');
var fns = require('./lib/properties');

var _has = Object.prototype.hasOwnProperty;

var shortcuts = {
  x: 'translateX',
  y: 'translateY',
  z: 'translateZ'
};


exports = module.exports = transform;

function transform(target, properties) {
  var output = [];
  var i;
  var name;
  var propValue;

  for (i in properties) {
    propValue = properties[i];

    // replace shortcut with its transform value.
    name = _has.call(shortcuts, i)
      ? name = shortcuts[i]
      : name = i;

    if (_has.call(fns, name)) {
      output.push(fns[name](numToString(propValue)));
      continue;
    }

    if (name === 'origin') {
      target.style[propTransOrigin] = propValue;
      continue;
    }

    console.warn(name, 'is not a valid property');
  }

  target.style[prop] = output.join(' ');
}


exports.get = get;

function get(target) {
  return style(target);
}


exports.none = none;

function none(target) {
  target.style[prop] = '';
  target.style[propTransOrigin] = '';
}


exports.isSupported = isSupported;

function isSupported() {
  return prop.length > 0;
}


function style(target) {
  return target.style[prop];
}


function numToString(value) {
  if (typeof value === 'number') {
    value += '';
  } else {
    value = trim(value);
  }

  return value;
}

},{"./lib/properties":17,"prefix":53,"trim":82}],16:[function(require,module,exports){
'use strict';

exports = module.exports = compose;

function compose() {
  var funcs = arguments;

  return function() {
    var this$1 = this;

    var args = arguments;
    for (var i = funcs.length-1; i >= 0; i--) {
      args = [funcs[i].apply(this$1, args)];
    }
    return args[0];
  };
}

},{}],17:[function(require,module,exports){
'use strict';

var trim = require('trim');
var compose = require('./compose');

var NUMBER_REGEX = /^-?\d+(\.\d+)?$/;

module.exports = {
  translate: compose(function(value) {
    return 'translate(' + value + ')';
  }, defaultUnit('px'), comma),

  translate3d: compose(function(value) {
    return 'translate3d(' + value + ')';
  }, defaultUnit('px'), comma),

  translateX: compose(function(x) {
    return 'translateX(' + x + ')';
  }, defaultUnit('px')),

  translateY: compose(function(y) {
    return 'translateY(' + y + ')';
  }, defaultUnit('px')),

  translateZ: compose(function(z) {
    return 'translateZ(' + z + ')';
  }, defaultUnit('px')),


  scale: compose(function(value) {
    return 'scale(' + value + ')';
  }, comma),

  scale3d: compose(function(value) {
    return 'scale3d(' + value + ')';
  }, comma),

  scaleX: function(value) {
    return 'scaleX(' + value + ')';
  },

  scaleY: function(value) {
    return 'scaleY(' + value + ')';
  },

  scaleZ: function(value) {
    return 'scaleZ(' + value + ')';
  },


  rotate: compose(function(value) {
    return 'rotate(' + value + ')';
  }, defaultUnit('deg'), comma),

  rotate3d: compose(function(value) {
    return 'rotate3d(' + value + ')';
  }, comma),

  rotateX: compose(function(value) {
    return 'rotateX(' + value + ')';
  }, defaultUnit('deg')),

  rotateY: compose(function(value) {
    return 'rotateY(' + value + ')';
  }, defaultUnit('deg')),

  rotateZ: compose(function(value) {
    return 'rotateZ(' + value + ')';
  }, defaultUnit('deg')),


  skew: compose(function(value) {
    return 'skew(' + value + ')';
  }, defaultUnit('deg'), comma),

  skewX: compose(function(value) {
    return 'skewX(' + value + ')';
  }, defaultUnit('deg')),

  skewY: compose(function(value) {
    return 'skewY(' + value + ')';
  }, defaultUnit('deg')),


  matrix: compose(function(value) {
    return 'matrix(' + value + ')';
  }, comma),

  matrix3d: compose(function(value) {
    return 'matrix3d(' + value + ')';
  }, comma),


  perspective: compose(function(value) {
    return 'perspective(' + value + ')';
  }, defaultUnit('px')),
};


function comma(value) {
  if (!/,/.test(value)) {
    value = value.split(' ').join(',');
  }

  return value;
}


function defaultUnit(unit) {
  return function(value) {
    return value.split(',').map(function(v) {
      v = trim(v);

      if (NUMBER_REGEX.test(v)) {
        v += unit;
      }

      return v;
    }).join(',');
  };
}

},{"./compose":16,"trim":82}],18:[function(require,module,exports){
require('get-float-time-domain-data');
var css = require('insert-styles');


css("/*! normalize.css v4.1.1 | MIT License | github.com/necolas/normalize.css */\n\n/**\n * 1. Change the default font family in all browsers (opinionated).\n * 2. Correct the line height in all browsers.\n * 3. Prevent adjustments of font size after orientation changes in IE and iOS.\n */\n\nhtml {\n  font-family: sans-serif; /* 1 */\n  line-height: 1.15; /* 2 */\n  -ms-text-size-adjust: 100%; /* 3 */\n  -webkit-text-size-adjust: 100%; /* 3 */\n}\n\n/**\n * Remove the margin in all browsers (opinionated).\n */\n\nbody {\n  margin: 0;\n}\n\n/* HTML5 display definitions\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 9-.\n * 1. Add the correct display in Edge, IE, and Firefox.\n * 2. Add the correct display in IE.\n */\n\narticle,\naside,\ndetails, /* 1 */\nfigcaption,\nfigure,\nfooter,\nheader,\nmain, /* 2 */\nmenu,\nnav,\nsection,\nsummary { /* 1 */\n  display: block;\n}\n\n/**\n * Add the correct display in IE 9-.\n */\n\naudio,\ncanvas,\nprogress,\nvideo {\n  display: inline-block;\n}\n\n/**\n * Add the correct display in iOS 4-7.\n */\n\naudio:not([controls]) {\n  display: none;\n  height: 0;\n}\n\n/**\n * Add the correct vertical alignment in Chrome, Firefox, and Opera.\n */\n\nprogress {\n  vertical-align: baseline;\n}\n\n/**\n * Add the correct display in IE 10-.\n * 1. Add the correct display in IE.\n */\n\ntemplate, /* 1 */\n[hidden] {\n  display: none;\n}\n\n/* Links\n   ========================================================================== */\n\n/**\n * 1. Remove the gray background on active links in IE 10.\n * 2. Remove gaps in links underline in iOS 8+ and Safari 8+.\n */\n\na {\n  background-color: transparent; /* 1 */\n  -webkit-text-decoration-skip: objects; /* 2 */\n}\n\n/**\n * Remove the outline on focused links when they are also active or hovered\n * in all browsers (opinionated).\n */\n\na:active,\na:hover {\n  outline-width: 0;\n}\n\n/* Text-level semantics\n   ========================================================================== */\n\n/**\n * 1. Remove the bottom border in Firefox 39-.\n * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.\n */\n\nabbr[title] {\n  border-bottom: none; /* 1 */\n  text-decoration: underline; /* 2 */\n  text-decoration: underline dotted; /* 2 */\n}\n\n/**\n * Prevent the duplicate application of `bolder` by the next rule in Safari 6.\n */\n\nb,\nstrong {\n  font-weight: inherit;\n}\n\n/**\n * Add the correct font weight in Chrome, Edge, and Safari.\n */\n\nb,\nstrong {\n  font-weight: bolder;\n}\n\n/**\n * Add the correct font style in Android 4.3-.\n */\n\ndfn {\n  font-style: italic;\n}\n\n/**\n * Correct the font size and margin on `h1` elements within `section` and\n * `article` contexts in Chrome, Firefox, and Safari.\n */\n\nh1 {\n  font-size: 2em;\n  margin: 0.67em 0;\n}\n\n/**\n * Add the correct background and color in IE 9-.\n */\n\nmark {\n  background-color: #ff0;\n  color: #000;\n}\n\n/**\n * Add the correct font size in all browsers.\n */\n\nsmall {\n  font-size: 80%;\n}\n\n/**\n * Prevent `sub` and `sup` elements from affecting the line height in\n * all browsers.\n */\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\nsub {\n  bottom: -0.25em;\n}\n\nsup {\n  top: -0.5em;\n}\n\n/* Embedded content\n   ========================================================================== */\n\n/**\n * Remove the border on images inside links in IE 10-.\n */\n\nimg {\n  border-style: none;\n}\n\n/**\n * Hide the overflow in IE.\n */\n\nsvg:not(:root) {\n  overflow: hidden;\n}\n\n/* Grouping content\n   ========================================================================== */\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\ncode,\nkbd,\npre,\nsamp {\n  font-family: monospace, monospace; /* 1 */\n  font-size: 1em; /* 2 */\n}\n\n/**\n * Add the correct margin in IE 8.\n */\n\nfigure {\n  margin: 1em 40px;\n}\n\n/**\n * 1. Add the correct box sizing in Firefox.\n * 2. Show the overflow in Edge and IE.\n */\n\nhr {\n  box-sizing: content-box; /* 1 */\n  height: 0; /* 1 */\n  overflow: visible; /* 2 */\n}\n\n/* Forms\n   ========================================================================== */\n\n/**\n * 1. Change font properties to `inherit` in all browsers (opinionated).\n * 2. Remove the margin in Firefox and Safari.\n */\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  font: inherit; /* 1 */\n  margin: 0; /* 2 */\n}\n\n/**\n * Restore the font weight unset by the previous rule.\n */\n\noptgroup {\n  font-weight: bold;\n}\n\n/**\n * Show the overflow in IE.\n * 1. Show the overflow in Edge.\n */\n\nbutton,\ninput { /* 1 */\n  overflow: visible;\n}\n\n/**\n * Remove the inheritance of text transform in Edge, Firefox, and IE.\n * 1. Remove the inheritance of text transform in Firefox.\n */\n\nbutton,\nselect { /* 1 */\n  text-transform: none;\n}\n\n/**\n * 1. Prevent a WebKit bug where (2) destroys native `audio` and `video`\n *    controls in Android 4.\n * 2. Correct the inability to style clickable types in iOS and Safari.\n */\n\nbutton,\nhtml [type=\"button\"], /* 1 */\n[type=\"reset\"],\n[type=\"submit\"] {\n  -webkit-appearance: button; /* 2 */\n}\n\n/**\n * Remove the inner border and padding in Firefox.\n */\n\nbutton::-moz-focus-inner,\n[type=\"button\"]::-moz-focus-inner,\n[type=\"reset\"]::-moz-focus-inner,\n[type=\"submit\"]::-moz-focus-inner {\n  border-style: none;\n  padding: 0;\n}\n\n/**\n * Restore the focus styles unset by the previous rule.\n */\n\nbutton:-moz-focusring,\n[type=\"button\"]:-moz-focusring,\n[type=\"reset\"]:-moz-focusring,\n[type=\"submit\"]:-moz-focusring {\n  outline: 1px dotted ButtonText;\n}\n\n/**\n * Change the border, margin, and padding in all browsers (opinionated).\n */\n\nfieldset {\n  border: 1px solid #c0c0c0;\n  margin: 0 2px;\n  padding: 0.35em 0.625em 0.75em;\n}\n\n/**\n * 1. Correct the text wrapping in Edge and IE.\n * 2. Correct the color inheritance from `fieldset` elements in IE.\n * 3. Remove the padding so developers are not caught out when they zero out\n *    `fieldset` elements in all browsers.\n */\n\nlegend {\n  box-sizing: border-box; /* 1 */\n  color: inherit; /* 2 */\n  display: table; /* 1 */\n  max-width: 100%; /* 1 */\n  padding: 0; /* 3 */\n  white-space: normal; /* 1 */\n}\n\n/**\n * Remove the default vertical scrollbar in IE.\n */\n\ntextarea {\n  overflow: auto;\n}\n\n/**\n * 1. Add the correct box sizing in IE 10-.\n * 2. Remove the padding in IE 10-.\n */\n\n[type=\"checkbox\"],\n[type=\"radio\"] {\n  box-sizing: border-box; /* 1 */\n  padding: 0; /* 2 */\n}\n\n/**\n * Correct the cursor style of increment and decrement buttons in Chrome.\n */\n\n[type=\"number\"]::-webkit-inner-spin-button,\n[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto;\n}\n\n/**\n * 1. Correct the odd appearance in Chrome and Safari.\n * 2. Correct the outline style in Safari.\n */\n\n[type=\"search\"] {\n  -webkit-appearance: textfield; /* 1 */\n  outline-offset: -2px; /* 2 */\n}\n\n/**\n * Remove the inner padding and cancel buttons in Chrome and Safari on OS X.\n */\n\n[type=\"search\"]::-webkit-search-cancel-button,\n[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\n/**\n * Correct the text style of placeholders in Chrome, Edge, and Safari.\n */\n\n::-webkit-input-placeholder {\n  color: inherit;\n  opacity: 0.54;\n}\n\n/**\n * 1. Correct the inability to style clickable types in iOS and Safari.\n * 2. Change font properties to `inherit` in Safari.\n */\n\n::-webkit-file-upload-button {\n  -webkit-appearance: button; /* 1 */\n  font: inherit; /* 2 */\n}\n");

addMeta({
	name: 'viewport',
	content: 'width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=0'
});
addMeta({
	'http-equiv': 'x-ua-compatible',
	content: 'ie=edge'
});
addMeta({
	charset: 'utf-8'
});


function addMeta (obj) {
	var meta = document.createElement('meta');
	var qs = 'meta';
	for (var name in obj) {
		qs += "[" + name + "]"
		meta.setAttribute(name, obj[name]);
	}
	if (!document.querySelector(qs)) {
		document.head.insertBefore(meta, document.head.firstChild);
	}
}
},{"get-float-time-domain-data":20,"insert-styles":29}],19:[function(require,module,exports){
/**
 * @module  get-ext
 *
 * Return file extension from path string
 */

module.exports = extname;

//get extension of a file
function extname (str) {
	var slug = str.split(/\/|\\/).slice(-1)[0];
	var idx = slug.lastIndexOf('.');
	if (idx <= 0) return '';
	var ext = slug.slice(idx);
	return ext;
}
},{}],20:[function(require,module,exports){
(function (global){
"use strict";

if (global.AnalyserNode && !global.AnalyserNode.prototype.getFloatTimeDomainData) {
  var uint8 = new Uint8Array(2048);
  global.AnalyserNode.prototype.getFloatTimeDomainData = function(array) {
    this.getByteTimeDomainData(uint8);
    for (var i = 0, imax = array.length; i < imax; i++) {
      array[i] = (uint8[i] - 128) * 0.0078125;
    }
  };
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],21:[function(require,module,exports){
/** generate unique id for selector */
var counter = Date.now() % 1e9;

module.exports = function getUid(){
	return (Math.random() * 1e9 >>> 0) + (counter++);
};
},{}],22:[function(require,module,exports){
module.exports = asString
module.exports.add = append

function asString(fonts) {
  var href = getHref(fonts)
  return '<link href="' + href + '" rel="stylesheet" type="text/css">'
}

function asElement(fonts) {
  var href = getHref(fonts)
  var link = document.createElement('link')
  link.setAttribute('href', href)
  link.setAttribute('rel', 'stylesheet')
  link.setAttribute('type', 'text/css')
  return link
}

function getHref(fonts) {
  var family = Object.keys(fonts).map(function(name) {
    var details = fonts[name]
    name = name.replace(/\s+/g, '+')
    return typeof details === 'boolean'
      ? name
      : name + ':' + makeArray(details).join(',')
  }).join('|')

  return '//fonts.googleapis.com/css?family=' + family
}

function append(fonts) {
  var link = asElement(fonts)
  document.head.appendChild(link)
  return link
}

function makeArray(arr) {
  return Array.isArray(arr) ? arr : [arr]
}

},{}],23:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],24:[function(require,module,exports){
/**
 * @module  input-number
 */

var caret = require('caret-position2');
var clamp = require('mumath/clamp');
var round = require('mumath/round');
var keys = {
	38: 'up',
	40: 'down'
};
var numRE = /[\-\.0-9]/;

module.exports = numerify;

function numerify (input, opts) {
	opts = opts || {};
	opts.step = opts.step || ((opts.min && opts.max) ? (opts.max - opts.min / 100) : 1);
	opts.max = opts.max || Infinity;
	opts.min = opts.min || -Infinity;
	opts.precision = opts.precision || 0.00001;

	var focused = false;

	input.addEventListener('keydown', function (e) {
		var key = keys[e.which];

		if (!key) return;

		e.preventDefault();

		var str = input.value;
		var pos = caret.get(input);

		//parse left side
		var left = pos.start;
		while (numRE.test(str[left - 1])) {
			left--;
		}

		//parse right side
		var right = pos.end;
		while (numRE.test(str[right])) {
			right++;
		}

		var numStr = str.slice(left, right);

		if (!numStr) return;

		var number = parseFloat(numStr);


		if (key === 'up') {
			number = clamp((number+opts.step), opts.min, opts.max);
		}
		else {
			number = clamp((number-opts.step), opts.min, opts.max);
		}
		number = round(number, opts.precision);

		var leftStr = str.slice(0, left);
		var rightStr = str.slice(right);

		var result = leftStr + number + rightStr;

		input.value = result;

		caret.set(input, left, result.length - rightStr.length);

		//resurrect suppressed event
		var inputEvent = new Event('input');
		input.dispatchEvent(inputEvent);

		//emulate change event
		if (!focused) {
			focused = true;
			input.addEventListener('blur', function change () {
				input.removeEventListener('blur', change);
				var changeEvent = new Event('change');
				input.dispatchEvent(changeEvent);
				focused = false;
			});
		}
	});

	return input;
}
},{"caret-position2":6,"mumath/clamp":25,"mumath/round":27}],25:[function(require,module,exports){
/**
 * Clamp value.
 * Detects proper clamp min/max.
 *
 * @param {number} a Current value to cut off
 * @param {number} min One side limit
 * @param {number} max Other side limit
 *
 * @return {number} Clamped value
 */

module.exports = require('./wrap')(function(a, min, max){
	return max > min ? Math.max(Math.min(a,max),min) : Math.max(Math.min(a,min),max);
});
},{"./wrap":28}],26:[function(require,module,exports){
/**
 * @module  mumath/precision
 *
 * Get precision from float:
 *
 * @example
 * 1.1 → 1, 1234 → 0, .1234 → 4
 *
 * @param {number} n
 *
 * @return {number} decimap places
 */

module.exports = require('./wrap')(function(n){
	var s = n + '',
		d = s.indexOf('.') + 1;

	return !d ? 0 : s.length - d;
});
},{"./wrap":28}],27:[function(require,module,exports){
/**
 * Precision round
 *
 * @param {number} value
 * @param {number} step Minimal discrete to round
 *
 * @return {number}
 *
 * @example
 * toPrecision(213.34, 1) == 213
 * toPrecision(213.34, .1) == 213.3
 * toPrecision(213.34, 10) == 210
 */
var precision = require('./precision');

module.exports = require('./wrap')(function(value, step) {
	if (step === 0) return value;
	if (!step) return Math.round(value);
	step = parseFloat(step);
	value = Math.round(value / step) * step;
	return parseFloat(value.toFixed(precision(step)));
});
},{"./precision":26,"./wrap":28}],28:[function(require,module,exports){
/**
 * Get fn wrapped with array/object attrs recognition
 *
 * @return {Function} Target function
 */
module.exports = function(fn){
	return function (a) {
		var this$1 = this;

		var args = arguments;
		if (a instanceof Array) {
			var result = new Array(a.length), slice;
			for (var i = 0; i < a.length; i++){
				slice = [];
				for (var j = 0, l = args.length, val; j < l; j++){
					val = args[j] instanceof Array ? args[j][i] : args[j];
					val = val;
					slice.push(val);
				}
				result[i] = fn.apply(this$1, slice);
			}
			return result;
		}
		else if (typeof a === 'object') {
			var result = {}, slice;
			for (var i in a){
				slice = [];
				for (var j = 0, l = args.length, val; j < l; j++){
					val = typeof args[j] === 'object' ? args[j][i] : args[j];
					val = val;
					slice.push(val);
				}
				result[i] = fn.apply(this$1, slice);
			}
			return result;
		}
		else {
			return fn.apply(this, args);
		}
	};
};
},{}],29:[function(require,module,exports){
(function (global){
'use strict'

var cache = {}

function noop () {}

module.exports = !global.document ? noop : insertStyles

function insertStyles (styles, options) {
  var id = options && options.id || styles

  var element = cache[id] = (cache[id] || createStyle(id))

  if ('textContent' in element) {
    element.textContent = styles
  } else {
    element.styleSheet.cssText = styles
  }
}

function createStyle (id) {
  var element = document.getElementById(id)

  if (element) return element

  element = document.createElement('style')
  element.setAttribute('type', 'text/css')

  document.head.appendChild(element)

  return element
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],30:[function(require,module,exports){
module.exports = isMobile;

function isMobile (ua) {
  if (!ua && typeof navigator != 'undefined') ua = navigator.userAgent;
  if (ua && ua.headers && typeof ua.headers['user-agent'] == 'string') {
    ua = ua.headers['user-agent'];
  }
  if (typeof ua != 'string') return false;

  return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(ua) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(ua.substr(0,4));
}

},{}],31:[function(require,module,exports){
/*!
 * is-number <https://github.com/jonschlinkert/is-number>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

module.exports = function isNumber(n) {
  return (!!(+n) && !Array.isArray(n)) && isFinite(n)
    || n === '0'
    || n === 0;
};

},{}],32:[function(require,module,exports){
(function(root) {
  'use strict';

  function isNumeric(v) {
    if (typeof v === 'number' && !isNaN(v)) return true;
    v = (v||'').toString().trim();
    if (!v) return false;
    return !isNaN(v);
  }

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = isNumeric;
    }
    exports.isNumeric = isNumeric;
  } else if (typeof define === 'function' && define.amd) {
    define([], function() {
      return isNumeric;
    });
  } else {
    root.isNumeric = isNumeric;
  }

})(this);

},{}],33:[function(require,module,exports){
'use strict';
var toString = Object.prototype.toString;

module.exports = function (x) {
	var prototype;
	return toString.call(x) === '[object Object]' && (prototype = Object.getPrototypeOf(x), prototype === null || prototype === Object.getPrototypeOf({}));
};

},{}],34:[function(require,module,exports){

/**
 * Expose `isUrl`.
 */

module.exports = isUrl;

/**
 * Matcher.
 */

var matcher = /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/;

/**
 * Loosely validate a URL `string`.
 *
 * @param {String} string
 * @return {Boolean}
 */

function isUrl(string){
  return matcher.test(string);
}

},{}],35:[function(require,module,exports){
module.exports = extend;

/*
  var obj = {a: 3, b: 5};
  extend(obj, {a: 4, c: 8}); // {a: 4, b: 5, c: 8}
  obj; // {a: 4, b: 5, c: 8}

  var obj = {a: 3, b: 5};
  extend({}, obj, {a: 4, c: 8}); // {a: 4, b: 5, c: 8}
  obj; // {a: 3, b: 5}

  var arr = [1, 2, 3];
  var obj = {a: 3, b: 5};
  extend(obj, {c: arr}); // {a: 3, b: 5, c: [1, 2, 3]}
  arr.push[4];
  obj; // {a: 3, b: 5, c: [1, 2, 3, 4]}

  var arr = [1, 2, 3];
  var obj = {a: 3, b: 5};
  extend(true, obj, {c: arr}); // {a: 3, b: 5, c: [1, 2, 3]}
  arr.push[4];
  obj; // {a: 3, b: 5, c: [1, 2, 3]}
*/

function extend(obj1, obj2 /*, [objn]*/) {
  var args = [].slice.call(arguments);
  var deep = false;
  if (typeof args[0] === 'boolean') {
    deep = args.shift();
  }
  var result = args[0];
  var extenders = args.slice(1);
  var len = extenders.length;
  for (var i = 0; i < len; i++) {
    var extender = extenders[i];
    for (var key in extender) {
      // include prototype properties
      var value = extender[key];
      if (deep && value && (typeof value == 'object')) {
        var base = Array.isArray(value) ? [] : {};
        result[key] = extend(true, base, value);
      } else {
        result[key] = value;
      }
    }
  }
  return result;
}

},{}],36:[function(require,module,exports){
'use strict';
module.exports = leftPad;

var cache = [
  '',
  ' ',
  '  ',
  '   ',
  '    ',
  '     ',
  '      ',
  '       ',
  '        ',
  '         '
];

function leftPad (str, len, ch) {
  // convert `str` to `string`
  str = str + '';
  // `len` is the `pad`'s length now
  len = len - str.length;
  // doesn't need to pad
  if (len <= 0) return str;
  // `ch` defaults to `' '`
  if (!ch && ch !== 0) ch = ' ';
  // convert `ch` to `string`
  ch = ch + '';
  // cache common use cases
  if (ch === ' ' && len < 10) return cache[len] + str;
  // `pad` starts with an empty string
  var pad = '';
  // loop
  while (true) {
    // add `ch` to `pad` if `len` is odd
    if (len & 1) pad += ch;
    // devide `len` by 2, ditch the fraction
    len >>= 1;
    // "double" the `ch` so this operation count grows logarithmically on `len`
    // each time `ch` is "doubled", the `len` would need to be "doubled" too
    // similar to finding a value in binary search tree, hence O(log(n))
    if (len) ch += ch;
    // `len` is 0, exit the loop
    else break;
  }
  // pad `str`!
  return pad + str;
}

},{}],37:[function(require,module,exports){
function lerp(v0, v1, t) {
    return v0*(1-t)+v1*t
}
module.exports = lerp
},{}],38:[function(require,module,exports){
/**
 * lodash 3.1.4 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var isArguments = require('lodash.isarguments'),
    isArray = require('lodash.isarray');

/**
 * Checks if `value` is object-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

/**
 * The base implementation of `_.flatten` with added support for restricting
 * flattening and specifying the start index.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {boolean} [isDeep] Specify a deep flatten.
 * @param {boolean} [isStrict] Restrict flattening to arrays-like objects.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */
function baseFlatten(array, isDeep, isStrict, result) {
  result || (result = []);

  var index = -1,
      length = array.length;

  while (++index < length) {
    var value = array[index];
    if (isObjectLike(value) && isArrayLike(value) &&
        (isStrict || isArray(value) || isArguments(value))) {
      if (isDeep) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten(value, isDeep, isStrict, result);
      } else {
        arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

/**
 * Gets the "length" property value of `object`.
 *
 * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
 * that affects Safari on at least iOS 8.1-8.3 ARM64.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {*} Returns the "length" value.
 */
var getLength = baseProperty('length');

/**
 * Checks if `value` is array-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 */
function isArrayLike(value) {
  return value != null && isLength(getLength(value));
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = baseFlatten;

},{"lodash.isarguments":44,"lodash.isarray":45}],39:[function(require,module,exports){
/**
 * lodash 3.0.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.7.0 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var isFunction = require('lodash.isfunction');

/**
 * The base implementation of `_.functions` which creates an array of
 * `object` function property names filtered from those provided.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Array} props The property names to filter.
 * @returns {Array} Returns the new array of filtered property names.
 */
function baseFunctions(object, props) {
  var index = -1,
      length = props.length,
      resIndex = -1,
      result = [];

  while (++index < length) {
    var key = props[index];
    if (isFunction(object[key])) {
      result[++resIndex] = key;
    }
  }
  return result;
}

module.exports = baseFunctions;

},{"lodash.isfunction":46}],40:[function(require,module,exports){
/**
 * lodash 3.2.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var root = require('lodash._root');

/** Used to compose bitmasks for wrapper metadata. */
var BIND_FLAG = 1,
    BIND_KEY_FLAG = 2,
    CURRY_BOUND_FLAG = 4,
    CURRY_FLAG = 8,
    CURRY_RIGHT_FLAG = 16,
    PARTIAL_FLAG = 32,
    PARTIAL_RIGHT_FLAG = 64,
    ARY_FLAG = 128,
    FLIP_FLAG = 512;

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_SAFE_INTEGER = 9007199254740991,
    MAX_INTEGER = 1.7976931348623157e+308,
    NAN = 0 / 0;

/** Used as the internal argument placeholder. */
var PLACEHOLDER = '__lodash_placeholder__';

/** `Object#toString` result references. */
var funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {...*} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  var length = args.length;
  switch (length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  value = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
  length = length == null ? MAX_SAFE_INTEGER : length;
  return value > -1 && value % 1 == 0 && value < length;
}

/**
 * Replaces all `placeholder` elements in `array` with an internal placeholder
 * and returns an array of their indexes.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {*} placeholder The placeholder to replace.
 * @returns {Array} Returns the new array of placeholder indexes.
 */
function replaceHolders(array, placeholder) {
  var index = -1,
      length = array.length,
      resIndex = -1,
      result = [];

  while (++index < length) {
    if (array[index] === placeholder) {
      array[index] = PLACEHOLDER;
      result[++resIndex] = index;
    }
  }
  return result;
}

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} prototype The object to inherit from.
 * @returns {Object} Returns the new object.
 */
var baseCreate = (function() {
  function object() {}
  return function(prototype) {
    if (isObject(prototype)) {
      object.prototype = prototype;
      var result = new object;
      object.prototype = undefined;
    }
    return result || {};
  };
}());

/**
 * Creates an array that is the composition of partially applied arguments,
 * placeholders, and provided arguments into a single array of arguments.
 *
 * @private
 * @param {Array|Object} args The provided arguments.
 * @param {Array} partials The arguments to prepend to those provided.
 * @param {Array} holders The `partials` placeholder indexes.
 * @returns {Array} Returns the new array of composed arguments.
 */
function composeArgs(args, partials, holders) {
  var holdersLength = holders.length,
      argsIndex = -1,
      argsLength = nativeMax(args.length - holdersLength, 0),
      leftIndex = -1,
      leftLength = partials.length,
      result = Array(leftLength + argsLength);

  while (++leftIndex < leftLength) {
    result[leftIndex] = partials[leftIndex];
  }
  while (++argsIndex < holdersLength) {
    result[holders[argsIndex]] = args[argsIndex];
  }
  while (argsLength--) {
    result[leftIndex++] = args[argsIndex++];
  }
  return result;
}

/**
 * This function is like `composeArgs` except that the arguments composition
 * is tailored for `_.partialRight`.
 *
 * @private
 * @param {Array|Object} args The provided arguments.
 * @param {Array} partials The arguments to append to those provided.
 * @param {Array} holders The `partials` placeholder indexes.
 * @returns {Array} Returns the new array of composed arguments.
 */
function composeArgsRight(args, partials, holders) {
  var holdersIndex = -1,
      holdersLength = holders.length,
      argsIndex = -1,
      argsLength = nativeMax(args.length - holdersLength, 0),
      rightIndex = -1,
      rightLength = partials.length,
      result = Array(argsLength + rightLength);

  while (++argsIndex < argsLength) {
    result[argsIndex] = args[argsIndex];
  }
  var offset = argsIndex;
  while (++rightIndex < rightLength) {
    result[offset + rightIndex] = partials[rightIndex];
  }
  while (++holdersIndex < holdersLength) {
    result[offset + holders[holdersIndex]] = args[argsIndex++];
  }
  return result;
}

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

/**
 * Creates a function that wraps `func` to invoke it with the optional `this`
 * binding of `thisArg`.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {number} bitmask The bitmask of wrapper flags. See `createWrapper` for more details.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createBaseWrapper(func, bitmask, thisArg) {
  var isBind = bitmask & BIND_FLAG,
      Ctor = createCtorWrapper(func);

  function wrapper() {
    var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
    return fn.apply(isBind ? thisArg : this, arguments);
  }
  return wrapper;
}

/**
 * Creates a function that produces an instance of `Ctor` regardless of
 * whether it was invoked as part of a `new` expression or by `call` or `apply`.
 *
 * @private
 * @param {Function} Ctor The constructor to wrap.
 * @returns {Function} Returns the new wrapped function.
 */
function createCtorWrapper(Ctor) {
  return function() {
    // Use a `switch` statement to work with class constructors.
    // See http://ecma-international.org/ecma-262/6.0/#sec-ecmascript-function-objects-call-thisargument-argumentslist
    // for more details.
    var args = arguments;
    switch (args.length) {
      case 0: return new Ctor;
      case 1: return new Ctor(args[0]);
      case 2: return new Ctor(args[0], args[1]);
      case 3: return new Ctor(args[0], args[1], args[2]);
      case 4: return new Ctor(args[0], args[1], args[2], args[3]);
      case 5: return new Ctor(args[0], args[1], args[2], args[3], args[4]);
      case 6: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
      case 7: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
    }
    var thisBinding = baseCreate(Ctor.prototype),
        result = Ctor.apply(thisBinding, args);

    // Mimic the constructor's `return` behavior.
    // See https://es5.github.io/#x13.2.2 for more details.
    return isObject(result) ? result : thisBinding;
  };
}

/**
 * Creates a function that wraps `func` to enable currying.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {number} bitmask The bitmask of wrapper flags. See `createWrapper` for more details.
 * @param {number} arity The arity of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createCurryWrapper(func, bitmask, arity) {
  var Ctor = createCtorWrapper(func);

  function wrapper() {
    var arguments$1 = arguments;

    var length = arguments.length,
        index = length,
        args = Array(length),
        fn = (this && this !== root && this instanceof wrapper) ? Ctor : func,
        placeholder = wrapper.placeholder;

    while (index--) {
      args[index] = arguments$1[index];
    }
    var holders = (length < 3 && args[0] !== placeholder && args[length - 1] !== placeholder)
      ? []
      : replaceHolders(args, placeholder);

    length -= holders.length;
    return length < arity
      ? createRecurryWrapper(func, bitmask, createHybridWrapper, placeholder, undefined, args, holders, undefined, undefined, arity - length)
      : apply(fn, this, args);
  }
  return wrapper;
}

/**
 * Creates a function that wraps `func` to invoke it with optional `this`
 * binding of `thisArg`, partial application, and currying.
 *
 * @private
 * @param {Function|string} func The function or method name to wrap.
 * @param {number} bitmask The bitmask of wrapper flags. See `createWrapper` for more details.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {Array} [partials] The arguments to prepend to those provided to the new function.
 * @param {Array} [holders] The `partials` placeholder indexes.
 * @param {Array} [partialsRight] The arguments to append to those provided to the new function.
 * @param {Array} [holdersRight] The `partialsRight` placeholder indexes.
 * @param {Array} [argPos] The argument positions of the new function.
 * @param {number} [ary] The arity cap of `func`.
 * @param {number} [arity] The arity of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createHybridWrapper(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
  var isAry = bitmask & ARY_FLAG,
      isBind = bitmask & BIND_FLAG,
      isBindKey = bitmask & BIND_KEY_FLAG,
      isCurry = bitmask & CURRY_FLAG,
      isCurryRight = bitmask & CURRY_RIGHT_FLAG,
      isFlip = bitmask & FLIP_FLAG,
      Ctor = isBindKey ? undefined : createCtorWrapper(func);

  function wrapper() {
    var arguments$1 = arguments;

    var length = arguments.length,
        index = length,
        args = Array(length);

    while (index--) {
      args[index] = arguments$1[index];
    }
    if (partials) {
      args = composeArgs(args, partials, holders);
    }
    if (partialsRight) {
      args = composeArgsRight(args, partialsRight, holdersRight);
    }
    if (isCurry || isCurryRight) {
      var placeholder = wrapper.placeholder,
          argsHolders = replaceHolders(args, placeholder);

      length -= argsHolders.length;
      if (length < arity) {
        return createRecurryWrapper(func, bitmask, createHybridWrapper, placeholder, thisArg, args, argsHolders, argPos, ary, arity - length);
      }
    }
    var thisBinding = isBind ? thisArg : this,
        fn = isBindKey ? thisBinding[func] : func;

    if (argPos) {
      args = reorder(args, argPos);
    } else if (isFlip && args.length > 1) {
      args.reverse();
    }
    if (isAry && ary < args.length) {
      args.length = ary;
    }
    if (this && this !== root && this instanceof wrapper) {
      fn = Ctor || createCtorWrapper(fn);
    }
    return fn.apply(thisBinding, args);
  }
  return wrapper;
}

/**
 * Creates a function that wraps `func` to invoke it with the optional `this`
 * binding of `thisArg` and the `partials` prepended to those provided to
 * the wrapper.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {number} bitmask The bitmask of wrapper flags. See `createWrapper` for more details.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} partials The arguments to prepend to those provided to the new function.
 * @returns {Function} Returns the new wrapped function.
 */
function createPartialWrapper(func, bitmask, thisArg, partials) {
  var isBind = bitmask & BIND_FLAG,
      Ctor = createCtorWrapper(func);

  function wrapper() {
    var arguments$1 = arguments;

    var argsIndex = -1,
        argsLength = arguments.length,
        leftIndex = -1,
        leftLength = partials.length,
        args = Array(leftLength + argsLength),
        fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;

    while (++leftIndex < leftLength) {
      args[leftIndex] = partials[leftIndex];
    }
    while (argsLength--) {
      args[leftIndex++] = arguments$1[++argsIndex];
    }
    return apply(fn, isBind ? thisArg : this, args);
  }
  return wrapper;
}

/**
 * Creates a function that wraps `func` to continue currying.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {number} bitmask The bitmask of wrapper flags. See `createWrapper` for more details.
 * @param {Function} wrapFunc The function to create the `func` wrapper.
 * @param {*} placeholder The placeholder to replace.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {Array} [partials] The arguments to prepend to those provided to the new function.
 * @param {Array} [holders] The `partials` placeholder indexes.
 * @param {Array} [argPos] The argument positions of the new function.
 * @param {number} [ary] The arity cap of `func`.
 * @param {number} [arity] The arity of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createRecurryWrapper(func, bitmask, wrapFunc, placeholder, thisArg, partials, holders, argPos, ary, arity) {
  var isCurry = bitmask & CURRY_FLAG,
      newArgPos = argPos ? copyArray(argPos) : undefined,
      newsHolders = isCurry ? holders : undefined,
      newHoldersRight = isCurry ? undefined : holders,
      newPartials = isCurry ? partials : undefined,
      newPartialsRight = isCurry ? undefined : partials;

  bitmask |= (isCurry ? PARTIAL_FLAG : PARTIAL_RIGHT_FLAG);
  bitmask &= ~(isCurry ? PARTIAL_RIGHT_FLAG : PARTIAL_FLAG);

  if (!(bitmask & CURRY_BOUND_FLAG)) {
    bitmask &= ~(BIND_FLAG | BIND_KEY_FLAG);
  }
  var result = wrapFunc(func, bitmask, thisArg, newPartials, newsHolders, newPartialsRight, newHoldersRight, newArgPos, ary, arity);

  result.placeholder = placeholder;
  return result;
}

/**
 * Creates a function that either curries or invokes `func` with optional
 * `this` binding and partially applied arguments.
 *
 * @private
 * @param {Function|string} func The function or method name to wrap.
 * @param {number} bitmask The bitmask of wrapper flags.
 *  The bitmask may be composed of the following flags:
 *     1 - `_.bind`
 *     2 - `_.bindKey`
 *     4 - `_.curry` or `_.curryRight` of a bound function
 *     8 - `_.curry`
 *    16 - `_.curryRight`
 *    32 - `_.partial`
 *    64 - `_.partialRight`
 *   128 - `_.rearg`
 *   256 - `_.ary`
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {Array} [partials] The arguments to be partially applied.
 * @param {Array} [holders] The `partials` placeholder indexes.
 * @param {Array} [argPos] The argument positions of the new function.
 * @param {number} [ary] The arity cap of `func`.
 * @param {number} [arity] The arity of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createWrapper(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
  var isBindKey = bitmask & BIND_KEY_FLAG;
  if (!isBindKey && typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var length = partials ? partials.length : 0;
  if (!length) {
    bitmask &= ~(PARTIAL_FLAG | PARTIAL_RIGHT_FLAG);
    partials = holders = undefined;
  }
  ary = ary === undefined ? ary : nativeMax(toInteger(ary), 0);
  arity = arity === undefined ? arity : toInteger(arity);
  length -= holders ? holders.length : 0;

  if (bitmask & PARTIAL_RIGHT_FLAG) {
    var partialsRight = partials,
        holdersRight = holders;

    partials = holders = undefined;
  }
  var newData = [func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity];

  func = newData[0];
  bitmask = newData[1];
  thisArg = newData[2];
  partials = newData[3];
  holders = newData[4];
  arity = newData[9] = newData[9] == null
    ? (isBindKey ? 0 : func.length)
    : nativeMax(newData[9] - length, 0);

  if (!arity && bitmask & (CURRY_FLAG | CURRY_RIGHT_FLAG)) {
    bitmask &= ~(CURRY_FLAG | CURRY_RIGHT_FLAG);
  }
  if (!bitmask || bitmask == BIND_FLAG) {
    var result = createBaseWrapper(func, bitmask, thisArg);
  } else if (bitmask == CURRY_FLAG || bitmask == CURRY_RIGHT_FLAG) {
    result = createCurryWrapper(func, bitmask, arity);
  } else if ((bitmask == PARTIAL_FLAG || bitmask == (BIND_FLAG | PARTIAL_FLAG)) && !holders.length) {
    result = createPartialWrapper(func, bitmask, thisArg, partials);
  } else {
    result = createHybridWrapper.apply(undefined, newData);
  }
  return result;
}

/**
 * Reorder `array` according to the specified indexes where the element at
 * the first index is assigned as the first element, the element at
 * the second index is assigned as the second element, and so on.
 *
 * @private
 * @param {Array} array The array to reorder.
 * @param {Array} indexes The arranged array indexes.
 * @returns {Array} Returns `array`.
 */
function reorder(array, indexes) {
  var arrLength = array.length,
      length = nativeMin(indexes.length, arrLength),
      oldArray = copyArray(array);

  while (length--) {
    var index = indexes[length];
    array[length] = isIndex(index, arrLength) ? oldArray[index] : undefined;
  }
  return array;
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8 which returns 'object' for typed array constructors, and
  // PhantomJS 1.9 which returns 'function' for `NodeList` instances.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Converts `value` to an integer.
 *
 * **Note:** This function is loosely based on [`ToInteger`](http://www.ecma-international.org/ecma-262/6.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3');
 * // => 3
 */
function toInteger(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber(value);
  if (value === INFINITY || value === -INFINITY) {
    var sign = (value < 0 ? -1 : 1);
    return sign * MAX_INTEGER;
  }
  var remainder = value % 1;
  return value === value ? (remainder ? value - remainder : value) : 0;
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3);
 * // => 3
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3');
 * // => 3
 */
function toNumber(value) {
  if (isObject(value)) {
    var other = isFunction(value.valueOf) ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = createWrapper;

},{"lodash._root":41}],41:[function(require,module,exports){
(function (global){
/**
 * lodash 3.0.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** Used to determine if values are of the language type `Object`. */
var objectTypes = {
  'function': true,
  'object': true
};

/** Detect free variable `exports`. */
var freeExports = (objectTypes[typeof exports] && exports && !exports.nodeType)
  ? exports
  : undefined;

/** Detect free variable `module`. */
var freeModule = (objectTypes[typeof module] && module && !module.nodeType)
  ? module
  : undefined;

/** Detect free variable `global` from Node.js. */
var freeGlobal = checkGlobal(freeExports && freeModule && typeof global == 'object' && global);

/** Detect free variable `self`. */
var freeSelf = checkGlobal(objectTypes[typeof self] && self);

/** Detect free variable `window`. */
var freeWindow = checkGlobal(objectTypes[typeof window] && window);

/** Detect `this` as the global object. */
var thisGlobal = checkGlobal(objectTypes[typeof this] && this);

/**
 * Used as a reference to the global object.
 *
 * The `this` value is used if it's the global object to avoid Greasemonkey's
 * restricted `window` object, otherwise the `window` object is used.
 */
var root = freeGlobal ||
  ((freeWindow !== (thisGlobal && thisGlobal.window)) && freeWindow) ||
    freeSelf || thisGlobal || Function('return this')();

/**
 * Checks if `value` is a global object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {null|Object} Returns `value` if it's a global object, else `null`.
 */
function checkGlobal(value) {
  return (value && value.Object === Object) ? value : null;
}

module.exports = root;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],42:[function(require,module,exports){
/**
 * lodash 3.1.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var baseFlatten = require('lodash._baseflatten'),
    createWrapper = require('lodash._createwrapper'),
    functions = require('lodash.functions'),
    restParam = require('lodash.restparam');

/** Used to compose bitmasks for wrapper metadata. */
var BIND_FLAG = 1;

/**
 * Binds methods of an object to the object itself, overwriting the existing
 * method. Method names may be specified as individual arguments or as arrays
 * of method names. If no method names are provided all enumerable function
 * properties, own and inherited, of `object` are bound.
 *
 * **Note:** This method does not set the `length` property of bound functions.
 *
 * @static
 * @memberOf _
 * @category Function
 * @param {Object} object The object to bind and assign the bound methods to.
 * @param {...(string|string[])} [methodNames] The object method names to bind,
 *  specified as individual method names or arrays of method names.
 * @returns {Object} Returns `object`.
 * @example
 *
 * var view = {
 *   'label': 'docs',
 *   'onClick': function() {
 *     console.log('clicked ' + this.label);
 *   }
 * };
 *
 * _.bindAll(view);
 * jQuery('#docs').on('click', view.onClick);
 * // => logs 'clicked docs' when the element is clicked
 */
var bindAll = restParam(function(object, methodNames) {
  methodNames = methodNames.length ? baseFlatten(methodNames) : functions(object);

  var index = -1,
      length = methodNames.length;

  while (++index < length) {
    var key = methodNames[index];
    object[key] = createWrapper(object[key], BIND_FLAG, object);
  }
  return object;
});

module.exports = bindAll;

},{"lodash._baseflatten":38,"lodash._createwrapper":40,"lodash.functions":43,"lodash.restparam":48}],43:[function(require,module,exports){
/**
 * lodash 3.0.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.7.0 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var baseFunctions = require('lodash._basefunctions'),
    keysIn = require('lodash.keysin');

/**
 * Creates an array of function property names from all enumerable properties,
 * own and inherited, of `object`.
 *
 * @static
 * @memberOf _
 * @alias methods
 * @category Object
 * @param {Object} object The object to inspect.
 * @returns {Array} Returns the new array of property names.
 * @example
 *
 * _.functions(_);
 * // => ['all', 'any', 'bind', ...]
 */
function functions(object) {
  return baseFunctions(object, keysIn(object));
}

module.exports = functions;

},{"lodash._basefunctions":39,"lodash.keysin":47}],44:[function(require,module,exports){
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
}

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

module.exports = isArguments;

},{}],45:[function(require,module,exports){
/**
 * lodash 3.0.4 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** `Object#toString` result references. */
var arrayTag = '[object Array]',
    funcTag = '[object Function]';

/** Used to detect host constructors (Safari > 5). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/**
 * Checks if `value` is object-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var fnToString = Function.prototype.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/* Native method references for those with the same name as other `lodash` methods. */
var nativeIsArray = getNative(Array, 'isArray');

/**
 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = object == null ? undefined : object[key];
  return isNative(value) ? value : undefined;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(function() { return arguments; }());
 * // => false
 */
var isArray = nativeIsArray || function(value) {
  return isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag;
};

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in older versions of Chrome and Safari which return 'function' for regexes
  // and Safari 8 equivalents which return 'object' for typed array constructors.
  return isObject(value) && objToString.call(value) == funcTag;
}

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is a native function.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
 * @example
 *
 * _.isNative(Array.prototype.push);
 * // => true
 *
 * _.isNative(_);
 * // => false
 */
function isNative(value) {
  if (value == null) {
    return false;
  }
  if (isFunction(value)) {
    return reIsNative.test(fnToString.call(value));
  }
  return isObjectLike(value) && reIsHostCtor.test(value);
}

module.exports = isArray;

},{}],46:[function(require,module,exports){
/**
 * lodash 3.0.8 (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** `Object#toString` result references. */
var funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8 which returns 'object' for typed array constructors, and
  // PhantomJS 1.9 which returns 'function' for `NodeList` instances.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

module.exports = isFunction;

},{}],47:[function(require,module,exports){
/**
 * lodash 3.0.8 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var isArguments = require('lodash.isarguments'),
    isArray = require('lodash.isarray');

/** Used to detect unsigned integer values. */
var reIsUint = /^\d+$/;

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used as the [maximum length](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  value = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
  length = length == null ? MAX_SAFE_INTEGER : length;
  return value > -1 && value % 1 == 0 && value < length;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is based on [`ToLength`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength).
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  if (object == null) {
    return [];
  }
  if (!isObject(object)) {
    object = Object(object);
  }
  var length = object.length;
  length = (length && isLength(length) &&
    (isArray(object) || isArguments(object)) && length) || 0;

  var Ctor = object.constructor,
      index = -1,
      isProto = typeof Ctor == 'function' && Ctor.prototype === object,
      result = Array(length),
      skipIndexes = length > 0;

  while (++index < length) {
    result[index] = (index + '');
  }
  for (var key in object) {
    if (!(skipIndexes && isIndex(key, length)) &&
        !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = keysIn;

},{"lodash.isarguments":44,"lodash.isarray":45}],48:[function(require,module,exports){
/**
 * lodash 3.6.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Native method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * Creates a function that invokes `func` with the `this` binding of the
 * created function and arguments from `start` and beyond provided as an array.
 *
 * **Note:** This method is based on the [rest parameter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters).
 *
 * @static
 * @memberOf _
 * @category Function
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var say = _.restParam(function(what, names) {
 *   return what + ' ' + _.initial(names).join(', ') +
 *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
 * });
 *
 * say('hello', 'fred', 'barney', 'pebbles');
 * // => 'hello fred, barney, & pebbles'
 */
function restParam(func, start) {
  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  start = nativeMax(start === undefined ? (func.length - 1) : (+start || 0), 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        rest = Array(length);

    while (++index < length) {
      rest[index] = args[start + index];
    }
    switch (start) {
      case 0: return func.call(this, rest);
      case 1: return func.call(this, args[0], rest);
      case 2: return func.call(this, args[0], args[1], rest);
    }
    var otherArgs = Array(start + 1);
    index = -1;
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = rest;
    return func.apply(this, otherArgs);
  };
}

module.exports = restParam;

},{}],49:[function(require,module,exports){
/**
 * Special language-specific overrides.
 *
 * Source: ftp://ftp.unicode.org/Public/UCD/latest/ucd/SpecialCasing.txt
 *
 * @type {Object}
 */
var LANGUAGES = {
  tr: {
    regexp: /\u0130|\u0049|\u0049\u0307/g,
    map: {
      '\u0130': '\u0069',
      '\u0049': '\u0131',
      '\u0049\u0307': '\u0069'
    }
  },
  az: {
    regexp: /[\u0130]/g,
    map: {
      '\u0130': '\u0069',
      '\u0049': '\u0131',
      '\u0049\u0307': '\u0069'
    }
  },
  lt: {
    regexp: /[\u0049\u004A\u012E\u00CC\u00CD\u0128]/g,
    map: {
      '\u0049': '\u0069\u0307',
      '\u004A': '\u006A\u0307',
      '\u012E': '\u012F\u0307',
      '\u00CC': '\u0069\u0307\u0300',
      '\u00CD': '\u0069\u0307\u0301',
      '\u0128': '\u0069\u0307\u0303'
    }
  }
}

/**
 * Lowercase a string.
 *
 * @param  {String} str
 * @return {String}
 */
module.exports = function (str, locale) {
  var lang = LANGUAGES[locale]

  str = str == null ? '' : String(str)

  if (lang) {
    str = str.replace(lang.regexp, function (m) { return lang.map[m] })
  }

  return str.toLowerCase()
}

},{}],50:[function(require,module,exports){
/**
 * Clamp value.
 * Detects proper clamp min/max.
 *
 * @param {number} a Current value to cut off
 * @param {number} min One side limit
 * @param {number} max Other side limit
 *
 * @return {number} Clamped value
 */

module.exports = function(a, min, max){
	return max > min ? Math.max(Math.min(a,max),min) : Math.max(Math.min(a,min),max);
};
},{}],51:[function(require,module,exports){
var sentenceCase = require('sentence-case')

/**
 * Param case a string.
 *
 * @param  {String} string
 * @param  {String} [locale]
 * @return {String}
 */
module.exports = function (string, locale) {
  return sentenceCase(string, locale, '-')
}

},{"sentence-case":55}],52:[function(require,module,exports){
var div = null
var prefixes = [ 'Webkit', 'Moz', 'O', 'ms' ]

module.exports = function prefixStyle (prop) {
  // re-use a dummy div
  if (!div) {
    div = document.createElement('div')
  }

  var style = div.style

  // prop exists without prefix
  if (prop in style) {
    return prop
  }

  // borderRadius -> BorderRadius
  var titleCase = prop.charAt(0).toUpperCase() + prop.slice(1)

  // find the vendor-prefixed prop
  for (var i = prefixes.length; i >= 0; i--) {
    var name = prefixes[i] + titleCase
    // e.g. WebkitBorderRadius or webkitBorderRadius
    if (name in style) {
      return name
    }
  }

  return false
}

},{}],53:[function(require,module,exports){
function identity(x) { return x; }

module.exports = identity;
module.exports.dash = identity;
module.exports.dash = identity;

},{}],54:[function(require,module,exports){
module.exports = scope;
scope.replace = replace;

function scope (css, parent) {
	if (!css) return css;

	if (!parent) return css;

	css = replace(css, parent + ' $1$2');

	//regexp.escape
	var parentRe = parent.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

	//replace self-selectors
	css = css.replace(new RegExp('(' + parentRe + ')\\s*\\1(?=[\\s\\r\\n,{])', 'g'), '$1');

	//replace `:host` with parent
	css = css.replace(new RegExp('(' + parentRe + ')\\s*:host', 'g'), '$1');

	//revoke wrongly replaced @ statements, like @supports, @import, @media etc.
	css = css.replace(new RegExp('(' + parentRe + ')\\s*@', 'g'), '@');

	return css;
}

function replace (css, replacer) {
	//strip block comments
	css = css.replace(/\/\*([\s\S]*?)\*\//g, '');

	return css.replace(/([^\r\n,{}]+)(,(?=[^}]*{)|\s*{)/g, replacer);
}
},{}],55:[function(require,module,exports){
var lowerCase = require('lower-case')

var NON_WORD_REGEXP = require('./vendor/non-word-regexp')
var CAMEL_CASE_REGEXP = require('./vendor/camel-case-regexp')
var TRAILING_DIGIT_REGEXP = require('./vendor/trailing-digit-regexp')

/**
 * Sentence case a string.
 *
 * @param  {String} str
 * @param  {String} locale
 * @param  {String} replacement
 * @return {String}
 */
module.exports = function (str, locale, replacement) {
  if (str == null) {
    return ''
  }

  replacement = replacement || ' '

  function replace (match, index, string) {
    if (index === 0 || index === (string.length - match.length)) {
      return ''
    }

    return replacement
  }

  str = String(str)
    // Support camel case ("camelCase" -> "camel Case").
    .replace(CAMEL_CASE_REGEXP, '$1 $2')
    // Support digit groups ("test2012" -> "test 2012").
    .replace(TRAILING_DIGIT_REGEXP, '$1 $2')
    // Remove all non-word characters and replace with a single space.
    .replace(NON_WORD_REGEXP, replace)

  // Lower case the entire string.
  return lowerCase(str, locale)
}

},{"./vendor/camel-case-regexp":56,"./vendor/non-word-regexp":57,"./vendor/trailing-digit-regexp":58,"lower-case":49}],56:[function(require,module,exports){
module.exports = /([\u0061-\u007A\u00B5\u00DF-\u00F6\u00F8-\u00FF\u0101\u0103\u0105\u0107\u0109\u010B\u010D\u010F\u0111\u0113\u0115\u0117\u0119\u011B\u011D\u011F\u0121\u0123\u0125\u0127\u0129\u012B\u012D\u012F\u0131\u0133\u0135\u0137\u0138\u013A\u013C\u013E\u0140\u0142\u0144\u0146\u0148\u0149\u014B\u014D\u014F\u0151\u0153\u0155\u0157\u0159\u015B\u015D\u015F\u0161\u0163\u0165\u0167\u0169\u016B\u016D\u016F\u0171\u0173\u0175\u0177\u017A\u017C\u017E-\u0180\u0183\u0185\u0188\u018C\u018D\u0192\u0195\u0199-\u019B\u019E\u01A1\u01A3\u01A5\u01A8\u01AA\u01AB\u01AD\u01B0\u01B4\u01B6\u01B9\u01BA\u01BD-\u01BF\u01C6\u01C9\u01CC\u01CE\u01D0\u01D2\u01D4\u01D6\u01D8\u01DA\u01DC\u01DD\u01DF\u01E1\u01E3\u01E5\u01E7\u01E9\u01EB\u01ED\u01EF\u01F0\u01F3\u01F5\u01F9\u01FB\u01FD\u01FF\u0201\u0203\u0205\u0207\u0209\u020B\u020D\u020F\u0211\u0213\u0215\u0217\u0219\u021B\u021D\u021F\u0221\u0223\u0225\u0227\u0229\u022B\u022D\u022F\u0231\u0233-\u0239\u023C\u023F\u0240\u0242\u0247\u0249\u024B\u024D\u024F-\u0293\u0295-\u02AF\u0371\u0373\u0377\u037B-\u037D\u0390\u03AC-\u03CE\u03D0\u03D1\u03D5-\u03D7\u03D9\u03DB\u03DD\u03DF\u03E1\u03E3\u03E5\u03E7\u03E9\u03EB\u03ED\u03EF-\u03F3\u03F5\u03F8\u03FB\u03FC\u0430-\u045F\u0461\u0463\u0465\u0467\u0469\u046B\u046D\u046F\u0471\u0473\u0475\u0477\u0479\u047B\u047D\u047F\u0481\u048B\u048D\u048F\u0491\u0493\u0495\u0497\u0499\u049B\u049D\u049F\u04A1\u04A3\u04A5\u04A7\u04A9\u04AB\u04AD\u04AF\u04B1\u04B3\u04B5\u04B7\u04B9\u04BB\u04BD\u04BF\u04C2\u04C4\u04C6\u04C8\u04CA\u04CC\u04CE\u04CF\u04D1\u04D3\u04D5\u04D7\u04D9\u04DB\u04DD\u04DF\u04E1\u04E3\u04E5\u04E7\u04E9\u04EB\u04ED\u04EF\u04F1\u04F3\u04F5\u04F7\u04F9\u04FB\u04FD\u04FF\u0501\u0503\u0505\u0507\u0509\u050B\u050D\u050F\u0511\u0513\u0515\u0517\u0519\u051B\u051D\u051F\u0521\u0523\u0525\u0527\u0561-\u0587\u1D00-\u1D2B\u1D6B-\u1D77\u1D79-\u1D9A\u1E01\u1E03\u1E05\u1E07\u1E09\u1E0B\u1E0D\u1E0F\u1E11\u1E13\u1E15\u1E17\u1E19\u1E1B\u1E1D\u1E1F\u1E21\u1E23\u1E25\u1E27\u1E29\u1E2B\u1E2D\u1E2F\u1E31\u1E33\u1E35\u1E37\u1E39\u1E3B\u1E3D\u1E3F\u1E41\u1E43\u1E45\u1E47\u1E49\u1E4B\u1E4D\u1E4F\u1E51\u1E53\u1E55\u1E57\u1E59\u1E5B\u1E5D\u1E5F\u1E61\u1E63\u1E65\u1E67\u1E69\u1E6B\u1E6D\u1E6F\u1E71\u1E73\u1E75\u1E77\u1E79\u1E7B\u1E7D\u1E7F\u1E81\u1E83\u1E85\u1E87\u1E89\u1E8B\u1E8D\u1E8F\u1E91\u1E93\u1E95-\u1E9D\u1E9F\u1EA1\u1EA3\u1EA5\u1EA7\u1EA9\u1EAB\u1EAD\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u1EB9\u1EBB\u1EBD\u1EBF\u1EC1\u1EC3\u1EC5\u1EC7\u1EC9\u1ECB\u1ECD\u1ECF\u1ED1\u1ED3\u1ED5\u1ED7\u1ED9\u1EDB\u1EDD\u1EDF\u1EE1\u1EE3\u1EE5\u1EE7\u1EE9\u1EEB\u1EED\u1EEF\u1EF1\u1EF3\u1EF5\u1EF7\u1EF9\u1EFB\u1EFD\u1EFF-\u1F07\u1F10-\u1F15\u1F20-\u1F27\u1F30-\u1F37\u1F40-\u1F45\u1F50-\u1F57\u1F60-\u1F67\u1F70-\u1F7D\u1F80-\u1F87\u1F90-\u1F97\u1FA0-\u1FA7\u1FB0-\u1FB4\u1FB6\u1FB7\u1FBE\u1FC2-\u1FC4\u1FC6\u1FC7\u1FD0-\u1FD3\u1FD6\u1FD7\u1FE0-\u1FE7\u1FF2-\u1FF4\u1FF6\u1FF7\u210A\u210E\u210F\u2113\u212F\u2134\u2139\u213C\u213D\u2146-\u2149\u214E\u2184\u2C30-\u2C5E\u2C61\u2C65\u2C66\u2C68\u2C6A\u2C6C\u2C71\u2C73\u2C74\u2C76-\u2C7B\u2C81\u2C83\u2C85\u2C87\u2C89\u2C8B\u2C8D\u2C8F\u2C91\u2C93\u2C95\u2C97\u2C99\u2C9B\u2C9D\u2C9F\u2CA1\u2CA3\u2CA5\u2CA7\u2CA9\u2CAB\u2CAD\u2CAF\u2CB1\u2CB3\u2CB5\u2CB7\u2CB9\u2CBB\u2CBD\u2CBF\u2CC1\u2CC3\u2CC5\u2CC7\u2CC9\u2CCB\u2CCD\u2CCF\u2CD1\u2CD3\u2CD5\u2CD7\u2CD9\u2CDB\u2CDD\u2CDF\u2CE1\u2CE3\u2CE4\u2CEC\u2CEE\u2CF3\u2D00-\u2D25\u2D27\u2D2D\uA641\uA643\uA645\uA647\uA649\uA64B\uA64D\uA64F\uA651\uA653\uA655\uA657\uA659\uA65B\uA65D\uA65F\uA661\uA663\uA665\uA667\uA669\uA66B\uA66D\uA681\uA683\uA685\uA687\uA689\uA68B\uA68D\uA68F\uA691\uA693\uA695\uA697\uA723\uA725\uA727\uA729\uA72B\uA72D\uA72F-\uA731\uA733\uA735\uA737\uA739\uA73B\uA73D\uA73F\uA741\uA743\uA745\uA747\uA749\uA74B\uA74D\uA74F\uA751\uA753\uA755\uA757\uA759\uA75B\uA75D\uA75F\uA761\uA763\uA765\uA767\uA769\uA76B\uA76D\uA76F\uA771-\uA778\uA77A\uA77C\uA77F\uA781\uA783\uA785\uA787\uA78C\uA78E\uA791\uA793\uA7A1\uA7A3\uA7A5\uA7A7\uA7A9\uA7FA\uFB00-\uFB06\uFB13-\uFB17\uFF41-\uFF5A])([\u0041-\u005A\u00C0-\u00D6\u00D8-\u00DE\u0100\u0102\u0104\u0106\u0108\u010A\u010C\u010E\u0110\u0112\u0114\u0116\u0118\u011A\u011C\u011E\u0120\u0122\u0124\u0126\u0128\u012A\u012C\u012E\u0130\u0132\u0134\u0136\u0139\u013B\u013D\u013F\u0141\u0143\u0145\u0147\u014A\u014C\u014E\u0150\u0152\u0154\u0156\u0158\u015A\u015C\u015E\u0160\u0162\u0164\u0166\u0168\u016A\u016C\u016E\u0170\u0172\u0174\u0176\u0178\u0179\u017B\u017D\u0181\u0182\u0184\u0186\u0187\u0189-\u018B\u018E-\u0191\u0193\u0194\u0196-\u0198\u019C\u019D\u019F\u01A0\u01A2\u01A4\u01A6\u01A7\u01A9\u01AC\u01AE\u01AF\u01B1-\u01B3\u01B5\u01B7\u01B8\u01BC\u01C4\u01C7\u01CA\u01CD\u01CF\u01D1\u01D3\u01D5\u01D7\u01D9\u01DB\u01DE\u01E0\u01E2\u01E4\u01E6\u01E8\u01EA\u01EC\u01EE\u01F1\u01F4\u01F6-\u01F8\u01FA\u01FC\u01FE\u0200\u0202\u0204\u0206\u0208\u020A\u020C\u020E\u0210\u0212\u0214\u0216\u0218\u021A\u021C\u021E\u0220\u0222\u0224\u0226\u0228\u022A\u022C\u022E\u0230\u0232\u023A\u023B\u023D\u023E\u0241\u0243-\u0246\u0248\u024A\u024C\u024E\u0370\u0372\u0376\u0386\u0388-\u038A\u038C\u038E\u038F\u0391-\u03A1\u03A3-\u03AB\u03CF\u03D2-\u03D4\u03D8\u03DA\u03DC\u03DE\u03E0\u03E2\u03E4\u03E6\u03E8\u03EA\u03EC\u03EE\u03F4\u03F7\u03F9\u03FA\u03FD-\u042F\u0460\u0462\u0464\u0466\u0468\u046A\u046C\u046E\u0470\u0472\u0474\u0476\u0478\u047A\u047C\u047E\u0480\u048A\u048C\u048E\u0490\u0492\u0494\u0496\u0498\u049A\u049C\u049E\u04A0\u04A2\u04A4\u04A6\u04A8\u04AA\u04AC\u04AE\u04B0\u04B2\u04B4\u04B6\u04B8\u04BA\u04BC\u04BE\u04C0\u04C1\u04C3\u04C5\u04C7\u04C9\u04CB\u04CD\u04D0\u04D2\u04D4\u04D6\u04D8\u04DA\u04DC\u04DE\u04E0\u04E2\u04E4\u04E6\u04E8\u04EA\u04EC\u04EE\u04F0\u04F2\u04F4\u04F6\u04F8\u04FA\u04FC\u04FE\u0500\u0502\u0504\u0506\u0508\u050A\u050C\u050E\u0510\u0512\u0514\u0516\u0518\u051A\u051C\u051E\u0520\u0522\u0524\u0526\u0531-\u0556\u10A0-\u10C5\u10C7\u10CD\u1E00\u1E02\u1E04\u1E06\u1E08\u1E0A\u1E0C\u1E0E\u1E10\u1E12\u1E14\u1E16\u1E18\u1E1A\u1E1C\u1E1E\u1E20\u1E22\u1E24\u1E26\u1E28\u1E2A\u1E2C\u1E2E\u1E30\u1E32\u1E34\u1E36\u1E38\u1E3A\u1E3C\u1E3E\u1E40\u1E42\u1E44\u1E46\u1E48\u1E4A\u1E4C\u1E4E\u1E50\u1E52\u1E54\u1E56\u1E58\u1E5A\u1E5C\u1E5E\u1E60\u1E62\u1E64\u1E66\u1E68\u1E6A\u1E6C\u1E6E\u1E70\u1E72\u1E74\u1E76\u1E78\u1E7A\u1E7C\u1E7E\u1E80\u1E82\u1E84\u1E86\u1E88\u1E8A\u1E8C\u1E8E\u1E90\u1E92\u1E94\u1E9E\u1EA0\u1EA2\u1EA4\u1EA6\u1EA8\u1EAA\u1EAC\u1EAE\u1EB0\u1EB2\u1EB4\u1EB6\u1EB8\u1EBA\u1EBC\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6\u1EC8\u1ECA\u1ECC\u1ECE\u1ED0\u1ED2\u1ED4\u1ED6\u1ED8\u1EDA\u1EDC\u1EDE\u1EE0\u1EE2\u1EE4\u1EE6\u1EE8\u1EEA\u1EEC\u1EEE\u1EF0\u1EF2\u1EF4\u1EF6\u1EF8\u1EFA\u1EFC\u1EFE\u1F08-\u1F0F\u1F18-\u1F1D\u1F28-\u1F2F\u1F38-\u1F3F\u1F48-\u1F4D\u1F59\u1F5B\u1F5D\u1F5F\u1F68-\u1F6F\u1FB8-\u1FBB\u1FC8-\u1FCB\u1FD8-\u1FDB\u1FE8-\u1FEC\u1FF8-\u1FFB\u2102\u2107\u210B-\u210D\u2110-\u2112\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u2130-\u2133\u213E\u213F\u2145\u2183\u2C00-\u2C2E\u2C60\u2C62-\u2C64\u2C67\u2C69\u2C6B\u2C6D-\u2C70\u2C72\u2C75\u2C7E-\u2C80\u2C82\u2C84\u2C86\u2C88\u2C8A\u2C8C\u2C8E\u2C90\u2C92\u2C94\u2C96\u2C98\u2C9A\u2C9C\u2C9E\u2CA0\u2CA2\u2CA4\u2CA6\u2CA8\u2CAA\u2CAC\u2CAE\u2CB0\u2CB2\u2CB4\u2CB6\u2CB8\u2CBA\u2CBC\u2CBE\u2CC0\u2CC2\u2CC4\u2CC6\u2CC8\u2CCA\u2CCC\u2CCE\u2CD0\u2CD2\u2CD4\u2CD6\u2CD8\u2CDA\u2CDC\u2CDE\u2CE0\u2CE2\u2CEB\u2CED\u2CF2\uA640\uA642\uA644\uA646\uA648\uA64A\uA64C\uA64E\uA650\uA652\uA654\uA656\uA658\uA65A\uA65C\uA65E\uA660\uA662\uA664\uA666\uA668\uA66A\uA66C\uA680\uA682\uA684\uA686\uA688\uA68A\uA68C\uA68E\uA690\uA692\uA694\uA696\uA722\uA724\uA726\uA728\uA72A\uA72C\uA72E\uA732\uA734\uA736\uA738\uA73A\uA73C\uA73E\uA740\uA742\uA744\uA746\uA748\uA74A\uA74C\uA74E\uA750\uA752\uA754\uA756\uA758\uA75A\uA75C\uA75E\uA760\uA762\uA764\uA766\uA768\uA76A\uA76C\uA76E\uA779\uA77B\uA77D\uA77E\uA780\uA782\uA784\uA786\uA78B\uA78D\uA790\uA792\uA7A0\uA7A2\uA7A4\uA7A6\uA7A8\uA7AA\uFF21-\uFF3A\u0030-\u0039\u00B2\u00B3\u00B9\u00BC-\u00BE\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u09F4-\u09F9\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0B72-\u0B77\u0BE6-\u0BF2\u0C66-\u0C6F\u0C78-\u0C7E\u0CE6-\u0CEF\u0D66-\u0D75\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F33\u1040-\u1049\u1090-\u1099\u1369-\u137C\u16EE-\u16F0\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1946-\u194F\u19D0-\u19DA\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3007\u3021-\u3029\u3038-\u303A\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA620-\uA629\uA6E6-\uA6EF\uA830-\uA835\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19])/g

},{}],57:[function(require,module,exports){
module.exports = /[^\u0041-\u005A\u0061-\u007A\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC\u0030-\u0039\u00B2\u00B3\u00B9\u00BC-\u00BE\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u09F4-\u09F9\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0B72-\u0B77\u0BE6-\u0BF2\u0C66-\u0C6F\u0C78-\u0C7E\u0CE6-\u0CEF\u0D66-\u0D75\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F33\u1040-\u1049\u1090-\u1099\u1369-\u137C\u16EE-\u16F0\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1946-\u194F\u19D0-\u19DA\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3007\u3021-\u3029\u3038-\u303A\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA620-\uA629\uA6E6-\uA6EF\uA830-\uA835\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19]+/g

},{}],58:[function(require,module,exports){
module.exports = /([\u0030-\u0039\u00B2\u00B3\u00B9\u00BC-\u00BE\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u09F4-\u09F9\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0B72-\u0B77\u0BE6-\u0BF2\u0C66-\u0C6F\u0C78-\u0C7E\u0CE6-\u0CEF\u0D66-\u0D75\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F33\u1040-\u1049\u1090-\u1099\u1369-\u137C\u16EE-\u16F0\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1946-\u194F\u19D0-\u19DA\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3007\u3021-\u3029\u3038-\u303A\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA620-\uA629\uA6E6-\uA6EF\uA830-\uA835\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19])([^\u0030-\u0039\u00B2\u00B3\u00B9\u00BC-\u00BE\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u09F4-\u09F9\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0B72-\u0B77\u0BE6-\u0BF2\u0C66-\u0C6F\u0C78-\u0C7E\u0CE6-\u0CEF\u0D66-\u0D75\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F33\u1040-\u1049\u1090-\u1099\u1369-\u137C\u16EE-\u16F0\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1946-\u194F\u19D0-\u19DA\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3007\u3021-\u3029\u3038-\u303A\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA620-\uA629\uA6E6-\uA6EF\uA830-\uA835\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19])/g

},{}],59:[function(require,module,exports){
/**
 * @module settings-panel
 */
'use strict';

var Emitter = require('events').EventEmitter;
var inherits = require('inherits');
var extend = require('just-extend');
var css = require('dom-css');
var uid = require('get-uid');

var insertCss = require('insert-styles');
var isPlainObject = require('is-plain-obj');
var format = require('param-case');
var px = require('add-px-to-style');
var scopeCss = require('scope-css');

module.exports = Panel


insertCss(".settings-panel {\r\n\tposition: relative;\r\n\t-webkit-user-select: none;\r\n\t-moz-user-select: none;\r\n\t-ms-user-select: none;\r\n\tuser-select: none;\r\n\tcursor: default;\r\n\ttext-align: left;\r\n\tbox-sizing: border-box;\r\n\tfont-family: sans-serif;\r\n\tfont-size: 1rem;\r\n\twidth: 32em;\r\n\tmax-width: 100%;\r\n\tpadding: 1em;\r\n}\r\n\r\n.settings-panel [hidden] {\r\n\tdisplay: none!important;\r\n}\r\n\r\n.settings-panel * {\r\n\tbox-sizing: border-box;\r\n}\r\n\r\n.settings-panel svg {\r\n\tfill: currentColor;\r\n\tmax-width: 100%;\r\n\tmax-height: 100%;\r\n\tdisplay: inline-block;\r\n}\r\n\r\n.settings-panel input,\r\n.settings-panel button,\r\n.settings-panel textarea,\r\n.settings-panel select {\r\n\tfont-family: inherit;\r\n\tfont-size: inherit;\r\n}\r\n\r\n.settings-panel textarea {\r\n\tmax-height: 8em;\r\n}\r\n\r\n\r\n.settings-panel a {\r\n\tcolor: inherit;\r\n\ttext-decoration: none;\r\n}\r\n\r\n/** Basic layout */\r\n.settings-panel-field {\r\n\tposition: relative;\r\n\tpadding: .25em;\r\n\tdisplay: table;\r\n\twidth: 100%;\r\n}\r\n.settings-panel-field:last-child {\r\n\tmargin-bottom: 0;\r\n}\r\n.settings-panel-label {\r\n\tleft: 0;\r\n\tdisplay: table-cell;\r\n\tline-height: 1.2;\r\n\tvertical-align: baseline;\r\n\tpadding-top: 0;\r\n\tmax-width: 100%;\r\n}\r\n.settings-panel-input {\r\n\tdisplay: table-cell;\r\n\tvertical-align: baseline;\r\n\tposition: relative;\r\n\twhite-space: nowrap;\r\n}\r\n\r\n.settings-panel-orientation-left .settings-panel-label {\r\n\twidth: 9em;\r\n\tpadding-right: .5em;\r\n}\r\n.settings-panel-orientation-right .settings-panel-label {\r\n\tdisplay: block;\r\n\tmargin-right: 0;\r\n\tfloat: right;\r\n\twidth: 9em;\r\n\tpadding-top: .4em;\r\n\tpadding-left: .5em;\r\n}\r\n.settings-panel-orientation-right .settings-panel-label + .settings-panel-input {\r\n\tdisplay: block;\r\n\twidth: calc(100% - 9em);\r\n}\r\n.settings-panel-orientation-top .settings-panel-label {\r\n\tdisplay: block;\r\n\twidth: 100%;\r\n\tmargin-right: 0;\r\n\tpadding-top: 0;\r\n\tline-height: 1.5;\r\n}\r\n.settings-panel-orientation-top .settings-panel-label + .settings-panel-input {\r\n\tdisplay: block;\r\n\twidth: 100%;\r\n\tpadding: 0;\r\n}\r\n.settings-panel-orientation-bottom .settings-panel-label {\r\n\tdisplay: block;\r\n\twidth: 100%;\r\n\tmargin-right: 0;\r\n\tpadding: 0;\r\n\tline-height: 1.5;\r\n\tborder-top: 2.5em solid transparent;\r\n}\r\n.settings-panel-orientation-bottom .settings-panel-label + .settings-panel-input {\r\n\twidth: 100%;\r\n\tposition: absolute;\r\n\ttop: 0;\r\n}\r\n\r\n.settings-panel-orientation-left > .settings-panel-label {\r\n\twidth: 9em;\r\n\tdisplay: table-cell;\r\n}\r\n\r\n.settings-panel-title {\r\n\tfont-size: 1.6em;\r\n\tline-height: 1.25;\r\n\tmargin-top: 0;\r\n\tmargin-bottom: 0;\r\n\tpadding: .25em .25em;\r\n\ttext-align: center;\r\n}\r\n.settings-panel--collapsible .settings-panel-title {\r\n\tcursor: pointer;\r\n}\r\n.settings-panel--collapsed > *:not(.settings-panel-title) {\r\n\tdisplay: none!important;\r\n}\r\n\r\n\r\n/** Button */\r\n.settings-panel-field--button {\r\n\tdisplay: inline-block;\r\n}\r\n.settings-panel-field--button .settings-panel-input {\r\n\tdisplay: block;\r\n\ttext-align: center;\r\n}\r\n.settings-panel-button {\r\n\tvertical-align: baseline;\r\n\tline-height: 1;\r\n\tmin-height: 2em;\r\n\tpadding: .2em 1em;\r\n\twidth: 100%;\r\n\tcursor: pointer;\r\n}\r\n\r\n\r\n/** Default text and alike style */\r\n.settings-panel-text {\r\n\theight: 2em;\r\n\twidth: 100%;\r\n\tvertical-align: baseline;\r\n}\r\n.settings-panel-textarea {\r\n\twidth: 100%;\r\n\tdisplay: block;\r\n\tvertical-align: top; /* allowable as we use autoheight */\r\n\tmin-height: 2em;\r\n}\r\n\r\n/** Checkbox style */\r\n.settings-panel-field--checkbox .settings-panel-input {\r\n\tline-height: 2em;\r\n}\r\n.settings-panel-checkbox-group {\r\n\tborder: none;\r\n\t-webkit-appearance: none;\r\n\t-moz-appearance: none;\r\n\t-o-appearance: none;\r\n\tappearance: none;\r\n\tmargin: 0;\r\n\tpadding: 0;\r\n\twhite-space: normal;\r\n}\r\n.settings-panel-checkbox {\r\n\tdisplay: inline-block;\r\n\tvertical-align: middle;\r\n\twidth: 1.2em;\r\n\theight: 1.2em;\r\n\tline-height: 1.2em;\r\n\tmargin: -.15em .25em 0 0;\r\n}\r\n.settings-panel-checkbox-label {\r\n\tdisplay: inline-block;\r\n\tvertical-align: baseline;\r\n\t-webkit-user-select: none;\r\n\t-moz-user-select: none;\r\n\t-ms-user-select: none;\r\n\tuser-select: none;\r\n\tline-height: 1.2;\r\n\tmargin-right: 1em;\r\n}\r\n.settings-panel-checkbox-group .settings-panel-checkbox-label:last-child {\r\n\tmargin-right: 0;\r\n}\r\n\r\n\r\n/** Color picker style */\r\n.settings-panel-color {\r\n\tposition: relative;\r\n\twidth: 2em;\r\n\theight: 2em;\r\n\tposition: absolute;\r\n\ttop: 0;\r\n\tbottom: 0;\r\n\tmargin: auto;\r\n}\r\n.settings-panel-color-value {\r\n\twidth: 100%;\r\n\theight: 2em;\r\n\tpadding: 0 0 0 2.5em;\r\n}\r\n.settings-panel .Scp {\r\n\t-webkit-user-select: none;\r\n\t-moz-user-select: none;\r\n\t-ms-user-select: none;\r\n\tuser-select: none;\r\n\tposition: absolute;\r\n\tz-index: 10;\r\n\tcursor: pointer;\r\n\tbottom: -120px;\r\n}\r\n.settings-panel .Scp-saturation {\r\n\tposition: relative;\r\n\twidth: calc(100% - 25px);\r\n\theight: 100%;\r\n\tbackground: linear-gradient(to right, #fff 0%, #f00 100%);\r\n\tfloat: left;\r\n}\r\n.settings-panel .Scp-brightness {\r\n\twidth: 100%;\r\n\theight: 100%;\r\n\tbackground: linear-gradient(to top, #000 0%, rgba(255,255,255,0) 100%);\r\n}\r\n.settings-panel .Scp-sbSelector {\r\n\tborder: 1px solid;\r\n\tposition: absolute;\r\n\twidth: 14px;\r\n\theight: 14px;\r\n\tbackground: #fff;\r\n\tborder-radius: 10px;\r\n\ttop: -7px;\r\n\tleft: -7px;\r\n\tbox-sizing: border-box;\r\n\tz-index: 10;\r\n}\r\n.settings-panel .Scp-hue {\r\n\twidth: 20px;\r\n\theight: 100%;\r\n\tposition: relative;\r\n\tfloat: left;\r\n\tbackground: linear-gradient(to bottom, #f00 0%, #f0f 17%, #00f 34%, #0ff 50%, #0f0 67%, #ff0 84%, #f00 100%);\r\n}\r\n.settings-panel .Scp-hSelector {\r\n\tposition: absolute;\r\n\tbackground: #fff;\r\n\tborder-bottom: 1px solid #000;\r\n\tright: -3px;\r\n\twidth: 10px;\r\n\theight: 2px;\r\n}\r\n\r\n\r\n\r\n/** Interval style */\r\n.settings-panel-interval {\r\n\tposition: relative;\r\n\t-webkit-appearance: none;\r\n\tdisplay: inline-block;\r\n\tvertical-align: top;\r\n\theight: 2em;\r\n\tmargin: 0px 0;\r\n\twidth: 70%;\r\n\tbackground: #ddd;\r\n\tcursor: ew-resize;\r\n\t-webkit-touch-callout: none;\r\n\t-webkit-user-select: none;\r\n\t-khtml-user-select: none;\r\n\t-moz-user-select: none;\r\n\t-ms-user-select: none;\r\n\tuser-select: none;\r\n}\r\n.settings-panel-interval-handle {\r\n\tbackground: #7a4;\r\n\tposition: absolute;\r\n\ttop: 0;\r\n\tbottom: 0;\r\n\tmin-width: 1px;\r\n}\r\n.settings-panel.settings-panel-interval-dragging * {\r\n\t-webkit-touch-callout: none !important;\r\n\t-webkit-user-select: none !important;\r\n\t-khtml-user-select: none !important;\r\n\t-moz-user-select: none !important;\r\n\t-ms-user-select: none !important;\r\n\tuser-select: none !important;\r\n\r\n\tcursor: ew-resize !important;\r\n}\r\n\r\n.settings-panel-interval + .settings-panel-value {\r\n\tright: 0;\r\n\tpadding-left: .5em;\r\n}\r\n\r\n\r\n\r\n/** Select style */\r\n.settings-panel-select {\r\n\tdisplay: inline-block;\r\n\twidth: 100%;\r\n\theight: 2em;\r\n\tvertical-align: baseline;\r\n}\r\n\r\n/** Value style */\r\n.settings-panel-value {\r\n\t-webkit-appearance: none;\r\n\t-moz-appearance: none;\r\n\t-o-appearance: none;\r\n\tappearance: none;\r\n\tmin-width: 3em;\r\n\tpadding: 0 0 0 0em;\r\n\tdisplay: inline-block;\r\n\tvertical-align: baseline;\r\n\tcursor: text;\r\n\theight: 2em;\r\n\tborder: none;\r\n\tborder-radius: 0;\r\n\toutline: none;\r\n\tfont-family: inherit;\r\n\tbackground: none;\r\n\tcolor: inherit;\r\n\twidth: 15%;\r\n}\r\n.settings-panel-value:focus {\r\n\toutline: 0;\r\n\tbox-shadow: 0;\r\n}\r\n.settings-panel-value-tip {\r\n\tdisplay: none;\r\n}\r\n\r\n/** Range style */\r\n.settings-panel-range {\r\n\twidth: 85%;\r\n\tpadding: 0;\r\n\tmargin: 0px 0;\r\n\theight: 2em;\r\n\tvertical-align: top;\r\n}\r\n.settings-panel-range + .settings-panel-value {\r\n\tpadding-left: .5em;\r\n\twidth: 15%;\r\n}\r\n\r\n.settings-panel-switch {\r\n\t-webkit-appearance: none;\r\n\t-moz-appearance: none;\r\n\tappearance: none;\r\n\tborder: none;\r\n\tdisplay: block;\r\n\tvertical-align: baseline;\r\n\tpadding: 0;\r\n\tmargin: 0;\r\n\tline-height: 2em;\r\n}\r\n.settings-panel-switch-input {\r\n\tmargin: 0;\r\n\tvertical-align: middle;\r\n\twidth: 1.2em;\r\n\theight: 1.2em;\r\n\tcursor: pointer;\r\n\tmargin-right: .25em;\r\n}\r\n.settings-panel-switch-label {\r\n\tdisplay: inline-block;\r\n\tvertical-align: baseline;\r\n\tline-height: 1.2;\r\n\tmargin-right: 1em;\r\n}\r\n\r\n\r\n.settings-panel hr {\r\n\tborder: none;\r\n\theight: 0;\r\n\tmargin: .5em 0;\r\n\tborder-bottom: 1px dotted;\r\n}\r\n\r\n.settings-panel-field--disabled {\r\n\topacity: .5;\r\n\tpointer-events: none;\r\n}");


/**
 * @constructor
 */
function Panel (items, opts) {
	var this$1 = this;

	if (!(this instanceof Panel)) return new Panel(items, opts)

	extend(this, opts);

	//ensure container
	if (this.container === undefined) this.container = document.body || document.documentElement;

	this.container.classList.add('settings-panel-container');

	//create element
	if (!this.id) this.id = uid();
	this.element = document.createElement('div')
	this.element.className = 'settings-panel settings-panel-' + this.id;
	if (this.className) this.element.className += ' ' + this.className;

	//create title
	if (this.title) {
		this.titleEl = this.element.appendChild(document.createElement('h2'));
		this.titleEl.className = 'settings-panel-title';
	}

	//create collapse button
	if (this.collapsible && this.title) {
		// this.collapseEl = this.element.appendChild(document.createElement('div'));
		// this.collapseEl.className = 'settings-panel-collapse';
		this.element.classList.add('settings-panel--collapsible');
		this.titleEl.addEventListener('click', function () {
			if (this$1.collapsed) {
				this$1.collapsed = false;
				this$1.element.classList.remove('settings-panel--collapsed');
			}
			else {
				this$1.collapsed = true;
				this$1.element.classList.add('settings-panel--collapsed');
			}
		});
	}

	//state is values of items
	this.state = {};

	//items is all items settings
	this.items = {};

	//create fields
	this.set(items);

	if (this.container) {
		this.container.appendChild(this.element)
	}

	//create theme style
	this.update();
}

inherits(Panel, Emitter);


/**
 * Set item value/options
 */
Panel.prototype.set = function (name, value) {
	var this$1 = this;

	//handle list of properties
	if (Array.isArray(name)) {
		var items = name;
		items.forEach(function (item) {
			this$1.set(item.id || item.label, item);
		});

		return this;
	}

	//handle plain object
	if (isPlainObject(name)) {
		var items$1 = name;
		var list = [];
		for (var key in items$1) {
			if (!isPlainObject(items$1[key])) {
				items$1[key] = {value: items$1[key]};
			}
			if (items$1[key].id == null) items$1[key].id = key;
			list.push(items$1[key]);
		}
		list = list.sort(function (a, b) { return (a.order||0) - (b.order||0); });

		return this.set(list);
	}

	//format name
	name = name || '';
	name = name.replace(/\-/g,'dash-');
	name = format(name);

	if (name) {
		var item = this.items[name];
		if (!item) item = this.items[name] = { id: name, panel: this };
	}
	//noname items should not be saved in state
	else {
		var item = {id: null, panel: this};
	}

	var initialValue = item.value;
	var isBefore = item.before;
	var isAfter = item.after;

	if (isPlainObject(value)) {
		item = extend(item, value);
	}
	else {
		//ignore nothing-changed set
		if (value === item.value && value !== undefined) return this;
		item.value = value;
	}

	if (item.value === undefined) item.value = item.default;

	if (name) this.state[name] = item.value;

	//define label via name
	if (item.label === undefined && item.id) {
		item.label = item.id;
	}

	//detect type
	if (!item.type) {
		if (item.value && Array.isArray(item.value)) {
			if (typeof item.value[0] === 'string') {
				item.type = 'checkbox';
			}
			else {
				item.type = 'interval'
			}
		} else if (item.scale || item.max || item.steps || item.step || typeof item.value === 'number') {
			item.type = 'range'
		} else if (item.options) {
			if (Array.isArray(item.options) && item.options.join('').length < 90 ) {
				item.type = 'switch'
			}
			else {
				item.type = 'select'
			}
		} else if (item.format) {
			item.type = 'color'
		} else if (typeof item.value === 'boolean') {
			item.type = 'checkbox'
		} else if (item.content != null) {
			item.type = 'raw'
		} else {
			if (item.value && (item.value.length > 140 || /\n/.test(item.value))) {
				item.type = 'textarea'
			}
			else {
				item.type = 'text'
			}
		}
	}

	var field, fieldId;

	if (item.id != null) {
		fieldId = 'settings-panel-field-' + item.id;
		field = this.element.querySelector('#' + fieldId);
	}

	//create field container
	if (!field) {
		field = document.createElement('div');
		if (fieldId != null) field.id = fieldId;
		this.element.appendChild(field);
		item.field = field;
	}
	else {
		//clean previous before/after
		if (isBefore) {
			this.element.removeChild(field.prevSibling);
		}
		if (isAfter) {
			this.element.removeChild(field.nextSibling);
		}
	}

	field.className = 'settings-panel-field settings-panel-field--' + item.type;

	if (item.orientation) field.className += ' settings-panel-orientation-' + item.orientation;

	if (item.className) field.className += ' ' + item.className;

	if (item.style) {
		if (isPlainObject(item.style)) {
			css(field, item.style);
		}
		else if (typeof item.style === 'string') {
			field.style.cssText = item.style;
		}
	}
	else if (item.style !== undefined) {
		field.style = null;
	}

	if (item.hidden) {
		field.setAttribute('hidden', true);
	}
	else {
		field.removeAttribute('hidden');
	}

	//createe container for the input
	var inputContainer = field.querySelector('.settings-panel-input');

	if (!inputContainer) {
		inputContainer = document.createElement('div');
		inputContainer.className = 'settings-panel-input';
		item.container = inputContainer;
		field.appendChild(inputContainer);
	}

	if (item.disabled) field.className += ' settings-panel-field--disabled';

	var components = this.components;
	var component = item.component;

	if (!component) {
		item.component = component = (components[item.type] || components.text)(item);

		if (component.on) {
			component.on('init', function (data) {
				item.value = data
				if (item.id) this$1.state[item.id] = item.value;
				var state = extend({}, this$1.state);

				item.init && item.init(data, state)
				this$1.emit('init', item.id, data, state)
				item.change && item.change(data, state)
				this$1.emit('change', item.id, data, state)
			});

			component.on('input', function (data) {
				item.value = data
				if (item.id) this$1.state[item.id] = item.value;
				var state = extend({}, this$1.state);

				item.input && item.input(data, state)
				this$1.emit('input', item.id, data, state)
				item.change && item.change(data, state)
				this$1.emit('change', item.id, data, state)
			});

			component.on('action', function () {
				var state = extend({}, this$1.state);
				item.action && item.action(state);
			});

			component.on('change', function (data) {
				item.value = data
				if (item.id) this$1.state[item.id] = item.value;
				var state = extend({}, this$1.state);

				item.change && item.change(data, state)
				this$1.emit('change', item.id, data, state)
			});
		}
	}
	else {
		component.update(item);
	}

	//create field label
	if (component.label !== false && (item.label || item.label === '')) {
		var label = field.querySelector('.settings-panel-label');
		if (!label) {
			label = document.createElement('label')
			label.className = 'settings-panel-label';
			field.insertBefore(label, inputContainer);
		}

		label.htmlFor = item.id;
		label.innerHTML = item.label;
		label.title = item.title || item.label;
	}

	//handle after and before
	// if (item.before) {
	// 	let before = item.before;
	// 	if (before instanceof Function) {
	// 		before = item.before.call(item, component);
	// 	}
	// 	if (before instanceof HTMLElement) {
	// 		this.element.insertBefore(before, field);
	// 	}
	// 	else {
	// 		field.insertAdjacentHTML('beforebegin', before);
	// 	}
	// }
	// if (item.after) {
	// 	let after = item.after;
	// 	if (after instanceof Function) {
	// 		after = item.after.call(item, component);
	// 	}
	// 	if (after instanceof HTMLElement) {
	// 		this.element.insertBefore(after, field.nextSibling);
	// 	}
	// 	else {
	// 		field.insertAdjacentHTML('afterend', after);
	// 	}
	// }

	//emit change
	if (initialValue !== item.value) {
		this.emit('change', item.id, item.value, this.state)
	}

	return this;
}


/**
 * Return property value or a list
 */
Panel.prototype.get = function (name) {
	if (name == null) return this.state;
	return this.state[name];
}


/**
 * Update theme
 */
Panel.prototype.update = function (opts) {
	extend(this, opts);

	//FIXME: decide whether we have to reset these params
	// if (opts && opts.theme) {
	// 	if (opts.theme.fontSize) this.fontSize = opts.theme.fontSize;
	// 	if (opts.theme.inputHeight) this.inputHeight = opts.theme.inputHeight;
	// 	if (opts.theme.fontFamily) this.fontFamily = opts.theme.fontFamily;
	// 	if (opts.theme.labelWidth) this.labelWidth = opts.theme.labelWidth;
	// 	if (opts.theme.palette) this.palette = opts.theme.palette;
	// }

	//update title, if any
	if (this.titleEl) this.titleEl.innerHTML = this.title;

	//update orientation
	this.element.classList.remove('settings-panel-orientation-top');
	this.element.classList.remove('settings-panel-orientation-bottom');
	this.element.classList.remove('settings-panel-orientation-left');
	this.element.classList.remove('settings-panel-orientation-right');
	this.element.classList.add('settings-panel-orientation-' + this.orientation);

	//apply style
	var cssStr = '';
	if (this.theme instanceof Function) {
		cssStr = this.theme.call(this, this);
	}
	else if (typeof this.theme === 'string') {
		cssStr = this.theme;
	}

	//append extra css
	if (this.css) {
		if (this.css instanceof Function) {
			cssStr += this.css.call(this, this);
		}
		else if (typeof this.css === 'string') {
			cssStr += this.css;
		}
	}

	//scope each rule
	cssStr = scopeCss(cssStr || '', '.settings-panel-' + this.id) || '';

	insertCss(cssStr.trim(), {
		id: this.id
	});

	if (this.style) {
		if (isPlainObject(this.style)) {
			css(this.element, this.style);
		}
		else if (typeof this.style === 'string') {
			this.element.style.cssText = this.style;
		}
	}
	else if (this.style !== undefined) {
		this.element.style = null;
	}

	return this;
}

//instance theme
Panel.prototype.theme = require('./theme/none');

/**
 * Registered components
 */
Panel.prototype.components = {
	range: require('./src/range'),

	button: require('./src/button'),
	text: require('./src/text'),
	textarea: require('./src/textarea'),

	checkbox: require('./src/checkbox'),
	toggle: require('./src/checkbox'),

	switch: require('./src/switch'),

	color: require('./src/color'),

	interval: require('./src/interval'),
	multirange: require('./src/interval'),

	custom: require('./src/custom'),
	raw: require('./src/custom'),

	select: require('./src/select')
};


/**
 * Additional class name
 */
Panel.prototype.className;


/**
 * Additional visual setup
 */
Panel.prototype.orientation = 'left';


/** Display collapse button */
Panel.prototype.collapsible = false;
},{"./src/button":63,"./src/checkbox":64,"./src/color":65,"./src/custom":66,"./src/interval":67,"./src/range":68,"./src/select":69,"./src/switch":70,"./src/text":71,"./src/textarea":72,"./theme/none":74,"add-px-to-style":3,"dom-css":14,"events":1,"get-uid":21,"inherits":23,"insert-styles":29,"is-plain-obj":33,"just-extend":35,"param-case":51,"scope-css":54}],60:[function(require,module,exports){
/**
 * Clamp value.
 * Detects proper clamp min/max.
 *
 * @param {number} a Current value to cut off
 * @param {number} min One side limit
 * @param {number} max Other side limit
 *
 * @return {number} Clamped value
 */

module.exports = require('./wrap')(function(a, min, max){
	return max > min ? Math.max(Math.min(a,max),min) : Math.max(Math.min(a,min),max);
});
},{"./wrap":62}],61:[function(require,module,exports){
/**
 * @module  mumath/precision
 *
 * Get precision from float:
 *
 * @example
 * 1.1 → 1, 1234 → 0, .1234 → 4
 *
 * @param {number} n
 *
 * @return {number} decimap places
 */

module.exports = require('./wrap')(function(n){
	var s = n + '',
		d = s.indexOf('.') + 1;

	return !d ? 0 : s.length - d;
});
},{"./wrap":62}],62:[function(require,module,exports){
/**
 * Get fn wrapped with array/object attrs recognition
 *
 * @return {Function} Target function
 */
module.exports = function(fn){
	return function (a) {
		var this$1 = this;

		var args = arguments;
		if (a instanceof Array) {
			var result = new Array(a.length), slice;
			for (var i = 0; i < a.length; i++){
				slice = [];
				for (var j = 0, l = args.length, val; j < l; j++){
					val = args[j] instanceof Array ? args[j][i] : args[j];
					val = val;
					slice.push(val);
				}
				result[i] = fn.apply(this$1, slice);
			}
			return result;
		}
		else if (typeof a === 'object') {
			var result = {}, slice;
			for (var i in a){
				slice = [];
				for (var j = 0, l = args.length, val; j < l; j++){
					val = typeof args[j] === 'object' ? args[j][i] : args[j];
					val = val;
					slice.push(val);
				}
				result[i] = fn.apply(this$1, slice);
			}
			return result;
		}
		else {
			return fn.apply(this, args);
		}
	};
};
},{}],63:[function(require,module,exports){
'use strict';

var EventEmitter = require('events').EventEmitter
var inherits = require('inherits')

module.exports = Button
inherits(Button, EventEmitter)

function Button (opts) {
	var this$1 = this;

	if (!(this instanceof Button)) return new Button(opts)

	var input = opts.container.querySelector('.settings-panel-button');
	if (!input) {
		this.element = input = opts.container.appendChild(document.createElement('button'))
		input.className = 'settings-panel-button';
		input.addEventListener('click', function (e) {
			e.preventDefault();
			this$1.emit('input');
			this$1.emit('action');
		})
	}

	this.update(opts);
}

Button.prototype.update = function (opts) {
	this.element.innerHTML = opts.value || opts.label;
	return this;
};

Button.prototype.label = false;
},{"events":1,"inherits":23}],64:[function(require,module,exports){
'use strict';

var EventEmitter = require('events').EventEmitter
var inherits = require('inherits')
var format = require('param-case')
var extend = require('just-extend');

module.exports = Checkbox
inherits(Checkbox, EventEmitter)

function Checkbox (opts) {
	var this$1 = this;

	if (!(this instanceof Checkbox)) return new Checkbox(opts)

	var that = this;

	if (!this.group) {
		this.group = document.createElement('fieldset');
		this.group.className = 'settings-panel-checkbox-group';
		opts.container.appendChild(this.group);
	}

	//detect multiple options from array value
	if (!opts.options && Array.isArray(opts.value)) {
		opts.options = opts.value;
	}

	//single checkbox
	if (!opts.options) {
		var input = this.group.querySelector('.settings-panel-checkbox');
		var label = this.group.querySelector('.settings-panel-checkbox-label');
		if (!input) {
			this.element = input = this.group.appendChild(document.createElement('input'));
			input.className = 'settings-panel-checkbox';
			this.labelEl = label = this.group.appendChild(document.createElement('label'));
			this.labelEl.innerHTML = '&nbsp;';
			label.className = 'settings-panel-checkbox-label';
			input.onchange = function (data) {
				that.emit('input', data.target.checked)
			}
			setTimeout(function () {
				that.emit('init', input.checked)
			})
		}
	}
	//multiple checkboxes
	else {
		var html = '';

		if (Array.isArray(opts.options)) {
			for (var i = 0; i < opts.options.length; i++) {
				var option = opts.options[i]
				html += createOption(option, option);
			}
		} else {
			for (var key in opts.options) {
				html += createOption(opts.options[key], key);
			}
		}

		this.group.innerHTML = html;

		this.group.addEventListener('change', function () {
			this$1.emit('input', getState());
		});
		setTimeout(function () {
			this$1.emit('init', getState());
		});
	}

	function getState () {
		var v = [];
		[].slice.call(that.group.querySelectorAll('.settings-panel-checkbox')).forEach(function (el) {
			if (el.checked) v.push(el.getAttribute('data-value'));
		});
		return v;
	}

	function createOption (label, value) {
		var htmlFor = "settings-panel-" + (format(opts.panel.id)) + "-" + (format(opts.id)) + "-input-" + (format(value));

		var html = "<input type=\"checkbox\" class=\"settings-panel-checkbox\" " + (value === opts.value ? 'checked' : '') + " id=\"" + htmlFor + "\" name=\"" + (format(opts.id)) + "\" data-value=\"" + value + "\" title=\"" + value + "\"/><label for=\"" + htmlFor + "\" class=\"settings-panel-checkbox-label\" title=\"" + value + "\">" + label + "</label>";
		return html;
	}

	this.update(opts);
}

Checkbox.prototype.update = function (opts) {
	var this$1 = this;

	extend(this, opts);

	if (!this.options) {
		this.labelEl.htmlFor = this.id
		this.element.id = this.id
		this.element.type = 'checkbox';
		this.element.checked = !!this.value;
	}
	else {
		if (!Array.isArray(this.value)) this.value = [this.value];
		var els = [].slice.call(this.group.querySelectorAll('.settings-panel-checkbox'));
		els.forEach(function (el) {
			if (this$1.value.indexOf(el.getAttribute('data-value')) >= 0) {
				el.checked = true;
			}
			else {
				el.checked = false;
			}
		});
	}

	this.group.disabled = !!this.disabled;

	return this;
}
},{"events":1,"inherits":23,"just-extend":35,"param-case":51}],65:[function(require,module,exports){
'use strict';

var EventEmitter = require('events').EventEmitter
var ColorPicker = require('simple-color-picker')
var inherits = require('inherits')
var css = require('dom-css')
var tinycolor = require('tinycolor2')
var formatParam = require('param-case')
var num = require('input-number')

module.exports = Color
inherits(Color, EventEmitter)

function Color (opts) {
	if (!(this instanceof Color)) return new Color(opts)

	this.update(opts);
}

Color.prototype.update = function (opts) {
	var this$1 = this;

	opts.container.innerHTML = '';

	opts = opts || {}
	opts.format = opts.format || 'rgb'
	opts.value = opts.value || '#123456';
	var icon = opts.container.appendChild(document.createElement('div'))
	//FIXME: this needed to make el vertical-aligned by baseline
	icon.innerHTML = '&nbsp;';
	icon.className = 'settings-panel-color'

	var valueInput = opts.container.appendChild(document.createElement('input'));
	valueInput.id = opts.id;
	valueInput.className = 'settings-panel-color-value';
	num(valueInput);
	valueInput.onchange = function () {
		picker.setColor(valueInput.value);
	};
	valueInput.oninput = function () {
		picker.setColor(valueInput.value);
	};

	if (opts.readonly) {
		valueInput.setAttribute('readonly', true);
	}


	var initial = opts.value
	switch (opts.format) {
		case 'rgb':
			initial = tinycolor(initial).toHexString()
			break
		case 'hex':
			initial = tinycolor(initial).toHexString()
			break
		case 'array':
			initial = tinycolor.fromRatio({r: initial[0], g: initial[1], b: initial[2]}).toHexString()
			break
		default:
			break
	}

	var picker = new ColorPicker({
		el: icon,
		color: initial,
		width: 160,
		height: 120
	});

	picker.$el.style.display = 'none';

	if (!opts.readonly) {
		icon.onmouseover = function () {
			picker.$el.style.display = ''
		}
		icon.onmouseout = function (e) {
			picker.$el.style.display = 'none'
		}
	}

	setTimeout(function () {
		this$1.emit('init', initial)
	});

	picker.onChange(function (hex) {
		var v = format(hex);
		if (v !== valueInput.value) valueInput.value = v;
		css(icon, {backgroundColor: hex})
		this$1.emit('input', format(hex))
	})

	function format (hex) {
		switch (opts.format) {
			case 'rgb':
				return tinycolor(hex).toRgbString()
			case 'hex':
				return tinycolor(hex).toHexString()
			case 'array':
				var rgb = tinycolor(hex).toRgb()
				return [rgb.r / 255, rgb.g / 255, rgb.b / 255].map(function (x) {
					return x.toFixed(2)
				})
			default:
				return hex
		}
	};

	return this;
}
},{"dom-css":14,"events":1,"inherits":23,"input-number":24,"param-case":51,"simple-color-picker":76,"tinycolor2":78}],66:[function(require,module,exports){
/**
 * @module  settings-panel/src/custom
 *
 * A custom html component
 */

'use strict';

var EventEmitter = require('events').EventEmitter
var inherits = require('inherits')
var extend = require('just-extend')

module.exports = Custom
inherits(Custom, EventEmitter)

function Custom (opts) {
	if (!(this instanceof Custom)) return new Custom(opts);

	//FIXME: these guys force unnecessary events, esp if element returns wrong value
	// opts.container.addEventListener('input', (e) => {
	// 	this.emit('input', e.target.value);
	// });
	// opts.container.addEventListener('change', (e) => {
	// 	this.emit('change', e.target.value);
	// });

	this.update(opts);
}

Custom.prototype.update = function (opts) {
	extend(this, opts);
	var el = this.content;
	if (this.content instanceof Function) {
		el = this.content(this);
		if (!el) return;

		if (typeof el === 'string') {
			this.container.innerHTML = el;
		}
		else if (!this.container.contains(el)) {
			this.container.appendChild(el);
		}
	}
	else if (typeof this.content === 'string') {
		this.container.innerHTML = el;
	}
	else if (this.content instanceof Element && (!this.container.contains(el))) {
		this.container.appendChild(el);
	}
	else {
		//empty content is allowable, in case if user wants to show only label for example
		// throw Error('`content` should be a function returning html element or string');
	}
};
},{"events":1,"inherits":23,"just-extend":35}],67:[function(require,module,exports){
'use strict';

var isNumeric = require('is-numeric')
var css = require('dom-css')
var isMobile = require('is-mobile')()
var format = require('param-case')
var clamp = require('mumath/clamp')
var EventEmitter = require('events').EventEmitter
var inherits = require('inherits');
var precision = require('mumath/precision');

module.exports = Range

inherits(Range, EventEmitter);

function Range (opts) {
	if (!(this instanceof Range)) return new Range(opts);

	this.update(opts);
}

Range.prototype.update = function (opts) {
	var this$1 = this;

	var self = this
	var scaleValue, scaleValueInverse, logmin, logmax, logsign, input, handle, panel;

	if (!!opts.step && !!opts.steps) {
		throw new Error('Cannot specify both step and steps. Got step = ' + opts.step + ', steps = ', opts.steps)
	}

	opts.container.innerHTML = '';

	if (opts.step) {
		var prec = precision(opts.step) || 1;
	}
	else {
		var prec = precision( (opts.max - opts.min) / opts.steps ) || 1;
	}

	// Create scale functions for converting to/from the desired scale:
	if (opts.scale === 'log' || opts.log) {
		scaleValue = function (x) {
			return logsign * Math.exp(Math.log(logmin) + (Math.log(logmax) - Math.log(logmin)) * x / 100)
		}
		scaleValueInverse = function (y) {
			return (Math.log(y * logsign) - Math.log(logmin)) * 100 / (Math.log(logmax) - Math.log(logmin))
		}
	} else {
		scaleValue = scaleValueInverse = function (x) { return x }
	}

	if (!Array.isArray(opts.value)) {
		opts.value = []
	}
	if (opts.scale === 'log' || opts.log) {
		// Get options or set defaults:
		opts.max = (isNumeric(opts.max)) ? opts.max : 100
		opts.min = (isNumeric(opts.min)) ? opts.min : 0.1

		// Check if all signs are valid:
		if (opts.min * opts.max <= 0) {
			throw new Error('Log range min/max must have the same sign and not equal zero. Got min = ' + opts.min + ', max = ' + opts.max)
		} else {
			// Pull these into separate variables so that opts can define the *slider* mapping
			logmin = opts.min
			logmax = opts.max
			logsign = opts.min > 0 ? 1 : -1

			// Got the sign so force these positive:
			logmin = Math.abs(logmin)
			logmax = Math.abs(logmax)

			// These are now simply 0-100 to which we map the log range:
			opts.min = 0
			opts.max = 100

			// Step is invalid for a log range:
			if (isNumeric(opts.step)) {
				throw new Error('Log may only use steps (integer number of steps), not a step value. Got step =' + opts.step)
			}
			// Default step is simply 1 in linear slider space:
			opts.step = 1
		}

		opts.value = [
			scaleValueInverse(isNumeric(opts.value[0]) ? opts.value[0] : scaleValue(opts.min + (opts.max - opts.min) * 0.25)),
			scaleValueInverse(isNumeric(opts.value[1]) ? opts.value[1] : scaleValue(opts.min + (opts.max - opts.min) * 0.75))
		]

		if (scaleValue(opts.value[0]) * scaleValue(opts.max) <= 0 || scaleValue(opts.value[1]) * scaleValue(opts.max) <= 0) {
			throw new Error('Log range initial value must have the same sign as min/max and must not equal zero. Got initial value = [' + scaleValue(opts.value[0]) + ', ' + scaleValue(opts.value[1]) + ']')
		}
	} else {
		// If linear, this is much simpler:
		opts.max = (isNumeric(opts.max)) ? opts.max : 100
		opts.min = (isNumeric(opts.min)) ? opts.min : 0
		opts.step = (isNumeric(opts.step)) ? opts.step : (opts.max - opts.min) / 100

		opts.value = [
			isNumeric(opts.value[0]) ? opts.value[0] : (opts.min + opts.max) * 0.25,
			isNumeric(opts.value[1]) ? opts.value[1] : (opts.min + opts.max) * 0.75
		]
	}

	// If we got a number of steps, use that instead:
	if (isNumeric(opts.steps)) {
		opts.step = isNumeric(opts.steps) ? (opts.max - opts.min) / opts.steps : opts.step
	}

	// Quantize the initial value to the requested step:
	opts.value[0] = opts.min + opts.step * Math.round((opts.value[0] - opts.min) / opts.step)
	opts.value[1] = opts.min + opts.step * Math.round((opts.value[1] - opts.min) / opts.step)


	//create DOM
	var lValue = require('./value')({
		container: opts.container,
		value: scaleValue(opts.value[0]).toFixed(prec),
		type: 'text',
		left: true,
		disabled: opts.disabled,
		id: opts.id,
		className: 'settings-panel-interval-value settings-panel-interval-value--left',
		input: function (v) {
			//TODO
		}
	})

	panel = opts.container.parentNode;

	input = opts.container.appendChild(document.createElement('span'))
	input.id = 'settings-panel-interval'
	input.className = 'settings-panel-interval'

	handle = document.createElement('span')
	handle.className = 'settings-panel-interval-handle'
	handle.value = 50;
	handle.min = 0;
	handle.max = 50;
	input.appendChild(handle)

	var value = opts.value

	// Display the values:
	var rValue = require('./value')({
		container: opts.container,
		disabled: opts.disabled,
		value: scaleValue(opts.value[1]).toFixed(prec),
		type: 'text',
		className: 'settings-panel-interval-value settings-panel-interval-value--right',
		input: function (v) {
			//TODO
		}
	})

	function setHandleCSS () {
		var left = ((value[0] - opts.min) / (opts.max - opts.min) * 100);
		var right = (100 - (value[1] - opts.min) / (opts.max - opts.min) * 100);
		css(handle, {
			left:  left + '%',
			width: (100 - left - right) + '%'
		});
		opts.container.style.setProperty('--low', left + '%');
		opts.container.style.setProperty('--high', 100 - right + '%');
		lValue.style.setProperty('--value', left + '%');
		rValue.style.setProperty('--value', 100 - right + '%');
	}

	// Initialize CSS:
	setHandleCSS()
	// An index to track what's being dragged:
	var activeIndex = -1

	function mouseX (ev) {
		// Get mouse/touch position in page coords relative to the container:
		return (ev.touches && ev.touches[0] || ev).pageX - input.getBoundingClientRect().left
	}

	function setActiveValue (fraction) {
		if (activeIndex === -1) {
			return
		}

		// Get the position in the range [0, 1]:
		var lofrac = (value[0] - opts.min) / (opts.max - opts.min)
		var hifrac = (value[1] - opts.min) / (opts.max - opts.min)

		// Clip against the other bound:
		if (activeIndex === 0) {
			fraction = Math.min(hifrac, fraction)
		} else {
			fraction = Math.max(lofrac, fraction)
		}

		// Compute and quantize the new value:
		var newValue = opts.min + Math.round((opts.max - opts.min) * fraction / opts.step) * opts.step

		// Update value, in linearized coords:
		value[activeIndex] = newValue

		// Update and send the event:
		setHandleCSS()
		input.oninput()
	}

	var mousemoveListener = function (ev) {
		if (ev.target === input || ev.target === handle) ev.preventDefault()

		var fraction = clamp(mouseX(ev) / input.offsetWidth, 0, 1)

		setActiveValue(fraction)
	}

	var mouseupListener = function (ev) {
		panel.classList.remove('settings-panel-interval-dragging')

		document.removeEventListener(isMobile ? 'touchmove' : 'mousemove', mousemoveListener)
		document.removeEventListener(isMobile ? 'touchend' : 'mouseup', mouseupListener)

		activeIndex = -1
	}

	input.addEventListener(isMobile ? 'touchstart' : 'mousedown', function (ev) {
		// Tweak control to make dragging experience a little nicer:
		panel.classList.add('settings-panel-interval-dragging')

		// Get mouse position fraction:
		var fraction = clamp(mouseX(ev) / input.offsetWidth, 0, 1)

		// Get the current fraction of position --> [0, 1]:
		var lofrac = (value[0] - opts.min) / (opts.max - opts.min)
		var hifrac = (value[1] - opts.min) / (opts.max - opts.min)

		// This is just for making decisions, so perturb it ever
		// so slightly just in case the bounds are numerically equal:
		lofrac -= Math.abs(opts.max - opts.min) * 1e-15
		hifrac += Math.abs(opts.max - opts.min) * 1e-15

		// Figure out which is closer:
		var lodiff = Math.abs(lofrac - fraction)
		var hidiff = Math.abs(hifrac - fraction)

		activeIndex = lodiff < hidiff ? 0 : 1

		// Attach this to *document* so that we can still drag if the mouse
		// passes outside the container:
		document.addEventListener(isMobile ? 'touchmove' : 'mousemove', mousemoveListener)
		document.addEventListener(isMobile ? 'touchend' : 'mouseup', mouseupListener)
	})

	setTimeout(function () {
		var scaledLValue = scaleValue(value[0])
		var scaledRValue = scaleValue(value[1])
		lValue.value = scaledLValue.toFixed(prec)
		rValue.value = scaledRValue.toFixed(prec)
		this$1.emit('init', [scaledLValue, scaledRValue])
	})

	input.oninput = function () {
		var scaledLValue = scaleValue(value[0])
		var scaledRValue = scaleValue(value[1])
		lValue.value = scaledLValue.toFixed(prec)
		rValue.value = scaledRValue.toFixed(prec)
		this$1.emit('input', [scaledLValue, scaledRValue])
	}

	return this;
}
},{"./value":73,"dom-css":14,"events":1,"inherits":23,"is-mobile":30,"is-numeric":32,"mumath/clamp":60,"mumath/precision":61,"param-case":51}],68:[function(require,module,exports){
'use strict';

var EventEmitter = require('events').EventEmitter
var inherits = require('inherits')
var isNumeric = require('is-numeric')
var css = require('dom-css')
var format = require('param-case')
var precision = require('mumath/precision')

module.exports = Range
inherits(Range, EventEmitter)

function Range (opts) {
	if (!(this instanceof Range)) return new Range(opts);

	this.update(opts);
}

Range.prototype.update = function (opts) {
	var this$1 = this;

	var scaleValue, scaleValueInverse, logmin, logmax, logsign

	if (!!opts.step && !!opts.steps) {
		throw new Error('Cannot specify both step and steps. Got step = ' + opts.step + ', steps = ', opts.steps)
	}

	opts.container.innerHTML = '';

	if (!opts.container) opts.container = document.body;

	var input = opts.container.querySelector('.settings-panel-range');

	if (!input) {
		input = opts.container.appendChild(document.createElement('input'))
		input.type = 'range'
		input.className = 'settings-panel-range'
	}

	if (opts.disabled) input.disabled = true;

	if (opts.log) opts.scale = 'log';

	// Create scale functions for converting to/from the desired scale:
	if (opts.scale === 'log') {
		scaleValue = function (x) {
			return logsign * Math.exp(Math.log(logmin) + (Math.log(logmax) - Math.log(logmin)) * x / 100)
		}
		scaleValueInverse = function (y) {
			return (Math.log(y * logsign) - Math.log(logmin)) * 100 / (Math.log(logmax) - Math.log(logmin))
		}
	} else {
		scaleValue = scaleValueInverse = function (x) { return x }
	}

	// Get initial value:
	if (opts.scale === 'log') {
		// Get options or set defaults:
		opts.max = (isNumeric(opts.max)) ? opts.max : 100
		opts.min = (isNumeric(opts.min)) ? opts.min : 0.1

		// Check if all signs are valid:
		if (opts.min * opts.max <= 0) {
			throw new Error('Log range min/max must have the same sign and not equal zero. Got min = ' + opts.min + ', max = ' + opts.max)
		} else {
			// Pull these into separate variables so that opts can define the *slider* mapping
			logmin = opts.min
			logmax = opts.max
			logsign = opts.min > 0 ? 1 : -1

			// Got the sign so force these positive:
			logmin = Math.abs(logmin)
			logmax = Math.abs(logmax)

			// These are now simply 0-100 to which we map the log range:
			opts.min = 0
			opts.max = 100

			// Step is invalid for a log range:
			if (isNumeric(opts.step)) {
				throw new Error('Log may only use steps (integer number of steps), not a step value. Got step =' + opts.step)
			}
			// Default step is simply 1 in linear slider space:
			opts.step = 1
		}

		opts.value = scaleValueInverse(isNumeric(opts.value) ? opts.value : scaleValue((opts.min + opts.max) * 0.5))

		if (opts.value * scaleValueInverse(opts.max) <= 0) {
			throw new Error('Log range initial value must have the same sign as min/max and must not equal zero. Got initial value = ' + opts.value)
		}
	} else {
		// If linear, this is much simpler:
		opts.max = (isNumeric(opts.max)) ? opts.max : 100
		opts.min = (isNumeric(opts.min)) ? opts.min : 0
		opts.step = (isNumeric(opts.step)) ? opts.step : (opts.max - opts.min) / 100

		opts.value = isNumeric(opts.value) ? opts.value : (opts.min + opts.max) * 0.5
	}

	// If we got a number of steps, use that instead:
	if (isNumeric(opts.steps)) {
		opts.step = isNumeric(opts.steps) ? (opts.max - opts.min) / opts.steps : opts.step
	}

	// Quantize the initial value to the requested step:
	var initialStep = Math.round((opts.value - opts.min) / opts.step)
	opts.value = opts.min + opts.step * initialStep

	//preser container data for display
	opts.container.setAttribute('data-min', opts.min);
	opts.container.setAttribute('data-max', opts.max);

	if (opts.scale === 'log') {
		//FIXME: not every log is of precision 3
		var prec = opts.precision != null ? opts.precision : 3;
	}
	else {
		if (opts.step) {
			var prec = opts.precision != null ? opts.precision : precision(opts.step);
		}
		else if (opts.steps) {
			var prec = opts.precision != null ? opts.precision : precision( (opts.max - opts.min) / opts.steps );
		}
	}

	var value = require('./value')({
		id: opts.id,
		container: opts.container,
		className: 'settings-panel-range-value',
		value: scaleValue(opts.value).toFixed(prec),
		type: opts.scale === 'log' ? 'text' : 'number',
		min: scaleValue(opts.min),
		max: scaleValue(opts.max),
		disabled: opts.disabled,
		//FIXME: step here might vary
		step: opts.step,
		input: function (v) {
			var scaledValue = scaleValueInverse(v)
			input.value = scaledValue;
			value.title = input.value;
			// value.value = v
			this$1.emit('input', v);
			input.setAttribute('value', scaledValue.toFixed(0))
			opts.container.style.setProperty('--value', scaledValue + '%');
			opts.container.style.setProperty('--coef', scaledValue/100);
		}
	});

	// Set value on the input itself:
	input.min = opts.min
	input.max = opts.max
	input.step = opts.step
	input.value = opts.value
	var v = 100 * (opts.value - opts.min) / (opts.max - opts.min);
	input.setAttribute('value', v.toFixed(0))
	opts.container.style.setProperty('--value', v + '%');
	opts.container.style.setProperty('--coef', v/100);

	setTimeout(function () {
		this$1.emit('init', parseFloat(value.value))
	});

	input.oninput = function (data) {
		var scaledValue = scaleValue(parseFloat(data.target.value));
		value.value = scaledValue.toFixed(prec);
		var v = 100 * (data.target.value - opts.min) / (opts.max - opts.min);
		input.setAttribute('value', v.toFixed(0));
		opts.container.style.setProperty('--value', v + '%');
		opts.container.style.setProperty('--coef', v/100);
		value.title = scaledValue;
		this$1.emit('input', scaledValue);
	}

	return this;
}
},{"./value":73,"dom-css":14,"events":1,"inherits":23,"is-numeric":32,"mumath/precision":61,"param-case":51}],69:[function(require,module,exports){
'use strict';

var EventEmitter = require('events').EventEmitter
var inherits = require('inherits')
var format = require('param-case')

module.exports = Select
inherits(Select, EventEmitter)

function Select (opts) {
	if (!(this instanceof Select)) return new Select(opts);

	this.update(opts);
}

Select.prototype.update = function (opts) {
	var this$1 = this;

	var i, container, input, downTriangle, upTriangle, key, option, el, keys

	opts.container.innerHTML = '';

	input = document.createElement('select')
	input.id = opts.id
	input.className = 'settings-panel-select';

	if (opts.disabled) input.disabled = true;

	downTriangle = document.createElement('span')
	downTriangle.className = 'settings-panel-select-triangle settings-panel-select-triangle--down'

	upTriangle = document.createElement('span')
	upTriangle.className = 'settings-panel-select-triangle settings-panel-select-triangle--up'

	if (Array.isArray(opts.options)) {
		for (var i$1 = 0; i$1 < opts.options.length; i$1++) {
			option = opts.options[i$1]
			el = document.createElement('option')
			el.value = el.textContent = option
			if (opts.value === option) {
				el.selected = 'selected'
			}
			input.appendChild(el)
		}
	} else {
		keys = Object.keys(opts.options)
		for (var i$2 = 0; i$2 < keys.length; i$2++) {
			key = keys[i$2]
			el = document.createElement('option')
			el.value = key
			if (opts.value === key) {
				el.selected = 'selected'
			}
			el.textContent = opts.options[key]
			input.appendChild(el)
		}
	}

	opts.container.appendChild(input)
	opts.container.appendChild(downTriangle)
	opts.container.appendChild(upTriangle)

	setTimeout(function () {
		this$1.emit('init', opts.value)
	})

	input.onchange = function (data) {
		this$1.emit('input', data.target.value)
	}

	return this;
}
},{"events":1,"inherits":23,"param-case":51}],70:[function(require,module,exports){
'use strict';

var inherits = require('inherits');
var Emitter = require('events').EventEmitter;
var format = require('param-case');
var extend = require('just-extend');

module.exports = Switch;

inherits(Switch, Emitter);

function Switch (opts) {
	var this$1 = this;

	if (!(this instanceof Switch)) return new Switch(opts);

	this.switch = opts.container.querySelector('.settings-panel-switch');

	if (!this.switch) {
		this.switch = document.createElement('fieldset');
		this.switch.className = 'settings-panel-switch';
		opts.container.appendChild(this.switch);

		var html = '';

		if (Array.isArray(opts.options)) {
			for (var i = 0; i < opts.options.length; i++) {
				var option = opts.options[i]
				html += createOption(option, option);
			}
		} else {
			for (var key in opts.options) {
				html += createOption(opts.options[key], key);
			}
		}

		this.switch.innerHTML = html;

		this.switch.onchange = function (e) {
			this$1.emit('input', e.target.getAttribute('data-value'));
		}

		setTimeout(function () {
			this$1.emit('init', opts.value)
		})
	}

	this.switch.id = opts.id;

	this.update(opts);

	function createOption (label, value) {
		var htmlFor = "settings-panel-" + (format(opts.panel.id)) + "-" + (format(opts.id)) + "-input-" + (format(value));

		var html = "<input type=\"radio\" class=\"settings-panel-switch-input\" " + (value === opts.value ? 'checked' : '') + " id=\"" + htmlFor + "\" name=\"" + (format(opts.id)) + "\" data-value=\"" + value + "\" title=\"" + value + "\"/><label for=\"" + htmlFor + "\" class=\"settings-panel-switch-label\" title=\"" + value + "\">" + label + "</label>";
		return html;
	}
}

Switch.prototype.update = function (opts) {
	return this;
}
},{"events":1,"inherits":23,"just-extend":35,"param-case":51}],71:[function(require,module,exports){
'use strict';

var EventEmitter = require('events').EventEmitter
var inherits = require('inherits')
var css = require('dom-css')
var num = require('input-number');
var extend = require('just-extend');

module.exports = Text
inherits(Text, EventEmitter)

function Text (opts) {
	var this$1 = this;

	if (!(this instanceof Text)) return new Text(opts)

	var element = opts.container.querySelector('.settings-panel-text');

	if (!element) {
		element = opts.container.appendChild(document.createElement('input'));
		element.className = 'settings-panel-text';
		num(element);

		if (opts.placeholder) element.placeholder = opts.placeholder;

		this.element = element;

		element.oninput = function (data) {
			this$1.emit('input', data.target.value)
		}
		setTimeout(function () {
			this$1.emit('init', element.value)
		});
	}

	this.update(opts);
}

Text.prototype.update = function (opts) {
	extend(this, opts);
	this.element.type = this.type
	this.element.id = this.id
	this.element.value = this.value || ''
	this.element.disabled = !!this.disabled;
	return this;
}
},{"dom-css":14,"events":1,"inherits":23,"input-number":24,"just-extend":35}],72:[function(require,module,exports){
'use strict';

var EventEmitter = require('events').EventEmitter
var inherits = require('inherits')
var css = require('dom-css')
var autosize = require('autosize');
var extend = require('just-extend');

module.exports = Textarea
inherits(Textarea, EventEmitter)

function Textarea (opts) {
	var this$1 = this;

	if (!(this instanceof Textarea)) return new Textarea(opts)

	//<textarea rows="1" placeholder="${param.placeholder || 'value...'}" id="${param.name}" class="prama-input prama-textarea" title="${param.value}">${param.value}</textarea>
	var input = opts.container.querySelector('.settings-panel-textarea');
	if (!input) {
		input = opts.container.appendChild(document.createElement('textarea'));
		input.className = 'settings-panel-textarea';

		this.element = input;

		setTimeout(function () {
			this$1.emit('init', input.value)
			autosize.update(input);
		})

		input.oninput = function (data) {
			this$1.emit('input', data.target.value)
		}

		autosize(input);
	}

	this.update(opts);
}

Textarea.prototype.update = function (opts) {
	extend(this, opts);

	this.element.rows = this.rows || 1;
	this.element.placeholder = this.placeholder || '';
	this.element.id = this.id

	this.element.value = this.value || '';

	this.element.disabled = !!this.disabled;

	autosize.update(this.element);

	return this;
}
},{"autosize":4,"dom-css":14,"events":1,"inherits":23,"just-extend":35}],73:[function(require,module,exports){
'use strict';

var num = require('input-number');

module.exports = function (opts) {
  opts = opts || {}
  var value = document.createElement('input');

  num(value, opts);

  if (opts.input) {
    value.addEventListener('input', function () {
      var v = value.value;
      if (opts.type === 'number') v = parseFloat(v);
      opts.input(v)
    })
  }
  if (opts.change) {
    value.addEventListener('change', function () {
      var v = value.value;
      if (opts.type === 'number') v = parseFloat(v);
      opts.change(v)
    })
  }

  if (opts.disabled) value.disabled = true;

  value.value = opts.value

  if (opts.id) value.id = opts.id;
  value.className = 'settings-panel-value';
  if (opts.className) value.className += ' ' + opts.className;
  opts.container.appendChild(value);

  //add tip holder after value
  var tip = opts.container.appendChild(document.createElement('div'));
  tip.className = 'settings-panel-value-tip';

  return value
}
},{"input-number":24}],74:[function(require,module,exports){
/**
 * @module  settings-panel/theme/none
 */
'use strict';

var px = require('add-px-to-style');

module.exports = none;

none.palette = ['white', 'black'];
none.fontSize = 13;
none.fontFamily = 'sans-serif';
none.labelWidth = '9em';
none.inputHeight = 2;
none.padding = 1/5;

function none (opts) {
	opts = opts || {};
	var fs = opts.fontSize || none.fontSize;
	var font = opts.fontFamily || none.fontFamily;
	var h = opts.inputHeight || none.inputHeight;
	var labelWidth = opts.labelWidth || none.labelWidth;
	var padding = opts.padding || none.padding;
	var palette = opts.palette || none.palette;
	var white = palette[0];
	var black = palette[palette.length - 1];

	if (/[-0-9.]*/.test(fs)) fs = parseFloat(fs);

	//just size part
	return ("\n\t\t:host {\n\t\t\tbackground: " + white + ";\n\t\t\tcolor: " + black + ";\n\t\t\tfont-family: " + font + ";\n\t\t\tfont-size: " + (px('font-size', fs)) + ";\n\t\t\tpadding: " + (h*2.5*padding) + "em;\n\t\t}\n\n\t\t.settings-panel-title {\n\t\t\tmin-height: " + h + "em;\n\t\t\tline-height: 1.5;\n\t\t\ttext-align: left;\n\t\t\tfont-size: " + (px('font-size',fs*1.333)) + ";\n\t\t\tpadding: " + (h * 2 * padding / 1.333) + "em " + (h * padding / 1.333) + "em;\n\t\t\tmin-height: " + (h/1.333) + "em;\n\t\t\tmargin: 0;\n\t\t}\n\n\t\t.settings-panel-field {\n\t\t\tpadding: " + (h * padding) + "em;\n\t\t}\n\n\t\t:host.settings-panel-orientation-left .settings-panel-label,\n\t\t:host .settings-panel-orientation-left .settings-panel-label,\n\t\t:host.settings-panel-orientation-right .settings-panel-label,\n\t\t:host .settings-panel-orientation-right .settings-panel-label {\n\t\t\twidth: " + (px('width', labelWidth)) + ";\n\t\t}\n\t\t:host.settings-panel-orientation-bottom .settings-panel-label {\n\t\t\tborder-top-width: " + h + "em;\n\t\t}\n\t\t:host.settings-panel-orientation-bottom .settings-panel-label + .settings-panel-input {\n\t\t\ttop: " + (h/8) + "em;\n\t\t}\n\t\t:host.settings-panel-orientation-left .settings-panel-label {\n\t\t\tpadding-right: " + (h/2) + "em;\n\t\t}\n\t\t:host.settings-panel-orientation-right .settings-panel-label {\n\t\t\tpadding-left: " + (h/2) + "em;\n\t\t}\n\t\t:host.settings-panel-orientation-right .settings-panel-label + .settings-panel-input {\n\t\t\twidth: calc(100% - " + labelWidth + ");\n\t\t}\n\n\t\t.settings-panel-text,\n\t\t.settings-panel-textarea,\n\t\t.settings-panel-range,\n\t\t.settings-panel-interval,\n\t\t.settings-panel-select,\n\t\t.settings-panel-color,\n\t\t.settings-panel-color-value,\n\t\t.settings-panel-value {\n\t\t\theight: " + h + "em;\n\t\t}\n\n\t\t.settings-panel-button,\n\t\t.settings-panel-input,\n\t\t.settings-panel-switch,\n\t\t.settings-panel-checkbox-group,\n\t\t.settings-panel-switch-label {\n\t\t\tmin-height: " + h + "em;\n\t\t}\n\t\t.settings-panel-input,\n\t\t.settings-panel-switch,\n\t\t.settings-panel-select,\n\t\t.settings-panel-checkbox-group,\n\t\t.settings-panel-switch-label {\n\t\t\tline-height: " + h + "em;\n\t\t}\n\n\t\t.settings-panel-switch-label,\n\t\t.settings-panel-checkbox,\n\t\t.settings-panel-checkbox-label,\n\t\t.settings-panel-button {\n\t\t\tcursor: pointer;\n\t\t}\n\n\t\t.settings-panel-range::-webkit-slider-thumb {\n\t\t\tcursor: ew-resize;\n\t\t}\n\t\t.settings-panel-range::-moz-range-thumb {\n\t\t\tcursor: ew-resize;\n\t\t}\n\t\t.settings-panel-range::-ms-track {\n\t\t\tcursor: ew-resize;\n\t\t}\n\t\t.settings-panel-range::-ms-thumb {\n\t\t\tcursor: ew-resize;\n\t\t}\n\n\t\t/* Default triangle styles are from control theme, just set display: block */\n\t\t.settings-panel-select-triangle {\n\t\t\tdisplay: none;\n\t\t\tposition: absolute;\n\t\t\tborder-right: .3em solid transparent;\n\t\t\tborder-left: .3em solid transparent;\n\t\t\tline-height: " + h + "em;\n\t\t\tright: 2.5%;\n\t\t\theight: 0;\n\t\t\tz-index: 1;\n\t\t\tpointer-events: none;\n\t\t}\n\t\t.settings-panel-select-triangle--up {\n\t\t\ttop: " + (h/2) + "em;\n\t\t\tmargin-top: -" + (h/4 + h/24) + "em;\n\t\t\tborder-bottom: " + (h/4) + "em solid;\n\t\t\tborder-top: 0px transparent;\n\t\t}\n\t\t.settings-panel-select-triangle--down {\n\t\t\ttop: " + (h/2) + "em;\n\t\t\tmargin-top: " + (h/24) + "em;\n\t\t\tborder-top: " + (h/4) + "em solid;\n\t\t\tborder-bottom: .0 transparent;\n\t\t}\n\n\t\t:host hr {\n\t\t\topacity: .5;\n\n\t\t\tcolor: " + black + "\n\t\t}\n\t");
}
},{"add-px-to-style":3}],75:[function(require,module,exports){
/**
 * @module  settings-panel/theme/typer
 *
 * White theme
 */
'use strict';

var px = require('add-px-to-style');
var fonts = require('google-fonts');
var color = require('tinycolor2');
var scopeCss = require('scope-css');
var interpolate = require('color-interpolate');
var none = require('./none');


module.exports = typer;

// typer.palette = ['#4B4E59', '#BCC1C7' ,'#F1F1F3'];
// typer.palette = ['#32393F', '#3F4851', '#49565F', '#ADB7C0', '#F4FBFF'];
// typer.palette = ['#111', '#eee'];
typer.palette = ['white', 'black'];
// typer.palette = ['#fff', '#24D4C0' ,'#21282E'];
typer.active = '#24D4C0';

typer.fontSize = 12;
typer.fontFamily = '"Montserrat", sans-serif';
typer.labelWidth = '9em';
typer.inputHeight = 2;
typer.padding = 1/5;

//color balance
typer.bg = .9;
typer.radius = 2;
typer.fg = .08;

fonts.add({
	'Montserrat': [400, 600],
	'Material Icons': 400
});


function typer (opts) {
	opts = opts || {};

	var h = opts.inputHeight || typer.inputHeight;
	var labelWidth = opts.labelWidth || typer.labelWidth;
	var fontSize = opts.fontSize || typer.fontSize;
	var font = opts.fontFamily || typer.fontFamily;
	var radius = opts.radius || typer.radius;
	var padding = opts.padding || typer.padding;

	//background/active tones
	var bg = opts.bg || typer.bg;
	var fg = opts.fg || typer.fg;


	//palette
	var palette = opts.palette || typer.palette;
	var pick = interpolate(palette);

	//obtain palette sorted by brightnes
	var nPalette = palette.slice().sort(function (a, b) { return color(a).getLuminance() - color(b).getLuminance(); });
	var npick = interpolate(nPalette);

	//the color of light/shadow to mix
	var light = color.mix('white', nPalette[nPalette.length - 1], 25).toString();
	var shadow = color.mix('black', nPalette[0], 25).toString();

	var active = opts.active || tone(.5);

	//helpers
	function tone (amt) {
		if (typeof amt === 'number') {
			amt = Math.max(Math.min(amt, 1), 0);
			return color(pick(amt)).toString();
		}
		return amt;
	}
	function ntone (amt) {
		if (typeof amt === 'number') {
			amt = Math.max(Math.min(amt, 1), 0);
			return color(npick(amt)).toString();
		}
		return amt;
	}
	function lighten (v, amt, t) {
		if ( t === void 0 ) t = tone;

		return color(t(v)).lighten(amt*100);
	}
	function darken (v, amt, t) {
		if ( t === void 0 ) t = tone;

		return color(t(v)).darken(amt*100);
	}
	function alpha (c, value) {
		return color(c).setAlpha(value).toString();
	}

	var inversed = color(palette[0]).getLuminance() > color(palette[palette.length - 1]).getLuminance();


	var pop = function (v, d, t) {
		if ( v === void 0 ) v = .9;
		if ( d === void 0 ) d = .05;
		if ( t === void 0 ) t = tone;

		return ("\n\t\t" + (text(fg, v)) + "\n\t\tbackground-color: " + (t(v)) + ";\n\t\tbackground-image: linear-gradient(to bottom, " + (lighten(v, d, t)) + ", " + (darken(v, d, t)) + ");\n\t\tbox-shadow: inset 1px 0px " + (alpha(light, .04)) + ", inset 0px 1px " + (alpha(light, .15)) + ", inset 0px -1px 1px " + (alpha(light, .07)) + ", 0 1px 2px " + (alpha(shadow, .35)) + ";\n\t");
	};
	var push = function (v, d, t) {
		if ( v === void 0 ) v = .1;
		if ( d === void 0 ) d = .05;
		if ( t === void 0 ) t = tone;

		return ("\n\t\tbackground: " + (t(v)) + ";\n\t\t/*background-image: linear-gradient(to bottom, " + (darken(v, d, t)) + ", " + (lighten(v, d, t)) + ");*/\n\t\tbox-shadow: inset 0 1px 2px " + (alpha(shadow, .18)) + ", 0 1px " + (alpha(light, .2)) + ";\n\t\tcolor: " + (t(1 - fg)) + ";\n\t\ttext-shadow: none;\n\t");
	};
	var text = function (v, bg) { return color(tone(v)).getLuminance() > color(tone(bg)).getLuminance() ? ("\n\t\tcolor: " + (tone(v)) + ";\n\t\tbackground: " + (tone(bg)) + ";\n\t\ttext-shadow: 0 -1px " + (color.mix(tone(bg), shadow, 50)) + ";\n\t") : ("\n\t\tcolor: " + (tone(v)) + ";\n\t\tbackground: " + (tone(bg)) + ";\n\t\ttext-shadow: 0 1px " + (color.mix(tone(bg), light, 50)) + ";\n\t"); };

	return none({
		fontSize: fontSize,
		fontFamily: font,
		inputHeight: h,
		labelWidth: labelWidth,
		palette: [tone(fg), tone(bg)],
		padding: padding
	}) + "\n\t\t:host {\n\t\t\t" + (text(fg, bg)) + ";\n\t\t\tbox-shadow: inset 0 1px " + (alpha(light, .15)) + ", 0 1.5px 11px -2px " + (alpha(shadow, .666)) + ";\n\t\t\tborder-radius: " + (radius*2) + "px;\n\t\t}\n\n\t\t:host a {\n\t\t\ttext-decoration: none;\n\t\t\tborder-bottom: 1px solid " + (alpha(tone(.0), .1)) + ";\n\t\t}\n\t\t:host a:hover {\n\t\t\ttext-decoration: none;\n\t\t\tborder-bottom: 1px solid " + (alpha(tone(.0), 1)) + ";\n\t\t}\n\n\t\t.settings-panel-title {\n\t\t\tfont-weight: 400;\n\t\t\t" + (text(fg, bg)) + ";\n\t\t\tbackground: none;\n\t\t}\n\n\t\t.settings-panel-label {\n\t\t\t" + (text(.25, bg)) + ";\n\t\t\tbackground: none;\n\t\t}\n\n\t\t.settings-panel-field:hover .settings-panel-label {\n\t\t\tcolor: " + (tone(fg)) + ";\n\t\t}\n\n\n\n\t/** Values */\n\t.settings-panel-value {\n\t}\n\t.settings-panel-value:first-child {\n\t}\n\t.settings-panel-value:hover,\n\t.settings-panel-value:focus {\n\t}\n\n\n\n\t/** Sliders */\n\t.settings-panel-range {\n\t\t-webkit-appearance: none;\n\t\t-moz-appearance: none;\n\t\tappearance: none;\n\t\tbackground: none;\n\t\tborder: 0;\n\t}\n\t.settings-panel-field--range:hover .settings-panel-range,\n\t.settings-panel-range:focus {\n\t\toutline: none;\n\t}\n\t.settings-panel-range::-webkit-slider-runnable-track {\n\t\theight: .5em;\n\t\tborder-radius: .5em;\n\t\t" + (push(fg, .05)) + "\n\t}\n\t.settings-panel-range::-moz-range-track {\n\t\theight: .5em;\n\t\tborder-radius: .5em;\n\t\t" + (push(fg, .05)) + "\n\t}\n\t.settings-panel-range::-ms-track {\n\t\t" + (push(fg, .05)) + "\n\t\toutline: none;\n\t\tcolor: transparent;\n\t\tborder: none;\n\t\theight: .5em;\n\t\tborder-radius: .5em;\n\t}\n\t.settings-panel-range::-ms-fill-lower {\n\t\tborder-radius: .5em;\n\t\t" + (push(fg, .05)) + "\n\t}\n\t.settings-panel-range::-ms-fill-upper {\n\t\tborder-radius: .5em;\n\t\t" + (push(.93, .05)) + "\n\t}\n\n\t@supports (--css: variables) {\n\t\t.settings-panel-range {\n\t\t\twidth: 100%;\n\t\t\t--active: " + active + ";\n\t\t\t--bg: " + (tone(.9)) + ";\n\t\t\t--track-background: linear-gradient(to right, var(--active) 0, var(--active) var(--value), var(--bg) 0) no-repeat;\n\t\t}\n\t\t.settings-panel-range::-webkit-slider-runnable-track {\n\t\t\tbackground: var(--track-background);\n\t\t}\n\t\t.settings-panel-range::-moz-range-track {\n\t\t\tbackground: var(--track-background);\n\t\t}\n\t\t.settings-panel-field--range .settings-panel-input {\n\t\t\tmargin-right: " + h + "em;\n\t\t}\n\t\t.settings-panel-field--range:hover .settings-panel-range,\n\t\t.settings-panel-range:focus {\n\t\t\t--bg: " + (tone(.93)) + ";\n\t\t}\n\t\t.settings-panel-range-value {\n\t\t\tdisplay: none;\n\t\t\tposition: absolute;\n\t\t\ttop: -" + (h*1.25) + "em;\n\t\t\ttext-align: center;\n\t\t\tpadding: 0;\n\t\t\tcolor: " + (tone(fg)) + ";\n\t\t\tbackground: " + (tone(1)) + ";\n\t\t\tbox-shadow: 0 1px 5px -1px " + (alpha(shadow, .5)) + ";\n\t\t\tborder-radius: " + radius + "px;\n\t\t\tz-index: 3;\n\t\t\tmargin-left: " + (-h*.65) + "em;\n\t\t\twidth: " + (h*2) + "em;\n\t\t\ttext-shadow: none;\n\t\t\tleft: calc(var(--value) - var(--coef) * " + (h*.8) + "em);\n\t\t}\n\t\t.settings-panel-field--range .settings-panel-value-tip {\n\t\t\tposition: absolute;\n\t\t\theight: 0;\n\t\t\ttop: -" + (h*.25) + "em;\n\t\t\tleft: calc(var(--value) - var(--coef) * " + (h*.8) + "em);\n\t\t\tmargin-left: " + (h*.1) + "em;\n\t\t\tdisplay: none;\n\t\t\tz-index: 3;\n\t\t\tborder-top: " + (h*.3) + "em solid " + (tone(1)) + ";\n\t\t\tborder-left: " + (h*.3) + "em solid transparent;\n\t\t\tborder-right: " + (h*.3) + "em solid transparent;\n\t\t\tborder-bottom: none;\n\t\t}\n\t\t.settings-panel-input:before {\n\t\t\tborder-top: " + (h*.3) + "em solid " + (alpha(shadow, .25)) + ";\n\t\t}\n\t\t.settings-panel-field--range:hover .settings-panel-value-tip,\n\t\t.settings-panel-range:focus ~ .settings-panel-value-tip {\n\t\t\tdisplay: block;\n\t\t}\n\t\t.settings-panel-field--range:hover .settings-panel-value,\n\t\t.settings-panel-range:focus ~ .settings-panel-value {\n\t\t\tdisplay: block;\n\t\t}\n\t}\n\n\t.settings-panel-range::-webkit-slider-thumb {\n\t\t" + (pop(fg, -.05)) + ";\n\t\theight: " + (h*.8) + "em;\n\t\twidth: " + (h*.8) + "em;\n\t\tborder-radius: " + (h*.8) + "em;\n\t\tmargin-top: -" + (h*.4) + "em;\n\t\tborder: 0;\n\t\tposition: relative;\n\t\ttop: .25em;\n\t\t-webkit-appearance: none;\n\t\tappearance: none;\n\t\tz-index: 3;\n\t}\n\t.settings-panel-range:focus::-webkit-slider-thumb,\n\t.settings-panel-range:hover::-webkit-slider-thumb,\n\t.settings-panel-field--range:hover .settings-panel-range::-webkit-slider-thumb {\n\t}\n\t.settings-panel-range::-webkit-slider-thumb:active {\n\t}\n\n\t.settings-panel-range::-moz-range-thumb {\n\t\t" + (pop(fg, -.05)) + ";\n\t\theight: " + (h*.8) + "em;\n\t\twidth: " + (h*.8) + "em;\n\t\tborder-radius: " + (h*.8) + "em;\n\t\tmargin-top: -" + (h*.4) + "em;\n\t\tborder: 0;\n\t\tposition: relative;\n\t\ttop: .25em;\n\t\t-moz-appearance: none;\n\t\tappearance: none;\n\t\tz-index: 3;\n\t}\n\t.settings-panel-range:focus::-moz-range-thumb,\n\t.settings-panel-range::-moz-range-thumb:hover,\n\t.settings-panel-field--range:hover .settings-panel-range::-moz-range-thumb {\n\t}\n\t.settings-panel-range::-moz-range-thumb:active {\n\t}\n\n\t.settings-panel-range::-ms-thumb {\n\t\t" + (pop(fg, -.05)) + ";\n\t\theight: " + (h*.8) + "em;\n\t\twidth: " + (h*.8) + "em;\n\t\tborder-radius: " + (h*.8) + "em;\n\t\tborder: 0;\n\t\tposition: relative;\n\t\ttop: .25em;\n\t\t-ms-appearance: none;\n\t\tappearance: none;\n\t\tz-index: 3;\n\t}\n\t.settings-panel-range:focus::-ms-thumb,\n\t.settings-panel-range:hover::-ms-thumb,\n\t.settings-panel-field--range:hover .settings-panel-range::-ms-thumb {\n\t}\n\t.settings-panel-range::-ms-thumb:active {\n\t}\n\n\n\t/** Interval */\n\t.settings-panel-interval {\n\t\tbackground: none;\n\t}\n\t.settings-panel-interval:after {\n\t\tcontent: '';\n\t\tposition: absolute;\n\t\twidth: 100%;\n\t\tleft: 0;\n\t\tbottom: 0;\n\t\ttop: 0;\n\t\theight: .5em;\n\t\tborder-radius: .5em;\n\t\tmargin-top: auto;\n\t\tmargin-bottom: auto;\n\t\t" + (push(.9, .05)) + "\n\t\tbackground: " + (tone(.9)) + ";\n\t}\n\t.settings-panel-field--interval:hover .settings-panel-interval:after,\n\t.settings-panel-interval-dragging .settings-panel-interval:after {\n\t\tbackground: " + (tone(.93)) + ";\n\t}\n\t.settings-panel-interval-handle {\n\t\tposition: absolute;\n\t\tz-index: 1;\n\t\ttop: 0;\n\t\theight: .5em;\n\t\tbottom: 0;\n\t\tmargin-top: auto;\n\t\tmargin-bottom: auto;\n\t\tbackground: " + active + ";\n\t}\n\t.settings-panel-interval-handle:after,\n\t.settings-panel-interval-handle:before {\n\t\tcontent: '';\n\t\tposition: absolute;\n\t\tright: -" + (h*.4) + "em;\n\t\ttop: 0;\n\t\tbottom: 0;\n\t\tmargin: auto;\n\t\theight: " + (h*.8) + "em;\n\t\twidth: " + (h*.8) + "em;\n\t\tborder-radius: " + (h*.8) + "em;\n\t\t" + (pop(fg, -.05)) + ";\n\t}\n\t.settings-panel-interval-handle:before {\n\t\tleft: -" + (h*.4) + "em;\n\t\tright: auto;\n\t}\n\n\t.settings-panel-field--interval:hover .settings-panel-interval-handle:after,\n\t.settings-panel-field--interval:hover .settings-panel-interval-handle:before,\n\t.settings-panel-interval-dragging .settings-panel-interval-handle:after,\n\t.settings-panel-interval-dragging .settings-panel-interval-handle:before {\n\t\t" + (pop(fg, -.05)) + ";\n\t}\n\n\t@supports (--css: variables) {\n\t\t.settings-panel-interval {\n\t\t\twidth: 100%;\n\t\t}\n\n\t\t.settings-panel-interval-value {\n\t\t\tposition: absolute;\n\t\t\ttop: -" + (h*1.25) + "em;\n\t\t\ttext-align: center;\n\t\t\tpadding: 0;\n\t\t\tdisplay: none;\n\t\t\tcolor: " + (tone(fg)) + ";\n\t\t\tbackground: " + (tone(1)) + ";\n\t\t\tbox-shadow: 0 1px 5px -1px " + (alpha(shadow, .5)) + ";\n\t\t\tborder-radius: " + radius + "px;\n\t\t\tz-index: 3;\n\t\t\tmargin-left: " + (-h) + "em;\n\t\t\twidth: " + (h*2) + "em;\n\t\t\ttext-shadow: none;\n\t\t\tleft: var(--value);\n\t\t}\n\n\t\t.settings-panel-field--interval .settings-panel-value-tip {\n\t\t\tposition: absolute;\n\t\t\theight: 0;\n\t\t\tdisplay: none;\n\t\t\ttop: -" + (h*.25) + "em;\n\t\t\tleft: var(--low);\n\t\t\tmargin-left: " + (-h*.3) + "em;\n\t\t\tz-index: 3;\n\t\t\tborder-top: " + (h*.3) + "em solid " + (tone(1)) + ";\n\t\t\tborder-left: " + (h*.3) + "em solid transparent;\n\t\t\tborder-right: " + (h*.3) + "em solid transparent;\n\t\t\tborder-bottom: none;\n\t\t}\n\t\t.settings-panel-interval-value--right + .settings-panel-value-tip {\n\t\t\tleft: var(--high);\n\t\t}\n\n\t\t.settings-panel-input:before {\n\t\t\tborder-top: " + (h*.3) + "em solid " + (alpha(shadow, .25)) + ";\n\t\t}\n\t\t.settings-panel-field--interval:hover .settings-panel-interval-value,\n\t\t.settings-panel-interval-dragging .settings-panel-interval-value {\n\t\t\tdisplay: block;\n\t\t}\n\t\t@media (min-width: 640px) {\n\t\t\t.settings-panel-field--interval:hover .settings-panel-value-tip,\n\t\t\t.settings-panel-interval-dragging .settings-panel-value-tip {\n\t\t\t\tdisplay: block;\n\t\t\t}\n\t\t}\n\t}\n\n\n\t\t/** Switch style */\n\t\t.settings-panel-switch {\n\t\t}\n\t\t.settings-panel-switch-input {\n\t\t\tdisplay: none;\n\t\t}\n\t\t.settings-panel-switch-label {\n\t\t\tposition: relative;\n\t\t\tdisplay: inline-block;\n\t\t\tpadding: 0 " + (h/2) + "em;\n\t\t\tmargin: 0;\n\t\t\tz-index: 2;\n\t\t\ttext-align: center;\n\t\t\t" + (pop(bg * .95, .07)) + ";\n\t\t\tcolor: " + (tone(.25)) + ";\n\t\t}\n\t\t.settings-panel-switch-input:checked + .settings-panel-switch-label {\n\t\t\t" + (push(.95, bg)) + ";\n\t\t\tcolor: " + (tone(fg)) + ";\n\t\t}\n\n\t\t.settings-panel-switch-input:first-child + .settings-panel-switch-label {\n\t\t\tborder-top-left-radius: 2px;\n\t\t\tborder-bottom-left-radius: 2px;\n\t\t}\n\t\t.settings-panel-switch-label:last-child {\n\t\t\tborder-top-right-radius: 2px;\n\t\t\tborder-bottom-right-radius: 2px;\n\t\t}\n\n\t\t.settings-panel-switch-label:hover {\n\t\t\t" + (pop(bg * .95 + (inversed ? -.07 : .07), .07)) + ";\n\t\t}\n\t\t.settings-panel-switch-label:active {\n\t\t\t" + (pop(bg * .95 + (inversed ? .07 : -.07), .07)) + ";\n\t\t}\n\n\n\t/** Select */\n\t.settings-panel-select {\n\t\tborder-radius: " + radius + "px;\n\t\tpadding-left: " + (h/4) + "em;\n\t\toutline: none;\n\t\tborder: none;\n\t\t-webkit-appearance: none;\n\t\t-moz-appearance: none;\n\t\t-o-appearance:none;\n\t\tappearance:none;\n\t\t" + (pop(bg * .95, .07)) + ";\n\t\tcolor: " + (tone(.25)) + ";\n\t}\n\t.settings-panel-select:hover,\n\t.settings-panel-select:active,\n\t.settings-panel-select:focus {\n\t\t" + (pop(bg * .95 + (inversed ? -.07 : .07), .07)) + ";\n\t}\n\t.settings-panel-select::-ms-expand {\n\t\tdisplay: none;\n\t}\n\t.settings-panel-select-triangle {\n\t\tcolor: inherit;\n\t\tdisplay: block;\n\t\ttransform: scale(.8);\n\t}\n\n\n\t/** Button */\n\t.settings-panel-button {\n\t\ttext-align: center;\n\t\tborder: none;\n\t\tborder-radius: " + radius + "px;\n\t\t" + (pop(bg * .95, .07)) + ";\n\t\tcolor: " + (tone(.25)) + ";\n\t}\n\t.settings-panel-button:focus {\n\t\toutline: none;\n\t}\n\t.settings-panel-button:hover {\n\t\t" + (pop(bg * .95 + (inversed ? -.07 : .07), .07)) + ";\n\t\tcolor: " + (tone(fg)) + ";\n\t}\n\t.settings-panel-button:active {\n\t\t" + (push(fg, .05)) + ";\n\t}\n\n\n\t/** Text */\n\t.settings-panel-text,\n\t.settings-panel-textarea {\n\t\t-webkit-appearance: none;\n\t\t-moz-appearance: none;\n\t\t-o-appearance:none;\n\t\tborder: none;\n\t\theight: " + h + "em;\n\t\tpadding: 0;\n\t\twidth: 100%;\n\t\tborder-radius: " + radius + "px;\n\t\tpadding-left: .4em;\n\t\t" + (push(bg*.95)) + ";\n\t\tcolor: " + (tone(fg)) + ";\n\t\ttext-shadow: none;\n\t}\n\t.settings-panel-textarea {\n\t\tpadding-top: .35em;\n\t}\n\n\t.settings-panel-text:hover,\n\t.settings-panel-textarea:hover,\n\t.settings-panel-text:focus,\n\t.settings-panel-textarea:focus {\n\t\t" + (push(bg * .95 - .04)) + ";\n\t\tcolor: " + (tone(fg)) + ";\n\t\toutline: none;\n\t}\n\n\t/** Color */\n\t.settings-panel-color {\n\t\tposition: relative;\n\t\twidth: " + h + "em;\n\t\tborder-top-left-radius: 3px;\n\t\tborder-bottom-left-radius: 3px;\n\t\tdisplay: inline-block;\n\t\tvertical-align: baseline;\n\t\tbox-shadow: 0 1px " + (alpha(light, .2)) + ";\n\t}\n\t.settings-panel-color-value {\n\t\t-webkit-appearance: none;\n\t\t-moz-appearance: none;\n\t\t-o-appearance:none;\n\t\tborder: none;\n\t\tpadding-left: " + (h/4) + "em;\n\t\twidth: calc(100% - " + h + "em);\n\t\tfont-family: inherit;\n\t\tborder-top-left-radius: 0;\n\t\tborder-bottom-left-radius: 0;\n\t\tborder-top-right-radius: 3px;\n\t\tborder-bottom-right-radius: 3px;\n\t\t" + (push(bg*.95)) + ";\n\t\tcolor: " + (tone(fg)) + ";\n\t\ttext-shadow: none;\n\t}\n\t.settings-panel-color-value:hover,\n\t.settings-panel-color-value:focus {\n\t\toutline: none;\n\t\t" + (push(bg * .95 - .04)) + ";\n\t\tcolor: " + (tone(fg)) + ";\n\t}\n\n\n\t/** Checkbox */\n\t.settings-panel-checkbox {\n\t\tdisplay: none;\n\t}\n\t.settings-panel-checkbox-label {\n\t\tdisplay: inline-block;\n\t\t" + (text(.25, bg)) + ";\n\t\tposition: relative;\n\t\tmargin-right: " + h + "em;\n\t}\n\t.settings-panel-checkbox-label:before {\n\t\tfont-family: \"Material Icons\";\n\t\tcontent: '';\n\t\tfont-weight: bolder;\n\t\tfont-size: " + (h*.75) + "em;\n\t\tdisplay: block;\n\t\tfloat: left;\n\t\twidth: 2em;\n\t\tmargin-right: -2em;\n\t\tmargin-top: -" + (h*.1) + "em;\n\t\topacity: 0;\n\t\tz-index: 1;\n\t\tposition: relative;\n\t\tcolor: " + (tone(fg)) + ";\n\t\ttext-shadow: 0 1px 2px " + (alpha(shadow, .5)) + ";\n\t}\n\t.settings-panel-checkbox-label:after {\n\t\tcontent: '';\n\t\tdisplay: block;\n\t\tfloat: left;\n\t\tmargin-top: -" + (h*.05) + "em;\n\t\twidth: " + (h*.666) + "em;\n\t\theight: " + (h*.666) + "em;\n\t\tborder-radius: " + radius + "px;\n\t\tposition: relative;\n\t\tmargin-right: " + (h/3) + "em;\n\t\tline-height: " + (h/2) + "em;\n\t\ttext-align: center;\n\t\tz-index: 0;\n\t\t" + (push(.915)) + ";\n\t}\n\t.settings-panel-checkbox-label:hover {\n\t\tcolor: " + (tone(fg)) + ";\n\t}\n\t.settings-panel-checkbox-label:hover:after {\n\t\t" + (push(.93, .07)) + ";\n\t}\n\t.settings-panel-checkbox:checked + .settings-panel-checkbox-label {\n\t}\n\t.settings-panel-checkbox:checked + .settings-panel-checkbox-label:before {\n\t\topacity: 1;\n\t}\n\t.settings-panel-checkbox:checked + .settings-panel-checkbox-label:after {\n\t\t" + (push(.93, .1)) + ";\n\t}\n\n\n\t/** Decorations */\n\t::-webkit-input-placeholder {\n\t\tcolor: " + (alpha(tone(0), .5)) + ";\n\t}\n\t::-moz-placeholder {\n\t\tcolor: " + (alpha(tone(0), .5)) + ";\n\t}\n\t:-ms-input-placeholder {\n\t\tcolor: " + (alpha(tone(0), .5)) + ";\n\t}\n\t:-moz-placeholder {\n\t\tcolor: " + (alpha(tone(0), .5)) + ";\n\t}\n\t::-moz-selection {\n\t\tbackground: " + (tone(fg)) + ";\n\t\tcolor: " + (tone(bg)) + ";\n\t}\n\t::selection {\n\t\tbackground: " + (tone(fg)) + ";\n\t\tcolor: " + (tone(bg)) + ";\n\t}\n\t:host hr {\n\t\tborder: none;\n\t\theight: 3px;\n\t\tborder-radius: " + radius + "px;\n\t\tmargin: " + (h/3) + "em 0;\n\t\t" + (push(bg * .98, .05)) + ";\n\t}\n\t";
};
},{"./none":74,"add-px-to-style":3,"color-interpolate":8,"google-fonts":22,"scope-css":54,"tinycolor2":78}],76:[function(require,module,exports){
'use strict';

var bindAll = require('lodash.bindall');
var transform = require('dom-transform');
var tinycolor = require('tinycolor2');
var Emitter = require('component-emitter');
var isNumber = require('is-number');
var clamp = require('./src/utils/maths/clamp');

/**
 * Creates a new Colorpicker
 * @param {Object} options
 * @param {String|Number|Object} options.color The default color that the colorpicker will display. Default is #FFFFFF. It can be a hexadecimal number or an hex String.
 * @param {String|Number|Object} options.background The background color of the colorpicker. Default is transparent. It can be a hexadecimal number or an hex String.
 * @param {DomElement} options.el A dom node to add the colorpicker to. You can also use `colorPicker.appendTo(domNode)` afterwards if you prefer.
 * @param {Number} options.width Desired width of the color picker. Default is 175.
 * @param {Number} options.height Desired height of the color picker. Default is 150.
 */
function SimpleColorPicker(options) {
  // options
  options = options || {};

  // properties
  this.color = null;
  this.width = 0;
  this.height = 0;
  this.hue = 0;
  this.choosing = false;
  this.position = {x: 0, y: 0};
  this.huePosition = 0;
  this.saturationWidth = 0;
  this.maxHue = 0;
  this.inputIsNumber = false;

  // bind methods to scope (only if needed)
  bindAll(this, '_onSaturationMouseMove', '_onSaturationMouseDown', '_onSaturationMouseUp', '_onHueMouseDown', '_onHueMouseUp', '_onHueMouseMove');

  // create dom
  this.$el = document.createElement('div');
  this.$el.className = 'Scp';
  this.$el.innerHTML = [
    '<div class="Scp-saturation">',
      '<div class="Scp-brightness"></div>',
      '<div class="Scp-sbSelector"></div>',
    '</div>',
    '<div class="Scp-hue">',
      '<div class="Scp-hSelector"></div>',
    '</div>'
  ].join('\n');

  // dom accessors
  this.$saturation = this.$el.querySelector('.Scp-saturation');
  this.$hue = this.$el.querySelector('.Scp-hue');
  this.$sbSelector = this.$el.querySelector('.Scp-sbSelector');
  this.$hSelector = this.$el.querySelector('.Scp-hSelector');

  // event listeners
  this.$saturation.addEventListener('mousedown', this._onSaturationMouseDown);
  this.$saturation.addEventListener('touchstart', this._onSaturationMouseDown);
  this.$hue.addEventListener('mousedown', this._onHueMouseDown);
  this.$hue.addEventListener('touchstart', this._onHueMouseDown);

  // some styling and DOMing from options
  if (options.el) {
    this.appendTo(options.el);
  }
  if (options.background) {
    this.setBackgroundColor(options.background);
  }
  this.setSize(options.width || 175, options.height || 150);
  this.setColor(options.color);

  return this;
}

Emitter(SimpleColorPicker.prototype);

/* =============================================================================
  Public API
============================================================================= */
/**
 * Add the colorPicker instance to a domElement.
 * @param  {domElement} domElement
 * @return {colorPicker} returns itself for chaining purpose
 */
SimpleColorPicker.prototype.appendTo = function(domElement) {
  domElement.appendChild(this.$el);
  return this;
};

/**
 * Removes colorpicker from is parent and kill all listeners.
 * Call this method for proper destroy.
 */
SimpleColorPicker.prototype.remove = function() {
  this.$saturation.removeEventListener('mousedown', this._onSaturationMouseDown);
  this.$saturation.removeEventListener('touchstart', this._onSaturationMouseDown);
  this.$hue.removeEventListener('mousedown', this._onHueMouseDown);
  this.$hue.removeEventListener('touchstart', this._onHueMouseDown);
  this._onSaturationMouseUp();
  this._onHueMouseUp();
  this.off();
  if (this.$el.parentNode) {
    this.$el.parentNode.removeChild(this.$el);
  }
};

/**
 * Manually set the current color of the colorpicker. This is the method
 * used on instantiation to convert `color` option to actual color for
 * the colorpicker. Param can be a hexadecimal number or an hex String.
 * @param {String|Number} color hex color desired
 */
SimpleColorPicker.prototype.setColor = function(color) {
  if(isNumber(color)) {
    this.inputIsNumber = true;
    color = '#' + ('00000' + (color | 0).toString(16)).substr(-6);
  }
  else {
    this.inputIsNumber = false;
  }
  this.color = tinycolor(color);

  var hsvColor = this.color.toHsv();

  if(!isNaN(hsvColor.h)) {
    this.hue = hsvColor.h;
  }

  this._moveSelectorTo(this.saturationWidth * hsvColor.s, (1 - hsvColor.v) * this.height);
  this._moveHueTo((1 - (this.hue / 360)) * this.height);

  this._updateHue();
  return this;
};

/**
 * Set size of the color picker for a given width and height. Note that
 * a padding of 5px will be added if you chose to use the background option
 * of the constructor.
 * @param {Number} width
 * @param {Number} height
 */
SimpleColorPicker.prototype.setSize = function(width, height) {
  this.width = width;
  this.height = height;
  this.$el.style.width = this.width + 'px';
  this.$el.style.height = this.height + 'px';
  this.saturationWidth = this.width - 25;
  this.maxHue = this.height - 2;
  return this;
};

/**
 * Set the background color of the colorpicker. It also adds a 5px padding
 * for design purpose.
 * @param {String|Number} color hex color desired for background
 */
SimpleColorPicker.prototype.setBackgroundColor = function(color) {
  if(isNumber(color)) {
    color = '#' + ('00000' + (color | 0).toString(16)).substr(-6);
  }
  this.$el.style.padding = '5px';
  this.$el.style.background = tinycolor(color).toHexString();
};

/**
 * Removes background of the colorpicker if previously set. It's no use
 * calling this method if you didn't set the background option on start
 * or if you didn't call setBackgroundColor previously.
 */
SimpleColorPicker.prototype.setNoBackground = function() {
  this.$el.style.padding = '0px';
  this.$el.style.background = 'none';
};

/**
 * Registers callback to the update event of the colorpicker.
 * ColorPicker inherits from [component/emitter](https://github.com/component/emitter)
 * so you could do the same thing by calling `colorPicker.on('update');`
 * @param  {Function} callback
 * @return {colorPicker} returns itself for chaining purpose
 */
SimpleColorPicker.prototype.onChange = function(callback) {
  this.on('update', callback);
  this.emit('update', this.getHexString());
  return this;
};

/* =============================================================================
  Color getters
============================================================================= */
/**
 * Main color getter, will return a formatted color string depending on input
 * or a number depending on the last setColor call.
 * @return {Number|String}
 */
SimpleColorPicker.prototype.getColor = function() {
  if(this.inputIsNumber) {
    return this.getHexNumber();
  }
  return this.color.toString();
};

/**
 * Returns color as css hex string (ex: '#FF0000').
 * @return {String}
 */
SimpleColorPicker.prototype.getHexString = function() {
  return this.color.toHexString().toUpperCase();
};

/**
 * Returns color as number (ex: 0xFF0000).
 * @return {Number}
 */
SimpleColorPicker.prototype.getHexNumber = function() {
  return parseInt(this.color.toHex(), 16);
};

/**
 * Returns color as {r: 255, g: 0, b: 0} object.
 * @return {Object}
 */
SimpleColorPicker.prototype.getRGB = function() {
  return this.color.toRgb();
};

/**
 * Returns color as {h: 100, s: 1, v: 1} object.
 * @return {Object}
 */
SimpleColorPicker.prototype.getHSV = function() {
  return this.color.toHsv();
};

/**
 * Returns true if color is perceived as dark
 * @return {Boolean}
 */
SimpleColorPicker.prototype.isDark = function() {
  return this.color.isDark();
};

/**
 * Returns true if color is perceived as light
 * @return {Boolean}
 */
SimpleColorPicker.prototype.isLight = function() {
  return this.color.isLight();
};

/* =============================================================================
  "Private" Methods LOL silly javascript
============================================================================= */
SimpleColorPicker.prototype._moveSelectorTo = function(x, y) {
  this.position.x = clamp(x, 0, this.saturationWidth);
  this.position.y = clamp(y, 0, this.height);

  transform(this.$sbSelector, {
    x: this.position.x,
    y: this.position.y
  });

};

SimpleColorPicker.prototype._updateColorFromPosition = function() {
  this.color = tinycolor({h: this.hue, s: this.position.x / this.saturationWidth, v: 1 - (this.position.y / this.height)});
  this._updateColor();
};

SimpleColorPicker.prototype._moveHueTo = function(y) {
  this.huePosition = clamp(y, 0, this.maxHue);

  transform(this.$hSelector, {
    y: this.huePosition
  });

};

SimpleColorPicker.prototype._updateHueFromPosition = function() {
  var hsvColor = this.color.toHsv();
  this.hue = 360 * (1 - (this.huePosition / this.maxHue));
  this.color = tinycolor({h: this.hue, s: hsvColor.s, v: hsvColor.v});
  this._updateHue();
};

SimpleColorPicker.prototype._updateHue = function() {
  var hueColor = tinycolor({h: this.hue, s: 1, v: 1});
  this.$saturation.style.background = 'linear-gradient(to right, #fff 0%, ' + hueColor.toHexString() + ' 100%)';
  this._updateColor();
};

SimpleColorPicker.prototype._updateColor = function() {
  this.$sbSelector.style.background = this.color.toHexString();
  this.$sbSelector.style.borderColor = this.color.isDark() ? '#FFF' : '#000';
  this.emit('update', this.color.toHexString());
};

/* =============================================================================
  Events handlers
============================================================================= */
SimpleColorPicker.prototype._onSaturationMouseDown = function(e) {
  this.choosing = true;
  var sbOffset = this.$saturation.getBoundingClientRect();
  var xPos = (e.type.indexOf('touch') === 0) ? e.touches[0].clientX : e.clientX;
  var yPos = (e.type.indexOf('touch') === 0) ? e.touches[0].clientY : e.clientY;
  this._moveSelectorTo(xPos - sbOffset.left, yPos - sbOffset.top);
  this._updateColorFromPosition();
  window.addEventListener('mouseup', this._onSaturationMouseUp);
  window.addEventListener('touchend', this._onSaturationMouseUp);
  window.addEventListener('mousemove', this._onSaturationMouseMove);
  window.addEventListener('touchmove', this._onSaturationMouseMove);
  e.preventDefault();
};

SimpleColorPicker.prototype._onSaturationMouseMove = function(e) {
  var sbOffset = this.$saturation.getBoundingClientRect();
  var xPos = (e.type.indexOf('touch') === 0) ? e.touches[0].clientX : e.clientX;
  var yPos = (e.type.indexOf('touch') === 0) ? e.touches[0].clientY : e.clientY;
  this._moveSelectorTo(xPos - sbOffset.left, yPos - sbOffset.top);
  this._updateColorFromPosition();
};

SimpleColorPicker.prototype._onSaturationMouseUp = function() {
  this.choosing = false;
  window.removeEventListener('mouseup', this._onSaturationMouseUp);
  window.removeEventListener('touchend', this._onSaturationMouseUp);
  window.removeEventListener('mousemove', this._onSaturationMouseMove);
  window.removeEventListener('touchmove', this._onSaturationMouseMove);
};

SimpleColorPicker.prototype._onHueMouseDown = function(e) {
  this.choosing = true;
  var hOffset = this.$hue.getBoundingClientRect();
  var yPos = (e.type.indexOf('touch') === 0) ? e.touches[0].clientY : e.clientY;
  this._moveHueTo(yPos - hOffset.top);
  this._updateHueFromPosition();
  window.addEventListener('mouseup', this._onHueMouseUp);
  window.addEventListener('touchend', this._onHueMouseUp);
  window.addEventListener('mousemove', this._onHueMouseMove);
  window.addEventListener('touchmove', this._onHueMouseMove);
  e.preventDefault();
};

SimpleColorPicker.prototype._onHueMouseMove = function(e) {
  var hOffset = this.$hue.getBoundingClientRect();
  var yPos = (e.type.indexOf('touch') === 0) ? e.touches[0].clientY : e.clientY;
  this._moveHueTo(yPos - hOffset.top);
  this._updateHueFromPosition();
};

SimpleColorPicker.prototype._onHueMouseUp = function() {
  this.choosing = false;
  window.removeEventListener('mouseup', this._onHueMouseUp);
  window.removeEventListener('touchend', this._onHueMouseUp);
  window.removeEventListener('mousemove', this._onHueMouseMove);
  window.removeEventListener('touchmove', this._onHueMouseMove);
};

module.exports = SimpleColorPicker;

},{"./src/utils/maths/clamp":77,"component-emitter":13,"dom-transform":15,"is-number":31,"lodash.bindall":42,"tinycolor2":78}],77:[function(require,module,exports){
'use strict';

module.exports = function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
};
},{}],78:[function(require,module,exports){
// TinyColor v1.4.1
// https://github.com/bgrins/TinyColor
// Brian Grinstead, MIT License

(function(Math) {

var trimLeft = /^\s+/,
    trimRight = /\s+$/,
    tinyCounter = 0,
    mathRound = Math.round,
    mathMin = Math.min,
    mathMax = Math.max,
    mathRandom = Math.random;

function tinycolor (color, opts) {

    color = (color) ? color : '';
    opts = opts || { };

    // If input is already a tinycolor, return itself
    if (color instanceof tinycolor) {
       return color;
    }
    // If we are called as a function, call using new instead
    if (!(this instanceof tinycolor)) {
        return new tinycolor(color, opts);
    }

    var rgb = inputToRGB(color);
    this._originalInput = color,
    this._r = rgb.r,
    this._g = rgb.g,
    this._b = rgb.b,
    this._a = rgb.a,
    this._roundA = mathRound(100*this._a) / 100,
    this._format = opts.format || rgb.format;
    this._gradientType = opts.gradientType;

    // Don't let the range of [0,255] come back in [0,1].
    // Potentially lose a little bit of precision here, but will fix issues where
    // .5 gets interpreted as half of the total, instead of half of 1
    // If it was supposed to be 128, this was already taken care of by `inputToRgb`
    if (this._r < 1) { this._r = mathRound(this._r); }
    if (this._g < 1) { this._g = mathRound(this._g); }
    if (this._b < 1) { this._b = mathRound(this._b); }

    this._ok = rgb.ok;
    this._tc_id = tinyCounter++;
}

tinycolor.prototype = {
    isDark: function() {
        return this.getBrightness() < 128;
    },
    isLight: function() {
        return !this.isDark();
    },
    isValid: function() {
        return this._ok;
    },
    getOriginalInput: function() {
      return this._originalInput;
    },
    getFormat: function() {
        return this._format;
    },
    getAlpha: function() {
        return this._a;
    },
    getBrightness: function() {
        //http://www.w3.org/TR/AERT#color-contrast
        var rgb = this.toRgb();
        return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    },
    getLuminance: function() {
        //http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
        var rgb = this.toRgb();
        var RsRGB, GsRGB, BsRGB, R, G, B;
        RsRGB = rgb.r/255;
        GsRGB = rgb.g/255;
        BsRGB = rgb.b/255;

        if (RsRGB <= 0.03928) {R = RsRGB / 12.92;} else {R = Math.pow(((RsRGB + 0.055) / 1.055), 2.4);}
        if (GsRGB <= 0.03928) {G = GsRGB / 12.92;} else {G = Math.pow(((GsRGB + 0.055) / 1.055), 2.4);}
        if (BsRGB <= 0.03928) {B = BsRGB / 12.92;} else {B = Math.pow(((BsRGB + 0.055) / 1.055), 2.4);}
        return (0.2126 * R) + (0.7152 * G) + (0.0722 * B);
    },
    setAlpha: function(value) {
        this._a = boundAlpha(value);
        this._roundA = mathRound(100*this._a) / 100;
        return this;
    },
    toHsv: function() {
        var hsv = rgbToHsv(this._r, this._g, this._b);
        return { h: hsv.h * 360, s: hsv.s, v: hsv.v, a: this._a };
    },
    toHsvString: function() {
        var hsv = rgbToHsv(this._r, this._g, this._b);
        var h = mathRound(hsv.h * 360), s = mathRound(hsv.s * 100), v = mathRound(hsv.v * 100);
        return (this._a == 1) ?
          "hsv("  + h + ", " + s + "%, " + v + "%)" :
          "hsva(" + h + ", " + s + "%, " + v + "%, "+ this._roundA + ")";
    },
    toHsl: function() {
        var hsl = rgbToHsl(this._r, this._g, this._b);
        return { h: hsl.h * 360, s: hsl.s, l: hsl.l, a: this._a };
    },
    toHslString: function() {
        var hsl = rgbToHsl(this._r, this._g, this._b);
        var h = mathRound(hsl.h * 360), s = mathRound(hsl.s * 100), l = mathRound(hsl.l * 100);
        return (this._a == 1) ?
          "hsl("  + h + ", " + s + "%, " + l + "%)" :
          "hsla(" + h + ", " + s + "%, " + l + "%, "+ this._roundA + ")";
    },
    toHex: function(allow3Char) {
        return rgbToHex(this._r, this._g, this._b, allow3Char);
    },
    toHexString: function(allow3Char) {
        return '#' + this.toHex(allow3Char);
    },
    toHex8: function(allow4Char) {
        return rgbaToHex(this._r, this._g, this._b, this._a, allow4Char);
    },
    toHex8String: function(allow4Char) {
        return '#' + this.toHex8(allow4Char);
    },
    toRgb: function() {
        return { r: mathRound(this._r), g: mathRound(this._g), b: mathRound(this._b), a: this._a };
    },
    toRgbString: function() {
        return (this._a == 1) ?
          "rgb("  + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ")" :
          "rgba(" + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ", " + this._roundA + ")";
    },
    toPercentageRgb: function() {
        return { r: mathRound(bound01(this._r, 255) * 100) + "%", g: mathRound(bound01(this._g, 255) * 100) + "%", b: mathRound(bound01(this._b, 255) * 100) + "%", a: this._a };
    },
    toPercentageRgbString: function() {
        return (this._a == 1) ?
          "rgb("  + mathRound(bound01(this._r, 255) * 100) + "%, " + mathRound(bound01(this._g, 255) * 100) + "%, " + mathRound(bound01(this._b, 255) * 100) + "%)" :
          "rgba(" + mathRound(bound01(this._r, 255) * 100) + "%, " + mathRound(bound01(this._g, 255) * 100) + "%, " + mathRound(bound01(this._b, 255) * 100) + "%, " + this._roundA + ")";
    },
    toName: function() {
        if (this._a === 0) {
            return "transparent";
        }

        if (this._a < 1) {
            return false;
        }

        return hexNames[rgbToHex(this._r, this._g, this._b, true)] || false;
    },
    toFilter: function(secondColor) {
        var hex8String = '#' + rgbaToArgbHex(this._r, this._g, this._b, this._a);
        var secondHex8String = hex8String;
        var gradientType = this._gradientType ? "GradientType = 1, " : "";

        if (secondColor) {
            var s = tinycolor(secondColor);
            secondHex8String = '#' + rgbaToArgbHex(s._r, s._g, s._b, s._a);
        }

        return "progid:DXImageTransform.Microsoft.gradient("+gradientType+"startColorstr="+hex8String+",endColorstr="+secondHex8String+")";
    },
    toString: function(format) {
        var formatSet = !!format;
        format = format || this._format;

        var formattedString = false;
        var hasAlpha = this._a < 1 && this._a >= 0;
        var needsAlphaFormat = !formatSet && hasAlpha && (format === "hex" || format === "hex6" || format === "hex3" || format === "hex4" || format === "hex8" || format === "name");

        if (needsAlphaFormat) {
            // Special case for "transparent", all other non-alpha formats
            // will return rgba when there is transparency.
            if (format === "name" && this._a === 0) {
                return this.toName();
            }
            return this.toRgbString();
        }
        if (format === "rgb") {
            formattedString = this.toRgbString();
        }
        if (format === "prgb") {
            formattedString = this.toPercentageRgbString();
        }
        if (format === "hex" || format === "hex6") {
            formattedString = this.toHexString();
        }
        if (format === "hex3") {
            formattedString = this.toHexString(true);
        }
        if (format === "hex4") {
            formattedString = this.toHex8String(true);
        }
        if (format === "hex8") {
            formattedString = this.toHex8String();
        }
        if (format === "name") {
            formattedString = this.toName();
        }
        if (format === "hsl") {
            formattedString = this.toHslString();
        }
        if (format === "hsv") {
            formattedString = this.toHsvString();
        }

        return formattedString || this.toHexString();
    },
    clone: function() {
        return tinycolor(this.toString());
    },

    _applyModification: function(fn, args) {
        var color = fn.apply(null, [this].concat([].slice.call(args)));
        this._r = color._r;
        this._g = color._g;
        this._b = color._b;
        this.setAlpha(color._a);
        return this;
    },
    lighten: function() {
        return this._applyModification(lighten, arguments);
    },
    brighten: function() {
        return this._applyModification(brighten, arguments);
    },
    darken: function() {
        return this._applyModification(darken, arguments);
    },
    desaturate: function() {
        return this._applyModification(desaturate, arguments);
    },
    saturate: function() {
        return this._applyModification(saturate, arguments);
    },
    greyscale: function() {
        return this._applyModification(greyscale, arguments);
    },
    spin: function() {
        return this._applyModification(spin, arguments);
    },

    _applyCombination: function(fn, args) {
        return fn.apply(null, [this].concat([].slice.call(args)));
    },
    analogous: function() {
        return this._applyCombination(analogous, arguments);
    },
    complement: function() {
        return this._applyCombination(complement, arguments);
    },
    monochromatic: function() {
        return this._applyCombination(monochromatic, arguments);
    },
    splitcomplement: function() {
        return this._applyCombination(splitcomplement, arguments);
    },
    triad: function() {
        return this._applyCombination(triad, arguments);
    },
    tetrad: function() {
        return this._applyCombination(tetrad, arguments);
    }
};

// If input is an object, force 1 into "1.0" to handle ratios properly
// String input requires "1.0" as input, so 1 will be treated as 1
tinycolor.fromRatio = function(color, opts) {
    if (typeof color == "object") {
        var newColor = {};
        for (var i in color) {
            if (color.hasOwnProperty(i)) {
                if (i === "a") {
                    newColor[i] = color[i];
                }
                else {
                    newColor[i] = convertToPercentage(color[i]);
                }
            }
        }
        color = newColor;
    }

    return tinycolor(color, opts);
};

// Given a string or object, convert that input to RGB
// Possible string inputs:
//
//     "red"
//     "#f00" or "f00"
//     "#ff0000" or "ff0000"
//     "#ff000000" or "ff000000"
//     "rgb 255 0 0" or "rgb (255, 0, 0)"
//     "rgb 1.0 0 0" or "rgb (1, 0, 0)"
//     "rgba (255, 0, 0, 1)" or "rgba 255, 0, 0, 1"
//     "rgba (1.0, 0, 0, 1)" or "rgba 1.0, 0, 0, 1"
//     "hsl(0, 100%, 50%)" or "hsl 0 100% 50%"
//     "hsla(0, 100%, 50%, 1)" or "hsla 0 100% 50%, 1"
//     "hsv(0, 100%, 100%)" or "hsv 0 100% 100%"
//
function inputToRGB(color) {

    var rgb = { r: 0, g: 0, b: 0 };
    var a = 1;
    var s = null;
    var v = null;
    var l = null;
    var ok = false;
    var format = false;

    if (typeof color == "string") {
        color = stringInputToObject(color);
    }

    if (typeof color == "object") {
        if (isValidCSSUnit(color.r) && isValidCSSUnit(color.g) && isValidCSSUnit(color.b)) {
            rgb = rgbToRgb(color.r, color.g, color.b);
            ok = true;
            format = String(color.r).substr(-1) === "%" ? "prgb" : "rgb";
        }
        else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.v)) {
            s = convertToPercentage(color.s);
            v = convertToPercentage(color.v);
            rgb = hsvToRgb(color.h, s, v);
            ok = true;
            format = "hsv";
        }
        else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.l)) {
            s = convertToPercentage(color.s);
            l = convertToPercentage(color.l);
            rgb = hslToRgb(color.h, s, l);
            ok = true;
            format = "hsl";
        }

        if (color.hasOwnProperty("a")) {
            a = color.a;
        }
    }

    a = boundAlpha(a);

    return {
        ok: ok,
        format: color.format || format,
        r: mathMin(255, mathMax(rgb.r, 0)),
        g: mathMin(255, mathMax(rgb.g, 0)),
        b: mathMin(255, mathMax(rgb.b, 0)),
        a: a
    };
}


// Conversion Functions
// --------------------

// `rgbToHsl`, `rgbToHsv`, `hslToRgb`, `hsvToRgb` modified from:
// <http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript>

// `rgbToRgb`
// Handle bounds / percentage checking to conform to CSS color spec
// <http://www.w3.org/TR/css3-color/>
// *Assumes:* r, g, b in [0, 255] or [0, 1]
// *Returns:* { r, g, b } in [0, 255]
function rgbToRgb(r, g, b){
    return {
        r: bound01(r, 255) * 255,
        g: bound01(g, 255) * 255,
        b: bound01(b, 255) * 255
    };
}

// `rgbToHsl`
// Converts an RGB color value to HSL.
// *Assumes:* r, g, and b are contained in [0, 255] or [0, 1]
// *Returns:* { h, s, l } in [0,1]
function rgbToHsl(r, g, b) {

    r = bound01(r, 255);
    g = bound01(g, 255);
    b = bound01(b, 255);

    var max = mathMax(r, g, b), min = mathMin(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min) {
        h = s = 0; // achromatic
    }
    else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }

        h /= 6;
    }

    return { h: h, s: s, l: l };
}

// `hslToRgb`
// Converts an HSL color value to RGB.
// *Assumes:* h is contained in [0, 1] or [0, 360] and s and l are contained [0, 1] or [0, 100]
// *Returns:* { r, g, b } in the set [0, 255]
function hslToRgb(h, s, l) {
    var r, g, b;

    h = bound01(h, 360);
    s = bound01(s, 100);
    l = bound01(l, 100);

    function hue2rgb(p, q, t) {
        if(t < 0) t += 1;
        if(t > 1) t -= 1;
        if(t < 1/6) return p + (q - p) * 6 * t;
        if(t < 1/2) return q;
        if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
    }

    if(s === 0) {
        r = g = b = l; // achromatic
    }
    else {
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return { r: r * 255, g: g * 255, b: b * 255 };
}

// `rgbToHsv`
// Converts an RGB color value to HSV
// *Assumes:* r, g, and b are contained in the set [0, 255] or [0, 1]
// *Returns:* { h, s, v } in [0,1]
function rgbToHsv(r, g, b) {

    r = bound01(r, 255);
    g = bound01(g, 255);
    b = bound01(b, 255);

    var max = mathMax(r, g, b), min = mathMin(r, g, b);
    var h, s, v = max;

    var d = max - min;
    s = max === 0 ? 0 : d / max;

    if(max == min) {
        h = 0; // achromatic
    }
    else {
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: h, s: s, v: v };
}

// `hsvToRgb`
// Converts an HSV color value to RGB.
// *Assumes:* h is contained in [0, 1] or [0, 360] and s and v are contained in [0, 1] or [0, 100]
// *Returns:* { r, g, b } in the set [0, 255]
 function hsvToRgb(h, s, v) {

    h = bound01(h, 360) * 6;
    s = bound01(s, 100);
    v = bound01(v, 100);

    var i = Math.floor(h),
        f = h - i,
        p = v * (1 - s),
        q = v * (1 - f * s),
        t = v * (1 - (1 - f) * s),
        mod = i % 6,
        r = [v, q, p, p, t, v][mod],
        g = [t, v, v, q, p, p][mod],
        b = [p, p, t, v, v, q][mod];

    return { r: r * 255, g: g * 255, b: b * 255 };
}

// `rgbToHex`
// Converts an RGB color to hex
// Assumes r, g, and b are contained in the set [0, 255]
// Returns a 3 or 6 character hex
function rgbToHex(r, g, b, allow3Char) {

    var hex = [
        pad2(mathRound(r).toString(16)),
        pad2(mathRound(g).toString(16)),
        pad2(mathRound(b).toString(16))
    ];

    // Return a 3 character hex if possible
    if (allow3Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1)) {
        return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
    }

    return hex.join("");
}

// `rgbaToHex`
// Converts an RGBA color plus alpha transparency to hex
// Assumes r, g, b are contained in the set [0, 255] and
// a in [0, 1]. Returns a 4 or 8 character rgba hex
function rgbaToHex(r, g, b, a, allow4Char) {

    var hex = [
        pad2(mathRound(r).toString(16)),
        pad2(mathRound(g).toString(16)),
        pad2(mathRound(b).toString(16)),
        pad2(convertDecimalToHex(a))
    ];

    // Return a 4 character hex if possible
    if (allow4Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1) && hex[3].charAt(0) == hex[3].charAt(1)) {
        return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0) + hex[3].charAt(0);
    }

    return hex.join("");
}

// `rgbaToArgbHex`
// Converts an RGBA color to an ARGB Hex8 string
// Rarely used, but required for "toFilter()"
function rgbaToArgbHex(r, g, b, a) {

    var hex = [
        pad2(convertDecimalToHex(a)),
        pad2(mathRound(r).toString(16)),
        pad2(mathRound(g).toString(16)),
        pad2(mathRound(b).toString(16))
    ];

    return hex.join("");
}

// `equals`
// Can be called with any tinycolor input
tinycolor.equals = function (color1, color2) {
    if (!color1 || !color2) { return false; }
    return tinycolor(color1).toRgbString() == tinycolor(color2).toRgbString();
};

tinycolor.random = function() {
    return tinycolor.fromRatio({
        r: mathRandom(),
        g: mathRandom(),
        b: mathRandom()
    });
};


// Modification Functions
// ----------------------
// Thanks to less.js for some of the basics here
// <https://github.com/cloudhead/less.js/blob/master/lib/less/functions.js>

function desaturate(color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var hsl = tinycolor(color).toHsl();
    hsl.s -= amount / 100;
    hsl.s = clamp01(hsl.s);
    return tinycolor(hsl);
}

function saturate(color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var hsl = tinycolor(color).toHsl();
    hsl.s += amount / 100;
    hsl.s = clamp01(hsl.s);
    return tinycolor(hsl);
}

function greyscale(color) {
    return tinycolor(color).desaturate(100);
}

function lighten (color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var hsl = tinycolor(color).toHsl();
    hsl.l += amount / 100;
    hsl.l = clamp01(hsl.l);
    return tinycolor(hsl);
}

function brighten(color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var rgb = tinycolor(color).toRgb();
    rgb.r = mathMax(0, mathMin(255, rgb.r - mathRound(255 * - (amount / 100))));
    rgb.g = mathMax(0, mathMin(255, rgb.g - mathRound(255 * - (amount / 100))));
    rgb.b = mathMax(0, mathMin(255, rgb.b - mathRound(255 * - (amount / 100))));
    return tinycolor(rgb);
}

function darken (color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var hsl = tinycolor(color).toHsl();
    hsl.l -= amount / 100;
    hsl.l = clamp01(hsl.l);
    return tinycolor(hsl);
}

// Spin takes a positive or negative amount within [-360, 360] indicating the change of hue.
// Values outside of this range will be wrapped into this range.
function spin(color, amount) {
    var hsl = tinycolor(color).toHsl();
    var hue = (hsl.h + amount) % 360;
    hsl.h = hue < 0 ? 360 + hue : hue;
    return tinycolor(hsl);
}

// Combination Functions
// ---------------------
// Thanks to jQuery xColor for some of the ideas behind these
// <https://github.com/infusion/jQuery-xcolor/blob/master/jquery.xcolor.js>

function complement(color) {
    var hsl = tinycolor(color).toHsl();
    hsl.h = (hsl.h + 180) % 360;
    return tinycolor(hsl);
}

function triad(color) {
    var hsl = tinycolor(color).toHsl();
    var h = hsl.h;
    return [
        tinycolor(color),
        tinycolor({ h: (h + 120) % 360, s: hsl.s, l: hsl.l }),
        tinycolor({ h: (h + 240) % 360, s: hsl.s, l: hsl.l })
    ];
}

function tetrad(color) {
    var hsl = tinycolor(color).toHsl();
    var h = hsl.h;
    return [
        tinycolor(color),
        tinycolor({ h: (h + 90) % 360, s: hsl.s, l: hsl.l }),
        tinycolor({ h: (h + 180) % 360, s: hsl.s, l: hsl.l }),
        tinycolor({ h: (h + 270) % 360, s: hsl.s, l: hsl.l })
    ];
}

function splitcomplement(color) {
    var hsl = tinycolor(color).toHsl();
    var h = hsl.h;
    return [
        tinycolor(color),
        tinycolor({ h: (h + 72) % 360, s: hsl.s, l: hsl.l}),
        tinycolor({ h: (h + 216) % 360, s: hsl.s, l: hsl.l})
    ];
}

function analogous(color, results, slices) {
    results = results || 6;
    slices = slices || 30;

    var hsl = tinycolor(color).toHsl();
    var part = 360 / slices;
    var ret = [tinycolor(color)];

    for (hsl.h = ((hsl.h - (part * results >> 1)) + 720) % 360; --results; ) {
        hsl.h = (hsl.h + part) % 360;
        ret.push(tinycolor(hsl));
    }
    return ret;
}

function monochromatic(color, results) {
    results = results || 6;
    var hsv = tinycolor(color).toHsv();
    var h = hsv.h, s = hsv.s, v = hsv.v;
    var ret = [];
    var modification = 1 / results;

    while (results--) {
        ret.push(tinycolor({ h: h, s: s, v: v}));
        v = (v + modification) % 1;
    }

    return ret;
}

// Utility Functions
// ---------------------

tinycolor.mix = function(color1, color2, amount) {
    amount = (amount === 0) ? 0 : (amount || 50);

    var rgb1 = tinycolor(color1).toRgb();
    var rgb2 = tinycolor(color2).toRgb();

    var p = amount / 100;

    var rgba = {
        r: ((rgb2.r - rgb1.r) * p) + rgb1.r,
        g: ((rgb2.g - rgb1.g) * p) + rgb1.g,
        b: ((rgb2.b - rgb1.b) * p) + rgb1.b,
        a: ((rgb2.a - rgb1.a) * p) + rgb1.a
    };

    return tinycolor(rgba);
};


// Readability Functions
// ---------------------
// <http://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef (WCAG Version 2)

// `contrast`
// Analyze the 2 colors and returns the color contrast defined by (WCAG Version 2)
tinycolor.readability = function(color1, color2) {
    var c1 = tinycolor(color1);
    var c2 = tinycolor(color2);
    return (Math.max(c1.getLuminance(),c2.getLuminance())+0.05) / (Math.min(c1.getLuminance(),c2.getLuminance())+0.05);
};

// `isReadable`
// Ensure that foreground and background color combinations meet WCAG2 guidelines.
// The third argument is an optional Object.
//      the 'level' property states 'AA' or 'AAA' - if missing or invalid, it defaults to 'AA';
//      the 'size' property states 'large' or 'small' - if missing or invalid, it defaults to 'small'.
// If the entire object is absent, isReadable defaults to {level:"AA",size:"small"}.

// *Example*
//    tinycolor.isReadable("#000", "#111") => false
//    tinycolor.isReadable("#000", "#111",{level:"AA",size:"large"}) => false
tinycolor.isReadable = function(color1, color2, wcag2) {
    var readability = tinycolor.readability(color1, color2);
    var wcag2Parms, out;

    out = false;

    wcag2Parms = validateWCAG2Parms(wcag2);
    switch (wcag2Parms.level + wcag2Parms.size) {
        case "AAsmall":
        case "AAAlarge":
            out = readability >= 4.5;
            break;
        case "AAlarge":
            out = readability >= 3;
            break;
        case "AAAsmall":
            out = readability >= 7;
            break;
    }
    return out;

};

// `mostReadable`
// Given a base color and a list of possible foreground or background
// colors for that base, returns the most readable color.
// Optionally returns Black or White if the most readable color is unreadable.
// *Example*
//    tinycolor.mostReadable(tinycolor.mostReadable("#123", ["#124", "#125"],{includeFallbackColors:false}).toHexString(); // "#112255"
//    tinycolor.mostReadable(tinycolor.mostReadable("#123", ["#124", "#125"],{includeFallbackColors:true}).toHexString();  // "#ffffff"
//    tinycolor.mostReadable("#a8015a", ["#faf3f3"],{includeFallbackColors:true,level:"AAA",size:"large"}).toHexString(); // "#faf3f3"
//    tinycolor.mostReadable("#a8015a", ["#faf3f3"],{includeFallbackColors:true,level:"AAA",size:"small"}).toHexString(); // "#ffffff"
tinycolor.mostReadable = function(baseColor, colorList, args) {
    var bestColor = null;
    var bestScore = 0;
    var readability;
    var includeFallbackColors, level, size ;
    args = args || {};
    includeFallbackColors = args.includeFallbackColors ;
    level = args.level;
    size = args.size;

    for (var i= 0; i < colorList.length ; i++) {
        readability = tinycolor.readability(baseColor, colorList[i]);
        if (readability > bestScore) {
            bestScore = readability;
            bestColor = tinycolor(colorList[i]);
        }
    }

    if (tinycolor.isReadable(baseColor, bestColor, {"level":level,"size":size}) || !includeFallbackColors) {
        return bestColor;
    }
    else {
        args.includeFallbackColors=false;
        return tinycolor.mostReadable(baseColor,["#fff", "#000"],args);
    }
};


// Big List of Colors
// ------------------
// <http://www.w3.org/TR/css3-color/#svg-color>
var names = tinycolor.names = {
    aliceblue: "f0f8ff",
    antiquewhite: "faebd7",
    aqua: "0ff",
    aquamarine: "7fffd4",
    azure: "f0ffff",
    beige: "f5f5dc",
    bisque: "ffe4c4",
    black: "000",
    blanchedalmond: "ffebcd",
    blue: "00f",
    blueviolet: "8a2be2",
    brown: "a52a2a",
    burlywood: "deb887",
    burntsienna: "ea7e5d",
    cadetblue: "5f9ea0",
    chartreuse: "7fff00",
    chocolate: "d2691e",
    coral: "ff7f50",
    cornflowerblue: "6495ed",
    cornsilk: "fff8dc",
    crimson: "dc143c",
    cyan: "0ff",
    darkblue: "00008b",
    darkcyan: "008b8b",
    darkgoldenrod: "b8860b",
    darkgray: "a9a9a9",
    darkgreen: "006400",
    darkgrey: "a9a9a9",
    darkkhaki: "bdb76b",
    darkmagenta: "8b008b",
    darkolivegreen: "556b2f",
    darkorange: "ff8c00",
    darkorchid: "9932cc",
    darkred: "8b0000",
    darksalmon: "e9967a",
    darkseagreen: "8fbc8f",
    darkslateblue: "483d8b",
    darkslategray: "2f4f4f",
    darkslategrey: "2f4f4f",
    darkturquoise: "00ced1",
    darkviolet: "9400d3",
    deeppink: "ff1493",
    deepskyblue: "00bfff",
    dimgray: "696969",
    dimgrey: "696969",
    dodgerblue: "1e90ff",
    firebrick: "b22222",
    floralwhite: "fffaf0",
    forestgreen: "228b22",
    fuchsia: "f0f",
    gainsboro: "dcdcdc",
    ghostwhite: "f8f8ff",
    gold: "ffd700",
    goldenrod: "daa520",
    gray: "808080",
    green: "008000",
    greenyellow: "adff2f",
    grey: "808080",
    honeydew: "f0fff0",
    hotpink: "ff69b4",
    indianred: "cd5c5c",
    indigo: "4b0082",
    ivory: "fffff0",
    khaki: "f0e68c",
    lavender: "e6e6fa",
    lavenderblush: "fff0f5",
    lawngreen: "7cfc00",
    lemonchiffon: "fffacd",
    lightblue: "add8e6",
    lightcoral: "f08080",
    lightcyan: "e0ffff",
    lightgoldenrodyellow: "fafad2",
    lightgray: "d3d3d3",
    lightgreen: "90ee90",
    lightgrey: "d3d3d3",
    lightpink: "ffb6c1",
    lightsalmon: "ffa07a",
    lightseagreen: "20b2aa",
    lightskyblue: "87cefa",
    lightslategray: "789",
    lightslategrey: "789",
    lightsteelblue: "b0c4de",
    lightyellow: "ffffe0",
    lime: "0f0",
    limegreen: "32cd32",
    linen: "faf0e6",
    magenta: "f0f",
    maroon: "800000",
    mediumaquamarine: "66cdaa",
    mediumblue: "0000cd",
    mediumorchid: "ba55d3",
    mediumpurple: "9370db",
    mediumseagreen: "3cb371",
    mediumslateblue: "7b68ee",
    mediumspringgreen: "00fa9a",
    mediumturquoise: "48d1cc",
    mediumvioletred: "c71585",
    midnightblue: "191970",
    mintcream: "f5fffa",
    mistyrose: "ffe4e1",
    moccasin: "ffe4b5",
    navajowhite: "ffdead",
    navy: "000080",
    oldlace: "fdf5e6",
    olive: "808000",
    olivedrab: "6b8e23",
    orange: "ffa500",
    orangered: "ff4500",
    orchid: "da70d6",
    palegoldenrod: "eee8aa",
    palegreen: "98fb98",
    paleturquoise: "afeeee",
    palevioletred: "db7093",
    papayawhip: "ffefd5",
    peachpuff: "ffdab9",
    peru: "cd853f",
    pink: "ffc0cb",
    plum: "dda0dd",
    powderblue: "b0e0e6",
    purple: "800080",
    rebeccapurple: "663399",
    red: "f00",
    rosybrown: "bc8f8f",
    royalblue: "4169e1",
    saddlebrown: "8b4513",
    salmon: "fa8072",
    sandybrown: "f4a460",
    seagreen: "2e8b57",
    seashell: "fff5ee",
    sienna: "a0522d",
    silver: "c0c0c0",
    skyblue: "87ceeb",
    slateblue: "6a5acd",
    slategray: "708090",
    slategrey: "708090",
    snow: "fffafa",
    springgreen: "00ff7f",
    steelblue: "4682b4",
    tan: "d2b48c",
    teal: "008080",
    thistle: "d8bfd8",
    tomato: "ff6347",
    turquoise: "40e0d0",
    violet: "ee82ee",
    wheat: "f5deb3",
    white: "fff",
    whitesmoke: "f5f5f5",
    yellow: "ff0",
    yellowgreen: "9acd32"
};

// Make it easy to access colors via `hexNames[hex]`
var hexNames = tinycolor.hexNames = flip(names);


// Utilities
// ---------

// `{ 'name1': 'val1' }` becomes `{ 'val1': 'name1' }`
function flip(o) {
    var flipped = { };
    for (var i in o) {
        if (o.hasOwnProperty(i)) {
            flipped[o[i]] = i;
        }
    }
    return flipped;
}

// Return a valid alpha value [0,1] with all invalid values being set to 1
function boundAlpha(a) {
    a = parseFloat(a);

    if (isNaN(a) || a < 0 || a > 1) {
        a = 1;
    }

    return a;
}

// Take input from [0, n] and return it as [0, 1]
function bound01(n, max) {
    if (isOnePointZero(n)) { n = "100%"; }

    var processPercent = isPercentage(n);
    n = mathMin(max, mathMax(0, parseFloat(n)));

    // Automatically convert percentage into number
    if (processPercent) {
        n = parseInt(n * max, 10) / 100;
    }

    // Handle floating point rounding errors
    if ((Math.abs(n - max) < 0.000001)) {
        return 1;
    }

    // Convert into [0, 1] range if it isn't already
    return (n % max) / parseFloat(max);
}

// Force a number between 0 and 1
function clamp01(val) {
    return mathMin(1, mathMax(0, val));
}

// Parse a base-16 hex value into a base-10 integer
function parseIntFromHex(val) {
    return parseInt(val, 16);
}

// Need to handle 1.0 as 100%, since once it is a number, there is no difference between it and 1
// <http://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0>
function isOnePointZero(n) {
    return typeof n == "string" && n.indexOf('.') != -1 && parseFloat(n) === 1;
}

// Check to see if string passed in is a percentage
function isPercentage(n) {
    return typeof n === "string" && n.indexOf('%') != -1;
}

// Force a hex value to have 2 characters
function pad2(c) {
    return c.length == 1 ? '0' + c : '' + c;
}

// Replace a decimal with it's percentage value
function convertToPercentage(n) {
    if (n <= 1) {
        n = (n * 100) + "%";
    }

    return n;
}

// Converts a decimal to a hex value
function convertDecimalToHex(d) {
    return Math.round(parseFloat(d) * 255).toString(16);
}
// Converts a hex value to a decimal
function convertHexToDecimal(h) {
    return (parseIntFromHex(h) / 255);
}

var matchers = (function() {

    // <http://www.w3.org/TR/css3-values/#integers>
    var CSS_INTEGER = "[-\\+]?\\d+%?";

    // <http://www.w3.org/TR/css3-values/#number-value>
    var CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";

    // Allow positive/negative integer/number.  Don't capture the either/or, just the entire outcome.
    var CSS_UNIT = "(?:" + CSS_NUMBER + ")|(?:" + CSS_INTEGER + ")";

    // Actual matching.
    // Parentheses and commas are optional, but not required.
    // Whitespace can take the place of commas or opening paren
    var PERMISSIVE_MATCH3 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
    var PERMISSIVE_MATCH4 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";

    return {
        CSS_UNIT: new RegExp(CSS_UNIT),
        rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
        rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
        hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
        hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
        hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
        hsva: new RegExp("hsva" + PERMISSIVE_MATCH4),
        hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
        hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
        hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
        hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
    };
})();

// `isValidCSSUnit`
// Take in a single string / number and check to see if it looks like a CSS unit
// (see `matchers` above for definition).
function isValidCSSUnit(color) {
    return !!matchers.CSS_UNIT.exec(color);
}

// `stringInputToObject`
// Permissive string parsing.  Take in a number of formats, and output an object
// based on detected format.  Returns `{ r, g, b }` or `{ h, s, l }` or `{ h, s, v}`
function stringInputToObject(color) {

    color = color.replace(trimLeft,'').replace(trimRight, '').toLowerCase();
    var named = false;
    if (names[color]) {
        color = names[color];
        named = true;
    }
    else if (color == 'transparent') {
        return { r: 0, g: 0, b: 0, a: 0, format: "name" };
    }

    // Try to match string input using regular expressions.
    // Keep most of the number bounding out of this function - don't worry about [0,1] or [0,100] or [0,360]
    // Just return an object and let the conversion functions handle that.
    // This way the result will be the same whether the tinycolor is initialized with string or object.
    var match;
    if ((match = matchers.rgb.exec(color))) {
        return { r: match[1], g: match[2], b: match[3] };
    }
    if ((match = matchers.rgba.exec(color))) {
        return { r: match[1], g: match[2], b: match[3], a: match[4] };
    }
    if ((match = matchers.hsl.exec(color))) {
        return { h: match[1], s: match[2], l: match[3] };
    }
    if ((match = matchers.hsla.exec(color))) {
        return { h: match[1], s: match[2], l: match[3], a: match[4] };
    }
    if ((match = matchers.hsv.exec(color))) {
        return { h: match[1], s: match[2], v: match[3] };
    }
    if ((match = matchers.hsva.exec(color))) {
        return { h: match[1], s: match[2], v: match[3], a: match[4] };
    }
    if ((match = matchers.hex8.exec(color))) {
        return {
            r: parseIntFromHex(match[1]),
            g: parseIntFromHex(match[2]),
            b: parseIntFromHex(match[3]),
            a: convertHexToDecimal(match[4]),
            format: named ? "name" : "hex8"
        };
    }
    if ((match = matchers.hex6.exec(color))) {
        return {
            r: parseIntFromHex(match[1]),
            g: parseIntFromHex(match[2]),
            b: parseIntFromHex(match[3]),
            format: named ? "name" : "hex"
        };
    }
    if ((match = matchers.hex4.exec(color))) {
        return {
            r: parseIntFromHex(match[1] + '' + match[1]),
            g: parseIntFromHex(match[2] + '' + match[2]),
            b: parseIntFromHex(match[3] + '' + match[3]),
            a: convertHexToDecimal(match[4] + '' + match[4]),
            format: named ? "name" : "hex8"
        };
    }
    if ((match = matchers.hex3.exec(color))) {
        return {
            r: parseIntFromHex(match[1] + '' + match[1]),
            g: parseIntFromHex(match[2] + '' + match[2]),
            b: parseIntFromHex(match[3] + '' + match[3]),
            format: named ? "name" : "hex"
        };
    }

    return false;
}

function validateWCAG2Parms(parms) {
    // return valid WCAG2 parms for isReadable.
    // If input parms are invalid, return {"level":"AA", "size":"small"}
    var level, size;
    parms = parms || {"level":"AA", "size":"small"};
    level = (parms.level || "AA").toUpperCase();
    size = (parms.size || "small").toLowerCase();
    if (level !== "AA" && level !== "AAA") {
        level = "AA";
    }
    if (size !== "small" && size !== "large") {
        size = "small";
    }
    return {"level":level, "size":size};
}

// Node: Export function
if (typeof module !== "undefined" && module.exports) {
    module.exports = tinycolor;
}
// AMD/requirejs: Define the module
else if (typeof define === 'function' && define.amd) {
    define(function () {return tinycolor;});
}
// Browser: Expose to window
else {
    window.tinycolor = tinycolor;
}

})(Math);

},{}],79:[function(require,module,exports){

var space = require('to-space-case')

/**
 * Export.
 */

module.exports = toCamelCase

/**
 * Convert a `string` to camel case.
 *
 * @param {String} string
 * @return {String}
 */

function toCamelCase(string) {
  return space(string).replace(/\s(\w)/g, function (matches, letter) {
    return letter.toUpperCase()
  })
}

},{"to-space-case":81}],80:[function(require,module,exports){

/**
 * Export.
 */

module.exports = toNoCase

/**
 * Test whether a string is camel-case.
 */

var hasSpace = /\s/
var hasSeparator = /[\W_]/
var hasCamel = /([a-z][A-Z]|[A-Z][a-z])/

/**
 * Remove any starting case from a `string`, like camel or snake, but keep
 * spaces and punctuation that may be important otherwise.
 *
 * @param {String} string
 * @return {String}
 */

function toNoCase(string) {
  if (hasSpace.test(string)) return string.toLowerCase()
  if (hasSeparator.test(string)) return (unseparate(string) || string).toLowerCase()
  if (hasCamel.test(string)) return uncamelize(string).toLowerCase()
  return string.toLowerCase()
}

/**
 * Separator splitter.
 */

var separatorSplitter = /[\W_]+(.|$)/g

/**
 * Un-separate a `string`.
 *
 * @param {String} string
 * @return {String}
 */

function unseparate(string) {
  return string.replace(separatorSplitter, function (m, next) {
    return next ? ' ' + next : ''
  })
}

/**
 * Camelcase splitter.
 */

var camelSplitter = /(.)([A-Z]+)/g

/**
 * Un-camelcase a `string`.
 *
 * @param {String} string
 * @return {String}
 */

function uncamelize(string) {
  return string.replace(camelSplitter, function (m, previous, uppers) {
    return previous + ' ' + uppers.toLowerCase().split('').join(' ')
  })
}

},{}],81:[function(require,module,exports){

var clean = require('to-no-case')

/**
 * Export.
 */

module.exports = toSpaceCase

/**
 * Convert a `string` to space case.
 *
 * @param {String} string
 * @return {String}
 */

function toSpaceCase(string) {
  return clean(string).replace(/[\W_]+(.|$)/g, function (matches, match) {
    return match ? ' ' + match : ''
  }).trim()
}

},{"to-no-case":80}],82:[function(require,module,exports){

exports = module.exports = trim;

function trim(str){
  return str.replace(/^\s*|\s*$/g, '');
}

exports.left = function(str){
  return str.replace(/^\s*/, '');
};

exports.right = function(str){
  return str.replace(/\s*$/, '');
};

},{}],83:[function(require,module,exports){
/**
 * @module wavefont/test
 *
 * Render waveform typeface in browser
 */
'use strict';

require('enable-mobile');
var css = require('insert-styles');
var uid = require('get-uid');
var Panel = require('settings-panel');
var addFont = require('add-font');


document.body.style.overflow = 'hidden';

addFont('./wavefont-bars.otf', 'font-family: wavefont; font-style: normal;');
addFont('./wavefont-bars-symmetrical.otf', 'font-family: wavefont; font-style: italic;');


// Build
// const build = require('./');

// let id = uid();

// document.fonts.clear();

// addToFonts(build({
// 	name: `wf-${id}`,
// 	symmetrical: false
// }).toArrayBuffer(), `wf-${id}`);

// addToFonts(build({
// 	name: `wf-${id}-symm`,
// 	symmetrical: true
// }).toArrayBuffer(), `wf-${id}-symm`);


// //add font to included font-faces
// function addToFonts (buffer, id) {
// 	//CSS fonts API

// 	let fontface = new window.FontFace(id, buffer)

// 	if ( fontface.status === 'error' ) {
// 		throw new Error('Fontface is invalid and cannot be displayed');
// 	}

// 	document.fonts.add( fontface );
// };



//create preview canvas
// let canvas = document.body.appendChild(document.createElement('canvas'));
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight/2;
// let context = canvas.getContext('2d');
// canvas.style.cssText = `
// 	position: absolute;
// 	top: 0;
// 	left: 0;
// 	right: 0;
// 	opacity: .85;
// 	pointer-events: none;
// `;
// for (var i = 0; i < font2.glyphs.length; i++) {
// 	var glyph = font2.glyphs.get(i);
// 	var x = i*10 + 60;
// 	var y = 60;
// 	var fontSize = 50;
// 	glyph.draw(context, x, y, fontSize);
// 	glyph.drawPoints(context, x, y, fontSize);
// 	glyph.drawMetrics(context, x, y, fontSize);
// }



//draw natural ranges with sine
var el = document.body.appendChild(document.createElement('textarea'));
el.style.cssText = "\n\tfont-family: wavefont;\n\twidth: 100vw;\n\theight: 100vh;\n\tline-height: 1;\n\tletter-spacing: 0px;\n\tfont-size: 72px;\n";


var ghIcon = "<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"784\" height=\"1024\" viewBox=\"0 0 784 1024\"><path d=\"M4.168 480.005q0 107.053 52.114 194.314 52.114 90.085 141.399 141.799t194.314 51.714q105.441 0 195.126-51.714 89.685-52.114 141.199-141.599t51.514-194.514q0-106.652-51.714-195.126-52.114-89.685-141.599-141.199t-194.514-51.514q-107.053 0-194.314 52.114-90.085 52.114-141.799 141.399t-51.714 194.314zM68.802 480.005q0-64.634 25.451-124.832t69.482-103.828q44.031-44.031 103.828-69.282t124.432-25.251 124.832 25.251 104.229 69.282q43.631 43.631 68.882 103.828t25.251 124.832q0 69.482-28.487 132.504t-79.989 108.876-117.76 66.458v-113.924q0-42.419-34.747-66.257 85.238-7.672 124.632-43.23t39.383-112.712q0-59.786-36.759-100.593 7.272-21.815 7.272-42.018 0-29.899-13.732-54.939-27.063 0-48.478 8.884t-52.515 30.699q-37.571-8.484-77.565-8.484-45.654 0-85.238 9.295-30.299-22.216-52.314-31.311t-49.891-9.084q-13.332 25.451-13.332 54.939 0 21.004 6.871 42.419-36.759 39.594-36.759 100.192 0 77.165 39.183 112.312t125.644 43.23q-23.027 15.355-31.911 44.843-19.792 6.871-41.207 6.871-16.156 0-27.875-7.272-3.636-2.024-6.66-4.236t-6.26-5.448-5.248-5.048-5.248-6.26-4.236-5.659-4.848-6.46-4.236-5.659q-18.991-25.051-45.243-25.051-14.143 0-14.143 6.060 0 2.424 6.871 8.083 12.931 11.308 13.732 12.12 9.696 7.672 10.908 9.696 11.719 14.544 17.779 31.911 22.627 50.502 77.565 50.502 8.884 0 34.747-4.036v85.649q-66.257-20.603-117.76-66.458t-79.989-108.876-28.487-132.504z\"></path></svg>";

var panel = Panel({
	symmetrical: {
		type: 'checkbox',
		label: 'Symmetrical',
		value: false,
		change: function (v) {
			el.style.fontStyle = v ? 'italic' : 'normal';
		}
	},
	fontSize: {
		label: 'Font size',
		type: 'range',
		value: 64,
		min: 9,
		max: 200,
		step: 1,
		change: function (v) {
			el.style.fontSize = v + 'px';
		}
	},
	generate: {
		type: 'button',
		label: 'Regenerate data',
		action: function (v) {
			genData();
		}
	}
}, {
	theme: require('settings-panel/theme/typer'),
	title: ("<a href=\"https://github.com/dfcreative/wavefont\" style=\"margin-left: -1em\">Wavefont <span style=\"position: absolute; opacity: 1; margin-top: .12em; margin-left: .4em; width: .9em; height: .9em;\">" + ghIcon + "</span></a>"),
	css: "\n\t\t:host {\n\t\t\tposition: absolute;\n\t\t\tz-index: 1;\n\t\t\ttop: 50%;\n\t\t\tleft: 50%;\n\t\t\twidth: 20rem;\n\t\t\tmargin-left: -10rem;\n\t\t\tmargin-top: -5rem;\n\t\t}\n\n\t\t:host .settings-panel-title {\n\t\t\ttext-align: center;\n\t\t}\n\n\t\t:host .settings-panel-checkbox-label {\n\t\t\tposition: relative;\n\t\t\tleft: 13.2em;\n\t\t}\n\t"
});


//regenerate data
function genData () {
	var rate = 44100;
	var len = 44100;
	var offset = 0x0200;

	var f1 = 5000 * Math.random();
	var f2 = 3000 * Math.random();
	var f3 = Math.random() * 53 + 17;
	var f4 = Math.random() * 27 + 173;

	var str = '';
	var isZero = false;
	for (var i = .5; i < len; i++) {
		var amp = Math.sin(Math.PI * 2 * i * f1*2 / rate)*.5 + Math.sin(Math.PI * 2 * i * f1*3 / rate)*.25 + Math.sin(Math.PI * 2 * i * f1*4 / rate)*.25;
		// amp *= Math.exp(-i/44100);
		// amp *= Math.sin(Math.PI * 2 * i * 2 * Math.sin(Math.PI * 2 * i * f1*2 / rate) / rate);
		// let amp = Math.random();
		amp *= Math.sin(Math.PI * 2 * i * f2*2 / rate + 13 * Math.sin(Math.PI * 2 * i * f2*.08 / rate));

		//spacer sins
		var spacerAmp1 =  Math.max(Math.sin(Math.PI * 2 * i * f3 * 2 / rate  + 1) * .5 + .49, 0);
		var spacerAmp2 = Math.max(Math.sin(Math.PI * 2 * i * f4 * 2 / rate  + 3) * .5 + .49, 0);
		amp *= spacerAmp1;
		amp *= spacerAmp2;

		//insert spaces where spacer amp is low
		var idx
		if (!spacerAmp1 || !spacerAmp2) {
			idx = isZero ? 0x0020 : 0x007c;
			isZero = true;
		}
		else {
			isZero = false;
			idx = Math.floor(offset + amp * 127);
		}

		str += String.fromCharCode(idx);
	}

	el.value = str;
}
genData();
},{"add-font":2,"enable-mobile":18,"get-uid":21,"insert-styles":29,"settings-panel":59,"settings-panel/theme/typer":75}]},{},[83]);
