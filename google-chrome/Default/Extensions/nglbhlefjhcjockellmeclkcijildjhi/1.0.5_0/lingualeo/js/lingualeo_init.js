
var lingualeo = {};
lingualeo.isAuth = null;
lingualeo.currentOptions = null;
lingualeo.untrainedWordsCount = 0;
lingualeo.tmplElems = {};

lingualeo.moveCookiesToBHO = function () {
//only for IE
	try {
		var global = kango.lang.getGlobalContext();
		var engine = global.KangoEngine;
		if (engine) {
			var tab = kango.browser.getActiveTab();
			if (tab) {
				var bho = tab.getBHO();
				if (bho) {
					var cookie = engine.getCookie('http://lingualeo.com/api/login', null);
					var cookies = cookie.split('; ');
					for(var i = 0; i < cookies.length; i++) {
						if (cookies[i].indexOf('remember=') != -1 || cookies[i].indexOf('lingualeo=') != -1) {
							bho.setCookie('http://lingualeo.com/api/login', null, cookies[i] + '; expires = Sat,01-Jan-2020 00:00:00 GMT; path=/');
						}
					}
				}
			}
		}
	} catch(e) {
		kango.console.log('Error during lingualeo.moveCookiesToBHO. Details: ' + e.message);
	}

};

lingualeo.getTranslations = function(originalText, context, callback) {
	//kango.console.log([originalText, context, originalText.length, lingualeo.config.maxTextLengthToTranslate]);
    if (originalText.replace(/ |\t|\r|\n/igm, '').length > lingualeo.config.maxTextLengthToTranslate) {
        lingualeo.ext.showNotification(
            kango.i18n.getMessage('textTooLong'),
            kango.i18n.getMessage('mustBeLessThan').replace(/\$1/, ''+lingualeo.config.maxTextLengthToTranslate),
            true
        );
        callback({'error': true, 'error_msg': 'text too long'});
    } else {
        lingualeo.server.loadTranslations(
            originalText,
            function(result) {
                callback({
                    context: context,
                    inDictionary: null, //result.is_user, //todo: fix this later
                    originalText: originalText,
                    translations: result.translate,
                    transcription: result.transcription,
                    picUrl: result.pic_url,
                    soundUrl: result.sound_url,
					word_forms: result.word_forms
                });
            }, function(error_msg, result, status) {
                callback({'error': true, 'error_msg': error_msg, 'result': result, 'status': status});
            }
        );
    }
};

lingualeo.setWordTranslation = function(originalText, translatedText, context, pageUrl, pageTitle) {
    lingualeo.server.setWordTranslation(
        originalText,
        translatedText,
        context,
        pageUrl,
        pageTitle,
        function() {
            lingualeo.ext.showNotification(
                kango.i18n.getMessage('dictUpdated'),
                //'<span class="ll-content-notification-word word">' + originalText + '</span> &mdash; ' + translatedText,
				originalText + ' - ' + translatedText,
                false,
                function() { lingualeo.openDictionaryPage(originalText); }
            );
            lingualeo.updateUntrainedWordsCounter(10 * 60 * 1000);
        },
        function(error_msg, result, status) {
            if(typeof result !== 'undefined' && result.error_code === 12) {
                kango.browser.tabs.getCurrent(function(tab) {
                    tab.dispatchMessage('showNoMeatballsDialog');
                });
            }
        }
    );
};

lingualeo.translateWithGoogle = function (originalText, langFrom, langTo, callback) {
    lingualeo.server.translate(originalText, langFrom, langTo, callback);
};

lingualeo.getTemplate = function(id) {
    if (!(id in lingualeo.tmplElems)) {
        lingualeo.tmplElems[id] = kango.io.getExtensionFileContents('lingualeo/templates/' + id + '.tmpl');
    }
    return {html: lingualeo.tmplElems[id]};
};

lingualeo.openLinguaLeoWebsite = function (campaign) {
	if (!campaign) {
		campaign = 'from_panel';
	}
    kango.browser.tabs.create({
		url: lingualeo.config.domain + (lingualeo.untrainedWordsCount ? lingualeo.config.path.training : lingualeo.config.path.dictionary) + '?utm_source=ll_plagin&utm_medium=referral&utm_campaign=' + campaign
	});
};

lingualeo.openLinguaLeoPage = function (page) {
    kango.browser.tabs.create({url: lingualeo.config.domain + lingualeo.config.path[page]});
};

