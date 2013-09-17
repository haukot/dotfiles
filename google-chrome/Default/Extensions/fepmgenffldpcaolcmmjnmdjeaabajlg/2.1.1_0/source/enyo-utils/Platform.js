/* Enyo Platform encapsulation. Include this FIRST in your depends.js.  The
 * first call you make to a function inside it will cause it to perform it's
 * detection (in the setup function).  If you are running in PhoneGap, and your
 * app depends on accurate results in here, make sure that you are not running
 * any code that depends on this module until after the "deviceready" PhoneGap
 * event is fired.
 *
 * This prefers direct access to APIs whenever possible - although you CAN run
 * webOS and WebWorks apps with PhoneGap, I'm trying to avoid going through any
 * extra layers here.
 *
 * If you are deploying to iOS, set a new parameter in your appinfo.json called
 * iTunesAppId to your application id as found in the Apple Dev Portal, for the
 * getReviewURL function
 *
 * PhoneGap iOS can have "OpenAllWhitelistURLsInWebView" set True in 
 * PhoneGap.plist to cause a browser window.open() to open in new windows.
 * 
 * If you are deploying to BlackBerry's App World, set a new parameter in your 
 * appinfo.json called "appWorldId" to your application's id as found in the 
 * App World Dev Portal, for the getReviewURL function.
 *
 * To make your browser work in BlackBerry, you'll need to add to config.xml:
 *   <feature id="blackberry.invoke"/>
 *   <feature id="blackberry.invoke.BrowserArguments"/>
 *
 */
