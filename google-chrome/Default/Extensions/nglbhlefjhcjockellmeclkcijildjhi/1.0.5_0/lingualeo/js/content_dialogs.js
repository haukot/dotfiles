// ==UserScript==
// @name LinguaLeoDialogs
// @all-frames true
// @include http://*
// @include https://*
// @exclude http*://*facebook.com/plugins/*
// @exclude http*://*twitter.com/widgets/*
// @exclude http*://plusone.google.com/*
// ==/UserScript==


/**
 * @requires LinguaLeoConfig
 * @requires llContent
 * @requires lingualeoHelper
 * @requires sizeHelper
 * @requires contentLocalizeHelper
 * @requires Event
 * @requires domHelper
 */

var getDialogTemplate = function (dialogId, htmlTemplateId, styleTemplateId) {
    var dialogTemplate = {
        _dialogHtml: '',
        dialogData: {},
        _id: dialogId,
        _styleTemplateId: styleTemplateId,
        _templateId: htmlTemplateId,
		_hideCallback: null,

        show: function () {
            this._createDialog();
			this._bindCommonEvents();
            this.bindEvents();
        },
		
		_destroyDielogElement: function () {
			this._unbindCommonEvents();
			var formElement = document.getElementById(this._id);
            if (formElement) {
                formElement.parentNode.removeChild(formElement);
            }
		},

        hide: function (returnValue) {
            this._destroyDielogElement();
			if (this._hideCallback) {
				this._hideCallback(returnValue);
			}
        },

        _setDialogPosition: function () {
            var formElement = document.getElementById(this._id);
            var rect = llContent.dialog.rect;  //todo:
            var sO = sizeHelper.scrollOffset();
            var l = (sO.left + rect.left - 12);
            var t = (sO.top + rect.top - formElement.offsetHeight - 10);

            // Correct dialog position according to viewport
            if (t < sO.top) {
                t = (sO.top + rect.bottom + 10);
            }
            if (l < sO.left + 5) {
                l = sO.left + 5;
            }
            else {
                var body = document.getElementsByTagName('body')[0];
                if (l + formElement.offsetWidth > sO.left + body.offsetWidth - 5) {
                    l = sO.left + body.offsetWidth - formElement.offsetWidth - 5;
                }
            }

            //var l = 100, t = 100; //for tests
            formElement.style.left = l + 'px';
            formElement.style.top = t + 'px';
        },

        _createDialog: function () {
            this._destroyDielogElement(); //destroy previous dialog if exists
            var htmlForm = lingualeoHelper.formatStrWithEscaping(this._dialogHtml, this.dialogData);
            domHelper.appendHtmlToElement(document.getElementsByTagName('body')[0], htmlForm);
            this._setDialogPosition();
        },

        _insertCss: function (callback) {
            lingualeoHelper.getTemplate(this._styleTemplateId, function (loginFormCssCode) {
                var config = new LinguaLeoConfig();
                var data = {
                    'llImagesUrl': htmlHelper.escapeHTML(config.path.images)
                };
                loginFormCssCode = lingualeoHelper.formatStr(loginFormCssCode, data);
                cssHelper.addCss(loginFormCssCode);
                callback();
            });
        },

        _getHtmlTemplate: function (callback) {
            var self = this;
            lingualeoHelper.getTemplate(this._templateId, function (loginFormHtmlCode) {
                self._dialogHtml = loginFormHtmlCode;
                callback();
            });
        },

        init: function (callback) {
            var self = this;
            self._insertCss(function () {
                self._getHtmlTemplate(function () {
                    callback();
                });
            });
        },
		
		_documentMouseDownHandler_static: function (event) {
			var self = event['customData'];
			self.hide();
		},
		
		_documentKeyDownHandler_static: function(event) {
			var self = event['customData'];
			if (event.keyCode === 27) {// Esc
				self.hide();
			}
		},
		
		_bindCommonEvents: function () {
			Event.add(document, 'mousedown', this._documentMouseDownHandler_static, this);
			Event.add(document, 'keydown', this._documentKeyDownHandler_static, this);
			var formElement = document.getElementById(this._id);
			Event.add(formElement, 'dblclick', function(event) { event.stopPropagation(); });
			Event.add(formElement, 'mousedown', function(event) { event.stopPropagation(); });
			Event.add(formElement, 'mouseup', function(event) { event.stopPropagation(); });
			Event.add(formElement, 'contextmenu', function(event) { event.stopPropagation(); });
        },
		
		_unbindCommonEvents: function () {
			Event.remove(document, 'mousedown', this._documentMouseDownHandler_static);
			Event.remove(document, 'keydown', this._documentKeyDownHandler_static);
		},

		//overload method
        bindEvents: function () {
        }
    };

    return dialogTemplate;
};