lingualeo.openDictionaryPage = function (defaultFocusedWord) {
    kango.browser.tabs.create({url: lingualeo.config.domain + lingualeo.config.path.dictionary + '?utm_source=ll_plagin&utm_medium=referral&utm_campaign=word_added#/' + encodeURIComponent(defaultFocusedWord)});
};

lingualeo.setUntrainedWordsCount = function(count) {
    if (lingualeo.currentOptions.showUntrainedWordsCount && count) {
        lingualeo.untrainedWordsCount = +count;
        lingualeo.ext.setStateHints(kango.i18n.getMessage('untrainedWords').replace(/\$1/, count), count.toString());
    }
    else {
        lingualeo.ext.setStateHints('LinguaLeo', null);
    }
};

lingualeo.updateUntrainedWordsCounter = function (customTimeout) {
    if (lingualeo.updateUntrainedWordsCounter.untrainedTimer) {
        clearTimeout(lingualeo.updateUntrainedWordsCounter.untrainedTimer);
        lingualeo.updateUntrainedWordsCounter.untrainedTimer = null;
    }
    if (lingualeo.isAuth) {
        if (lingualeo.currentOptions.showUntrainedWordsCount) {
            lingualeo.server.getUntrainedWordsCount(function(result) {
                if (lingualeo.isAuth) {
                    lingualeo.setUntrainedWordsCount(result.count);
                }
            });
			kango.storage.setItem('lastUntrainedWordsCountUpdate', new Date().getTime());
			lingualeo.updateUntrainedWordsCounter.untrainedTimer = setTimeout(lingualeo.updateUntrainedWordsCounter, customTimeout || lingualeo.config.untrainedWordsCheckingTimeout);
        } else {
            lingualeo.setUntrainedWordsCount(null);
        }
    }
};

lingualeo.readExtensionOptions = function () {
    var oldOptions = lingualeo.currentOptions;
    lingualeo.currentOptions = lingualeo.getExtensionOptions();

    // Check for options changes
    if (oldOptions === null || oldOptions.showUntrainedWordsCount !== lingualeo.currentOptions.showUntrainedWordsCount) {
        lingualeo.updateUntrainedWordsCounter();
    }
};

lingualeo.checkExtensionVersion = function () {
    var ver = kango.getExtensionInfo().version;
    // Show changelog if the extension has been updated or just installed
    if (kango.storage.getItem('version') != ver) {
		window.setTimeout(function () {
			kango.ui.optionsPage.open('changelog');
			//Safari coookie fix: open page and unlock setting cookies througgh XHR
			var ua = window.navigator.userAgent.toLowerCase();
            if (/webkit/.test(ua) && !/chrome/.test(ua)) {
				kango.browser.tabs.create({'url': lingualeo.config.domain, 'focused': false});
			}
		}, 500);		
        kango.storage.setItem('version', ver);
    }
};

lingualeo.setExtensionCookie = function () {
    if (kango.storage.getItem('isCookieSet') === null) {
        lingualeo.server.setCookieWithServer(function () {
            kango.storage.setItem('isCookieSet', true);
        });
		/*
		kango.browser.setCookie(lingualeo.config.domain, {
			name: 'chrome-hide',
			value: '1',
			expires: 1663056787
		});
		*/
    }
};

lingualeo.setInterfaceLanguage = function () {
    var lang = kango.storage.getItem('lang_interface');
    if (lang) {
        kango.i18n.init(lang);
    }
};

lingualeo.getNativeLang = function () {
    var lang_native = kango.storage.getItem('lang_native');
    if (!lang_native) {
        lang_native = kango.i18n.getCurrentLocale();
    }
    return lang_native;
};

lingualeo.getUserData = function () {
    if (lingualeo.isAuth) {
        lingualeo.server.getUserData(function (data) {
            if (typeof data['user'] !== 'undefined') {
                if (typeof data['user']['lang_interface'] !== 'undefined') {
                    kango.storage.setItem('lang_interface', data['user']['lang_interface']);
                    lingualeo.setInterfaceLanguage();
                    lingualeo.sendMessageForAllTabs('updateLocaleMessages');
                }
                if (typeof data['user']['lang_native'] !== 'undefined') {
                    kango.storage.setItem('lang_native', data['user']['lang_native']);
                    lingualeo.sendMessageForAllTabs('updateNativeLang');
                }
				if (typeof data['user']['user_id'] !== 'undefined') {
					kango.storage.setItem('user_id', data['user']['user_id']);
				}	
            }
        });
    }
};

