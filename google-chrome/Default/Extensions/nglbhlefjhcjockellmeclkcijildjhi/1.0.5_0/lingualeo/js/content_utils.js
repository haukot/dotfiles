// ==UserScript==
// @name LinguaLeoUtils
// @all-frames true
// @include http://*
// @include https://*
// @exclude http*://*facebook.com/plugins/*
// @exclude http*://*twitter.com/widgets/*
// @exclude http*://plusone.google.com/*
// ==/UserScript==



//----------------------------------------------
// crossbrowser Event object (custom fixes last 13.09.2012)
// from http://javascript.ru/tutorial/events/crossbrowser
var Event = (function() {

  var guid = 0;
    
  function fixEvent(event) {
	event = event || window.event;
  
    if ( event.isFixed ) {
      return event;
    }
    event.isFixed = true;
  
    event.preventDefault = event.preventDefault || function(){this.returnValue = false};
    event.stopPropagation = event.stopPropagaton || function(){this.cancelBubble = true};
    
    if (!event.target) {
        event.target = event.srcElement;
    }
  
    if (!event.relatedTarget && event.fromElement) {
		//TODO: here may be problems in Opera
		event.relatedTarget = event.fromElement == event.target ? event.toElement : event.fromElement;
    }
  
    if ( event.pageX == null && event.clientX != null ) {
        var html = document.documentElement, body = document.body;
        event.pageX = event.clientX + (html && html.scrollLeft || body && body.scrollLeft || 0) - (html.clientLeft || 0);
        event.pageY = event.clientY + (html && html.scrollTop || body && body.scrollTop || 0) - (html.clientTop || 0);
    }
  
    if ( !event.which && event.button ) {
        event.which = (event.button & 1 ? 1 : ( event.button & 2 ? 3 : ( event.button & 4 ? 2 : 0 ) ));
    }
	
	return event;
  }  
  
  /* Вызывается в контексте элемента всегда this = element */
  function commonHandle(event) {
    event = fixEvent(event);
    
    var handlers = this.custom_universal_events[event.type];

	for ( var g in handlers ) {
      var handler = handlers[g]['handler'];
		event['customData'] = handlers[g]['data'];
      var ret = handler.call(this, event);
      if ( ret === false ) {
          event.preventDefault();
          event.stopPropagation();
      }
    }
  }
  
  var Event = {
    add: function(elem, type, handler, data) {
      if (elem.setInterval && ( elem != window && !elem.frameElement ) ) {
        elem = window;
      }
      
      if (!handler['guid']) {
        handler['guid'] = ++guid;
      }
      
      if (!elem.custom_universal_events) {
        elem.custom_universal_events = {};
		elem.handle = function(event) {
		  if (typeof Event !== "undefined") {
			return commonHandle.call(elem, event);
		  }
        }
      }
	  
      if (!elem.custom_universal_events[type]) {
        elem.custom_universal_events[type] = {};   
      
        if (elem.addEventListener)
		  elem.addEventListener(type, elem.handle, false);
		else if (elem.attachEvent)
          elem.attachEvent("on" + type, elem.handle);
      }
      
      elem.custom_universal_events[type][handler['guid']] = {'handler': handler, 'data': data}; 
    },
    
    remove: function(elem, type, handler) {
      var handlers = elem.custom_universal_events && elem.custom_universal_events[type]
      
      if (!handlers) 
		return;
      
      delete handlers[handler['guid']]
      
      for(var any in handlers) 
		return;
	  if (elem.removeEventListener)
		elem.removeEventListener(type, elem.handle, false);
	  else if (elem.detachEvent)
		elem.detachEvent("on" + type, elem.handle);
		
	  delete elem.custom_universal_events[type];
	
	  
	  for (var any in elem.custom_universal_events) 
		return;
	  try {
	    delete elem.handle;
	    delete elem.custom_universal_events;
	  } catch(e) { // IE
	    elem.removeAttribute("handle");
	    elem.removeAttribute("custom_universal_events");
	  }
    } 
  };
  
  return Event;
}());




