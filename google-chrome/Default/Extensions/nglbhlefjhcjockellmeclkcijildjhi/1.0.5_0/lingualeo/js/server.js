
var LingualeoServer = function(baseURL) {

	var port = kango.getExtensionInfo().settings['port'];

    var self = this;
    this.responseStatusErrorHandler = null;
    this.responseErrorHandler = null;

	
    //*****************************************************************//

    function sendPostRequest(url, options) {
        sendRequest('POST', url, options);
    }

    function sendGetRequest(url, options) {
        sendRequest('GET', url, options);
    }

    function sendRequest(method, url, options) {
		if (typeof options.params === 'undefined' || options.params === null) {
			options.params = {};
		}
		options.params['port'] = port;
		var details = {
			'method': method,
			'url': url,
			'headers': {'Content-Type': 'application/x-www-form-urlencoded'},
			'params': options.params
		};
		kango.xhr.send(details, function (data) {
            //kango.console.log('kango.xhr.send callback');
			var result;
			if (data.status !== 200) {
				if (self.responseStatusErrorHandler) {
					self.responseStatusErrorHandler(data.status, options.isSilentError);
				}
				if (options.onError) {
					options.onError(null, null, data.status);
				}
			} else {
				try {
					result = JSON.parse(data.response);
				} catch(e) {
					result = {error_msg: 'Wrong server response.'}
				}

				if (result.error_msg) {
					if (self.responseErrorHandler) {
						self.responseErrorHandler(result.error_msg, result.error_code, options.isSilentError);
					}
					if (options.onError) {
						options.onError(result.error_msg, result, data.status);
					}
				} else {
					if (options.onSuccess) {
						options.onSuccess(result || {});
					}
				}
			}
			if (options.onComplete) {
				options.onComplete(result || {});
			}
		});
        //kango.console.log('sendRequest done');
    }

    //*****************************************************************//

    this.loadTranslations = function(originalText, callbackSuccess, callbackError) {
        sendPostRequest(baseURL + lingualeo.config.ajax.getTranslations, {
            isSilentError: true,
            params: {
                word: originalText,
                include_media: 1,
				add_word_forms: 1
            },
            onSuccess: callbackSuccess,
            onError: callbackError
        });
    };

    //adds new translation when user clicks on translateion or enters custom translation
    this.setWordTranslation = function(originalText, translatedText, context, pageUrl, pageTitle, callbackSuccess, callbackError) {
        sendPostRequest(baseURL + lingualeo.config.ajax.addWordToDict, {
            isSilentError: false,
            params: {
                word: originalText,
                tword: translatedText,
                context: context || '',
                context_url: pageUrl,
                context_title: pageTitle
            },
            onSuccess: callbackSuccess,
            onError: callbackError
        });
    };

    //translates context with google
    this.translate = function(originalText, langFrom, langTo, callback) {
        sendGetRequest(baseURL + lingualeo.config.ajax.translate, {
            isSilentError: true,
            params: {
                q: encodeURIComponent(originalText),
                source: langFrom,
                target: langTo
            },
            onComplete: callback
        });
    };

    this.checkAuthorization = function(isSilentError, callbackSuccess, callbackError) {
        sendPostRequest(baseURL + lingualeo.config.ajax.isAuth, {
            isSilentError: isSilentError,
            onSuccess: function(result) {
                if (callbackSuccess) {
                    callbackSuccess(result.is_authorized);
                }
            },
            onError: callbackError
        });
    };

    this.getUntrainedWordsCount = function(callbackSuccess, callbackError) {
        sendPostRequest(baseURL + lingualeo.config.ajax.getUntrainedWordsCount, {
            isSilentError: true,
            onSuccess: callbackSuccess,
            onError: callbackError
        });
    };

    this.setCookieWithServer = function (callbackSuccess) {
        sendPostRequest(baseURL + lingualeo.config.ajax.setChromeHideCookie, {
            isSilentError: true,
            onSuccess: callbackSuccess
        });
    };

    this.getUserData = function (callbackSuccess) {
        sendPostRequest(lingualeo.config.ajax.login, {
            isSilentError: true,
            onSuccess: callbackSuccess
        });
    };

    this.login = function (username, pass, callback) {
        sendPostRequest(lingualeo.config.ajax.login, {
            isSilentError: true,
            params: {
                //port: 1,
                email: username,
                password: pass
            },
            onComplete: callback
        });
    };
	
	this.checkSiteNotifications = function (user_id, callbackSuccess) {
		var url = lingualeo.config.ajax.checkSiteNotifications.replace('{user_id}', user_id);
        sendGetRequest(url, {
            isSilentError: true,
            onSuccess: callbackSuccess
        });
    };

};