lingualeo.loginUser = function (username, pass, callback) {
	lingualeo.server.login(username, pass, function (result) {
		if (typeof result.error_msg === 'undefined' || result.error_msg === '') {
			lingualeo.moveCookiesToBHO();
			lingualeo.ext.setAuthState(true);
            lingualeo.updateUntrainedWordsCounter();
            lingualeo.getUserData();
		}
		callback(result);
	});
};

lingualeo.checkAuthorization = function (callback) {
    lingualeo.ext.setAuthState(false);
    lingualeo.ext.setStateHints(kango.i18n.getMessage('stateAuthorization'), '...');
    lingualeo.server.checkAuthorization(
        true,
        function(isAuthorized) {
            lingualeo.ext.setAuthState(isAuthorized);
            lingualeo.updateUntrainedWordsCounter();
            lingualeo.getUserData();
			if (callback) {
				callback(isAuthorized);
			}
        },
        function() {
            lingualeo.ext.setAuthState(false);
			if (callback) {
				callback(false);
			}
        }
    );
};

lingualeo.proceedContextMenuShow = function () {
    // As soon as we don't have en event such as onBeforeContextMenu,
    // we'll update the text of context menu item after timeout.
    // That sucks, but cool Chrome developers didn't give us 100% possibility
    // to update context menu items right before the menu is showing.
    // So...
    if (lingualeo.proceedContextMenuShow.itemTimer) {
        clearTimeout(lingualeo.proceedContextMenuShow.itemTimer);
    }
    lingualeo.proceedContextMenuShow.itemTimer = setTimeout(function() {
        lingualeo.contextMenu.updateTranslationItem(null);
    }, 100);
};

lingualeo.setContextItemText = function (text) {
    lingualeo.contextMenu.updateTranslationItem(text);
};

lingualeo.initContextMenu = function () {
    lingualeo.contextMenu.createLoginItem(lingualeo.openLinguaLeoWebsite);
    lingualeo.contextMenu.createTranslationItem(function() {
        kango.browser.tabs.getCurrent(function(tab) {
            tab.dispatchMessage('getContext');
        });
    });
    lingualeo.contextMenu.setLoginItemVisibility(false);
    lingualeo.contextMenu.setTranslationItemVisibility(false);
};

lingualeo.extendServer = function () {
    lingualeo.server.responseStatusErrorHandler = function(status, isSilentError) {
        var msg;
        var title = kango.i18n.getMessage('error');

        if (status == 404 || status == 0) {
            title = kango.i18n.getMessage('error404');
            msg = kango.i18n.getMessage('errorNoConnection');
        }
        else if (status == 503) {
            // Force error showing when the server is being updated
            isSilentError = false;
            title = kango.i18n.getMessage('error503');
            msg = kango.i18n.getMessage('serverUpdating');
        }
        else {
            // Reset authorization state, so next time user will be asked to login
            title = kango.i18n.getMessage('responseCode').replace(/\$1/, ''+status);
            msg = kango.i18n.getMessage('errorNoConnection');
        }
        //lingualeo.ext.setAuthState(false);

        if (!isSilentError) {
            lingualeo.ext.showNotification(title, msg);
        }
    };

    lingualeo.server.responseErrorHandler = function(errorMsg, errorCode, isSilentError) {
		/*
        if (errorCode === 401) {//not authorised
            lingualeo.ext.setAuthState(false);
            if (!isSilentError) {
                kango.browser.tabs.getCurrent(function(tab) {
                    tab.dispatchMessage('showLoginForm');
                });
            }
        } else if (errorCode === 12) {//not enough meatballs
            //do nothing
        } else {
            if (!isSilentError) {
                lingualeo.ext.showNotification(kango.i18n.getMessage('error'), errorMsg);
            }
        }
		*/
		if (!isSilentError) {
			lingualeo.ext.showNotification(kango.i18n.getMessage('error'), errorMsg);
		}		
    };
};

lingualeo.sendMessageForAllTabs = function (msgName) {
    kango.browser.tabs.getAll(function(tabs) {
        for(var i = 0; i < tabs.length; i++) {
            tabs[i].dispatchMessage(msgName);
        }
    });
};

lingualeo.updateOptionsForAllTabs = function () {
    lingualeo.sendMessageForAllTabs('updateOptions');
    lingualeo.readExtensionOptions();
};

