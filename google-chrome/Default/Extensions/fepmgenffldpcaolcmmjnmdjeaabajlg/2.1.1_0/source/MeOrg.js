enyo.kind({
     name: "MeOrg",
     kind: enyo.VFlexBox,
     components: [
         {kind: "ApplicationEvents", /*onApplicationRelaunch: "onApplicationRelaunch",*/ onWindowRotated: "onWindowRotated", onOpenAppMenu: "onOpenAppMenu", onBack: "onBackGesture", onWindowParamsChange: "windowParamsChangeHandler"},
         {name: "launchBrowserCall", kind: "PalmService", service: "palm://com.palm.applicationManager/", method: "launch"},
         {name: "launchApp", kind: "PalmService", service: "palm://com.palm.applicationManager/", method: "open"},
         {name: "connection", kind: "PalmService", service: "palm://com.palm.connectionmanager/", method: "getstatus", onResponse: "connectionResponseHandler", subscribe: true},
         {name: "requestItemsService", kind: "WebService", onSuccess: "grabFeedSuccess", onFailure: "grabFeedFailure", components: [
                {method: "GET", handleAs: "json", contentType: "application/x-www-form-urlencoded; charset=utf-8", headers: {"Content-type": "application/x-www-form-urlencoded", "Connection": "close"},}
         ]},
         {name: "pane", kind: "Pane", flex: 1, components: [
             {name: "startScreen", kind: "StartScreen"},             
             {name: "welcomePane", kind: "Welcome"} ,
             /*{name: "homePane", kind: "Home"} ,*/
             {name: "preferences", kind: "Preferences", onSave: "preferencesSaved", onCancel: "goBack"},
         ]},
         
         {name: "changelogDialog", kind: "ChangelogDialog"},
         {name: "popupDialog", kind: "MyPopupDialog"},
         {name: "popupDialog2", kind: "MyPopupDialog"},
         {name: "addItemDialog", kind: "AddLinkDialog"},
         {name: "menuDialog", kind: "MenuDialog", onMenuSelect: "onMenuSelect"},
         {name: "appMissing", kind: "AppMissing"},
         {name: "about", kind: "AboutDialog"},
         {name: "dataManager", kind: "DataManager"},
         {name: "help", kind: "Help"},
         /*{kind: "SyncDialog", name: "syncDialog"},*/
         
         {name: "appMenu", kind: "AppMenu", components: [
             {caption: $L("Preferences & Accounts"), onclick: "showPreferences"},
             {caption: $L("Import Data..."), components: [
                 {caption: $L("from Evernote"), onclick: "showEvernoteImporter"},
                 {caption: $L("from Google Note"), onclick: "showGoogleNoteImporter"},
             ]},
             {caption: $L("Show Changelog"), onclick: "showChangelog"},
             {caption: $L("Rate Me!"), onclick: "rateMeClicked"},
             {caption: $L("More Apps by this Developer"), onclick: "moreAppsClicked"},
             {caption: $L("About"), onclick: "showAboutPopup"},
             {caption: $L("Help"), onclick: "showHelp"},

         ]},
         
    ],

     // declare 'published' properties
    published: {
        startNormal: true,
        calledFromExtern: false,
        offlineMode: true,
        webViewMaximized: false,
        filterTags: "",
    },
    
    create : function() {
        this.inherited(arguments);
        if (Platform.isTablet()) {
        	this.$.pane.createComponent({name: "feedSlidingPane", kind: "SlidingPane", flex: 1, style: "background-color: #000000;", multiViewMinWidth: 500, components: [
                {name: "notebookListPane", kind: "NotebookList", width: (Platform.isBlackBerry() ? "300px" : "250px")},
                {name: "itemListPane", kind: "ItemList", width: "300px"},
                {name: "feedWebViewPane", kind: "ItemView", dragAnywhere: false, flex: 1, onResize: "slidingResize"},
        	]}, {owner: this});
        } else {
        	this.$.pane.createComponent({name: "feedSlidingPane", kind: "SlidingPane", flex: 1, style: "background-color: #000000;", multiView: false, multiViewMinWidth: 50000, components: [
                {name: "notebookListPane", kind: "NotebookList", width: (Platform.isBlackBerry() ? "300px" : "250px")},
                {name: "itemListPane", kind: "ItemList", width: "300px"},
                {name: "feedWebViewPane", kind: "ItemView", dragAnywhere: false, flex: 1, onResize: "slidingResize"},
          	]}, {owner: this});
        }
    },

    rendered: function() {
        this.inherited(arguments);
        if (Util.isDebug()) {
            this.log("START");
        }
        this.$.dataManager.startCheckOnlineStateJob();
        if (Util.isDebug()) {
            this.log("END");
        }
    }, 
    
    showWelcomePage : function( ) {
        if (Util.isDebug()) {
            this.log("redirecting to welcomePane");
        }
        this.$.pane.selectViewByName("welcomePane");
    },
    
    showHomePage : function( ) {
        if (Util.isDebug()) {
            this.log("redirecting to homePane");
        }
        this.$.homePane.update( this.$.dataManager.getNotebooks() );
        this.$.pane.selectViewByName("homePane");
    },
    
    checkConnection : function( ) {
        if (Platform.isWebOS()) {
            if (Util.isDebug()) {
                this.log("webos detected")
            }
            this.$.connection.call({}); 
        } else if (Platform.isBrowser() == true) {
            if (Util.isDebug()) {
                this.log("browser detected")
            }
            var inResponse = { "isInternetConnectionAvailable": true };
            this.connectionResponseHandler( "null", inResponse );
        } else if (Platform.isPlaybook()) {
            var conn = blackberry.system.hasDataCoverage();
            var inResponse = { "isInternetConnectionAvailable": conn };
            this.connectionResponseHandler( "null", inResponse );
        } else if (Platform.isBB10()) {
//            var conn = (blackberry.connection.NONE ? false : true);
//            var inResponse = { "isInternetConnectionAvailable": conn };
//            this.connectionResponseHandler( "null", inResponse );
        	
        	// wird in index.html erledigt!
        	
        } else {
            if (Util.isDebug()) {
                this.log("no webos or browser detected, using phonegap!")
            }
            var networkState = navigator.network.connection.type;
        
            // var states = {};
            // states[Connection.UNKNOWN]  = 'Unknown connection';
            // states[Connection.ETHERNET] = 'Ethernet connection';
            // states[Connection.WIFI]     = 'WiFi connection';
            // states[Connection.CELL_2G]  = 'Cell 2G connection';
            // states[Connection.CELL_3G]  = 'Cell 3G connection';
            // states[Connection.CELL_4G]  = 'Cell 4G connection';
            // states[Connection.NONE]     = 'No network connection';
        
            // alert('Connection type: ' + states[networkState]);
            var inResponse = { "isInternetConnectionAvailable": true };
            if (networkState == Connection.NONE) {
                inResponse = { "isInternetConnectionAvailable": false };
            }
            this.connectionResponseHandler( "null", inResponse );
        }
    },
    
    normalStart : function ( ) {
        if (Util.isDebug()) {
            this.log("START");
        }

        // if somebody gets here, there could no bg sync active!
        localStorage.setItem("syncInProgress", false);
        Settings.getSettings( true );

        enyo.keyboard.setResizesWindow( true ); 
        if (Platform.isWebOS() && !Platform.isTouchpad()) {
            enyo.asyncMethod( this, this.rotationLock() );
        }

        // reload data  
        if (!Platform.isBrowser()) {
            enyo.asyncMethod( this.$.dataManager, this.$.dataManager.reloadData() );
        } else {
            this.$.dataManager.reloadData();
        }
        
        // check connection state     
        if (!Platform.isBrowser()) {
            enyo.asyncMethod( this, this.checkConnection() );   
        } else {
            this.checkConnection();   
        }

        this.setCalledFromExtern(false);

        if (Settings.getSettings().username == "" || Settings.getSettings().password == "" || Settings.getSettings().accountVerified != true) {
            // TODO: vorhandene Daten löschen & preferences-dialog anzeigen
            this.disableItemListPaneControls( true );
            this.showWelcomePage();
        } else {
            // check if this is the first start
            if (Util.isDebug()) {
                this.log("Settings.getSettings().lastVersion: ", Settings.getSettings().lastVersion);
                this.log("Settings.getSettings().accountVerified: ", Settings.getSettings().accountVerified);
            }
            // FIXME test only
            // this.setLastVersion("1.0.0") ;
            var appinfo = enyo.fetchAppInfo();
            if (Util.isDebug()) {
                this.log("currentVersion: " + appinfo.version);
                this.log("lastVersionUsed: " + Settings.getSettings().lastVersion);
            }
            if (appinfo.version != Settings.getSettings().lastVersion) {
                if (Util.isDebug()) {
                    this.log("new version detected, showing changelog");
                }
                localStorage.removeItem("lastSync");
                localStorage.setItem("lastVersion", appinfo.version);
                this.$.changelogDialog.openAtCenter();  
            }
            this.$.pane.selectViewByName("feedSlidingPane");
            this.$.itemListPane.selectView("feedList");
    
            if (this.$.dataManager.getNotebooks().length > 0) {
                this.$.notebookListPane.selectView("feedList");
            } else {
                this.$.notebookListPane.selectView("emptyList");
            }
            
            if (this.$.dataManager.getItemsAll().length > 0) {
                if (!Platform.isBrowser()) {
                    enyo.asyncMethod( this, this.showItemsFromStorage() );
                } else {
                    this.showItemsFromStorage();
                }
                
                /*var lastRead = Settings.getSettings().lastRead;
                this.log("lastRead: " + lastRead);
                if (lastRead != "" && lastRead != null && Platform.isTouchpad()) {
                    this.log("loading last article...");
                    var lastRow = Settings.getSettings().lastRow;
                    this.log("lastRow: " + lastRow);
                    var selectedObj = ArrayUtils.getElementFromArrayById( this.$.dataManager.getFeedItems(), lastRead);
                    if (selectedObj != null) {
                        this.$.itemListPane.setSelectedObj( selectedObj );
                        // this.$.itemListPane.loadLocalData( lastRead );
                        this.$.feedWebViewPane.setContent( selectedObj );
                        if (lastRow != -1) {
                            this.$.itemListPane.setSelectedRow( lastRow );
                            this.$.itemListPane.$.feedList.render();  
                            this.$.itemListPane.$.feedList.refresh();  
                            var scrollerArticle = Settings.getSettings().scrollerArticle;
                            this.error("scrollerArticle: " + scrollerArticle);
                            // this.$.feedWebViewPane.setArticleScrollPosition( scrollerArticle );
                        }
                    }
                }*/
            } else {
                this.$.itemListPane.selectView("emptyList");
            }
        }

        if (Util.isDebug()) {
            this.log("END");
        }
    },
    
    showItemsFromStorage : function() {
        if (Util.isDebug()) {
            this.log("START");
            // show just the items with the selected state
            this.log("preparing '" + Settings.getSettings().notebook + "' items...");
        }
        this.$.dataManager.setFeedItems( this.$.dataManager.getFeedItemsByStateAndTag(Settings.getSettings().notebook, Settings.getSettings().filterTags, Settings.getSettings().filterType ) );
        
        // show notebooks
        if (Util.isDebug()) {
            this.log("render notebooklist...");
        }
        this.$.notebookListPane.$.feedList.render();
        if (Util.isDebug()) {
            this.log("refreshing notebooklist...");
        }
        this.$.notebookListPane.$.feedList.refresh();
        this.$.notebookListPane.updateCountLabel();

        // show content
        if (Util.isDebug()) {
            this.log("render itemlist...");
        }
        this.$.itemListPane.$.feedList.render();
        if (Util.isDebug()) {
            this.log("refreshing itemlist...");
        }
        this.$.itemListPane.$.feedList.refresh();
        if (Util.isDebug()) {
            this.log("updating countLabel to " + this.$.dataManager.getFeedItems().length + " items");
        }
        this.$.itemListPane.updateCountLabel();
        if (this.$.dataManager.getItemsAll().length == 0) {
            this.$.itemListPane.selectView("emptyList");
        } else {
            this.$.itemListPane.selectView("feedList");
        }
        if (Util.isDebug()) {
            this.log("finished!");
            this.log("END");
        }
    },
    
    disableItemListPaneControls : function( disabled ) {
        // this.log("START");
        if (disabled !== undefined) {
            // this.$.itemListPane.$.itemStateSelector.setDisabled( disabled );
            // this.$.itemListPane.$.orderSelector.setDisabled( disabled );
            // this.$.itemListPane.$.searchBox.setDisabled( disabled );
            // this.$.itemListPane.$.addButton.setDisabled( disabled );
            this.$.notebookListPane.$.refreshButton.setDisabled( disabled );
            // this.$.itemListPane.$.countLabel.setStyle( "color: #CFCFCF" );
        }
        // this.log("END");
    },
    
   loadItemList : function() {
        if (Util.isDebug()) {
            this.log("START");
        }
        // process offline stored data
        this.$.dataManager.processOfflineData( true );
        this.$.notebookListPane.updateCountLabel(); 
        // this.$.notebookListPane.hideListSpinner(); 
        if (Util.isDebug()) {
            this.log("END");
        }
   },
   
    refreshFeedItemsListLite: function() {
        if (Util.isDebug()) {
            this.log("START");
        }

        // this.$.feedWebViewPane.showEmptyPage();
        // this.$.itemListPane.clearSelection();
        // this.setFeedItems([]);
        
        this.loadItemList( );
        
        // this.$.itemListPane.hideListSpinner();
        if (Util.isDebug()) {
            this.log("END");
        }
    },
    
    ////////////////////////////////////////////
    // APP MENU - START
    ////////////////////////////////////////////
    showAboutPopup : function() {
        // this.log("showAboutPopup()");
        this.$.about.openAtCenter();  
    },

    showChangelog : function() {
        // this.log("showAboutPopup()");
        this.$.changelogDialog.openAtCenter();  
    },

    showEvernoteImporter : function() {
        if (Util.isDebug()) {
            this.log("START");
        }
        if (Settings.getSettings().online == true) {
            var url = "http://e-springpad.appspot.com/";
            if (Platform.isWebOS()) {
                if (Settings.getSettings().useAdvancedBrowser == false) {
                    this.$.launchBrowserCall.call({"id": "com.palm.app.browser", "params":{"target": url}});
                } else {
                    this.$.launchBrowserCall.call({"id": "com.maklesoft.browser", "params":{"url": url}});
                }
            } else {
                // alert("item.url: " + item.url);
                // console.log("loading childBrowser...");
                // window.plugins.childBrowser.showWebPage( item.url, {showLocationBar: true } );
                var args = new blackberry.invoke.BrowserArguments(url);
                blackberry.invoke.invoke(blackberry.invoke.APP_BROWSER, args);
            }
        }
        if (Util.isDebug()) {
            this.log("END");
        }
    },

    showGoogleNoteImporter : function() {
        if (Util.isDebug()) {
            this.log("START");
        }
        if (Settings.getSettings().online == true) {
            var url = "http://g-springpad.appspot.com/";
            if (Platform.isWebOS()) {
                if (Settings.getSettings().useAdvancedBrowser == false) {
                    this.$.launchBrowserCall.call({"id": "com.palm.app.browser", "params":{"target": url}});
                } else {
                    this.$.launchBrowserCall.call({"id": "com.maklesoft.browser", "params":{"url": url}});
                }
            } else {
                // alert("item.url: " + item.url);
                // console.log("loading childBrowser...");
                // window.plugins.childBrowser.showWebPage( item.url, {showLocationBar: true } );
                var args = new blackberry.invoke.BrowserArguments(url);
                blackberry.invoke.invoke(blackberry.invoke.APP_BROWSER, args);
            }
        }
        if (Util.isDebug()) {
            this.log("END");
        }
    },

    showHelp : function() {
        // this.$.launchBrowserCall.call({"id": "com.palm.app.browser", "params":{"target": "http://sven-ziegler.com/wordpress/?page_id=86"}});
        this.$.help.openAtCenter();
    },


    showPreferences : function() {
        // this.log("showPreferences()");
        if (this.$.pane.getViewName() == "feedSlidingPane") {
            this.$.pane.selectViewByName("preferences");
        } else {
            this.showFailurePopup($L("Please finish the active task before!"), $L("Failure!"));
        }
    },
    
    showQuickStartGuide : function( ) {
        if (this.$.pane.getViewName() == "feedSlidingPane") {
            this.$.pane.selectViewByName("welcomePane");
            this.$.welcomePane.startAsQuickGuideOnly( true );
        } else {
            this.showFailurePopup($L("Please finish the active task before!"), $L("Failure!"));
        }
    },
    
    ////////////////////////////////////////////
    // APP MENU - END
    ////////////////////////////////////////////

    showFeedFailurePopup : function( msg ) {
        if (Util.isDebug()) {
            this.log("START");
        }
        this.$.popupDialog.openAtCenter();  
        this.$.popupDialog.setTitle($L("Failure!"));
        this.$.popupDialog.setMessage( msg );
        this.$.popupDialog.hideCancelButton();
        if (Util.isDebug()) {
            this.log("END");
        }
    },
    
    showFailurePopup : function ( str, title ) {
    	if (this.$.popupDialog) {
        	this.$.popupDialog.openAtCenter();  
            if (title !== undefined) {
                this.$.popupDialog.setTitle( title );
            } else {
                this.$.popupDialog.setTitle($L("Failure!"));
            }
            this.$.popupDialog.setMessage(str);
            this.$.popupDialog.hideCancelButton();
    	} else {
    		this.error( title );
    		this.error( str );
    	}
    },

    showFailurePopup2 : function ( str, title ) {
        this.$.popupDialog2.openAtCenter();  
        if (title !== undefined) {
            this.$.popupDialog2.setTitle( title );
        } else {
            this.$.popupDialog2.setTitle($L("Failure!"));
        }
        this.$.popupDialog2.setMessage(str);
        this.$.popupDialog2.hideCancelButton();
    },

    connectionResponseHandler: function( inSender, inResponse ) {
        if (Util.isDebug()) {
            this.log("START");
            this.log(inResponse);
        }
        var online = false;
        if (inResponse.isInternetConnectionAvailable == true) {
            if (Util.isDebug()) {
                this.log("device is online");
            }
            online = true;
        } else {
            if (Util.isDebug()) {
                this.log("device is offline");
            }
        }
        localStorage.setItem("online", online);
        Settings.getSettings( true );
        
        if (this.$.itemListPane) {
            this.$.itemListPane.setOnline( online );
        }

        if (this.$.notebookListPane) {
            this.$.notebookListPane.setOnline( online );
        }

        if (online && Settings.getSettings().autoSync == true) {
            // sync itemlist + articles
            this.$.dataManager.doSync( false );
        } else {
            if (Util.isDebug()) {
                this.log("autosync is disabled");
            }
        }       
        
        if (Util.isDebug()) {
            this.log("END");
        }
    }, 
    
    showAddLinkDialog : function ( params ) {
        if (Util.isDebug()) {
            this.log(params);
        }
        // check if called from external
        this.$.addItemDialog.openAtCenter();  
        this.$.addItemDialog.resetAddItemDialog();
        if (params !== undefined) {
            if (Util.isDebug()) {
                this.log("called from external...");
            }
            if (params.title !== undefined && params.title != null && params.title.length > 0) {
                this.$.addItemDialog.setParams( params.url, params.title, "addLink");
                this.$.addItemDialog.onSubmit();
            } else {
                this.$.addItemDialog.setParams( params.url, null, "addLink");
                // this.$.addItemDialog.onSubmit();
            }
        } else {
            this.$.addItemDialog.setParams( null, null, "addLink");
        }
    },

    slidingResize : function( inSender, inValue ) {
        if (Util.isDebug()) {
            this.log("START");
        }
        if (inValue != null) {
            if (Util.isDebug()) {
                this.log("inValue: " + inValue);
            }
            // var info = enyo.fetchDeviceInfo();
            if (Util.isDebug()) {
                this.log("Platform.screenWidth: " + Platform.screenWidth);
            }
            pxpos = inValue.lastIndexOf("px");
            slidingwidth = inValue.substring(0, pxpos);
            if (Util.isDebug()) {
                this.log("slidingwidth: " + slidingwidth);
            }
            if (Platform.screenWidth == slidingwidth) {
                this.$.feedWebViewPane.setFullscreen( true );
                this.setWebViewMaximized( true );
            } else {
                this.$.feedWebViewPane.setFullscreen( false );
                this.setWebViewMaximized( false );
            }
        }
        if (Util.isDebug()) {
            this.log("END");
        }
    },
    
    resizeWebView : function( ) {
        if (Util.isDebug()) {
            this.log("START");
        }
        // var s = enyo.fetchControlSize(this);
        // this.log("w: " + s.w);
        // this.log("h: " + s.h);
        this.$.feedSlidingPane.selectViewByName("itemListPane");
        // this.$.feedSlidingPane.selectViewByName("feedWebViewPane").applyStyle('height', '630px');
        if (Util.isDebug()) {
            this.log("END");
        }
    },
    
    zoomInWebPanel:function() {
        if (Util.isDebug()) {
            this.log();
        }
//        this.$.pane.selectView(this.$.feedSlidingPane);
        this.$.feedSlidingPane.selectViewByName("feedWebViewPane");
    },
    
    zoomInItemListPanel:function() {
        // this.$.pane.selectView(this.$.feedSlidingPane);
        this.$.feedSlidingPane.selectViewByName("itemListPane");
    },
    
    onOpenAppMenu : function() {
        if (Util.isDebug()) {
            this.log();
        }
    },
    
    onWindowRotated : function( ) {
        if (Platform.isWebOS()) {
            orientation = enyo.getWindowOrientation();
            if (Util.isDebug()) {
                this.log("orientation: " + orientation);
            }
            info = enyo.fetchDeviceInfo();
            if (orientation == "up" || orientation == "down") {
            	Platform.screenWidth = info.screenWidth;
            	Platform.screenHeight = info.screenHeight;
            } else {
            	Platform.screenWidth = info.screenHeight;
            	Platform.screenHeight = info.screenWidth;
            }
        } else if (Platform.isBlackBerry()) {
            orientation = window.orientation;
            if (Util.isDebug()) {
                this.log("orientation: " + orientation);
            }
            if (orientation == 0) { // landscape mode
                if (Util.isDebug()) {
                    this.log("switched to landscape");
                }
                Platform.screenWidth = 1024;
                Platform.screenHeight = 600;
            } else {
                if (Util.isDebug()) {
                    this.log("switched to portrait");
                }
                Platform.screenWidth = 600;
                Platform.screenHeight = 1024;
            }
            
            if (undefined !== this.$.feedWebViewPane.$.articleContainer.$.contentArea.$.tempControl.$.content) {
                if (Util.isDebug()) {
                    this.log("refreshing detail view, new min-height: " + Util.getMinContentHeight());
                }
                this.$.feedWebViewPane.$.articleContainer.$.contentArea.$.tempControl.$.content.applyStyle( "min-height", Util.getMinContentHeight());
                // this.$.feedWebViewPane.$.articleContainer.$.contentArea.$.tempControl.$.content.render();
            } else {
                if (Util.isDebug()) {
                    this.log("workaround to refresh the detail view");
                }
                this.$.feedWebViewPane.render();
            }
            
        }
        
        this.$.itemListPane.onRotateWindow();
        this.$.feedWebViewPane.onRotateWindow();
    },

    onBackGesture : function(inSender, inEvent) {
       enyo.setFullScreen( false );
       this.$.feedSlidingPane.back(inEvent);
       inEvent.stopPropagation();
   },
   
    windowParamsChangeHandler: function() {
    /*    this.error(enyo.windowParams);
        this.onApplicationRelaunch();
        return true;*/
        // this.log("START");
        // this.log(enyo.windowParams);
        if (enyo.windowParams.action == "addLink") {
            // TODO check online state
            if (Util.isDebug()) {
                this.log("added from external...");
            }
            this.setCalledFromExtern(true);
            this.showAddLinkDialog(enyo.windowParams);
        }
        // this.log("END");
        return true;
    },
    
   rotationLock : function() {
       // this.error();
        if (Platform.isWebOS() == true && Platform.isTouchpad() == false && Settings.getSettings().useRotationLock == true) {
           // this.error("rotate!");
            enyo.setAllowedOrientation("portrait"); //"landscape"  
        }
   },
   
   showMenuDialog : function() {
       if (Util.isDebug()) {
           this.log();
       }
       this.$.menuDialog.openAtCenter();  
   },

   onMenuSelect : function( inSender, inValue ) {
       this.$.menuDialog.close();
       if (Util.isDebug()) {
           this.log("inValue: " + inValue);
       }
        switch (inValue) {
            case "1": 
                this.showPreferences();
            break;
            case "3": 
                this.showChangelog();
            break;
            case "4": 
                this.showAboutPopup();
            break;
            case "6": 
                this.showEvernoteImporter();
            break;
            case "7": 
                this.showGoogleNoteImporter();
            break;
            case "8": 
                this.rateMeClicked();
            break;
            case "9": 
                this.moreAppsClicked();
            break;
            default: 
                this.showHelp();
            break;
        }
   },
   
   rateMeClicked : function() {
       if (Platform.isWebOS()) {
           var finderApp = "com.palm.app.enyo-findapps";
           if (Platform.isTouchpadOrPre3() && !Platform.isTouchpad()) {
               finderApp = "com.palm.app.findapps";
           }
           this.$.launchApp.call({id: finderApp, params: {target: "http://developer.palm.com/appredirect/?packageid=com.sven-ziegler.meorg"}});
       } else {
           var url = Platform.getReviewURL();
           Platform.browser( url, this )();
       }
   },
    
   moreAppsClicked : function() {
       if (Platform.isWebOS()) {
           var finderApp = "com.palm.app.enyo-findapps";
           if (Platform.isTouchpadOrPre3() && !Platform.isTouchpad()) {
               finderApp = "com.palm.app.findapps";
           }
           this.$.launchApp.call({id: finderApp, params: {target: "http://developer.palm.com/appredirect/?packageid=com.sven-ziegler.readontouch"}});
       } else {
           var url = "http://appworld.blackberry.com/webstore/vendor/26457/";           
           Platform.browser( url, this )();
       }
   },

    getDataManager : function() {
        // this.log();
        return this.$.dataManager;
    },
    
    
}); 