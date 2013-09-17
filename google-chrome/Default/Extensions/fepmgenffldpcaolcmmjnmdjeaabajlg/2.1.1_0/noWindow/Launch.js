enyo.kind({
    name: "Launcher",
    kind: "Component",
 
    components: [   
        // Application events handlers
        {kind: "ApplicationEvents", onUnload: "cleanup", onApplicationRelaunch: "relaunch"},
        {name: "setAlarm", kind: "PalmService", service: "palm://com.palm.power/timeout/", method: "set", onResponse: "alarmServiceResponseHandler"},
        {name: "clearAlarm", kind: "PalmService", service: "palm://com.palm.power/timeout/", method: "clear", onResponse: "alarmServiceResponseHandler"},
        {name: "springpadApi", kind: "SpringpadApi"},
        {name: "dataManager", kind: "DataManager"},
     ],
 
     // declare 'published' properties
    published: {
        syncLayer: { title: $L("Syncing Items") + "...", icon : "images/48.png" },
        app: null,
    },
    
    create: function (inSender, inEvent) {
        this.inherited(arguments);
    },
 
    startup: function () {
        var params = enyo.windowParams;
        // this.log(params);
 
        this.relaunch(params);
    },
 
    relaunch: function ( bla ) {
        // this.log("START");
        var params = enyo.windowParams;
        // this.log(params);
        
        // check to see if main app window is already open
        this.appWindow = enyo.windows.fetchWindow("main");
        // this.log("this.appWindow: "+ this.appWindow);
        // this.log("params.action: "+ params.action);
        // enyo.windows.addBannerMessage("Test 123456 :-))","{}","/images/ReadOnTouch-48-r2.png");
 
        // check to see if a special param has been sent to the app
        // in this case, we may have defined a params.action property in
        // JustType to tell the app to do something. Let's assume that our
        // params are either:  {action: "addData", data: "Some data"} or
        //                     {action: "doSomething"}
        if (params.action) {
            switch (params.action) {
                case "addLink":
                    if (this.appWindow != null && this.appWindow !== undefined) {
                        // this.log("reactivating existing window...");
                        // enyo.windows.activateWindow(this.appWindow, params);   
                        enyo.windows.addBannerMessage("Currently only available .. ","{}","images/24.png");
                        enyo.windows.addBannerMessage("... when " + enyo.fetchAppInfo().title + " is closed!","{}","images/24.png");
                    } else {
                        // open the main window and pass the params along
                        // this.openCard("background", params, false);
                        // this.log("addLink...");
                        this.addLink( params.url, params.title, params.description );
                    }
                    break;
                case "doSync":
                    if (this.appWindow == null || this.appWindow == undefined) {
                        // this.log("doSync... :-)");
                        // this.addSyncLayer();
//                         
                        // TODO check if client is online!!!!
                        this.app = new DataManager();
                        this.app.doSync( true, this, "removeDashboard", "addSyncLayer", "restartBgSyncAlarm");
                    } else {
                        if (Util.isDebug()) {
                            this.log("no bg sync available, because the app is active!");
                        }
                        // enyo.windows.addBannerMessage("No background sync available.. ","{}","images/24.png");
                        // enyo.windows.addBannerMessage("... because the app is active!","{}","images/24.png");
                        this.restartBgSyncAlarmQuick();
                    }
                    break;
            }
        }
        else {
            if (Settings.getSettings().syncInProgress == true && Util.syncIsStillActive() == true) {
                enyo.windows.addBannerMessage("App is currently not available... ","{}","images/24.png");
                enyo.windows.addBannerMessage("... because of background sync!","{}","images/24.png");
            } else {
                this.opencard("normal.html", "main", params);
            }
        }
        // this.log("END");
        return true;
    },
 
    // cleanup was defined above as the onUnload handler for application events
    // we'll use it to save any changes to our appPrefs
    cleanup: function () {
        // this.log("Cleanup in appLaunch");
        // this.savePrefs();
        this.restartBgSyncAlarm();
    },
    
    opencard : function( path, name, params) {
        // this.log();
        basePath = enyo.fetchAppRootPath() + "/";
        path = basePath + path;
        enyo.windows.activate(path, name, params);    
    },
    
    restartBgSyncAlarmQuick : function() {
        if (Util.isDebug()) {
            this.log('restarting bg sync in 2 minutes');
        }
        localStorage.setItem("syncInProgress", false);
        Settings.getSettings( true );
        var appId = enyo.fetchAppInfo().id;
        var time = "00:02:00";
        // this.log("time: " + time);
        // this.log("set next bgsync in: " + time);
        this.$.setAlarm.call({
            "wakeup" : true, 
            "key" : appId + ".sync", 
            "uri":"palm://com.palm.applicationManager/launch",
            "params" : {"id" : appId, "params": {"action" : "doSync"}},
            "in": time
        });
     },

    restartBgSyncAlarm : function() {
        localStorage.setItem("syncInProgress", false);
        Settings.getSettings( true );
        var appId = enyo.fetchAppInfo().id;
        var time = Settings.getAlarmTimeFromSettings();
        // this.log("time: " + time);
        if (time == null) {
            if (Util.isDebug()) {
                this.log("clearing alarm! ");
            }
            this.$.clearAlarm.call({
                "key" : appId + ".sync" 
            });
        } else {
            if (Util.isDebug()) {
                this.log("set next bgsync in: " + time);
            }
            this.$.setAlarm.call({
                "wakeup" : true, 
                "key" : appId + ".sync", 
                "uri":"palm://com.palm.applicationManager/launch",
                "params" : {"id" : appId, "params": {"action" : "doSync"}},
                "in": time
            });
        }
     },
    
    removeDashboard: function( newData) {
        // enyo.windows.addBannerMessage("Finished syncing article list!","{}","images/ReadOnTouch-24.png");
        // this.$.dashboard.setLayers([]);
        
        this.restartBgSyncAlarm();        
        /*if (true == newData) {
            // check if app is active and update it
            // this.error("we have new articles, so check if app is active");
            this.appWindow = enyo.windows.fetchWindow("main");
            if (this.appWindow != null && this.appWindow !== undefined) {
                // this.log("reactivating existing window...");
                enyo.windows.addBannerMessage("Refreshing client data...","{}","images/ReadOnTouch-24.png");
                enyo.windows.activateWindow(this.appWindow, {"action": "updateUi"});   
            }
        }*/
    }, 

    addLayer : function( title, url ) {
        var layer = { title: title, text: url, icon : "images/48.png" }; 
        if (this.$.dashboard === undefined) {
            var kindItem = {name : "dashboard", kind : "Dashboard", icon : "images/48.png", smallIcon : "images/24.png", onTap : "dashboardTapHandler", onDashboardActivated: "dashboardActivated", onUserClose: "userClose", onLayerSwipe: "userClose"};
            this.createComponent( kindItem, {owner: this});
        }
        this.$.dashboard.setLayers([layer]);
    }, 

    addSyncLayer : function( ) {
        /*if (this.$.dashboard === undefined) {
            var kindItem = {name : "dashboard", kind : "Dashboard", icon : "images/ReadOnTouch-48-r2.png", smallIcon : "images/ReadOnTouch-24.png", onTap : "dashboardTapHandler", onDashboardActivated: "dashboardActivated", onUserClose: "userClose", onLayerSwipe: "userClose"};
            this.createComponent( kindItem, {owner: this});
            enyo.windows.addBannerMessage("Started syncing article list...","{}","images/ReadOnTouch-24.png");
        }
        this.$.dashboard.setLayers([this.syncLayer]);
        */
    }, 

    dashboardTapHandler: function() {
        // this.log();
        if (this.app != null && Settings.getSettings().syncInProgress == false) {
            this.removeDashboard();
            this.opencard("normal.html", "main", {});
        } else if (this.app == null && Settings.getSettings().syncInProgress == false) {
            this.$.dashboard.setLayers([]);
            this.opencard("normal.html", "main", {});
        } else {
            enyo.windows.addBannerMessage("Wait for sync to be finished!","{}","images/24.png");
        }
    }, 
    
    userClose : function( ) {
        // this.log();
        localStorage.setItem("syncInProgress", false);
    },

    showInfo : function( message ) {
        enyo.windows.addBannerMessage( message,"{}","images/24.png" );
        // this.addLayer( message );
        this.opencard( "background.html", "background" );
        enyo.windows.fetchWindow( "background" ).close();
    },

    alarmServiceResponseHandler : function() {
        
    },
        
    dashboardActivated: function( dash ) {
        // this.error(dash);
        for(l in dash)
        {
            // this.error("for...");
            var c = dash[l].dashboardContent;
            if(c)
            {
                // this.error("change bg...");
                c.$.topSwipeable.applyStyle("background-color", "black");
            }
        }
    },

    addLink : function( url, title, description ) {
        // this.log("START");
        if (Util.isDebug()) {
            this.log("url: " + url);
        }
        if (title == null || title == "null" || title == undefined || title == "undefined" || title == "") {
            title = $L("Imported from External");
        }
        if (description == null || description == "null" || description == undefined || description == "undefined" || description == "") {
            description = "";
        }
        
        title = StringUtils.convertToHTML( title );
        description = StringUtils.convertToHTML( StringUtils.stripHtmlCodes( description ) );
        
        if (Util.isDebug()) {
            this.log("title: " + title);
            this.log("description: " + description);
        }
        
        var uuid = Util.createUuid();
        uuid = "/UUID(" + uuid + ")/";
        if (Util.isDebug()) {
            this.log("uuid       : " + uuid);
        }
        var data = "[";
        data += "[\"create\", \"Bookmark\", \"" + uuid + "\"],";

        var uuidSource = Util.createUuid();
        var uuidSourceShort = uuidSource;
        uuidSource = "/UUID(" + uuidSource + ")/";
        uuidSourceShort = uuidSource;
            
        data += "[\"create\", \"lifemanagr.Source\", \"" + uuidSource + "\"],";
        data += "[\"set\", \"" + uuidSource + "\", \"value\", \"" + url + "\" ],";
        data += "[\"add\", \"" + uuid + "\", \"metadata.sources\", \"" + uuidSourceShort + "\" ],";
        data += "[\"set\", \"" + uuid + "\", \"name\", \"" + title + "\" ]";
        if (description !== undefined && description != "undefined" && description != null && description != "") {
            data += ",[\"set\", \"" + uuid + "\", \"text\", \"" + description + "\" ]";
        }
        data += "]";
        this.$.springpadApi.onFetchSuccess = "addItemFeedSuccess";
        this.$.springpadApi.onFetchFailure = "addItemFeedFailed";
        this.$.springpadApi.fetchData("users/me/commands", "POST", data );
        
        var d = new Date();
        var dateString = "/Date(" + d.getTime() + ")/";
        
        this.item = {
            "name": title,
            "type": "/Type(Bookmark)/",
            "created": dateString,
            "uuid": uuid,
            "properties": {
                "sources": [ { "value": url } ],    
                "text": description
            },
        };
        
        if (Util.isDebug()) {
            this.log("item: " + JSON.stringify(this.item));        
            this.log("END");
        }
    },

    addItemFeedSuccess: function(inSender, inResponse, inRequest) {
        if (Util.isDebug()) {
            this.log();
        }
        var message = "Added Link successfully!";
        if (this.appWindow === undefined) {
            this.showInfo( message );
        }
        this.$.dataManager.reloadData();
        this.$.dataManager.getItemsAll().push( this.item );
        localStorage.removeItem("items");
        localStorage.setItem( "items", JSON.stringify(this.$.dataManager.getItemsAll()) );
    },
        
    addItemFeedFailed: function(inSender, inResponse, inRequest) {
        this.error(JSON.stringify(inResponse));
        var message = "Link could not be added!";
        if (this.appWindow === undefined) {
            this.showInfo( message );
        }
    },
    
});