enyo.kind({
    name: "Platform",
    kind: "Component",
    published: {
    	screenWidth: 0,
    	screenHeight: 0,
    	pixelRatio: 1,
    	realPixelRatio: 1,
    	platform: "",
    },
    statics: {
        setup: function()
        {
            
            /* If you include PhoneGap, but you don't wait until the device var
             * is initialized before calling this, we're going to ignore this
             * until the device var is available
             */
            if( (window.cordova || window.PhoneGap) && !window.device) {
                enyo.log("EnyoPlatform: Cordova/PhoneGap detected, device not (yet) available. Bailing until next call.");
                return;
            }
            /* Check for systems where we don't have PhoneGap in our
             * requirements first, currently webOS and BlackBerry WebWorks
             * Even if you use PhoneGap on BlackBerry, according to the PhoneGap
             * documentation, it's platform determination code doesn't work
             * properly for at least some models.
             */
            if(typeof window.PalmSystem !== "undefined")
            {
                var deviceInfo = enyo.fetchDeviceInfo();
                this.platform = "webos";
                this.platformVersion = deviceInfo ? parseFloat(deviceInfo.platformVersion) : "unknown";
                // console.log(enyo.json.stringify(info));
                this.deviceName = deviceInfo.modelNameAscii;
                // console.log(enyo.json.stringify(info));
                var orientation = enyo.getWindowOrientation();
                if (orientation == "up" || orientation == "down") {
                    console.log("landscape active");
                    this.screenWidth = deviceInfo.screenWidth;
                    this.screenHeight = deviceInfo.screenHeight;
                } else {
                    console.log("portrait active");
                    this.screenWidth = deviceInfo.screenHeight;
                    this.screenHeight = deviceInfo.screenWidth;
                }
                this.pixelRatio = "1";
                this.realPixelRatio = "1.0";
            }
            else if(typeof blackberry !== "undefined" ||  (navigator.userAgent.indexOf('Version/10.0') >= 0))
            {
                this.platform = "blackberry";
                /* According to the BlackBerry docs,  to get the version number,
                 * we have to actually make an AJAX request to
                 * http://localhost:8472/blackberry/system/get . Screw that.
                 */
                if(navigator.userAgent.indexOf('Version/10.0') >= 0) {
                    this.platformVersion = "10";
                } else {
                    this.platformVersion = "unknown";
                }
                
                this.screenWidth = screen.width;
                this.screenHeight = screen.height;
                this.pixelRatio = window.devicePixelRatio;
                this.realPixelRatio = window.devicePixelRatio;
                if ((this.screenWidth == 600 && Platform.this == 1024) || (this.screenWidth == 1024 && this.screenHeight == 600)) {
                	this.deviceName = "playbook";
                } else {
                	this.deviceName = "bb10";
                }
            }
            else if(typeof window.cordova !== "undefined" || typeof PhoneGap !== "undefined")
            {
                /* See the PhoneGap Device API documentation for possible
                 * pitfalls.
                 */
                this.platform = device.platform.toLowerCase();
                this.platformVersion = parseFloat(device.version);
                this.screenWidth = window.innerWidth;
                this.screenHeight = window.innerHeight;
                this.pixelRatio = window.devicePixelRatio;
                this.realPixelRatio = window.devicePixelRatio;
            }
            else
            {
                /* Someone with more time on their hands might be interested in
                 * breaking this out to determine various web browsers and their
                 * respective versions.  Not for me at this time.
                 */
                this.platform = "web";
                this.platformVersion = "unknown";
                this.screenWidth = window.innerWidth;
                this.screenHeight = window.innerHeight;
                this.pixelRatio = "1";
                this.realPixelRatio = "1.0";
            }
            enyo.log("********* Setting up Platform Variables *************");
            enyo.log("window.PalmSystem "+ window.PalmSystem);
            enyo.log("window.blackberry "+ window.blackberry);
            enyo.log("window.cordova " + window.cordova);
            enyo.log("window.device "+ window.device);
            if(window.device)
                enyo.log("window.device.platform "+ window.device.platform);
            enyo.log("window.chrome "+ window.chrome);
            enyo.log("Platform detected: " + this.platform + " version " + this.platformVersion);
            enyo.log("screenWidth: " + this.screenWidth);
            enyo.log("screenHeight: " + this.screenHeight);
            enyo.log("pixelRatio: " + this.getPixelRatio());
            enyo.log("realPixelRatio: " + this.realPixelRatio);
            enyo.log(" ************************************** ");
            
            // setting font size
            var scale = Number( Number(this.getPixelRatio()) * 100.0 );
            $('html').css('font-size', scale + "%");
            
            FS.init();
        },
        /* Should you find yourself in need of the raw platform name */
        getPlatformName: function() { this.platform || this.setup(); return this.platform; },
        
        /* Platform boolean functions -- return true if specific platform */        
        isWebOS: function() { this.platform || this.setup(); return this.platform == "webos"; },
        isAndroid: function() { this.platform || this.setup(); return this.platform == "android"; },
        isBlackBerry: function() { this.platform || this.setup(); return this.platform == "blackberry" || this.platform == "webworks" },
        isWebWorks: function() { this.platform || this.setup(); return this.platform == "webworks"; },
        isiOS: function() { this.platform || this.setup(); return this.platform == "iphone"; },
        isMobile: function() { this.platform || this.setup(); return this.platform != "web"; },
        isBrowser: function() { this.platform || this.setup(); return this.platform == "web"; },

        
        isTouchpad : function() {
            if (this.touchpad == null) {
                this.touchpad = Platform.isWebOS() && this.deviceName == "TouchPad";
                console.log("this.touchpad: " + this.touchpad);
            }
            return this.touchpad;
        },
        
        isTouchpadOrPre3 : function() {
            // console.log("deviceName: " + this.deviceName);
            if (this.touchpadOrPre3 == null) {
                this.touchpadOrPre3 = Platform.isWebOS() && this.deviceName == "TouchPad" || this.deviceName == "Pre3";
                console.log("this.touchpadOrPre3: " + this.touchpadOrPre3);
            }
            return this.touchpadOrPre3;
        },
        
        isPre3 : function() {
            // console.log("deviceName: " + this.deviceName);
            if (this.pre3 == null) {
                this.pre3 = Platform.isWebOS() && this.deviceName == "Pre3";
                console.log("this.pre3: " + this.pre3);
            }
            return this.pre3;
        },
        
        isVeer : function() {
            // console.error("deviceName: " + this.deviceName);
            // console.error("this.veer: " + this.veer);
            this.veer = Platform.isWebOS() && this.deviceName == "Veer";
            console.log("this.veer: " + this.veer);
            return this.veer;
        },
        
        isPlaybook : function() {
            if (this.playbook == null) {
                this.playbook = Platform.isBlackBerry() && this.deviceName == "playbook";
                console.log("this.playbook: " + this.playbook);
            }
            return this.playbook;
        },
        
        isBB10 : function() {
            if (this.bb10 == null) {
                this.bb10 = Platform.isBlackBerry() && this.deviceName == "bb10";
                console.log("this.bb10: " + this.bb10);
            }
            return this.bb10;
        },
        
        isTabletDevice: function() {
        	/*var a = Number(this.screenWidth * this.screenWidth);
        	console.log("a: " + a);
        	var b = Number(this.screenHeight * this.screenHeight);
        	console.log("b: " + b);
        	console.log("this.pixelRatio: " + this.pixelRatio);

            var inches = Number(Math.sqrt(a + b) / this.pixelRatio);
            console.log("inches: " + inches);
			
            if (inches > 6)
            {
            	return true;
            }
            return false;*/
        	if (Platform.isAndroid() && AndroidData !== undefined) {
            	var inches = AndroidData.getInches();
            	console.log("phonegap inches: " + inches);
            	if (Number(inches) > 6.0) {
            		console.log("device is a tablet!");
            		return true;
            	}
        	}
    		console.log("device is a phone");
        	return false;
        },
        
        isTablet: function( ) {
            if (this.tablet == null) {
                this.tablet = (Platform.isTouchpad() || Platform.isPlaybook() || Platform.isBrowser() /*) && (!Platform.isHandy()*/ || Platform.isTabletDevice());
                console.log("this.tablet: " + this.tablet);
            }
            return this.tablet;
        },
        
        isHandy: function( ) {
            if (this.handy == null) {
                this.handy = Platform.isBB10() || Platform.isPre3() || Platform.isVeer() || !Platform.isTablet();
                console.log("this.handy: " + this.handy);
            }
            return this.handy;
        },

        isPortraitMode : function( ) {
            if (Platform.isWebOS() == true) {
                var orientation = enyo.getWindowOrientation();
                console.log("orientation: " + orientation);
                if (orientation == "left" || orientation == "right") {
                    return true;
                }
            } else {
                var orientation = window.orientation;
                console.log("orientation: " + orientation);
                console.log("Platform.isBlackBerry(): " + Platform.isBlackBerry());
                console.log("Platform.screenHeight: " + Platform.screenHeight);
                console.log("Platform.screenWidth: " + Platform.screenWidth);
                if (Platform.isAndroid()) {
                	if (Platform.isHandy()) {
                		if (orientation != 0 && orientation != 180) {
                    		console.log("portrait-mode");
                			return true;
                		} else {
                        	console.log("landscape-mode");
                			return false;
                		}
                	} else {
                		if (orientation != 0 && orientation != 180) {
                        	console.log("landscape-mode");
                			return false;
                		} else {
                    		console.log("portrait-mode");
                			return true;
                		}
                	}
                } else {
                	
                }
                if (Platform.isBlackBerry()) {
                	if (Platform.screenHeight > Platform.screenWidth) { // landscape mode
                		console.log("portrait-mode");
                		return true;
                	}
                } 
            }
        	console.log("landscape-mode");
            return false;
        },

        
        hasFlash: function() {
            this.platform || this.setup();
            return (this.platform == "webos" && this.platformVersion >= 2) ||
                    (this.isBlackBerry()) || // TODO: Version check?
                    (this.platform == "android");
        },
        
        /* General screen size functions -- tablet vs phone, landscape vs portrait */
        isLargeScreen: function() { return window.innerWidth > 480; },
        isWideScreen: function() { return window.innerWidth > window.innerHeight; },
        
        /* Platform-supplied UI concerns */
        hasBack: function()
        {
            this.platform || this.setup(); 
            return this.platform == "android" || (this.platform == "webos" && this.platformVersion < 3);
        },
        hasMenu: function()
        {
            /* You may want to include Android here if you're using a target
             * API of less than 14 (Ice Cream Sandwich)
             */
            /* Blackberry Tablet OS has a standard "swipe down from top bezel" gesture
             * that they use .. should probably consider that here, but I'm not sure
             * if their other platforms have any equivalent
             */
            this.platform || this.setup(); 
            return this.platform == "webos" || (this.platform == "android" && this.platformVersion < 4); 
        },
        
        /* Platform-specific Audio utility. WebWorks on PlayBook and webOS have
         * great support for HTML5 audio objects. Android's is terrible, so we
         * choose to use the PhoneGap media API there, which is encapsulated in
         * the PlatformSound kind
         */
        useHTMLAudio: function()
        {
            this.platform || this.setup(); 
            return this.isWebOS() || this.isWebWorks() || !this.isMobile();
        },
        /* Used to post a notification message.  Supports webOS Enyo Dashboard,
         * webKitNotifications (Chrome/PlayBook), PhoneGap LocalNotifications
         * plugin
         * msgid = unique message id for message
         * (this needs to be modified to make replacement Dashboards in webOS when using duplicate msgid)
         * title = top line of text
         * subtext = second line of text
         * icon = icon to set for notification (webOS, Chrome - not supported in
         *        PlayBook OS 2.0, must configure in LocalNotifications plugin
         *        for Android)
         * smallIcon = icon to use for notification bar (webOS)
         * msgTapCallback = callback when message is tapped (webOS, Chrome), arg = dashProps
         * iconTapCallback = callback when icon is tapped (webOS), arg = dashProps
         * bannerMsg = banner to post (webOS)
         * alertSound = sound to play (webOS)
         */
        postNotification: function(msgid, title, subtext, icon, smallIcon, msgTapCallback, iconTapCallback, bannerMsg, alertSound)
        {
            var wkn = window.webkitNotifications;
            if(typeof msgid == "object")
            {
                title = msgid.title;
                subtext = msgid.subtext;
                icon = msgid.icon;
                smallIcon = msgid.smallIcon;
                msgTapCallack = msgid.msgTapCallback;
                iconTapCallback = msgid.iconTapCallback;
                bannerMsg = msgid.bannerMsg;
                alertSound = msgid.alertSound;
                msgid = msgid.msgid;
            }
            if(!this.NotificationDashboards)
            {
                this.NotificationDashboards = { };
            }
            if(window.PalmSystem || (typeof plugins !== "undefined" && plugins.localNotification) )
            {
                this.actuallyPostNotification(msgid, title, subtext);
            } else if(wkn) {
                if(wkn.checkPermission()) { // 1 = Not Allowed, 2 = Denied, 0 = Allowed
                    wkn.requestPermission(enyo.bind(this, this.actuallyPostNotification, msgid, title, subtext));
                } else {
                    this.actuallyPostNotification(msgid, title, subtext);
                }
            }           
        },
        dashboardTap: function(inSender, dashProps)
        {
            if(inSender.msgTapCallback)
                inSender.msgTapCallback(dashProps);
        },
        dashboardIconTap: function(inSender, dashProps)
        {
            if(inSender.iconTapCallback)
                inSender.iconTapCallback(dashProps);
        },
        actuallyPostNotification: function(msgid, title, subtext, icon, smallIcon, msgTapCallback, iconTapCallback, bannerMsg, alertSound)
        {
            if(window.PalmSystem)
            {
                if(!this.NotificationDashboards[0])
                {
                    this.NotificationDashboards[0] = this.createComponent( {
                        kind: "Dashboard",
                        "smallIcon": smallIcon,
                        "icon": icon,
                        onMessageTap: "dashboardTap",
                        onIconTap: "dashboardIconTap",
                    });
                }
                if(!this.NotificationDashboards[msgid]) {
                    this.NotificationDashboards[msgid] = { "icon": icon,
                                                            "smallIcon": smallIcon,
                                                            "title": title, "text": subtext,
                                                            id: msgid, "msgTapCallback": msgTapCallback,
                                                            "iconTapCallback": iconTapCallback };
                    this.NotificationDashboards[0].push(this.NotificationDashboards[msgid]);
                    if(bannerMsg)
                        enyo.windows.addBannerMessage(bannerMsg, '{}', smallIcon, "", alertSound);
                }
                //this.NotificationDashboards[0].onLayerSwipe = "dashboardLayerSwipe";
                //this.NotificationDashboards[0].onUserClose = "dashboardClosed";
            } else if(window.webkitNotifications) {
                var wkn = window.webkitNotifications;
                if(wkn.checkPermission() === 0) // 0 = Allowed, 1 = Not Allowed, 2 = Denied
                {
//                    if(!this.NotificationDashboards[msgid]) {
                        try {
                            var note = wkn.createNotification(icon, title, subtext);
                            note.id = msgid;                            
                            //note.onclose = enyo.bind(this, this.dashboardLayerSwipe, note, note);
                            note.onclick = enyo.bind(this, function() { msgTapCallback(); });
                            note.ondisplay = enyo.bind(this, function() { /* should play alert sound here but doesn't work on PlayBook */ });
                            note.onerror = enyo.bind(this, function() { enyo.log("webkitnotification onerror"); });                         
                            note.show();
//                            this.NotificationDashboards[0] = "temp holder";
//                            this.NotificationDashboards[msgid] = note;
                        } catch(err) { // throw security error
                            enyo.log("error posting notification:" + err);
                        }
//                    } else {
//                        enyo.log("duplicate notification");
//                    }
                } else {
                    enyo.log("request permission");
                    window.webkitNotifications.requestPermission();
                }
            } else if(typeof plugins !== "undefined" && plugins.localNotification) {
                this.NotificationDashboards[0] = "temp holder";
                if(!this.NotificationDashboards[msgid]) {
                    this.NotificationDashboards[msgid] = 1;
                    plugins.localNotification.add({
                        date: new Date(),
                        message: title + "\r\n" + subtext,
                        //ticker: "Hmm.. what does the ticker line do?  I wonder.  Maybe I should read the documentation.",
                        repeatDaily: false,
                        id: msgid
                    });
                }
            }
            else 
            {
                enyo.log("No known notification system");
            }           
        },
        /* Platform Specific Web Browser -- returns a function that should
         * launch the OS's web browser.  
         * call: Platform.browser("http://www.google.com/", this)();
         */
        browser: function(url, thisObj)
        {
            this.platform || this.setup(); 
            if(this.isWebOS())
            {
                
                var result = localStorage.getItem( "useAdvancedBrowser" );
                enyo.log("result: " + result);
                if (result == undefined || result == null || result.trim().length == 0) {
                    enyo.log("property '" + name + "' was not stored");
                    localStorage.setItem( "useAdvancedBrowser", false );
                }
                enyo.log("read property value: " + result );
                var ab = result == "true" ? true : false
                
                if (ab) {
                    return enyo.bind(thisObj, (function(args) {
                        var x = thisObj.createComponent({ kind: "PalmService", service: "palm://com.palm.applicationManager/", method: "launch" });
                        x.call({"id": "com.maklesoft.browser", "params":{"url": url}});
                    }));
                } else {
                    return enyo.bind(thisObj, (function(args) {
                        var x = thisObj.createComponent({ kind: "PalmService", service: "palm://com.palm.applicationManager/", method: "open" });
                        x.call({ target: url });
                    }));
                }
            }
            else if(this.platform == "web" || (this.platform == "android" && parseFloat(this.platformVersion >= 4.0)) )
            {
                /* If web, just open a new tab/window - this also works well in
                 * Android 4.0 - suggest ChildBrowser PhoneGap plugin for other
                 * versions of Android
                 */
                return enyo.bind(thisObj, function(x) { window.open(x, '_blank'); }, url);
            }
            else if(this.isPlaybook())
            {
                /* If BlackBerry, go through their ridiculous parsing rules */
                /* Make sure you have the invoke and invoke.BrowserArguments
                 * configured in your config.xml.
                 */
                var args = new blackberry.invoke.BrowserArguments(this.blackBerryURLEncode(url));
                return enyo.bind(thisObj, blackberry.invoke.invoke, blackberry.invoke.APP_BROWSER, args);
            }
            else if(this.isBB10())
            {
            	var args = new blackberry.invoke.invoke({
                    uri: url
                }, null, null);
//                var args = new blackberry.invoke.BrowserArguments(this.blackBerryURLEncode(url));
                return enyo.bind(thisObj, blackberry.invoke.invoke, args);
            }
            else if(typeof window.cordova !== "undefined" || typeof PhoneGap !== "undefined" && window.plugins && window.plugins.childBrowser)
            {
                /* If you have the popular childBrowser plugin for PhoneGap */
                /* If you're using iOS, make sure you've called the childBrowser.init first somewhere!! */
                return enyo.bind(thisObj, window.plugins.childBrowser.openExternal, url);
            }
            else if(this.platform == "android" && navigator.app && navigator.app.loadUrl)
            {
                /* If Android < 4.0 and PhoneGap ChildBrowser plugin is not available, then
                 * Assume PhoneGap is loaded, otherwise we wouldn't know it's Android, right */
                return enyo.bind(thisObj, function(x) { navigator.app.loadUrl({ openexternal:true }) }, url);
            }
            else
            {
                /* Fall back to something that could possibly work
                 * One could also make a case for just setting window.location
                 */
                return enyo.bind(thisObj, function(x) { window.open(x, '_blank'); }, url);
            }
        },
        /* A ridiculous function for parsing URLs into something that RIM's
         * BrowserArguments call can deal with "properly", thanks to their
         * forums.
         */
        blackBerryURLEncode: function(address) {
            var encodedAddress = "";
            // URL Encode all instances of ':' in the address
            encodedAddress = address.replace(/:/g, "%3A");
            // Leave the first instance of ':' in its normal form
            encodedAddress = encodedAddress.replace(/%3A/, ":");
            // Escape all instances of '&' in the address
            encodedAddress = encodedAddress.replace(/&/g, "\&");

            if (typeof blackberry !== 'undefined') {
                var args = new blackberry.invoke.BrowserArguments(encodedAddress);
                blackberry.invoke.invoke(blackberry.invoke.APP_BROWSER, args);
            } else {
                // If I am not a BlackBerry device, open link in current browser
                window.location = encodedAddress; 
            }            
        },
        getReviewURL: function()
        {
            var appInfo;
            var url = "";
            
            appInfo = Util.fetchAppInfo();
            if(enyo.isString(appInfo))
                appInfo = JSON.parse(appInfo);
                
            this.platform || this.setup(); 
            switch(Platform.platform) {
                case "webos":
                    url = "http://developer.palm.com/appredirect/?packageid=" + (appInfo.idfull !== undefined ? appInfo.idfull : appInfo.id);
                    break;
                case "android":
                    /* enyo.fetchAppId() appears unreliable here? */
                    url = "market://details?id=" + appInfo.id;
                    break;
                case "blackberry":  // intentional fallthrough
                case "webworks":
                    url = "http://appworld.blackberry.com/webstore/content/" + appInfo.appWorldId;
                    break;
                case "iphone":
                    url = "itms-apps://ax.itunes.apple.com/WebObjects/MZStore.woa/wa/viewContentsUserReviews?type=Purple+Software&id="+appInfo.iTunesAppId;
                    break;
            }
            return url;
        },
        
        getPixelRatio: function() {
//        	console.log("RoT Number(this.pixelRatio): " + Number(this.pixelRatio));
//        	console.log("RoT Number(this.pixelRatio) >= Number(1.0): " + Number(this.pixelRatio) >= Number(1.0));
//        	console.log("RoT Number(this.pixelRatio) < Number(1.5): " + Number(this.pixelRatio) < Number(1.5));
        	if ( String(this.pixelRatio).length == 1) {
        		console.log("1");
        		this.pixelRatio =  this.pixelRatio + ".0";
        		return this.pixelRatio;
        	}
        	if (this.pixelRatio == 1.0 || this.pixelRatio == 1.5 || this.pixelRatio == 2.0 || this.pixelRatio == 2.24) {
        		return this.pixelRatio;
        	}
    		if (Number(this.pixelRatio) >= Number(1.0) && Number(this.pixelRatio) < Number(1.5)) {
    			console.log("2");
    			this.pixelRatio =  "1.5";
    		} else if (Number(this.pixelRatio) >= Number(1.5) && Number(this.pixelRatio) < Number(2.0)) {
    			console.log("3");
    			this.pixelRatio =  "2.0";
    		} else if (Number(this.pixelRation) >= Number(2.0) && Number(this.pixelRatio) < Number(2.23)) {
    			console.log("4");
    			this.pixelRatio =  "2.0";
    		} else {
    			console.log("5");
    			this.pixelRatio =  "2.24";
    		}
//        	console.log("this.pixelRatio: " + this.pixelRatio);
        	return this.pixelRatio;
        }
    }
});

// experimental code that MIGHT work on an implementation where createHTMLNotification actually works.
// PlayBook 2.0, however, is not that place.

/* if(window.webkitNotifications)
{
    enyo.windows.openDashboard = (function(path, name, params, attributes) {
        enyo.log("openDashboard", path);
        if(window.webkitNotifications.checkPermission() == 0) {
        enyo.log("opening dashboard");
        var note = window.webkitNotifications.createHTMLNotification(path);
        attributes = attributes || {};
        attributes.window = "dashboard";
        note.enyo = note.enyo || {};
        note.enyo.windowParams = params || {};
        note.show();
    }
    });
}*/

(function() {
    if(window.PalmSystem)
    {
        var deviceInfo = enyo.fetchDeviceInfo();
        if(parseFloat(deviceInfo.platformVersion) <= 2.2)
        {
            enyo.Dashboard.prototype.dbActivated = function() {
                this.window.document.getElementsByTagName("body")[0].className = "enyo-toolbar";
                this.doDashboardActivated();
            };
        }
    }
})();