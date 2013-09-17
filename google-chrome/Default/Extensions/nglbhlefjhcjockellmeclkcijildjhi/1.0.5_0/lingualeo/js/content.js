// ==UserScript==
// @name LinguaLeoContent
// @all-frames true
// @include http://*
// @include https://*
// @exclude http*://*lingualeo.com/*
// @exclude http*://*lingualeo.ru/*
// @exclude http*://*facebook.com/plugins/*
// @exclude http*://*twitter.com/widgets/*
// @exclude http*://plusone.google.com/*
// ==/UserScript==

//kango.console.log('content');

function formatStrExt (str, data) {
    for (var paramName in data) {
        str = str.replace(new RegExp('{'+paramName+'\\?(.*?)\\:(.*?)}', 'g'), data[paramName] ? '$1' : '$2');
    }
    return lingualeoHelper.formatStr(str, data);
}
/*
function htmlen (str, keepQuotes) {
    var html = str.replace(/&[^#]/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return keepQuotes ? html : html.replace(/"/g, '&quot;');
}
*/
function wrapWordWithTag (text, word, tagName) {
    return text.replace(new RegExp('([^\\w]|^)('+word+')([^\\w]|$)', 'gi'), '<'+htmlHelper.escapeHTML(tagName)+'>$1$2$3</'+htmlHelper.escapeHTML(tagName)+'>');
}

function createElementFromHtml (html) {
    var container = document.createElement('div');
    container.innerHTML = html;
    return container.childNodes[0];
}

function trimText(text) {
    return text.replace(/^[ \t\r\n]+|[ \t\r\n]+$/, '');
}