lingualeo.setNewOptions = function (newOptions) {
    for(var option in newOptions) {
        if (newOptions.hasOwnProperty(option)) {
            kango.storage.setItem(option, newOptions[option]);
        }
    }
};

lingualeo.getAuthState = function () {
	return lingualeo.isAuth;
};

lingualeo.getExtensionOptions = function() {
    var opts = {};
    for (var i in lingualeo.defaultOptions) {
        opts[i] = (kango.storage.getItem(i) != null) ? +kango.storage.getItem(i) : lingualeo.defaultOptions[i];
    }
    return opts;
};

lingualeo.buttonHandler = function () {
	lingualeo.openLinguaLeoWebsite();
	
	var lastUpdateTime = kango.storage.getItem('lastUntrainedWordsCountUpdate');
	if (lastUpdateTime !== null) {
		var currentTime = new Date().getTime();
		if (currentTime - lastUpdateTime > 30 * 60 * 1000) { //if more that 30 minutes
			lingualeo.updateUntrainedWordsCounter();
		}
	}
};

lingualeo.showSiteNotifications = function (notificationsArr) {
	for(var i = 0; i < notificationsArr.length; i++) {
		(function (notifInfo) {
			var data = {
				'title': notifInfo.notification_header,
				'text': notifInfo.notification_text,
				'forceShowing': false,
				'mainImageUrl': notifInfo.notification_pic_url,
				'hideTimeout': 0,
				'showAllTabs': true
			};
			lingualeo.ext.showNotification2(data, function () {
				kango.browser.tabs.create({url: 'http:' + notifInfo.notification_url + (notifInfo.notification_url.indexOf('?') === -1 ? '?' : '&') + 'utm_source=ll_plagin&utm_medium=referral&utm_campaign=notification'});
			});
		})(notificationsArr[i]);		
	}
};

lingualeo.checkSiteNotifications = function () {
	if (lingualeo.isAuth && lingualeo.currentOptions.showBrowserPopups && lingualeo.currentOptions.showSiteNotifications) {
		var lastCheckTime = kango.storage.getItem('lastSiteNotificationsCheck') || 0;
		var currentTime = new Date().getTime();
		if (currentTime - lastCheckTime > 12 * 60 * 60 * 1000) { //if more than 12 hours
			kango.storage.setItem('lastSiteNotificationsCheck', currentTime);
			var user_id = kango.storage.getItem('user_id');
			if (user_id) {
				lingualeo.server.checkSiteNotifications(user_id, function(result) {
					if (lingualeo.isAuth && result.notification && result.notification.length) {
						lingualeo.showSiteNotifications(result.notification);
					}
				});
			}
		}
	}
	window.setTimeout(lingualeo.checkSiteNotifications, 60 * 60 * 1000); //repeat every hour
};




lingualeo.init = function () {
    lingualeo.config = new LinguaLeoConfig();
    lingualeo.ext = new LinguaLeoExt();
    lingualeo.defaultOptions = new LinguaLeoDefaultOptions();
    lingualeo.contextMenu = new LinguaLeoContextMenu();
    lingualeo.initContextMenu();
    lingualeo.server = new LingualeoServer(lingualeo.config.api);
    lingualeo.extendServer();

    lingualeo.setInterfaceLanguage();
    lingualeo.readExtensionOptions();
    lingualeo.checkExtensionVersion();
    lingualeo.setExtensionCookie();
    lingualeo.checkAuthorization();
	
	kango.addEventListener('ContextMenuItemClick', function(event) {
		kango.browser.tabs.getCurrent(function(tab) {
            tab.dispatchMessage('getContext');
        });
	});

    kango.browser.addEventListener(kango.browser.event.DocumentComplete, function(event) {
        if (event.url.indexOf(lingualeo.config.domain) === 0 || event.url.indexOf(lingualeo.config.domain_ru) === 0) {
            lingualeo.setExtensionCookie();
            if (!lingualeo.isAuth) {
				window.setTimeout(function () {
					lingualeo.checkAuthorization();
				}, 500);                
            }
        }
    });
	kango.ui.browserButton.setCaption('LinguaLeo');
    kango.ui.browserButton.addEventListener(kango.ui.browserButton.event.Command, lingualeo.buttonHandler);

    kango['lingualeo'] = lingualeo;
	
	window.setTimeout(lingualeo.checkSiteNotifications, 5 * 60 * 1000);  //do first check after 5 min (not to disturb user after startup) //5 * 60 * 1000
};


lingualeo.init();




