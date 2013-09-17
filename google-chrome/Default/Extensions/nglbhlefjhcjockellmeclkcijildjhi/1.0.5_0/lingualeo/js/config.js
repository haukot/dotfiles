// ==UserScript==
// @name LinguaLeoConfig
// @all-frames true
// @include http://*
// @include https://*
// @exclude http*://*facebook.com/plugins/*
// @exclude http*://*twitter.com/widgets/*
// @exclude http*://plusone.google.com/*
// ==/UserScript==

var LinguaLeoConfig = function () {
    return {
        domain: 'http://lingualeo.com',
		domain_ru: 'http://lingualeo.ru',
		

        path: {
            login: '/login',
            dictionary: '/userdict',
            training: '/training',
            goldStatus: '/gold?from=plagin_meatballs-dialog',
            wordArticle: '/userdict#/{originalText}',
            images: 'http://lingualeo.com/plugins/all/images',
            register: '/register',
			register2: '/?utm_source=ll_plagin&utm_medium=referral&utm_campaign=register',
            forgotPass: '/password/forgot',
            meatballs: '/meatballs',
            audio_player: 'http://lingualeo.com/plugins/all/flash/1.html#sound='
        },
		
		
		api: 'http://api.lingualeo.com',
        ajax: {
            isAuth: '/isauthorized',
            getTranslations: '/gettranslates',
            translate: '/translate.php',
            addWordToDict: '/addword',
            getUntrainedWordsCount: '/getUntrainedWordsCount',
            setChromeHideCookie: '/setChromeHideCookie',
            login: 'http://lingualeo.com/api/login',
			checkSiteNotifications: 'http://api.lingualeo.com/user/{user_id}/notifications/unread'
        },
		
		/*
		api: 'http://lingualeo.com',
        ajax: {
            isAuth: '/api/isauthorized',
            getTranslations: '/api/gettranslates',
            translate: '/translate.php',
            addWordToDict: '/api/addword',
            getUntrainedWordsCount: '/api/getUntrainedWordsCount',
            setChromeHideCookie: '/api/setChromeHideCookie',
            login: '/api/login'
        },
		*/

        maxTextLengthToTranslate: 50,
        notificationTimeout: 10000,
        untrainedWordsCheckingTimeout: 2 * 60 * 60 * 1000 //two hours
    };
};