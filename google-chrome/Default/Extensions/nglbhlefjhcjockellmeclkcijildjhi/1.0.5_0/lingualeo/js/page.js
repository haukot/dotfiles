



(function() {
    var $ = function(id) { return document.getElementById(id) };
    var deltaX = 0;
    var sunElem, forestElem, treeElem, footerElem;

    function proceedMouseWheel(event) {
        if (typeof event.wheelDelta !== 'undefined') {
            deltaX += event.wheelDelta / 2;
        } else {
            deltaX += -event.detail * 4;
        }

        if (deltaX < -600) {
            deltaX = -600;
        }
        else if (deltaX > 0) {
            deltaX = 0;
        }
        var scaleForest = 1 + deltaX * 0.0003;
        var scaleTree = 1 + deltaX * 0.001;
		sunElem.style.OTransform = 'translate('+(-deltaX*0.3)+'px,'+(-deltaX * 0.05)+'px)';
        sunElem.style.MozTransform = 'translate('+(-deltaX*0.3)+'px,'+(-deltaX * 0.05)+'px)';
        sunElem.style.WebkitTransform = 'translate('+(-deltaX*0.3)+'px,'+(-deltaX * 0.05)+'px)';

		forestElem.style.OTransform = 'translate('+(deltaX * 0.1)+'px,0) scale('+scaleForest+','+scaleForest+')';
        forestElem.style.MozTransform = 'translate('+(deltaX * 0.1)+'px,0) scale('+scaleForest+','+scaleForest+')';
        forestElem.style.WebkitTransform = 'translate('+(deltaX * 0.1)+'px,0) scale('+scaleForest+','+scaleForest+')';

		treeElem.style.OTransform = 'translate('+(deltaX * 0.1)+'px,0) scale('+scaleTree+','+scaleTree+')';
        treeElem.style.MozTransform = 'translate('+(deltaX * 0.1)+'px,0) scale('+scaleTree+','+scaleTree+')';
        treeElem.style.WebkitTransform = 'translate('+(deltaX * 0.1)+'px,0) scale('+scaleTree+','+scaleTree+')';

        treeElem.style.opacity = (1 + deltaX/2000);
        footerElem.style.backgroundPosition = (deltaX)+'px bottom';
    }

    function initAnimations() {
        sunElem = $('sun');
        forestElem = $('forest');
        treeElem = $('tree');
        footerElem = $('footer');

        // Stop mouse wheel event on content part of the page
		Event.add($('content'), 'mousewheel', function(e) {
            e.stopPropagation();
        });

        // Start capturing mouse wheel event on the page after all finishing all animations
        setTimeout(function() {
			Event.add($('container'), 'mousewheel', proceedMouseWheel);
			Event.add($('container'), 'DOMMouseScroll', proceedMouseWheel);
        }, 9000);
    }

    function poceedHashChanged() {
        var isChangelog = (document.location.hash === '#changelog');
        $('optionsContainer').className = isChangelog ? 'hidden' : '';
        $('changelogContainer').className = isChangelog ? '' : 'hidden';
        $('tabOptions').className = isChangelog ? '' : 'selected';
        $('tabChangelog').className = isChangelog ? 'selected' : '';
    }

    function initPage() {
        window.onhashchange = poceedHashChanged;
        poceedHashChanged();
    }

    initPage();
    initAnimations();
    
})();