var browserDetector = (function () {
    var browserDetector = {
        userAgent: window.navigator.userAgent.toLowerCase(),
        getVersion: function() {
            return (this.userAgent.match( /.+(?:rv|it|ra|ie|me)[\/: ]([\d.]+)/ ) || [])[1];
        },
        isChrome: function() {
            return (/chrome/.test(this.userAgent));
        },
        isSafari: function() {
            return (/webkit/.test(this.userAgent) && !/chrome/.test(this.userAgent));
        },
        isOpera: function() {
            return (/opera/.test(this.userAgent));
        },
        isIE: function() {
            return (/msie/.test(this.userAgent) && !/opera/.test(this.userAgent));
        },
        isFirefox: function() {
            return (/firefox/.test(this.userAgent) && !/(compatible|webkit)/.test(this.userAgent));
        }
    };

    return browserDetector;
})();



var domHelper = (function () {
    var domHelper = {};

    domHelper.Fragment = function() {
        this.initialize(arguments);
    };

    domHelper.Fragment.prototype = {
        initialize: function() {
            this._frag = document.createDocumentFragment();
            this._nodes = [];
        },
        appendSource: function(source) {
            var div = document.createElement('div');
            div.innerHTML = source;
            for (var i=0; i < div.childNodes.length; i++) {
                var node = div.childNodes[i].cloneNode(true);
                this._nodes.push(node);
                this._frag.appendChild(node);
            }
        },
        appendTo: function(element) {
            if (element) {
                element.appendChild(this._frag);
            }
        },
        insertAsFirst: function(element) {
            if (element) {
                element.insertBefore(this._frag,element.firstChild);
            }
        },
        insertBefore: function(parent, element) {
            if (parent && element) {
                parent.insertBefore(this._frag, element);
            }
        },
        reclaim: function() {
            for (var i=0; i < this._nodes.length; i++) {
                var node = this._nodes[i];
                this._frag.appendChild(node);
            }
        }
    };

    domHelper.appendHtmlToElement = function(element, html){
        var frag = new domHelper.Fragment();
        frag.appendSource(html);
        frag.appendTo(element);
    };

    domHelper.insertHtmlAsFirstElement = function(element, html){
        var frag = new domHelper.Fragment();
        frag.appendSource(html);
        frag.insertAsFirst(element);
    };

    domHelper.removeAllChilds = function(elem){
        if (typeof(elem)=='string'){
            elem = document.getElementById(elem);
        }
        if (typeof elem=='undefined' || elem==null)
            return false;
        while(elem.hasChildNodes()){
            elem.removeChild(elem.firstChild);
        }
        return true;
    };

    return domHelper;
})();

var cssHelper = (function () {
    var cssHelper = {};
    cssHelper.hasClass = function(ele, cls){
        if (ele == null)
            return false;
        return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    };

    cssHelper.addClass = function(ele, cls){
        if (ele == null)
            return;
        if (!cssHelper.hasClass(ele, cls)) {
            ele.className += " " + cls;
        }
    };

    cssHelper.removeClass = function(ele, cls) {
        if (ele == null)
            return;
        if (cssHelper.hasClass(ele, cls)) {
            var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
            ele.className = ele.className.replace(reg, ' ');
        }
    };

    cssHelper.addCss = function (cssCode, id) {
        if (id && document.getElementById(id))
            return;
        var styleElement = document.createElement("style");
        styleElement.type = "text/css";
        if (id)
            styleElement.id = id;
        if (styleElement.styleSheet){
            styleElement.styleSheet.cssText = cssCode;
        }else{
            styleElement.appendChild(document.createTextNode(cssCode));
        }
        var father = null;
        var heads = document.getElementsByTagName("head");
        if (heads.length>0){
            father = heads[0];
        }else{
            var bodies = document.getElementsByTagName("body");
            if (bodies.length>0){
                father = bodies[0];
            } else {
                //todo: do we really need this brunch? this is not corrctly working for XML documents in Chrome
                //if (typeof document.documentElement!='undefined'){
                //    father = document.documentElement
                //}
            }
        }
        if (father!=null)
            father.appendChild(styleElement);
    };

    return cssHelper;
})();

