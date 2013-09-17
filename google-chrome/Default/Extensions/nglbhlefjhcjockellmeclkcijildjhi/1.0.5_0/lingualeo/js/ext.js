
var LinguaLeoExt = function () {

    return {
        notificationHandlers: {},
		
		showNotification2: function(data, handler) {
			if (lingualeo.currentOptions.showBrowserPopups || data.forceShowing) {
                var notificationData = {
                    'id': 'kango_content_notification' + Math.random(),
                    'contentData': {
                        'caption': 'LinguaLeo',
                        'imagesUrl': lingualeo.config.path.images,
                        'title': data.title,
                        'text': data.text,
						'mainImageUrl': data.mainImageUrl || lingualeo.config.path.images + '/i48.png'
                    },
                    'hideTimeout': typeof data.hideTimeout === 'undefined' ? lingualeo.config.notificationTimeout : data.hideTimeout //check with undefined because if data.hideTimeout can be 0
                };
            
				if (data.showAllTabs === true) {
					this.notificationHandlers[notificationData['id']] = function () {
						kango.browser.tabs.getAll(function(tabs) {
							for(var i = 0; i < tabs.length; i++) {
								tabs[i].dispatchMessage('hideContentNotification', notificationData['id']);
							}
						});
						handler();
					};
				
				
					kango.browser.tabs.getAll(function(tabs) {
						for(var i = 0; i < tabs.length; i++) {
							tabs[i].dispatchMessage('showContentNotification', notificationData);
						}
					});
				} else {
					this.notificationHandlers[notificationData['id']] = handler;
					kango.browser.tabs.getCurrent(function(tab) {
						tab.dispatchMessage('showContentNotification', notificationData);
					});
				}
            }
        },
		

        showNotification: function(title, text, forceShowing, handler) {
			var data = {
				'title': title,
                'text': text,
				'forceShowing': forceShowing
			};
			this.showNotification2(data, handler);
        },

        //launched when user clicks on the notification
        callNotificationHandler: function (id) {
            if (typeof this.notificationHandlers[id] === 'function') {
                this.notificationHandlers[id]();
                delete this.notificationHandlers[id];
            }
        },

        setStateHints: function(title, badgeText, badgeColor) {
            kango.ui.browserButton.setBadgeValue(badgeText || '');
            if (title) {
                kango.ui.browserButton.setTooltipText(title)
            }
        },

        setAuthState: function(isAuthorized) {
            lingualeo.isAuth = !!isAuthorized;
            if (isAuthorized) {
                lingualeo.ext.setStateHints('LinguaLeo', null);
                kango.ui.browserButton.setIcon('lingualeo/images/i19.png');
            } else {
                lingualeo.ext.setStateHints(kango.i18n.getMessage('notAuthStatus'), null);
                kango.ui.browserButton.setIcon('lingualeo/images/i19bw.png');
				kango.storage.removeItem('user_id');
            }
            lingualeo.contextMenu.setLoginItemVisibility(!isAuthorized);
            lingualeo.contextMenu.setTranslationItemVisibility(isAuthorized);
        }
    };
};