var showMeatballsDialog = function () {
    var meatDialog = getDialogTemplate('ll_meat_dialog', 'contentMeatDialog', 'contentMeatDialogStyle');
    contentLocalizeHelper.updateLocaleMessages(false, function () {
        meatDialog.dialogData = {
            'meatballsDialogHeader': contentLocalizeHelper.getLocaleMessage('meatballsDialogHeader'),
            'meatballsDialogInvite': contentLocalizeHelper.getLocaleMessage('meatballsDialogInvite'),
            'meatballsDialogGold': contentLocalizeHelper.getLocaleMessage('meatballsDialogGold'),
            'dlgCloseHint': contentLocalizeHelper.getLocaleMessage('dlgCloseHint'),
            'meatballsDialogHeader2': contentLocalizeHelper.getLocaleMessage('meatballsDialogHeader2')
        };
    });
    meatDialog.bindEvents = function () {
        var self = this;
        var inviteHref = document.getElementById('ll_meat_dialog_invite');
        Event.add(inviteHref, 'click', function (event) {
            kango.invokeAsync('kango.lingualeo.openLinguaLeoPage', 'meatballs');
            self.hide();
            return false;
        });

        var goldHref = document.getElementById('ll_meat_dialog_gold');
        Event.add(goldHref, 'click', function (event) {
            kango.invokeAsync('kango.lingualeo.openLinguaLeoPage', 'goldStatus');
            self.hide();
            return false;
        });

        var closeHref = document.getElementById('ll_meat_dialog_close');
        Event.add(closeHref, 'click', function (event) {
            self.hide();
            return false;
        });
    };
    meatDialog.init(function () {
        meatDialog.show();
    });
};


var showLoginDialog = function (hideCallback) {
    var loginDialog = getDialogTemplate('ll_login_form', 'contentLoginForm', 'contentLoginFormStyle');

    contentLocalizeHelper.updateLocaleMessages(false, function () {
        loginDialog.dialogData = {
            'loginDialogCapt': contentLocalizeHelper.getLocaleMessage('loginDialogCapt'),
            'loginDialogEnter': contentLocalizeHelper.getLocaleMessage('loginDialogEnter'),
            'loginDialogSignUp': contentLocalizeHelper.getLocaleMessage('loginDialogSignUp'),
            'loginDialogForgot': contentLocalizeHelper.getLocaleMessage('loginDialogForgot'),
            'loginDialogPass': contentLocalizeHelper.getLocaleMessage('loginDialogPass'),
            'loginDialogEmail': contentLocalizeHelper.getLocaleMessage('loginDialogEmail'),
            'dlgCloseHint': contentLocalizeHelper.getLocaleMessage('dlgCloseHint')
        };
    });

    loginDialog.bindEvents = function () {
        var self = this;
        var form = document.getElementById(this._id);
        Event.add(form, 'submit', function (event) {
            return false;
        });
        var loginBtn = document.getElementById('ll_login_button');
        Event.add(loginBtn, 'click', function (event) {
            self._handleLogin();
            return false;
        });
        var createAccHref = document.getElementById('ll_login_create_acc');
        Event.add(createAccHref, 'click', function (event) {
			var rnd = Math.random();
			var page = 'register';
			if (rnd > 0.5) {
				page = 'register2';
			}
            kango.invokeAsync('kango.lingualeo.openLinguaLeoPage', page);
            return false;
        });
        var forgotPassHref = document.getElementById('ll_login_forgot_pass');
        Event.add(forgotPassHref, 'click', function (event) {
            kango.invokeAsync('kango.lingualeo.openLinguaLeoPage', 'forgotPass');
            return false;
        });
        var closeHref = document.getElementById('ll_login_close');
        Event.add(closeHref, 'click', function (event) {
            self.hide();
            return false;
        });
    };

    loginDialog._clearErrorList = function () {
        var errListEl = document.getElementById('ll_login_error_list_1');
        domHelper.removeAllChilds(errListEl);
        //domHelper.appendHtmlToElement(errListEl, '&nbsp;');
    };

    loginDialog._addErrorToList = function (text) {
        var errListEl = document.getElementById('ll_login_error_list_1');
        domHelper.removeAllChilds(errListEl);
        domHelper.appendHtmlToElement(errListEl, htmlHelper.escapeHTML(text));
    };

    loginDialog._isDataValid = function (username, pass) {
        var validateEmail = function (email) {
            var emailRegex = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
            return emailRegex.test(email);
        };

        if (username.length === 0 || !validateEmail(username)) {
            this._addErrorToList(contentLocalizeHelper.getLocaleMessage('loginDialogEmailIncorrect'));//todo: message for invalid email
            return false;
        }
        if (pass.length === 0) {
            this._addErrorToList(contentLocalizeHelper.getLocaleMessage('loginDialogEmailIncorrect'));//todo: message for empty pass
            return false;
        }
        return true;
    };

    loginDialog._handleLogin = function () {
        this._clearErrorList();
        var username = document.getElementById('ll_login_username').value;
        var pass = document.getElementById('ll_login_pass').value;
        if (this._isDataValid(username, pass)) {
            var self = this;
            kango.invokeAsyncCallback('kango.lingualeo.loginUser', username, pass, function (result) {
                if (typeof result.error_msg !== 'undefined' && result.error_msg !== '') {
                    self._addErrorToList(result.error_msg);
                } else {                    
					self.hide(true);
                }
            });
        }
    };
	
	loginDialog._hideCallback = hideCallback;

    loginDialog.init(function () {
        loginDialog.show();
    });
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

    kango.addMessageListener('showNoMeatballsDialog', function (event) {
		showMeatballsDialog();
	});
    kango.addMessageListener('showLoginForm', function (event) {
		showLoginDialog();
	});
})();








