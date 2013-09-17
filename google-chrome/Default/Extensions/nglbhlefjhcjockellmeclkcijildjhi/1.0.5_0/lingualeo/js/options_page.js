
var statusTimer;
var localeMessages = null;
var extensionInfo = null;

var getLocaleMessage = function (idMsg) {
    var result = null;
    if (localeMessages !== null && typeof localeMessages[idMsg] !== 'undefined')
        result = localeMessages[idMsg];
    return result;
};

var updateLocaleMessages = function (callback) {
    kango.invokeAsync('kango.i18n.getMessages', function (messages) {
        localeMessages = messages;
        callback();
    });
};

var updateExtensionInfo = function (callback) {
    kango.invokeAsync('kango.getExtensionInfo', function (info) {
        extensionInfo = info;
        callback();
    });
};

function getInputByName (name) {
    var elems = document.getElementsByName(name);
    if (elems.length === 1 && elems[0].nodeName.toLowerCase() === 'input') {
        return elems[0];
    }
    return null;
}

function reloadOptions() {
    kango.invokeAsync('kango.lingualeo.getExtensionOptions', function (options) {
        for (var optionName in options) {
            var element = getInputByName(optionName);
            if (element) {
                element.checked = options[optionName];
            }
        }
        updateOptionsDOM(options);
    });
}

function updateOptionsDOM(options) {
    document.getElementById('cbDblClickWithCtrl').disabled = !options.useDblClick;
    document.getElementById('cbDblClickWithAlt').disabled = !options.useDblClick;
    document.getElementById('cbAutoTranslateContext').disabled = !options.showContext;
	document.getElementById('cbShowSiteNotifications').disabled = !options.showBrowserPopups;
}

function saveOptions(event) {
	if (event.target.id && event.target.id === 'cbShowBrowserPopups') {
		document.getElementById('cbShowSiteNotifications').checked =  event.target.checked;		
	}

    var newOptions = {};
    for (var optionName in new LinguaLeoDefaultOptions()) {
        var element = getInputByName(optionName);
        if (element) {
            newOptions[optionName] = element.checked ? 1 : 0;
        }
    }

    kango.invokeAsync('kango.lingualeo.setNewOptions', newOptions, function () {
        kango.invokeAsync('kango.lingualeo.updateOptionsForAllTabs', function () {
            reloadOptions();
        });
    });

    // Show status message
    document.getElementById('status').className = 'shown';
    if (statusTimer) {
        clearTimeout(statusTimer);
    }
    statusTimer = setTimeout(function() {
        document.getElementById('status').className = '';
    }, 1200);
}

function initOptions() {
    var elems = document.getElementsByTagName('input');
    for(var i = 0, len = elems.length; i < len; i += 1) {
        var element = elems[i];
        if (element.type.toLowerCase() === 'checkbox') {
			Event.add(element, 'click', saveOptions);
        }
    }
    reloadOptions();
}

var i18nPage = {
    tags: ['a', 'div', 'label', 'h2', 'h3', 'span'],
    internatinalise: function () {
        for(var i = 0; i < this.tags.length; i+=1){
            var elems = document.getElementsByTagName(this.tags[i]);
            for(var j = 0; j < elems.length; j+=1){
                var element = elems[j];
                if (element.hasAttribute('i18n-innerHTML')){
                    var name = element.getAttribute('i18n-innerHTML');
                    var param1 = null;
                    if (element.hasAttribute('i18n-param1')){
                        param1 = element.getAttribute('i18n-param1');
                        if (param1.toLowerCase() === '$$version$$'){
                            param1 = extensionInfo.version;
                        } else if (param1.toLowerCase() === '$$command_key$$') {
                            param1 = (window.navigator.userAgent.toLowerCase().indexOf('macintosh') > -1) ? '⌘Command' : 'Ctrl';
                        }
                    }
                    var text = getLocaleMessage(name).replace(/\$1/, param1);
                    if (text !== ''){
                        element.innerHTML = text;
                    }
                }
            }
        }
    }
};

function fixLinksForIE () {
	var linkOnClick = function (event) {
		//kango.console.log(event.target.nodeName);
		kango.invokeAsync('kango.browser.tabs.create', {url: event['customData']});
		KangoAPI.closeWindow();
		return false;
	};
	var links = document.getElementsByTagName('a');
	var i = 0, l = links.length;
	for(; i < l; i += 1) {
		var link = links[i];
		if (typeof link.href === 'string' && link.href.indexOf('http') === 0) {
			Event.add(link, 'click', linkOnClick, link.href);
		}
	}
}








/*********************************************************/
//
//   Initialization
//
/*********************************************************/
KangoAPI.onReady(function() {
	updateLocaleMessages(function () {
        updateExtensionInfo(function () {
            i18nPage.internatinalise();
			if (browserDetector.isIE()) {
				fixLinksForIE();
			}
			if (browserDetector.isOpera()) {
				document.getElementById('howToUseOpera').style.display = 'inline';
				document.getElementById('howToUseAll').style.display = 'none';
			}
        });
    });
	initOptions();

});


