var sizeHelper = (function () {
    var sizeHelper = {};

    sizeHelper.clientSize = function () {
        var d = document;
        var b = document.getElementsByTagName('body')[0];
        return {
            width:(d['compatMode']==null || typeof d['compatMode'] == 'undefined' || d['compatMode'] == 'CSS1Compat') && d.documentElement && d.documentElement.clientWidth || b && b.clientWidth,
            height:(d['compatMode']==null || typeof d['compatMode'] == 'undefined' || d['compatMode'] == 'CSS1Compat') && d.documentElement && d.documentElement.clientHeight || b && b.clientHeight
        };
        /*
         return {
            width: d.documentElement && d.documentElement.clientWidth || b && b.clientWidth,
            height: d.documentElement && d.documentElement.clientHeight || b && b.clientHeight
         };
         */
    };

    sizeHelper.scrollOffset = function () {
        var d = document;
        var b = document.getElementsByTagName('body')[0];
        return {
            left: d.documentElement && d.documentElement.scrollLeft || b && b.scrollLeft,
            top: d.documentElement && d.documentElement.scrollTop || b && b.scrollTop
        };
    };

    sizeHelper.scrollSize = function () {
        var d = document;
        var b = document.getElementsByTagName('body')[0];
        return {
            width: d.documentElement && d.documentElement.scrollWidth || b && b.scrollWidth,
            height: d.documentElement && d.documentElement.scrollHeight || b && b.scrollHeight
        };
    };
	
	sizeHelper.getOffset = function (elem) {
		var getOffsetSum = function (elem) {
			var top=0, left=0;
			while(elem) {
				top = top + parseInt(elem.offsetTop);
				left = left + parseInt(elem.offsetLeft);
				elem = elem.offsetParent;
			}
			return {'top': top, 'left': left};
		};

		var getOffsetRect = function (elem) {
			var box = elem.getBoundingClientRect();
			var body = document.body;
			var docElem = document.documentElement;
			var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
			var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
			var clientTop = docElem.clientTop || body.clientTop || 0;
			var clientLeft = docElem.clientLeft || body.clientLeft || 0;
			var top  = box.top +  scrollTop - clientTop;
			var left = box.left + scrollLeft - clientLeft;
			return {'top': Math.round(top), 'left': Math.round(left)};
		};
	
		if (elem.getBoundingClientRect) {
			return getOffsetRect(elem);
		} else {
			return getOffsetSum(elem);
		}
	};
	
	sizeHelper.pointInRect = function (point, rect) {
		if (point.y > rect.bottom || point.y < rect.top) {
			return false;
		}
		if (point.x > rect.right || point.x < rect.left) {
			return false;
		}
		return true;
	};

    return sizeHelper;
})();

var arrayHelper = (function () {
	var arrayHelper = {};
	
	/**
	 * Converts object with any properties to array (loses property names)
	 */
	arrayHelper.convertFromObject = function (obj) {
		var result = [];
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				result.push(obj[key]);
			}		
		}
		return result;
	};

	arrayHelper.map = function(array, func) {
		var len = array.length;
		var result = new Array(len);
		for(var i = 0; i < len; i++) {
			result[i] = func(array[i]);
		}
		return result;
	}; 
	
	arrayHelper.indexOf = function (array, object, start) {
		for (var i = start || 0, length = array.length; i < length; i += 1) {
			if (array[i] === object) { 
				return i; 
			}
		}
		return -1;
    };

	return arrayHelper;
})();

