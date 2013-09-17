// ==UserScript==
// @name LinguaLeoContentNotification
// @all-frames true
// @include http://*
// @include https://*
// @exclude http*://*facebook.com/plugins/*
// @exclude http*://*twitter.com/widgets/*
// @exclude http*://plusone.google.com/*
// ==/UserScript==

//kango.console.log('NOTIFICATION!!!!');

var kangoContentNotificationStatus = {
    'NEW': 0,
    'VISIBLE': 1,
    'HIDDEN': 2
};


function KangoContentNotification (data, htmlTemplate) {
    this.id = data.id || 'kango_content_notification' + Math.random();
    this._htmlTemplate = htmlTemplate;
    this._hideTimeout = data.hideTimeout; //if 0 then no auto hide
    this.contentData = JSON.parse(JSON.stringify(data.contentData));
    this.bDoNotBindContentClick = data.bDoNotBindContentClick; //true|false
    this.width = data.width || '300px';
    this._hideTimer = null;
    this.elementHeight = 0;
    this.elementWidth = 0;
    this.status = kangoContentNotificationStatus.NEW;
    this._createNotificationElement();
    this.calculateOwnSize();
    this._bindEnevts();
}

KangoContentNotification.prototype._createNotificationElement = function () {
    this.contentData.id = this.id;
    var htmlNotification = lingualeoHelper.formatStrWithEscaping(this._htmlTemplate, this.contentData);
    domHelper.appendHtmlToElement(document.getElementsByTagName('body')[0], htmlNotification);
    var element = document.getElementById(this.id);
    element.style.width = this.width;
};

KangoContentNotification.prototype.destroyNotificationElement = function () {
    var element = document.getElementById(this.id);
    element.parentNode.removeChild(element);
};

KangoContentNotification.prototype._bindEnevts = function () {
    var element = document.getElementById(this.id);
    var self = this;
    if (this.bDoNotBindContentClick !== true) {
        Event.add(element, 'click', function (event) {
            kango.invokeAsync('kango.lingualeo.ext.callNotificationHandler', self.id);
            self.hide();
            event.stopPropagation();
            event.preventDefault();
        });
    }
    var elementClose = document.getElementById(this.id + '_close');
    Event.add(elementClose, 'click', function (event) {
        self.hide();
        event.stopPropagation();
        event.preventDefault();
    });
};

KangoContentNotification.prototype.calculateOwnSize = function () {
    var element = document.getElementById(this.id);
    this.elementHeight = element.offsetHeight;
    this.elementWidth = element.offsetWidth;
};

/*
//todo: make it work
KangoContentNotification.prototype.setPosition = function (right, bottom) {
    var element = document.getElementById(this.id);
    element.style.right = right + 'px';
    element.style.bottom = bottom + 'px';
};
*/

KangoContentNotification.prototype.setPosition = function (left, top) {
    var element = document.getElementById(this.id);
    element.style.left = left + 'px';
    element.style.top = top + 'px';
};

KangoContentNotification.prototype.show = function () {
    var element = document.getElementById(this.id);
    cssHelper.addClass(element, 'll-content-notification-shown');
    this.status = kangoContentNotificationStatus.VISIBLE;
    if (this._hideTimeout !== 0) {
        this._startHideTimeout();
    }
};

KangoContentNotification.prototype.hide = function () {
    var element = document.getElementById(this.id);
    if (element) {
		//cssHelper.removeClass(element, 'll-content-notification-shown');
		element.style.display = 'none';		
	}
	this.status = kangoContentNotificationStatus.HIDDEN;
};

KangoContentNotification.prototype._startHideTimeout = function () {
    var self = this;
    this._hideTimer = window.setTimeout(function () {
        self.hide();
    }, this._hideTimeout);
};



var contentNotificationManager = {
    _notificationTemplate: '',
    _notifications: [],
	_quirksMode: false,
	
	getNotificationById: function (id) {
		for (var i = 0, len = this._notifications.length; i < len; i += 1) {
            var notification = this._notifications[i];
            if (notification.id === id) {
				return notification;
			}
        }
		return null;
	},
	
	hideNotification: function (id) {
		var notification = this.getNotificationById(id);
		if (notification) {
			notification.hide();
		}
	},

    recalculatePositions: function () {
        var cs = sizeHelper.clientSize();
        var bottom = cs.height;
		if (this._quirksMode) {
			var sO = sizeHelper.scrollOffset();
			bottom += sO.top;
		}
        for (var i = 0, len = this._notifications.length; i < len; i += 1) {
            var notification = this._notifications[i];
            notification.calculateOwnSize();
            bottom -= notification.elementHeight + 10;
            notification.setPosition(cs.width - notification.elementWidth - 10, bottom);
        }
    },

    _removeAllHiddenNotifications: function () {
        for (var i = this._notifications.length - 1; i >= 0; i -= 1) {
            if (this._notifications[i].status === kangoContentNotificationStatus.HIDDEN) {
                this._notifications[i].destroyNotificationElement();
                this._notifications.splice(i, 1);
            }
        }
    },

    createNotification: function (notificationData) {
        this._removeAllHiddenNotifications();
        var notification = new KangoContentNotification(notificationData, this._notificationTemplate);
        this._notifications.push(notification);
        this.recalculatePositions();
        return notification;
    },

    init: function (callback) {
		var self = this;
		if (browserDetector.isIE() && typeof document.compatMode !== 'undefined' && document.compatMode === 'BackCompat') {
			self._quirksMode = true;
		}
        lingualeoHelper.getTemplate('contentNotification', function (htmlTemplate) {
            self._notificationTemplate = htmlTemplate;
            lingualeoHelper.getTemplate('contentNotificationStyle', function (style) {
                cssHelper.addCss(style);
				if (self._quirksMode) {
					cssHelper.addCss('.ll-content-notification{position:absolute !important;}');
				}
                callback();
            });
        });
    }
};


function isTopWindow () {
    try {
        if (window.top != window) //do not use !== because of Quirks mode
            return false;
    } catch (e) {
        return false;
    }
    return true;
}


(function () {
    if (!isTopWindow()) {
        return;
    }

    contentNotificationManager.init(function () {
        kango.addMessageListener('showContentNotification', function (event) {
            var notification = contentNotificationManager.createNotification(event.data);
            notification.show();
        });
		
		
		kango.addMessageListener('hideContentNotification', function (event) {
            contentNotificationManager.hideNotification(event.data);
        });
		
		
    });
})();