function canTranslate(text) {
    return /[a-z0-9'-]/i.test(text)/* && text.length <= 50*/;
}


function findSentence2 (selection, inputElement) {

    var arrPunctuation = ['.', '!', '?'];

    var moveLeftUntilPunctuatuin = function (range) {
        var text = range.toString();
        bPunctReached = false;
        while (!bPunctReached) {
            if (range.startOffset > 0) {
                range.setStart(range.startContainer, range.startOffset - 1);
                if (arrPunctuation.indexOf(range.toString().charAt(0)) !== -1) {
                    bPunctReached = true;
                    range.setStart(range.startContainer, range.startOffset + 1);
                }
            } else {
                bPunctReached = true;
            }
            if (text === range.toString())
                bPunctReached = true;
        }
        return range;
    };

    var moveRightUntilPunctuatuin = function (range) {
        var text = range.toString();
        bPunctReached = false;
        while (!bPunctReached) {
            if (range.endOffset < range.endContainer.textContent.length) {
                try{
					range.setEnd(range.endContainer, range.endOffset + 1);
				} catch (e) {
					bPunctReached = true;
				} 
                if (arrPunctuation.indexOf(range.toString().charAt(range.toString().length - 1)) !== -1) {
                    bPunctReached = true;
                    range.setEnd(range.endContainer, range.endOffset - 1);
                }
            } else {
                bPunctReached = true;
            }
            if (text === range.toString())
                bPunctReached = true;
        }
        return range;
    };

    var findSentenceContainingText = function (context, text, arrPunctuation) {
        text = trimText(text);
        //kango.console.log('text = ' + text);
        var len = text.length;
        var pos = context.indexOf(text);
        while (pos !== -1) {
            var posPunct = context.search(new RegExp('[\\' + arrPunctuation.join('\\') + '](\\s|$)', 'gim'));
            if (posPunct === -1){
                return context;
            }
            if (pos < posPunct) {
                return context.substr(0, posPunct + 1);
            } else {
                context = context.substr(posPunct + 1);
            }
            //kango.console.log(context, pos, posPunct);
            pos = context.indexOf(text);
        }
		return text;
    };
	
	//chacks if all element siblings are inline
	var isAllSiblingsAreInline = function (element) {
		/*
		var prevSib = element.previousSibling, nextSib = element.nextSibling;
		while (prevSib !== null) {
			if (typeof prevSib.style !== 'undefined' && prevSib.style.display !== 'inline' && prevSib.style.display !== '') {
				return false;
			}
			prevSib = prevSib.previousSibling;
		}
		while (nextSib !== null) {
			if (typeof nextSib.style !== 'undefined' && nextSib.style.display !== 'inline' && nextSib.style.display !== '') {
				return false;
			}
			nextSib = nextSib.nextSibling;
		}
		*/
		var blockTags = ['div', 'p', 'form', 'ul', 'ol', 'dl', 'li', 'table', 'pre', 'dt', 'dd', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
		var parent = element.parentNode;
		var child = parent.firstChild;
		while (child !== null) {
			if (typeof child.nodeName !== 'undefined') {
				if (arrayHelper.indexOf(blockTags, child.nodeName.toLowerCase()) !== -1) {
					return false;
				}
			}
			if (typeof child.style !== 'undefined' && child.style.display !== 'inline' && child.style.display !== '') {
				return false;
			}
			//kango.console.log([child.nodeName, child.style ? child.style.display : 'null']);		
			child = child.nextSibling;
		}
		
		return true;
	}
	
	//finds first block parent or parent that has block children
	var getBlockParent = function (element) {
		var resultElement = element;
		var inlineTags = ['font', 'b', 'i', 'span', 'u', 'em', 'a', 'strong'];
		var bStop = false;
		while (!bStop) {
			if (typeof resultElement.parentNode !== 'undefined' && resultElement.parentNode !== null) {
				resultElement = resultElement.parentNode;
				//kango.console.log([resultElement.nodeName, resultElement.style.display]);				
				if (!isAllSiblingsAreInline(resultElement) || (typeof resultElement.nodeName !== 'undefined' && arrayHelper.indexOf(inlineTags, resultElement.nodeName.toLowerCase()) === -1)) {
					bStop = true;
				}
			} else {
				bStop = true;
			}
		}
		return resultElement;
	};


	if (inputElement) {
		var selStart = inputElement.selectionStart;
		var selEnd = inputElement.selectionEnd;
		//kango.console.log([selStart, selEnd]);
		var text = inputElement.value + '.';
		var separatorsStr = arrPunctuation.join('');
		while (separatorsStr.indexOf(text.charAt(selStart - 1)) === -1 && selStart !== 1) {
			selStart -= 1;
		}
		while (separatorsStr.indexOf(text.charAt(selEnd + 1)) === -1 && selEnd !== text.length - 1) {
			selEnd += 1;
		}
		//kango.console.log([selStart, selEnd]);
		var selectedText = text.substring(selStart, selEnd);
		//kango.console.log('selectedText = ' + selectedText);
		result = findSentenceContainingText(inputElement.value, selectedText, arrPunctuation);
	} else {
		var range = selection.getRangeAt(0);
		//expand selection to the left and to the right until punctuation to get more info about selected text
		//this helps us to skip sentenses that contain the same text as selected text.
		range = moveLeftUntilPunctuatuin(range);
		range = moveRightUntilPunctuatuin(range);
		var parentElement = getBlockParent(range.startContainer);//range.commonAncestorContainer;
		var parentText = parentElement.textContent; 
		//kango.console.log('findSentence2 ' + [parentText, range.toString()]);
		var result = findSentenceContainingText(parentText, range.toString(), arrPunctuation);
		//kango.console.log('findSentence2 result = ' + result);
	}

    return result;
}

function extractContext(inputElement) {
	var result = null;
	var sel = selectionHelper.getSelection();
	var backupSelection = selectionHelper.saveSelection();

	//get selection text
	var text = '';
	if (inputElement) {
		text = inputElement.value.substring(inputElement.selectionStart, inputElement.selectionEnd);
	} else {
		if (typeof sel.toString === 'function') {
			text = sel.toString();
		} else {
			try { 
				text = document.selection.createRange().text; //IE throws Access denied sometimes when document.selection.type === 'None' (read here https://github.com/tinymce/tinymce/pull/122)
			} catch (e) {}
		}
	}
	text = trimText(text);

	if (canTranslate(text) && text.length > 0) {
		//kango.console.log('canTranslate text = ' + text);
        // Expand selection to whole sentence, get context
        var context = null;
        
		if (browserDetector.isChrome() || browserDetector.isSafari()) {
			//chrome
			//kango.console.log([sel, sel.toString()]);
            sel.modify('move', 'left', 'sentence');  // modifying with 'sentence' in FF causes exception
            sel.modify('extend', 'right', 'sentence');
            context = trimText(sel.toString());
        } else {
            if (typeof sel.getRangeAt === 'function') {
                //opera, firefox, ie9 standards
                context = findSentence2(sel, inputElement);
            } else {
                //ie9 quirks mode
                var tmpRange = document.selection.createRange();
				var parentElText = tmpRange.parentElement().innerText || '';
                tmpRange.moveStart('sentence', -1);
                tmpRange.moveEnd('sentence', 1);
                context = tmpRange.text;
				if (parentElText.length && context.length > parentElText.length) {
					context = parentElText;
				}
            }
        }
		
		result = {
			text: text,
			context: (context === text) ? null : context
		};
	}

	selectionHelper.restoreSelection(backupSelection);

	return result;
}


var LLDictionariesList = {
    linkTemplate: '<a href="{href}" target="_blank" class="{className}" title="{title}" style="background-image:url(\'{imagesUrl}/sprites.png\') !important"></a>',
    list: {
        multitran: {
            className: 'lleo_multitran',
            title: 'Multitran',
            isAvailable: function(locale){
                return locale == 'ru';
            },
            getLink: function (word, locale){
                return 'http://multitran.ru/c/m.exe?CL=1&l1=1&s='+encodeURIComponent(word);
            }
        },
        google: {
            className: 'lleo_google',
            title: 'Google',
            isAvailable: function(locale) {
                return true;
            },
            getLink: function(word, locale) {
                if (locale == 'pt_br') {
                    locale = 'pt';
                }
                return 'http://translate.google.com/#en|' + (locale == 'en' ? 'ru' : locale) + '|' + encodeURIComponent(word);
            }
        },
        lingvo: {
            className: 'lleo_lingvo',
            title: 'Abbyy Lingvo',
            isAvailable: function(locale) {
                return locale == 'ru';
            },
            getLink: function(word, locale){
                return 'http://lingvopro.abbyyonline.com/en/Search/en-ru/' + encodeURIComponent(word);
            }
        },
        dictionary: {
            className: 'lleo_dict',
            title: 'Dictionary.com',
            isAvailable: function(locale) {
                return true;
            },
            getLink: function(word, locale) {
                return 'http://dictionary.reference.com/browse/' + encodeURIComponent(word);
            }
        },
        theFreeDictionary: {
            className: '',
            title: 'TheFreeDictionary.com',
            isAvailable: function(locale) {
                return true;
            },
            getLink: function(word, locale) {
                return 'http://www.thefreedictionary.com/' + encodeURIComponent(word);
            }
        },
        linguee: {
            className: 'lleo_linguee',
            title: 'Linguee',
            isAvailable: function(locale){
                return locale == 'pt';
            },
            getLink: function(word, locale){
                return 'http://www.linguee.com.br/ingles-portugues/search?source=auto&query=' + encodeURIComponent(word);
            }
        },
        michaelis: {
            className: 'lleo_michaelis',
            title: 'Michaelis',
            isAvailable: function(locale) {
                return locale == 'pt';
            },
            getLink: function(word, locale) {
                return 'http://michaelis.uol.com.br/moderno/ingles/index.php?lingua=ingles-portugues&palavra=' + encodeURIComponent(word);
            }
        }
    }
};

function replaceInTemplate(replace, to, template) {
    return template.replace('{' + replace + '}', htmlHelper.escapeHTML(to));
}






var llContent = {};
llContent.isMac = window.navigator.userAgent.toLowerCase().indexOf('macintosh') > -1;
llContent.config = null;
llContent.options = null;
llContent.nativeLang = null;
llContent.lastTextSentToTranslation = null;

llContent.updateNativeLang = function () {
    kango.invokeAsync('kango.lingualeo.getNativeLang', function (lang) {
        llContent.nativeLang = lang;
    });
};

llContent.updateOptions = function () {
    kango.invokeAsync('kango.lingualeo.getExtensionOptions', function(response){
        llContent.options = response;
    });
};

llContent.getTranslationsHtml = function (translations, inDictionary) {
    // Create translation items, limit by 5 options
    var items = [];
    if (translations && translations.length) {
		try {
			translations = Array.prototype.slice.call(translations, 0);
		} catch (e) {
			translations = arrayHelper.convertFromObject(translations);
		}
        var ind = 0;

        // Cut off the first translation if it's a current word translation
        // (current translation always goes first in list)
        if (inDictionary) {
            translations.splice(0, 1);
            ind++;
        }
        // Limit by 5 translations if more
        if (translations.length > 5) {
            translations = translations.slice(0, 5);
        }

        items = arrayHelper.map(translations, function(item) {
			var linkMarker = replaceInTemplate('imagesUrl', llContent.config.path.images, '{imagesUrl}/1/marker.png');
			var indexAttr = ' ind="'+htmlHelper.escapeHTML((ind++))+'" ';
			return '<div class="ll-translation-item" '+indexAttr+'><div class="ll-translation-text" '+indexAttr+'><img class="ll-translation-marker" src="'+htmlHelper.escapeHTML(linkMarker)+'"/><a href="javascript:void 0" '+indexAttr+' >'+htmlHelper.escapeHTML(item.value)+'</a></div><div class="ll-translation-counter">'+htmlHelper.escapeHTML(item.votes)+'</div></div>';
        });
    }
    return items.join('');
};

llContent.getArticleTemplateData = function () {
    var inDict = llContent.dialog.curData.inDictionary;
    var hasTranslation = llContent.dialog.curData.translations && llContent.dialog.curData.translations.length;
    var originalText = llContent.dialog.curData.originalText;
	var baseForm = null;
	var isOriginalTextAlreadyABaseForm = true;
	if (llContent.dialog.curData.word_forms && llContent.dialog.curData.word_forms.length) {
		if (trimText(originalText.toLowerCase()) != trimText(llContent.dialog.curData.word_forms[0].word.toLowerCase())) {
			isOriginalTextAlreadyABaseForm = false;
			baseForm = llContent.dialog.curData.word_forms[0].word;
		}
	}
	

    var dictionariesLinksHTML = '';
    if (llContent.options.showDictIcons) {
        var linkTemplate = replaceInTemplate('imagesUrl', llContent.config.path.images, LLDictionariesList.linkTemplate);
        for (var dictName in LLDictionariesList.list) {
            var dictItem = LLDictionariesList.list[dictName];
            if (dictItem.isAvailable(llContent.nativeLang)) {
                var linkHTML =  replaceInTemplate('className', dictItem.className, linkTemplate);
                linkHTML = replaceInTemplate('title', dictItem.title, linkHTML);
                dictionariesLinksHTML += replaceInTemplate('href', dictItem.getLink(originalText, llContent.nativeLang), linkHTML);
            }
        }
    }
	
	//kango.console.log([llContent.dialog.curData.context, htmlHelper.escapeHTML(llContent.dialog.curData.context), htmlHelper.escapeHTML(llContent.dialog.curData.context)]);

    return {
        imagesUrl: htmlHelper.escapeHTML(llContent.config.path.images),
        inDict: htmlHelper.escapeHTML(llContent.dialog.curData.inDictionary),
        transItems: llContent.getTranslationsHtml(llContent.dialog.curData.translations, inDict), //already escaped
        transcription: htmlHelper.escapeHTML(llContent.dialog.curData.transcription) || '---',
        originalText: htmlHelper.escapeHTML(originalText),
        addTranHint: htmlHelper.escapeHTML(contentLocalizeHelper.getLocaleMessage('enterCustomTranslation')),
        wordHint: inDict ? htmlHelper.escapeHTML(contentLocalizeHelper.getLocaleMessage('wordLinkHint')) : '',
        seeAlsoHint: htmlHelper.escapeHTML(contentLocalizeHelper.getLocaleMessage('seeAlsoHint')),
        optionsBtnHint: htmlHelper.escapeHTML(contentLocalizeHelper.getLocaleMessage('optionsBtnHint')),
        soundUrl: htmlHelper.escapeHTML(llContent.dialog.curData.soundUrl) || '',
        soundHint: htmlHelper.escapeHTML(contentLocalizeHelper.getLocaleMessage('soundButtonHint')),
        hasPic: !!(llContent.options.showPicture && llContent.dialog.curData.picUrl),
        picUrl: htmlHelper.escapeHTML((llContent.options.showPicture && llContent.dialog.curData.picUrl) || llContent.config.path.images + '/blank.gif'),
        showDicts: htmlHelper.escapeHTML(llContent.options.showDictIcons),
        translateContextHint: htmlHelper.escapeHTML(contentLocalizeHelper.getLocaleMessage('translateContextHint')),
        context: llContent.options.showContext
            ? llContent.dialog.curData.context ? wrapWordWithTag(htmlHelper.escapeHTML(llContent.dialog.curData.context), originalText, 'b') : null
            : null,
        dictionariesLinksHTML: dictionariesLinksHTML, //already escaped
        wordLink: inDict
            ? llContent.config.domain + lingualeoHelper.formatStr(llContent.config.path.wordArticle, {originalText: htmlHelper.escapeHTML(originalText.toLocaleLowerCase())})
            : 'javascript:void 0',
        translatedText: baseForm && !isOriginalTextAlreadyABaseForm 
			? htmlHelper.escapeHTML(contentLocalizeHelper.getLocaleMessage('baseFormHint')) + ':'
			: inDict
            ? htmlHelper.escapeHTML(llContent.dialog.curData.translations[0].value)
            : hasTranslation
            ? htmlHelper.escapeHTML(contentLocalizeHelper.getLocaleMessage('chooseTranslationHint')) + ':'
            : htmlHelper.escapeHTML(contentLocalizeHelper.getLocaleMessage('noTranslationHint')) + '.',
		baseForm: htmlHelper.escapeHTML(baseForm)
    }
};

llContent.playSound = function () {
    //if (browserDetector.isChrome()) {  //use soundmanager all the time because of Range HTTP header problem in Chome html5 audio
    //    document.getElementById('lleo_player').play();
    //} else {        
		var url = llContent.config.path.audio_player + llContent.dialog.curData.soundUrl;
        var htmlFrame = '<iframe src="' + htmlHelper.escapeHTML(url) + '" width="0" height="0" style="width:0; height:0; visibility:hidden; border:0; overflow:hidden; margin:0; padding:0;" marginwidth="0" marginheight="0" hspace="0" vspace="0" frameborder="0" scrolling="no"></iframe>';
        domHelper.appendHtmlToElement(document.getElementById('lleo_sound'), htmlFrame);
    //}
	return false;
};

llContent.markBlockClick = function () {
	kango.invokeAsync('kango.lingualeo.openLinguaLeoWebsite', 'popup');
	return false;
};

llContent.baseFormClick = function () {
	var baseForm = llContent.dialog.curData.word_forms && llContent.dialog.curData.word_forms.length ? llContent.dialog.curData.word_forms[0].word : null; 
	if (baseForm) {
		llContent.showTranslatesDialog({'text': baseForm, 'context': null});
	}
	return false;
};

llContent.showTranslations = function (data) {
    if (llContent.dialog.elem) {
        llContent.dialog.curData = data;
        lingualeoHelper.getTemplate('contentTranslations', function(htmlTemplate) {
            var html = formatStrExt(htmlTemplate, llContent.getArticleTemplateData());
            llContent.dialog.setContent(html);
			Event.add(document.getElementById('lleo_setTransForm'), 'submit', llContent.handlers.submitCustomTranslation);
			Event.add(document.getElementById('lleo_trans'), 'click', llContent.handlers.clickTranslationsList);
            Event.add(document.getElementById('lleo_sound'), 'click', llContent.playSound);
			Event.add(document.getElementById('lleo_markBlock'), 'click', llContent.markBlockClick);
			Event.add(document.getElementById('lleo_baseForm'), 'click', llContent.baseFormClick);
			if (browserDetector.isSafari() || browserDetector.isIE()) {
				var optionsHref = document.getElementById('lleo_optionsBtn');
				Event.add(optionsHref, 'click', llContent.openSettings);
				optionsHref.style.display = 'block';
			}
            if (llContent.options.autoplaySound) {
                llContent.playSound();
            }
            if (llContent.options.showContext) {
                if (llContent.options.autoTranslateContext) {
                    llContent.handlers.clickTranslateContext();
                } else {
					Event.add(document.getElementById('lleo_translateContextLink'), 'click', llContent.handlers.clickTranslateContext);
                }
            }
        });
    }
};

llContent.showLoginDialog = function () {
	var backupSelection = selectionHelper.saveSelection();
	showLoginDialog(function (returnValue) {
		if (returnValue) {
			selectionHelper.restoreSelection(backupSelection);
			llContent.showTranslationsDialog();
		}
	});
};

llContent.showTranslatesDialog = function (data) {
	llContent.dialog.create();
	llContent.lastTextSentToTranslation = data.text;
	kango.invokeAsyncCallback('kango.lingualeo.getTranslations', data.text, data.context, function(response) {
		if (data.text === llContent.lastTextSentToTranslation) {
			if (response.error) {
				llContent.dialog.remove();
				if (typeof response.result !== 'undefined' && response.result !== null && response.result.error_code === 401) {// not authorised
					kango.invokeAsync('kango.lingualeo.ext.setAuthState', false);
					llContent.showLoginDialog();
				}
				//kango.console.log([response.error, response.error_msg, response.status]);
			} else {
				llContent.showTranslations(response);
			}
		}
	});
};


llContent.showDialogForCurrentSelection = function (inputElement, doExpandCollapsedSelection) {
	if (inputElement && inputElement.getAttribute && inputElement.getAttribute('type') === 'password') {
		return;
	}
	var sel = selectionHelper.getSelection();
	if (!inputElement && doExpandCollapsedSelection) {		
		if (sel.isCollapsed) {
			try {
				sel.modify('move', 'left', 'word');
				sel.modify('extend', 'right', 'word');
			} catch (e) {
				//kango.console.log(e.message);
			}
		}
	}
	var data = extractContext(inputElement);
	if (data) {	
		var rect = null;
		if (inputElement) {
			rect = inputElement.getBoundingClientRect();
		} else {
			if (typeof sel.getRangeAt === 'function') {
				var range = sel.getRangeAt(0);
				rect = range.getBoundingClientRect();
				//kango.console.log(JSON.stringify(rect));
				if (browserDetector.isOpera() || browserDetector.isFirefox()) { //crutch, on http://ru.scribd.com/doc/42717509/gamification101 in Opera and FF 'getBoundingClientRect' returns incorrect values 
					var cS = sizeHelper.clientSize();
					var point = {'x': rect.left, 'y': rect.top};
					var visibleAreaRect = {'left': 0, 'top': 0, 'right': cS.width, 'bottom': cS.height};
					//kango.console.log(JSON.stringify(point));
					//kango.console.log(JSON.stringify(visibleAreaRect));
					if (!sizeHelper.pointInRect(point, visibleAreaRect)) {
						kango.console.log('not in rect!');
						var startEl = range.startContainer;
						while(typeof startEl.tagName === 'undefined') {
							startEl = startEl.parentNode;
						}
						var offset = sizeHelper.getOffset(startEl);
						var sO = llContent.dialog.scrollOfsetOnClick || sizeHelper.scrollOffset();
						offset.left -= sO.left;
						offset.top -= sO.top;
						rect = {'left': offset.left, 'top': offset.top, 'width': startEl.offsetWidth, 'height': startEl.offsetHeight};
						rect.right = rect.left + rect.width;
						rect.bottom = rect.top + rect.height;
					}
				}
			} else {
				rect = document.selection.createRange().getClientRects()[0];
			}
		}
		
		llContent.dialog.scrollOfsetOnClick = sizeHelper.scrollOffset();
		llContent.dialog.rect = rect;
		
		kango.invokeAsync('kango.lingualeo.getAuthState', function (isAuthorised) {
			if (isAuthorised) {		
				llContent.showTranslatesDialog(data);
			} else {
				kango.invokeAsyncCallback('kango.lingualeo.checkAuthorization', function (bAuthorised) {
					if (bAuthorised) {
						llContent.showTranslatesDialog(data);
					} else {
						llContent.showLoginDialog();				
					}
				});
			}
		});			
	}
};

llContent.showTranslationsDialog = function () {
    // Detect if context menu was called from input element.
    // If so, pass it as a parameter, so script can calculate dialog position relatively to the input,
    // not to current selection, because it's impossible to get x/y coords for selection inside the input
    // using standard technique with getClientBoundRect().
    // Moreover, this input will be used to extract a text context using input-specific selection methods.
    var inputElement = null;
	if (typeof document.activeElement.tagName !== 'undefined' && (document.activeElement.tagName.toLowerCase() === 'input' || document.activeElement.tagName.toLowerCase() === 'textarea')) {
		inputElement = document.activeElement;
	}	
	//var inputElement = (document.activeElement instanceof HTMLInputElement) ? document.activeElement : null;
    llContent.showDialogForCurrentSelection(inputElement, true);
};

llContent.bindEventHandlers = function () {
    Event.add(window, 'resize', llContent.dialog.remove);
	Event.add(document, 'dblclick', llContent.handlers.dblClick);
	Event.add(document, 'keydown', llContent.handlers.keyDown);
	Event.add(document, 'contextmenu', llContent.handlers.contextMenu);
	Event.add(document, 'selectionchange', llContent.handlers.selectionChange);
	Event.add(document, 'mousedown', llContent.dialog.remove);
    kango.addMessageListener('getContext', llContent.showTranslationsDialog);
    kango.addMessageListener('updateOptions', llContent.updateOptions);
    kango.addMessageListener('updateLocaleMessages', function () {contentLocalizeHelper.updateLocaleMessages(true);});
    kango.addMessageListener('updateNativeLang', llContent.updateNativeLang);
	if (browserDetector.isOpera()) {
		Event.add(document, 'mouseup', llContent.handlers.operaMouseUp);
	}
};

llContent.injectStyle = function () {
    lingualeoHelper.getTemplate('contentStyle', function(code){
        cssHelper.addCss(code);
    });
};

llContent.openSettings = function () {
	kango.invokeAsync('kango.ui.optionsPage.open');
};

llContent.init = function () {
    llContent.config = new LinguaLeoConfig();
    llContent.bindEventHandlers();
    llContent.injectStyle();
    llContent.updateOptions();
    llContent.updateNativeLang();
};


llContent.dialog = {};
llContent.dialog.elem = null;
llContent.dialog.rect = null;
llContent.dialog.curData = null;
llContent.dialog.scrollOfsetOnClick = null;

llContent.dialog.remove = function () {
    var elem = document.getElementById('lleo_dialog')
    if (elem) {
        elem.parentNode.removeChild(elem);
        llContent.dialog.elem = null;
    }
};

llContent.dialog.setContent = function (html) {
	document.getElementById('lleo_dialogContent').innerHTML = html;
    llContent.dialog.updatePosition();
};

llContent.dialog.updatePosition = function () {
    var body = document.getElementsByTagName('body')[0];
    var sO = llContent.dialog.scrollOfsetOnClick || sizeHelper.scrollOffset();
	llContent.dialog.scrollOfsetOnClick = null;//todo: test this better
    var l = (sO.left + llContent.dialog.rect.left - 12);
    var t = (sO.top + llContent.dialog.rect.top - llContent.dialog.elem.offsetHeight - 10);

    // Correct dialog position according to viewport
    if (t < sO.top) {
        t = (sO.top + llContent.dialog.rect.bottom + 10);
    }
    if (l < sO.left + 5) {
        l = sO.left + 5;
    }
    else if (l + llContent.dialog.elem.offsetWidth > sO.left + body.offsetWidth - 5) {
        l = sO.left + body.offsetWidth - llContent.dialog.elem.offsetWidth - 5;
    }
    llContent.dialog.elem.style.left = l + 'px';
    llContent.dialog.elem.style.top = t + 'px';
};

llContent.dialog.create = function () {
    lingualeoHelper.getTemplate('dialog', function(htmlTemplate) {
        var html = formatStrExt(htmlTemplate, {
            imagesUrl: htmlHelper.escapeHTML(llContent.config.path.images),
            closeBtnHint: htmlHelper.escapeHTML(contentLocalizeHelper.getLocaleMessage('dlgCloseHint') + ' (Esc)')
        });
        llContent.dialog.remove();
        //llContent.dialog.elem = createElementFromHtml(html);
		//document.documentElement.appendChild(llContent.dialog.elem);
		domHelper.appendHtmlToElement(document.getElementsByTagName('body')[0], html);
		llContent.dialog.elem = document.getElementById('lleo_dialog');
		
		Event.add(llContent.dialog.elem, 'dblclick', function(event) { event.stopPropagation(); });
		Event.add(llContent.dialog.elem, 'mousedown', function(event) { event.stopPropagation(); });
		Event.add(llContent.dialog.elem, 'mouseup', function(event) { event.stopPropagation(); });
		Event.add(llContent.dialog.elem, 'contextmenu', function(event) { event.stopPropagation(); });
		Event.add(document.getElementById('lleo_closeBtn'), 'click', llContent.dialog.remove);
		        
        llContent.dialog.setContent('&nbsp;' + htmlHelper.escapeHTML('Loading...'));
        llContent.dialog.elem.className = 'lleo_show';
    });
};

llContent.dialog.setTranslatedContext = function (htmlEscapedText) {
    if (llContent.dialog.elem) {
		document.getElementById('lleo_context').innerHTML = htmlEscapedText;
		document.getElementById('lleo_gBrand').className = '';
    }
};


llContent.handlers = {};
llContent.handlers.dblClick = function (event) {
    if (llContent.options.useDblClick) {
        if ((!llContent.options.dblClickWithCtrl && !llContent.options.dblClickWithAlt)
            || (llContent.options.dblClickWithCtrl && (llContent.isMac ? event.metaKey : event.ctrlKey))
            || (llContent.options.dblClickWithAlt && event.altKey))
        {
			var inputElement = null;
			if (typeof event.target.tagName !== 'undefined' && (event.target.tagName.toLowerCase() === 'input' || event.target.tagName.toLowerCase() === 'textarea')) {
				inputElement = event.target;
			}	
			//var inputElement = event.target instanceof HTMLInputElement ? event.target : null;
            llContent.showDialogForCurrentSelection(inputElement, false);
        }
    }
	return false;
};

llContent.handlers.keyDown = function(event) {
    if (event.keyCode === 27) {   // Esc
        llContent.dialog.remove();
        return;
    }
    if (event.ctrlKey && event.keyCode === 76) {   // 'L'-key
        llContent.showTranslationsDialog();
    }
};

llContent.handlers.contextMenu = function () {
    kango.invokeAsync('kango.lingualeo.proceedContextMenuShow');
};

llContent.handlers.selectionChange = function (event) {
	var selection = selectionHelper.getSelection();
	if (typeof selection.toString === 'funciton') {
		var text = trimText(selection.toString());
		kango.invokeAsync('kango.lingualeo.setContextItemText', canTranslate(text) ? text : null);
	}
};

llContent.handlers.submitCustomTranslation = function (event) {
    // Add not empty user's translation to dictionary
    var transValue = trimText(document.getElementById('lleo_transField').value);
    if (transValue) {
        kango.invokeAsync('kango.lingualeo.setWordTranslation', llContent.dialog.curData.originalText, transValue, llContent.dialog.curData.context, document.URL, document.title);
        llContent.dialog.remove();
    }
	return false;
};

llContent.handlers.clickTranslationsList = function (event) {
    if (event.target.tagName === 'A' || event.target.tagName === 'DIV') {
		var indAttr = parseInt(event.target.getAttribute('ind'));
		if (!isNaN(indAttr)) {
			kango.invokeAsync('kango.lingualeo.setWordTranslation', llContent.dialog.curData.originalText, llContent.dialog.curData.translations[indAttr].value, llContent.dialog.curData.context, document.URL, document.title);
			llContent.dialog.remove();
		}
    }
	return false;
};

llContent.handlers.clickTranslateContext = function () {
    if (llContent.dialog.curData.context != null && typeof llContent.dialog.curData.context !== 'undefined') {
		document.getElementById('lleo_translateContextLink').style.visibility = 'hidden';
        var context = wrapWordWithTag(htmlHelper.escapeHTML(llContent.dialog.curData.context), llContent.dialog.curData.originalText, 'b');
        kango.invokeAsyncCallback('kango.lingualeo.translateWithGoogle', context, 'en', llContent.nativeLang || 'ru', function(response) {
			//kango.console.log([response.error_msg, response.translation, contentLocalizeHelper.getLocaleMessage('errorContextTranslation')]);
            llContent.dialog.setTranslatedContext(response.error_msg ? contentLocalizeHelper.getLocaleMessage('errorContextTranslation') : response.translation);
        });
    }
	return false;
};

llContent.handlers.operaMouseUp = function (event) {
	if (llContent.isMac ? event.metaKey : event.ctrlKey) {
		var inputElement = null;
		if (typeof event.target.tagName !== 'undefined' && (event.target.tagName.toLowerCase() === 'input' || event.target.tagName.toLowerCase() === 'textarea')) {
			inputElement = event.target;
		}	
		llContent.showDialogForCurrentSelection(inputElement, false);
	}
	return false;
};


llContent.init();