var selectionHelper = (function () {
	var selectionHelper = {};
	
	selectionHelper.getSelection = function () {
		if (typeof window.getSelection === 'function') {
			var sel = window.getSelection();
			if (typeof sel.getRangeAt === 'function') {
				return sel;
			} else {
				return document.getSelection();
			}
		} else {
			return document.selection;
		}
	};
	
	selectionHelper.saveSelection = function () {
		var selection = {};
		
		var inputElement = null;
		var actElem = document.activeElement;
		var tagName = actElem.tagName;
		if (typeof tagName !== 'undefined') {
			tagName = tagName.toLowerCase();
			if (tagName === 'textarea' || tagName === 'input' && actElem.type.toLowerCase() === 'text') {
				inputElement = actElem;
			}
		}
		
		if (inputElement) {
			// Selection inside input elements must be saved in different way to restore it afterwards
			selection['type'] = 'input';
			selection['element'] = inputElement;
			selection['start'] = inputElement.selectionStart;
			selection['end'] = inputElement.selectionEnd;
		} else {
			var sel = selectionHelper.getSelection();
			selection['type'] = 'simple';
			if (typeof sel.getRangeAt === 'function' && sel.rangeCount > 0) {
				selection['range'] = sel.getRangeAt(0).cloneRange();
			}
		}		
		
		return selection;
	};

	selectionHelper.restoreSelection = function (selection) {
		var result = false;
		
		if (typeof selection['type'] !== 'undefined') {
			if (selection['type'] === 'input') {
				selection['element'].focus();
				selection['element'].setSelectionRange(selection['start'], selection['end']);				
				result = true;
			} else if (selection['type'] === 'simple') {
				var sel = selectionHelper.getSelection();
				if (typeof sel.removeAllRanges === 'function') {
					try {
						sel.removeAllRanges(); //sometimes gets exception in IE
					} catch (e) {}
					if (typeof selection['range'] !== 'undefined') {
						sel.addRange(selection['range']);
						result = true;
					}
				}
			}
		}
		
		return result;
	};
	
	return selectionHelper;
})();



var contentLocalizeHelper = (function () {
    var _localeMessages = null;
    var contentLocalizeHelper = {};

    contentLocalizeHelper.getLocaleMessage = function (idMsg) {
        var result = null;
        if (_localeMessages !== null && typeof _localeMessages[idMsg] !== 'undefined')
            result = _localeMessages[idMsg];
        return result;
    };

    contentLocalizeHelper.updateLocaleMessages = function (bForce, callback) {
        if (typeof callback !== 'function') {
            callback = function () {};
        }
        if (bForce === true || _localeMessages === null) {
			if (typeof kango !== 'undefined' && typeof kango.invokeAsync !== 'undefined') {
				kango.invokeAsync('kango.i18n.getMessages', function (messages) {
					_localeMessages = messages;
					callback();
				});
			}
        } else {
            callback();
        }
    };

    contentLocalizeHelper.updateLocaleMessages();
    return contentLocalizeHelper;
})();


var htmlHelper = (function () {

	var htmlHelper = {};

	var escapeReplacements = {'&': '&amp;', '"': '&quot', '<': '&lt;', '>': '&gt;'};
	htmlHelper.escapeHTML = function (str) {
		if (str === null || str === 0)
			return str;
		str += ''; //to string;
		return str.replace(/[&"<>]/g, function (m) {
			return escapeReplacements[m];
		});
	}

	return htmlHelper;
})();










var lingualeoHelper = (function () {
    var lingualeoHelper = {};

	lingualeoHelper.formatStrWithEscaping = function(str, data) {
        for (var paramName in data) {
            if (data.hasOwnProperty(paramName)) {
                str = str.replace(new RegExp('{'+paramName+'}', 'g'), htmlHelper.escapeHTML(data[paramName]));
            }
        }
        return str;
    };
	
    lingualeoHelper.formatStr = function(str, data) {
        for (var paramName in data) {
            if (data.hasOwnProperty(paramName)) {
                str = str.replace(new RegExp('{'+paramName+'}', 'g'), data[paramName]);
            }
        }
        return str;
    };

    lingualeoHelper.getTemplate = function(name, callback) {
        kango.invokeAsync('kango.lingualeo.getTemplate', name, function(response) {
            callback(response.html);
        });
    };

    return lingualeoHelper;
})();

