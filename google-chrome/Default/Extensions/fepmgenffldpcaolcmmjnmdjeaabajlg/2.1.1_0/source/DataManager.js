enyo.kind({
    name: "DataManager",
    kind: "Component",
 
    components: [   
         {name: "getIP", kind: "WebService", url: "http://jsonip.com", handleAs: "json", onSuccess: "receivedIP", onFailure: "failedIP"},
         {kind: "FileUtils", onRemoveCurrent: "removeCurrentItem"},
         {name: "springpadApi", kind: "SpringpadApi"},
         {name: "requestThemesService", 
            kind: "WebService", 
            url: "http://springpad.com/springpad/resources/notebook-themes.json", 
            contentType: "application/json; charset=utf-8", 
            onSuccess: "requestThemesSuccess", 
            onFailure: "requestThemesFailure",
            method: "GET", 
            handleAs: "json", 
            contentType: "application/x-www-form-urlencoded; charset=utf-8"
         },
         /*{kind: enyo.PalmService,
            name: "downloadService",
            service: "palm://com.palm.downloadmanager/",
            method: "download",
            timeout: 30000,
            subscribe: true,
            resubscribe: true,
            onSuccess: "grabImageSuccess",
            onFailure: "grabImageFailure",
         },*/
         {kind: enyo.PalmService,
            name: "deleteDownloadFile",
            service: "palm://com.palm.downloadmanager/",
            method: "deleteDownloadedFile",
            onSuccess : "deleteFinished",
            onFailure : "deleteFail",
         },
         {name: "progressDialog", kind: "ProgressDialog"},
         {kind: "SyncDialog", name: "syncDialog", onCancel: "cancelDownload"},
         {kind: "ModalDialog", name: "failureDialog", style: "height: 240px;", caption: $L("Max. allowed content size exceeded"), components:[
             {kind: "Button", caption: $L("Ok"), flex: 1, className: "enyo-button-negative", onclick: "closeDialog"},
		 ]},
		 {kind: "ModalDialog", name: "offlineSuccessDialog", caption: $L("Offline stored modifications successfully submitted to Springpad!"), components:[
             {kind: "Button", caption: $L("Ok"), flex: 1, className: "enyo-button-affirmative", onclick: "closeSuccessDialog"},
         ]},
		 {kind: "ModalDialog", name: "offlineFailureDialog", caption: $L("I'm sorry, but the offline stored modifications could not be submitted properly to Springpad! Please try again later."), components:[
             {kind: "Button", caption: $L("Ok"), flex: 1, className: "enyo-button-negative", onclick: "closeFailureDialog"},
         ]},
    ],

     // declare 'published' properties
    published: {
        background: false,
        /*syncInProgress: false,*/

        currentMaxDownloads: 1,
        millisToWait: 5000,

        itemsAll: [],
        feedItems: [],
        notebooks: [],
        springpadThemes: [],
        springpadAccents: [],
        downloadedArticles: [],
        currentlyLoading: [],
        currentlyWaiting: [],
        totalItemsToDownload: 0,
        toggledReadState: [],
        accountVerified: false,
        availableTags: [],
        availableTypes: [],
        cancelImageDownload: false,
        imagesToDownload: [],
        downloadedImages: [],
        totalItems: 0,
        storedOffline: [],
        failedImages: [],
        
        availableShoppingLists: [],
        
        funcname: undefined, 
        scope: undefined,
        ip: null
    },
    
     doSync : function( bgMode, scope, funcname, funcname2, funcname3 ) {
        if (Util.isDebug()) {
            this.log("START");
        }
        
        if (Settings.getSettings().syncInProgress == true) {
            if (Util.isDebug()) {
                this.log("There is already a sync going on... returning!");
                this.log("END");
            }
            return;
        } 
        
        this.funcname = funcname3;
        this.scope = scope;
        
        // there can only be one current sync
        localStorage.setItem("syncInProgress", true);
        Settings.getSettings( true );
        
        // this.log("bgMode: " + bgMode);
        // this.log("funcname: " + funcname);
        // this.log("scope: " + scope);
        if ( bgMode !== undefined) {
            this.setBackground( bgMode );
        } else {
            this.setBackground( false );
        }

        if (Util.isDebug()) {
            this.log("Settings.getSettings().online: " + Settings.getSettings().online);
            this.log("Settings.getSettings().autoSync: " + Settings.getSettings().autoSync);
        }
        if (Settings.getSettings().online == true) {
            if (Settings.getSettings().username != "" && Settings.getSettings().password != "" && Settings.getSettings().accountVerified == true)
            {

                if (Settings.getSettings().autoSync == true && bgMode == false) {
                    if (Util.isDebug()) {
                        this.log("showing empty list...");
                    }
                    this.owner.$.itemListPane.selectView("emptyList");
                    this.owner.disableItemListPaneControls( true );
//                  this.loadItemList( );
                    // process offline stored data
                    this.processOfflineData( true );
                } else if (Settings.getSettings().autoSync == true && bgMode == true) {
                    localStorage.setItem("lastActivity", new Date().getTime());
                    if (this.background == true && funcname2 !== undefined && this.scope !== undefined) {
                        if (Util.isDebug()) {
                            this.log("Start syncing... :-)");
                        }
                        // a function that binds this to this.foo
                        var func = enyo.bind(this.scope, funcname2);
                        // the value of this.foo(3)
                        var value = func();
                    }
//                    this.loadItemList( funcname, scope );
                    // process offline stored data
                    this.processOfflineData( true );
                } else {
                    if (Util.isDebug()) {
                        this.log("autosync disabled!");
                    }
                    localStorage.setItem("syncInProgress", false);
                    Settings.getSettings( true );
                    // process offline stored data
                    this.processOfflineData( false );
                }
            } else {
                if (Util.isDebug()) {
                    this.log("currently no verified user account detected!");
                }
                localStorage.setItem("syncInProgress", false);
                Settings.getSettings( true );
                if (this.background == true && funcname3 !== undefined && this.scope !== undefined) {
                    if (Util.isDebug()) {
                        this.log("restart timer...");
                    }
                    // a function that binds this to this.foo
                    var func = enyo.bind(this.scope, funcname3);
                    // the value of this.foo(3)
                    var value = func();
                }
            }
        } else {
            if (Util.isDebug()) {
                this.log("currently not online!");
            }
            localStorage.setItem("syncInProgress", false);
            Settings.getSettings( true );
            if (this.background == true && funcname3 !== undefined && this.scope !== undefined) {
                if (Util.isDebug()) {
                    this.log("restart timer...");
                }
                // a function that binds this to this.foo
                var func = enyo.bind(this.scope, funcname3);
                // the value of this.foo(3)
                var value = func();
            }
        }
        
        if (Util.isDebug()) {
            this.log("Settings.getSettings().syncInProgress: " + Settings.getSettings().syncInProgress);
        }
        if (Settings.getSettings().syncInProgress == true && this.getBackground() == true) {
            while (Settings.getSettings().syncInProgress == true && this.getBackground() == true) {
                // wait 5 seconds
                this.sleep(5);
                if (Util.isDebug()) {
                    this.log("Settings.getSettings().syncInProgress: " + Settings.getSettings().syncInProgress);
                }
            }
        }
        
        if (Util.isDebug()) {
            this.log("END");
        }
    },

    sleep : function(naptime){
        naptime = naptime * 1000;
        var sleeping = true;
        var now = new Date();
        var alarm;
        var startingMSeconds = now.getTime();
        if (Util.isDebug()) {
            this.log("starting nap at timestamp: " + startingMSeconds + "\nWill sleep for: " + naptime + " ms");
        }
        while(sleeping){
            alarm = new Date();
            alarmMSeconds = alarm.getTime();
            if(alarmMSeconds - startingMSeconds > naptime){ sleeping = false; }
        }        
        if (Util.isDebug()) {
            this.log("Wakeup!");
        }
    },
    

    ////////////////////////////////////////////
    // LOAD ARTICLE LIST - START
    ////////////////////////////////////////////
    loadItemList : function (  ) {
        // this.log("START");
        this.cancel = false;
        if (this.background == false) {
//            this.owner.$.notebookListPane.showListSpinner();
//            if (this.$.progressDialog !== undefined) {
//                this.$.progressDialog.resetDialog();
//            }
//            this.showProgressPopup( $L("Syncing Items"), 10, "unknown", "unknown", false );
            this.$.syncDialog.openAtCenter();
            this.$.syncDialog.resetDialog();
            this.$.syncDialog.update( Const.SYNC_DIALOG_DOWNLOADING );
        }

//        if (Util.isDebug()) {
//            this.log("lastSync: " + (new Date()).getTime());
//        }
//        localStorage.removeItem("lastSync");
//        localStorage.setItem("lastSync", (new Date()).getTime());
        Settings.getSettings( true );
        
        // update themes from springpad
        this.$.requestThemesService.call();
        
        this.$.springpadApi.onFetchSuccess = "grabNotebooksSuccess";
        this.$.springpadApi.onFetchFailure = "grabNotebooksFailure";
        this.$.springpadApi.fetchData("users/me/blocks?limit=1000&type=Workbook", "GET" );
        // this.log("END");
    },
   
    grabNotebooksSuccess: function(inSender, responseText) {
        // this.log("START");
        // this.log()
         this.log("inSender: " + inSender);
         this.log("responseText: " + enyo.json.stringify(responseText));
        // this.log("enyo.json.stringify(responseText).length: " + enyo.json.stringify(responseText).length);

    	if (this.cancel) {
            if (Util.isDebug()) {
                this.log("END - canceled!");
            }
    		return;
    	}
    	
        this.setNotebooks([]);
/*        this.setFeedItems([]);
        this.setItemsAll([]);
        this.setAvailableShoppingLists([]);
        this.totalItems = 0;*/
        
        var obj = {
           name: "All My Stuff",
           theme: "standard",
        };
        this.getNotebooks().push(obj);

        // create array of items     
        resultArray = [];   
        counter = 0;
        for (key in responseText)
        {
            gnsObj = responseText[key];
            gnsObj.modifiedNew = this.getValueFromString( gnsObj.modified );
            gnsObj.createdNew = this.getValueFromString( gnsObj.created );
            
            // if (Util.isDebug()) {
                // this.log("responseText[key]: " + JSON.stringify(responseText[key]));
            // }
            // this.log("obj.name: " + obj.name);
            // this.log("obj.properties.theme: " + obj.properties.theme);
            // this.log("obj.properties.accent: " + obj.properties.accent);
            // this.log("obj.properties: " + enyo.json.stringify(obj.properties));
            // this.getNotebooks().push(obj);
            resultArray.push( gnsObj );
            counter++;
        }
        
        // this.log("this.getNotebooks(): " + resultArray.length);
        // this.log("final counter: " + counter);
        // sort array of items depending on time_updated!
        // this.setNotebooks(this.getNotebooks().sort(function(a,b) {  
        resultArray = (resultArray.sort(function(a,b) {  
            /*var intA = parseInt( a.createdNew );
            var intB = parseInt( b.createdNew );
            return intA - intB;*/
            A = (a.name !== undefined ? String(a.name).toLowerCase() : "");
            B = (b.name !== undefined ? String(b.name).toLowerCase() : "");
            if (A < B){
               return -1;
            }else if (A > B){
              return  1;
            }else{
              return 0;
            }
        })); 
        
        for (key in resultArray) {
            this.getNotebooks().push( resultArray[key] );
        }

        // save itemlist
        if (Util.isDebug()) {
            this.log("saving " + this.getNotebooks().length + " notebooks...");
        }
        storageType = "notebooks";
//        localStorage.removeItem(storageType);
        localStorage.setItem(storageType, JSON.stringify(this.getNotebooks()));
        
        if (this.getBackground() == false) {
            // show stored itemlist
            if (Util.isDebug()) {
                this.log("switching to notebook list... :-)");
            }
            if (counter > 0 ) {
                this.owner.$.notebookListPane.selectView("feedList");
//                this.owner.showItemsFromStorage();
            } else {
                this.owner.$.notebookListPane.selectView("emptyList");
            }
        }
        
    	if (this.cancel) {
            if (Util.isDebug()) {
                this.log("END - canceled!");
            }
    		return;
    	}
        
        var lastSync = Settings.getSettings().lastSync;
        if (lastSync == 0) {
	    	this.setItemsAll([]);
	        this.setFeedItems([]);
	        this.setAvailableShoppingLists([])
        }
        this.totalItems = 0;
        this.downloadNotebookItems();

        // this.log("END");
    },
    
    grabNotebooksFailure : function(inSender, inResponse, inRequest) {
        // this.log("START");
        // hide the spinner in the itemlist
        if (this.getBackground() == false) {
            this.owner.$.notebookListPane.hideListSpinner();
//            this.$.progressDialog.close();
        }                  

        // this.error();
        this.error("inSender: " + inSender);
        this.error("inResponse: " + inResponse);
        this.error("inRequest: " + inRequest);
        
        var status = "0";
        if (inRequest && inRequest.xhr) {
        	status = inRequest.xhr.status;
            this.error("inRequest.xhr.status: " + inRequest.xhr.status);
            this.error("inRequest.xhr.getResponseHeader(\"Content-Type\"): " + inRequest.xhr.getResponseHeader("Content-Type"));
            this.error("inRequest.xhr: " + enyo.json.stringify(inRequest.xhr));
        }
        
        localStorage.setItem("syncInProgress", false);
        Settings.getSettings( true );   
        
        // check status!
        if (this.getBackground() == false) {
            this.owner.disableItemListPaneControls( false );
            // show stored itemlist
            this.owner.showItemsFromStorage();
            if (status == 403) {
            	this.$.syncDialog.error( $L("Authorization failed! Please check your username and password!") );
            } else if (status >= 500 && status <= 599) { // server error
                this.$.syncDialog.error($L("Springpad servers are currently not available! Please try again later!"));
            } else {
            	this.$.syncDialog.error( "Error code: " + inRequest.xhr.status );
            }
        } else {
            // restart bg-sync
            var func = enyo.bind(this.scope, this.funcname);
            var value = func();
        }
        
        // this.log("END");
    },

    downloadNotebookItems : function ( syncDate ) {
        // this.log("START");
//        if (this.getBackground() == false) {
//            this.showProgressPopup( $L("Syncing Items"), 25, "unknown", "unknown", false );
//        }
        this.$.syncDialog.update( Const.SYNC_DIALOG_DOWNLOADING, null, this.totalItems );

        var lastSync = Settings.getSettings().lastSync;
        if (Util.isDebug()) {
            this.log("lastSync: " + lastSync);
        }
    	var howtoload = "";
    	if (lastSync == 0 || lastSync == null || lastSync == "null") {
    		lastSync = (syncDate !== undefined ? syncDate : 0);
    		howtoload = "createdAfter=" + lastSync;
    	} else {
    		howtoload = "modifiedAfter=" + lastSync;
    	}
        this.$.springpadApi.onFetchSuccess = "grabNotebookItemsSuccess";
        this.$.springpadApi.onFetchFailure = "grabNotebookItemsFailure";
        this.$.springpadApi.fetchData("users/me/blocks?" + howtoload + "&limit=" + Const.ITEM_SYNC_LIMIT + "&format=sync&sd=true", "GET" );
        // this.log("END");
    },
   
    grabNotebookItemsSuccess: function(inSender, responseText, inRequest) {
//        if (Util.isDebug()) {
//            this.log("START");
////            this.error("inRequest.xhr.getResponseHeader(\"X-Spring-Next-Page-Date\"): " + inRequest.xhr.getResponseHeader("X-Spring-Next-Page-Date"));
////            this.error("inRequest.xhr.getAllResponseHeaders(): " + inRequest.xhr.getAllResponseHeaders());
//        }

    	if (this.cancel) {
            if (Util.isDebug()) {
                this.log("END - canceled!");
            }
    		return;
    	}

    	syncDate = inRequest.xhr.getResponseHeader("X-Spring-Next-Page-Date");
        
        if (Util.isDebug()) {
//            this.log(JSON.stringify(responseText));
            this.log("responseText.length: " + responseText.length);
        }

        // collect and handle response-data
        total = 0;
        actual = 0;

//        if (this.getBackground() == false) {
//            this.showProgressPopup( $L("Syncing Items"), 30, "unknown", "unknown", false );
//        }
        
        for (key in responseText)
        {
            gnisObj = responseText[key];
            deleted = (gnisObj.deleted == true || gnisObj.deleted == "true" || (gnisObj.properties !== undefined && gnisObj.properties.deleteOwned == true) ? true : false);
//             if (Util.isDebug()) {
//                 this.log("deleted: " + deleted);
//             }
            // enyo.nextTick("processNotebookItem", enyo.bind(this, this.processNotebookItem(), obj));
            // enyo.nextTick(this, "processNotebookItem", obj);
            if (deleted == false) {
                // this.log("key: " + key);
//                 if (Util.isDebug()) {
//                     this.log("responseText[" + key + "]: " + JSON.stringify(gnisObj));
//                 }
                
                if (this.processNotebookItem( gnisObj )) {
                    this.updateOrInsertItem( gnisObj );
                	if (gnisObj.type != "/Type(CheckListItem)/") {
                        total++;
                	}

                    this.$.syncDialog.update( Const.SYNC_DIALOG_PROCESSING, null, Number(this.totalItems) + Number(total) );

                }
            } else {
            	item = ArrayUtils.getElementFromArrayById( this.getItemsAll(), gnisObj.uuid );
                if (item !== undefined && item !== null) {
                    if (Util.isDebug()) {
                        this.log("deleting item: " + item.name);
                    }
                    ArrayUtils.removeElement( this.getItemsAll(), item);
                	if (gnisObj.type != "/Type(CheckListItem)/") {
                        total++;
                	}
                }
            }

            actual = Math.round( 70 / Number(responseText.length) * Number(total)) + 20;
            // if (Util.isDebug()) {
                // this.log("actual: " + actual);
            // }
//            if (this.getBackground() == false) {
                // this.log("updating progress bar to: " + actual + " %");
                // enyo.nextTick("showProgress", enyo.bind( this, this.showProgressPopup, $L("Syncing Items"), Number(actual), "unknown", "unknown", false ));
                // this.showProgressPopup( $L("Syncing Items"), Number(actual), "unknown", "unknown", false );
//                this.$.progressDialog.updateProgress( $L("Syncing Items"), Number(actual), "unknown", "unknown", false );
//            }
            
        }

        this.totalItems += total;
        
        if (Util.isDebug()) {
            this.log("syncDate: " + syncDate);
            this.log("Settings.getSettings().lastSync: " + Settings.getSettings().lastSync);
        }
        
        if (Number(responseText.length) >= Const.ITEM_SYNC_LIMIT && syncDate != this.currentSync) {
            if (Util.isDebug()) {
                this.log("END - not downloaded everything!");
            }
            this.currentSync = syncDate;
            this.downloadNotebookItems( syncDate );
            return;
        }
        
        localStorage.setItem("lastSync", syncDate);
        Settings.getSettings( true );
        
//        if (this.getBackground() == false) {
//            this.showProgressPopup( $L("Syncing Items"), 80, "unknown", "unknown", false );
//        }
        if (Util.isDebug()) {
            this.log("items downloaded: " + total);
            this.log("total tags available: " + this.getAvailableTags().length);
            this.log("total types available: " + this.getAvailableTypes().length);
            this.log("total lists available: " + this.getAvailableShoppingLists().length);
        }
        tagSize = Number(JSON.stringify(this.getAvailableTags()).length);
        // this.log("saving tags: " + Math.round(tagSize/1024) + " kb");
        this.sortAvailableTags();
        this.sortAvailableTypes();
        this.sortAvailableShoppingLists();

//        if (this.getBackground() == false) {
//            this.showProgressPopup( $L("Storing Data"), 90, "unknown", "unknown", false );
//        }
        if (total > 0) {
	        this.$.syncDialog.update( Const.SYNC_DIALOG_STORING, null, this.totalItems );
	        this.storeItemsAll();
        }

        if (this.getBackground() == false) {
//            this.showProgressPopup( $L("Storing Data"), 100, "unknown", "unknown", false );
            this.owner.$.notebookListPane.updateCountLabel();
            this.owner.$.itemListPane.updateCountLabel();
            // show stored itemlist
            if (Util.isDebug()) {
                this.log("switching to item list... :-)");
            }
            if (this.getItemsAll() > 0 ) {
                this.owner.$.itemListPane.selectView("feedList");
                this.owner.showItemsFromStorage();
            } else {
                this.owner.$.itemListPane.selectView("emptyList");
            }
        }

        if (this.getImagesToDownload().length > 0 && Settings.getSettings().downloadImages == true) {
            if (Util.isDebug()) {
                this.log("will download a total of " + this.getImagesToDownload().length + " images!");
            }
//            if (this.getBackground() == false) {
//                this.showProgressPopup( $L("Downloading new images"), 0, 0, this.getImagesToDownload().length, false, "cancelDownloadImages" );
//            }
            this.$.syncDialog.update( Const.SYNC_DIALOG_DOWNLOADING_IMAGES );
            // download items
            this.doDownloadImages();
        } else {
            if (Util.isDebug()) {
                this.log("no images needs to be downloaded!");
            }
            this.syncFinished() ;
        } 
        if (Util.isDebug()) {
            this.log("END");
        }
    },

    processNotebookItem : function( processingItem ) {
        
        // if (obj.name == "PlayBook Deployment") {
            // this.log("properties: " + JSON.stringify(obj.properties));
        // }
        
    	if (processingItem.type == "/Type(Workbook)/" 
    		|| processingItem.type == "/Type(LifeManagrUser)/" 
			|| processingItem.type == "/Type(BetaFeature)/" 
			|| processingItem.type == "/Type(CollabMember)/"
			|| processingItem.type == "/Type(QuickAddItem)/"
			|| processingItem.type == "/Type(Channel)/"
			|| processingItem.type == "/Type(Date)/"
			|| processingItem.type == "/Type(DateObject)/"
			|| processingItem.type == "/Type(ProductivityCategory)/"
			|| processingItem.type == "/Type(DateTimeObject)/"
			|| processingItem.type == "/Type(NavigationItem)/"
			|| processingItem.type == "/Type(Frequency)/"
			|| processingItem.type == "/Type(CheckListItem)/"
			|| processingItem.type == "/Type(NotebookContents)/"
			) {
    		return false;
    	}
    	
    	if (processingItem.properties !== undefined && processingItem.properties.isAttachment == true) {
    		return false;
    	}
        
//        if (Util.isDebug()) {
//            this.log("processingItem: " + JSON.stringify(processingItem));
//        }

        if (processingItem.image !== undefined) {
            fileNameI = StringUtils.getFilenameFromURL( processingItem.image );
            // this.log("fileNameI: " + fileNameI);
            imageI = ArrayUtils.getImageFromArrayByFilename(this.getDownloadedImages(), fileNameI);
            // this.log("imageI: " + imageI);
            
            if (imageI == null) {
                if (!ArrayUtils.isElementInArray( this.getImagesToDownload(), processingItem.image) && ArrayUtils.getImageFromArrayByFilename(this.getDownloadedImages(), fileNameI) == null) {
                    // this.log("must download imageSource: " + obj.image);
                    this.getImagesToDownload().push( processingItem.image );
                }
            }
        }

        // check if thumbnail is available
        if (processingItem.properties !== undefined && processingItem.properties.thumbKey !== undefined) {

            // use thumbnail
            if (processingItem.properties.thumbKey.indexOf("http") == -1) {
                processingItem.properties.thumbKey = "http://springpad-user-data.s3.amazonaws.com/" + processingItem.properties.thumbKey;
            }

            fileNameT = StringUtils.getFilenameFromURL( processingItem.properties.thumbKey );
            // this.log("fileNameT: " + fileNameT);
            imageT = ArrayUtils.getImageFromArrayByFilename(this.getDownloadedImages(), fileNameT);
            // this.log("imageT: " + imageT);
            
            if (imageT == null) {
                if (!ArrayUtils.isElementInArray( this.getImagesToDownload(), processingItem.properties.thumbKey) && ArrayUtils.getImageFromArrayByFilename(this.getDownloadedImages(), fileNameT) == null) {
                    // this.log("must download thumbnailSource: " + obj.properties.thumbKey);
                    this.getImagesToDownload().push( processingItem.properties.thumbKey );
                }
            }
            
        }
        if (processingItem.properties !== undefined && processingItem.properties.tags !== undefined) {
            // this.log("tags: " + JSON.stringify(obj.properties.tags));
            this.addGlobalTags( this.getAvailableTags(), processingItem.properties.tags);
        }
        // this.log("checking obj.type: " + obj.type);
        type = StringUtils.getValueFromString( processingItem.type );
        // this.log("found type: " + type);
        if (type == "GeneralList") {
            // this.log("found list: " + obj.name);
            shoppingList = {
                "name": processingItem.name,
                "uuid": processingItem.uuid    
            };
            this.getAvailableShoppingLists().push( shoppingList );
        }
        this.addGlobalTypes( this.getAvailableTypes(), type);
        
        // grab the tags
        if (processingItem.tags !== undefined) {
            // this.log("tags: " + newItem.tags);
            this.addGlobalTags( this.getAvailableTags(), processingItem.tags);
        }
        
        return true;
    },

    storeItemsAll : function() {
        // save itemlist
    	contentSize = Number(JSON.stringify(this.getItemsAll()).length);
        if (Util.isDebug()) {
            this.log("saving notebook items: " + Math.round(contentSize/1024) + " kb");
        }
        // every character using 2bytes, because of UTF-8! So only half of 5 mb is available for storage
        if (Platform.isBrowser()) {
            if (Util.isDebug()) {
                this.log("storing items to browser local storage: " + contentSize);
            }
         // Request storage usage and capacity left
            window.webkitStorageInfo.queryUsageAndQuota(webkitStorageInfo.PERSISTENT, //the type can be either TEMPORARY or PERSISTENT
            function(used, remaining) {
              console.log("Used quota: " + used + ", remaining quota: " + remaining);
            }, function(e) {
              console.log('Error', e); 
            } );
            
            
            if (Util.isDebug()) {
                this.log("contentSize (bytes): " + Number(contentSize));
                this.log("additional space (1024*512) (bytes): " + Number(1024*512));
                this.log("requesting total bytes: " + Number(Number(contentSize) + Number(1024*512)));
            }
            var stoItems = this.getItemsAll();
         // Request Quota (only for File System API)  
            window.webkitStorageInfo.requestQuota(webkitStorageInfo.PERSISTENT, Number(Number(contentSize) + Number(1024*1024)), function(grantedBytes) {
              window.webkitRequestFileSystem(webkitStorageInfo.PERSISTENT, grantedBytes, function() {
            	  try {
            		  console.log("granted " + Number(Number(contentSize) + Number(1024*1024)) + " bytes for webkit storage!");
//                      localStorage.removeItem("items");
                      localStorage.setItem("items", JSON.stringify(stoItems));
            	  } catch(e) {
                      console.log('Error: '+  e); 
                      alert('Error: '+  e); 
            	  }
                  stoItems = null;
              }, function(e) {
                  console.log('Error: '+  e); 
                  alert('Error: '+  e); 
              }); 
            }, function(e) {
                console.log('Error: '+  e); 
                alert('Error: '+  e); 
            });
            
        } else if (Platform.isWebOS() && contentSize <= 2400000 ) {
            if (Util.isDebug()) {
                this.log("storing items to local storage: " + this.getItemsAll().length);
            }
//            localStorage.removeItem("items");
            localStorage.setItem("items", JSON.stringify(this.getItemsAll()));
        } else if (Platform.isWebOS() && contentSize > 2400000) {
            if (Util.isDebug()) {
                this.log("show failure message");
            }
            this.$.failureDialog.openAtCenter();
        } else if (Platform.isBlackBerry()  && contentSize <= 2400000 ) {
            if (Util.isDebug()) {
                this.log("blackberry: storing items to local storage: " + this.getItemsAll().length);
            }
//            localStorage.removeItem("items");
            localStorage.setItem("items", JSON.stringify(this.getItemsAll()));
            // delete old file if any
            if (Platform.isPlaybook()) {
                try {
                    dirs = blackberry.io.dir.appDirs.app.storage.path;
                    filePath = String(dirs) + "/items.data";
                    if (blackberry.io.file.exists(filePath)) {
                        blackberry.io.file.deleteFile(filePath);
                    }
                }
                catch (e) {
                    alert("error in deleting file:"+e);
                }     
            } else if (Platform.isBB10()) {
            	// TODO implement
            }
        } else if (Platform.isBlackBerry()  && contentSize > 2400000 ) {
            this.storeItemsAllToFileSystem();
        } else {
            this.error("WTF?!?!!?");
        }
    },
    
    grabNotebookItemsFailure : function(inSender, inResponse, inRequest) {
        // this.log("START");

        // this.error("Unexpected Error!");
        this.error(JSON.stringify(inResponse));

        localStorage.setItem("syncInProgress", false);
        Settings.getSettings( true );
        
        if (this.getBackground() == false) {
            this.owner.disableItemListPaneControls( false );
        	this.$.syncDialog.update( Const.SYNC_DIALOG_OTHER, "error-code: " + inRequest.xhr.status );
        	this.$.syncDialog.abort();
        } else {
            // restart bg-sync
            var func = enyo.bind(this.scope, this.funcname);
            var value = func();
        }

        // var str = JSON.stringify(inResponse);
        // this.showFailurePopup( str, "Unexpected Error!" ); 

        // this.log("END");
    },    
    
    sortAvailableTags : function() {
        this.setAvailableTags(this.getAvailableTags().sort( function( a,b ) {  
            // enyo.log(" +----> b: " + b.time_updated + ", a: " + a.time_updated);
            if (a.isTag == false || b.isTag == false) {
                return 0;
            }
            
            return String(a.tag).localeCompare( String(b.tag) );
        }));        

        // save tags
//        localStorage.removeItem("availableTags");
        localStorage.setItem("availableTags", JSON.stringify(this.getAvailableTags()));
    },
    
    sortAvailableTypes : function() {
        this.setAvailableTypes(this.getAvailableTypes().sort(function(a,b) {  
            // enyo.log(" +----> b: " + b.time_updated + ", a: " + a.time_updated);
            
            return $L(a).localeCompare( $L(b) );
        }));        

        // save tags
//        localStorage.removeItem("availableTypes");
        localStorage.setItem("availableTypes", JSON.stringify(this.getAvailableTypes()));
    },
    
    sortAvailableShoppingLists : function() {
        this.setAvailableShoppingLists(this.getAvailableShoppingLists().sort(function(a,b) {  
            // enyo.log(" +----> b: " + b.time_updated + ", a: " + a.time_updated);
            
            return a.name.localeCompare( b.name );
        }));        

        // save lists
//        localStorage.removeItem("availableShoppingLists");
        localStorage.setItem("availableShoppingLists", JSON.stringify(this.getAvailableShoppingLists()));

    },
    
    getTypeFromString : function( str ) {
        if (str !== undefined) {
            var posEnd = str.indexOf("(");
            var value = str.substring(1, posEnd);
            return value;
        }  
    },
    
    getValueFromString : function( str ) {
        if (str !== undefined) {
            var posStart = str.indexOf("(");
            var posEnd = str.lastIndexOf(")");
            var value = str.substring(posStart+1, posEnd);
            return value;
        }  
    },
    
    getWorkbooks: function( uuidList ) {
        if (Util.isDebug()) {
            this.log("uuidList: " + uuidList);
        }
        
        wbResult = [];
        if (uuidList !== undefined && uuidList != null) {
            pos = uuidList.toString().indexOf(",");
            if (Util.isDebug()) {
                this.log("pos: " + pos);
            }

            if (pos != -1) {
                idArray = uuidList.toString().split(",");
                for(gwbkey in idArray) {
                    if (Util.isDebug()) {
                        this.log("idArray[gwbkey]: " + idArray[gwbkey]);
                    }
                    wbResult.push( this.getWorkbook( idArray[gwbkey] ) );
                }
            } else {
                return this.getWorkbook( uuidList );
            }
        }
        return wbResult;        
    },
    
    getWorkbook : function( uuid ) {
        if (Util.isDebug()) {
            this.log("START");
            this.log("uuid: " + uuid);
        }
        // this.log();
        result = "";
        if (uuid !== undefined) {
            // only items for parameter notebook
            for (gwkey in this.getNotebooks())
            {
                // this.log("obj: " + JSON.stringify(obj));
                objuuid = this.getValueFromString(this.getNotebooks()[gwkey].uuid);
                // this.log("objuuid: " + objuuid);
                if (uuid  == objuuid) {
                    if (Util.isDebug()) {
                        this.log("END");
                    }
                    return this.getNotebooks()[gwkey];
                }
            }
        }
        // this.log("result.length: " + result.length);
        if (Util.isDebug()) {
            this.log("END");
        }
        return result            
    },
    
   isTagAvailable : function( inTag ) {
      // this.log("START");
      // this.log("looking for tag: " + inTag);
      for (itakey in this.getAvailableTags()) {
          if (this.getAvailableTags()[itakey].tag == inTag) {
              // this.log("found it! ");
              // this.log("END");
              return true;
          }
      }    
      // this.log("END");
      return false;
   },
   
   addGlobalTags : function( inArray, tags) {
       // this.log("START");
       if (tags !== null && inArray != null) {
           for (agtkey in tags) {
               // this.log("tags[agtkey]: " + tags[agtkey]);
               if (this.isTagAvailable( tags[agtkey] ) == false) {
                   // this.log("added new tag: " + tags[agtkey]);
                   globalTagItem = {
                       "tag" : tags[agtkey],
                       "isTag" : true,
                   };
                   this.getAvailableTags().push( globalTagItem );
               }
           }
       }
      // this.log("END");
   },

   isTypeAvailable : function( inType ) {
      for (ityakey in this.getAvailableTypes()) {
          if (this.getAvailableTypes()[ityakey] == inType) {
              return true;
          }
      }    
      return false;
   },
   
   addGlobalTypes : function( inArray, type) {
       if (type != null && inArray != null) {
           // this.log("tag: " + tag);
           if (this.isTypeAvailable( type ) == false) {
               // this.log(" adding type: " + type);
               this.getAvailableTypes().push( type );
           }
       }
   },

    ////////////////////////////////////////////
    // LOAD ARTICLE LIST - END
    ////////////////////////////////////////////
    
    getFeedItemsByStateAndTag : function( notebook, tag, type, force ) {
        if (Util.isDebug()) {
            this.log("START");
            this.log("notebook: " + notebook);
            this.log("tag: " + tag);
            this.log("type: " + type);
            this.log("force: " + force);
        }
        // this.log("filter: " + filter);
        // this.log();
        // firesult = null;
        firesult = [];
        
        if (notebook !== undefined && notebook != null && tag != undefined && tag != null)
        {
            if (Util.isDebug()) {
                this.log("iterate over all items (" + this.getItemsAll().length + ")");
            }            
            for (fic in this.getItemsAll())
            {
            	getfeedbyObj = this.getItemsAll()[fic];
//            	if (fic == 132) {
//            		this.log("obj " + fic + ": " + JSON.stringify(getfeedbyObj));
//            	} else {
//            		this.log("obj " + fic + ": " + getfeedbyObj.uuid);
//            	}
                // this.log("this.getItemsAll()[" + fic + "]: " + JSON.stringify(this.getItemsAll()[fic]));
                if (getfeedbyObj !== undefined && getfeedbyObj != null) {
                        // this.log("lets have a look...");
                        
//                         this.log("StringUtils.getValueFromString(getfeedbyObj.type): " + StringUtils.getValueFromString(getfeedbyObj.type));
                        if (type == StringUtils.getValueFromString(getfeedbyObj.type) || type == "") {
                            if (getfeedbyObj.properties !== undefined) {
                                // this.log("obj.properties.workbooks: " + obj.properties.workbooks);
                                if (this.isNotebook( getfeedbyObj.properties.workbooks, notebook ) || notebook == "All_My_Stuff") {
                                    // this.log("maybe found something... ;-)");
                                    // check tags
                                    if (tag != "") {
                                        if (this.hasTag( getfeedbyObj.properties.tags, tag )) {
                                            firesult.push( getfeedbyObj );
                                        }
                                    } else {
                                        // this.log("found something...");
                                        firesult.push( getfeedbyObj );
                                    }
                                // } else {
                                    // this.error("THIS SHOULD NOT HAPPEN - 1");
                                }
                            } else {
                                // obj has no properties
                                this.error("obj " + fic + " has no properties: " + JSON.stringify(getfeedbyObj));
                            }
                        } else {
                            // everything is fine, the current object just don't matches the filtered item type! :-)
                        }
                } else {
                    this.error("THIS SHOULD NOT HAPPEN - 4");
                }
            }
            
            firesult = ArrayUtils.sortSpringpadData( firesult, Settings.getSettings().sortOrder );
            
        }
        if (Util.isDebug()) {
            this.log("firesult.length: " + firesult.length);
        }
        
        if (firesult.length > 0 || true == force) {
            localStorage.setItem("notebook", notebook);
            localStorage.setItem("filterTags", tag);
            localStorage.setItem("filterType", type);
            Settings.getSettings( true );
            if (this.getBackground() == false) {
                if (notebook != "All_My_Stuff" || tag != "") {
                    this.owner.$.itemListPane.filterActive( true );
                } else {
                    this.owner.$.itemListPane.filterActive( false );
                }
                this.owner.$.itemListPane.selectedRow = -1;
//                this.owner.$.feedWebViewPane.showEmptyPage();
                this.owner.$.feedWebViewPane.updateOrCloseCurrentItem();
            }
        }

        if (Util.isDebug()) {
            this.log("END");
        }
        return firesult;
    },
    
    getFeedItemsByTag : function( tag ) {
        if (Util.isDebug()) {
            this.log("START");
            this.log("tag: " + tag);
        }
        result = [];
        
        if (tag != undefined && tag != null)
        {

            if (Util.isDebug()) {
                this.log("iterate over all items (" + this.getFeedItems().length + ")");
            }            
            for (key in this.getFeedItems())
            {
                // this.log("obj: " + JSON.stringify(obj));
                if (this.getFeedItems()[key] !== undefined && this.getFeedItems()[key] != null) {
                    // this.log("lets have a look...");
                    if (this.getFeedItems()[key].properties !== undefined) {
                        // this.log("maybe found something... ;-)");
                        // check tags
                        
                        if (tag == "notags" && this.getFeedItems()[key].properties.tags === undefined) {
                            result.push(this.getFeedItems()[key]);
                        } else if (tag != "notags" && this.getFeedItems()[key].properties.tags !== undefined) {
                            if (this.hasTag( this.getFeedItems()[key].properties.tags, tag )) {
                                result.push(this.getFeedItems()[key]);
                            }
                        }
                    }
                }
            }
            
            result = ArrayUtils.sortSpringpadData( result, Settings.getSettings().sortOrder );
            
        }
        if (Util.isDebug()) {
            this.log("result.length: " + result.length);
        }
        
        if (result.length > 0 || true == force) {
            localStorage.setItem("filterTags", tag);
            Settings.getSettings( true );
            if (this.getBackground() == false) {
                if (Settings.getSettings().notebook != "All_My_Stuff" || tag != "") {
                    this.owner.$.itemListPane.filterActive( true );
                } else {
                    this.owner.$.itemListPane.filterActive( false );
                }
                this.owner.$.itemListPane.$.feedList.$.scroller.punt();
            }
        }

        if (Util.isDebug()) {
            this.log("END");
        }
        return result;
    },
    
    getFeedItemsByType : function( type, searchInAll ) {
        if (Util.isDebug()) {
            this.log("START");
            this.log("type: " + type);
            this.log("searchInAll: " + searchInAll);
        }
        result = [];
        
        if (type != undefined && type != null)
        {
            searchList = this.getFeedItems();
            if (searchInAll) {
                searchList = this.getItemsAll();
            }
            
            if (Util.isDebug()) {
                this.log("iterate over " + searchList.length + " items");
            }            
            for (key in searchList)
            {
                // this.log("obj: " + JSON.stringify(obj));
                if (searchList[key] !== undefined && searchList[key] != null) {
                    // this.log("lets have a look...");
                    if (searchList[key].type == type || type == "") {
                        result.push(searchList[key]);
                    }
                }
            }
            
            result = ArrayUtils.sortSpringpadData( result, Settings.getSettings().sortOrder );
            
        }
        if (Util.isDebug()) {
            this.log("result.length: " + result.length);
        }
        
        if (result.length > 0) {
            localStorage.setItem("filterType", StringUtils.getValueFromString(type));
            Settings.getSettings( true );
            if (this.getBackground() == false) {
                this.owner.$.itemListPane.filterActive( );
                this.owner.$.itemListPane.$.feedList.$.scroller.punt();
            }
        }
        if (Util.isDebug()) {
            this.log("END");
        }
        return result;
    },
    
        
    
    getNotebookId : function( notebook ) {
        if (notebook === undefined) {
            return;
        }
          
        for (key in this.getNotebooks()) {
            // this.log("obj: " + JSON.stringify(obj));
            if (this.getNotebooks()[key].name == notebook) {
                return this.getValueFromString( this.getNotebooks()[key].uuid );
            }
        }
        
        return "";
    },
    
    isNotebook : function ( notebooks, notebook ) {

        matchedAll = false;
            // this.log("obj.notebooks: " + notebooks);
        if (notebooks !== undefined && notebooks != null & notebook !== undefined && notebook != null) {
            
            // var notebookId = this.getNotebookId( notebook );
            // this.log("notebookId: " + notebookId);
            
            if (notebooks.indexOf(notebook) != -1) {
                matchedAll = true;;
            }
            
        } else {
            matchedAll = false;
        }
        return matchedAll;
    },
    
    hasTag : function ( tags, tag ) {
        matchedAll = true;
        if (tags !== undefined && tags != null & tag !== undefined && tag != null) {
            // this.log("obj.tags: " + tags);
            // this.log("tag: " + tag);
            
            if (tag.indexOf(",") != 1) {
                tagArray = String(tag).split(",");
                for(key in tagArray) {
                    tmpTag = tagArray[key];
                    if (tags.indexOf(tmpTag) == -1) {
                        matchedAll = false;
                        break;
                    }
                }
            } else {
                if (tags.indexOf(tag) == -1) {
                    matchedAll = false;;
                }
            }
            
        } else {
            matchedAll = false;
        }
        return matchedAll;
    },
    
    reloadData : function( ) {
        if (Util.isDebug()) {
            this.log("START");
        }

        // load all data that have been modifued or created offline        
        this.setStoredOffline( enyo.json.parse(localStorage.getItem("storedOffline")) );
        if (this.getStoredOffline() == null) {
            this.setStoredOffline([]);
            if (Util.isDebug()) {
                this.log("no offline created / modified objects found");
            }
        } else {
            if (Util.isDebug()) {
                this.log(this.getStoredOffline().length + " objects were created / modfied while client was offline");
            }
            if (Settings.getSettings().online == true) {
                this.processOfflineData();
            }
        }
        
        this.setSpringpadThemes( enyo.json.parse(localStorage.getItem("springpadThemes")) );
        if (this.getSpringpadThemes() == null) {
            if (Util.isDebug()) {
                this.log("no already downloaded themes found");
            }
            this.setSpringpadThemes([]);
        } else {
            if (Util.isDebug()) {
                this.log("loaded already downloaded themes: " + this.getSpringpadThemes().length);
            }
        }
        
        this.setSpringpadAccents( enyo.json.parse(localStorage.getItem("springpadAccents")) );
        if (this.getSpringpadAccents() == null) {
            if (Util.isDebug()) {
                this.log("no already downloaded accents found");
            }
            this.setSpringpadAccents([]);
        } else {
            if (Util.isDebug()) {
                this.log("loaded already downloaded accents: " + this.getSpringpadAccents().length);
            }
        }
        
        
        if (Platform.isPlaybook()) {
            try {
                var dirs = "";
                dirs = blackberry.io.dir.appDirs.app.storage.path;
                filePath = String(dirs) + "/items.data";
                if (blackberry.io.file.exists(filePath)) {
                    blackberry.io.file.readFile(filePath,enyo.bind( this, this.handleOpenedFile), false);
                }
                data = Util.loadFile( filePath );
                // this.log("data from Util.loadFile: " + data);
                if (data != null && data.length > 0) {
                    this.setItemsAll( enyo.json.parse( data ) );
                    if (Util.isDebug()) {
                        this.log("items loaded from file system: " + this.getItemsAll().length);
                    }
                } else {
                    this.loadItemsAllFromLocalStorage();
                }
            }
            catch (e) {
                alert("error in reading file:"+e);
            }     
        } else if (Platform.isBB10()) {
            try {
                window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
                
                filePath = blackberry.io.home + "/items.data";
                window.requestFileSystem(window.PERSISTENT, 1024 * 1024 * 5,
                    function (fs) {
                         // in order to access the shared folder,
                         // config.xml must declare the "access_shared" permission
                         // reference file by absolute path since file system is un-sandboxed
                         fs.root.getFile(filePath, {create: false},
                             function (fileEntry) {
                                 fileEntry.file(function (file) {
                                     var reader = new FileReader();

                                     reader.onloadend = enyo.bind( this, this.handleOpenedFile);

                                     reader.readAsText(file);
                                }, errorHandler);
                             }, errorHandler);
                    });
                
                data = Util.loadFile( filePath );
                this.log("data from Util.loadFile: " + data);
                if (data != null && data.length > 0) {
                    this.setItemsAll( enyo.json.parse( data ) );
                    if (Util.isDebug()) {
                        this.log("items loaded from file system: " + this.getItemsAll().length);
                    }
                } else {
                    this.loadItemsAllFromLocalStorage();
                }
            }
            catch (e) {
                alert("error in reading file:"+e);
            }     
        } else {
            this.setItemsAll( enyo.json.parse(localStorage.getItem("items")) );
            if (this.getItemsAll() == null) {
                if (Util.isDebug()) {
                    this.log("no items found");
                }
                this.setItemsAll([]);
            } else {
                if (Util.isDebug()) {
                    this.log("items loaded from local storage: " + this.getItemsAll().length);
                }
            }
        }

        this.setNotebooks( enyo.json.parse(localStorage.getItem("notebooks")) );
        if (this.getNotebooks() == null) {
            if (Util.isDebug()) {
                this.log("no notebooks found");
            }
            this.setNotebooks([]);
        } else {
            if (Util.isDebug()) {
                this.log("notebooks loaded: " + this.getNotebooks().length);
            }
        }
        
        this.setAvailableShoppingLists( enyo.json.parse(localStorage.getItem("availableShoppingLists")) );
        if (this.getAvailableShoppingLists() == null) {
            if (Util.isDebug()) {
                this.log("no availableShoppingLists found");
            }
            this.setAvailableShoppingLists([]);
        } else {
            if (Util.isDebug()) {
                this.log("availableShoppingLists loaded: " + this.getAvailableShoppingLists().length);
            }
        }
                
        imagesToDownload = localStorage.getItem("imagesToDownload");
        if (imagesToDownload != null) {
            this.setImagesToDownload( enyo.json.parse(imagesToDownload) );
            if (this.getImagesToDownload() == null) {
                if (Util.isDebug()) {
                    this.log("no images to download found");
                }
                this.setImagesToDownload([]);
            } else {
                if (Util.isDebug()) {
                    this.log("loaded images to download: " + this.getImagesToDownload().length);
                }
            }
        } else {
            if (Util.isDebug()) {
                this.log("no images to download found");
            }
            this.setImagesToDownload([]);
        }

        downloadedImages = localStorage.getItem("downloadedImages");
        if (downloadedImages != null) {
            this.setDownloadedImages( enyo.json.parse(downloadedImages) );
            if (this.getDownloadedImages() == null) {
                if (Util.isDebug()) {
                    this.log("no already downloaded images found");
                }
                this.setDownloadedImages([]);
            } else {
                if (Util.isDebug()) {
                    this.log("loaded already downloaded images: " + this.getDownloadedImages().length);
                }
            }
        } else  {
            if (Util.isDebug()) {
                this.log("no already downloaded images found");
            }
            this.setDownloadedImages([]);
        }

        this.setAvailableTags( enyo.json.parse(localStorage.getItem("availableTags")) );
        if (this.getAvailableTags() == null) {
            this.setAvailableTags([]);
        }

        this.setAvailableTypes( enyo.json.parse(localStorage.getItem("availableTypes")) );
        if (this.getAvailableTypes() == null) {
            this.setAvailableTypes([]);
        }
        
        if (Util.isDebug()) {
            this.log("END");
        }
    },

    loadItemsAllFromLocalStorage : function() {
        if (Util.isDebug()) {
            this.log();
        }
        this.setItemsAll( enyo.json.parse(localStorage.getItem("items")) );
        if (this.getItemsAll() == null) {
            if (Util.isDebug()) {
                this.log("no items found");
            }
            this.setItemsAll([]);
        } else {
            if (Util.isDebug()) {
                this.log("items loaded from local storage: " + this.getItemsAll().length);
            }
            this.storeItemsAllToFileSystem();
        }
    },

    handleOpenedFile : function (fullPath, blobData) {
        if (Util.isDebug()) {
            this.log("fullPath: " + fullPath);
            this.log("blobData.length: " + blobData.length);
            this.log("blobData: " + JSON.stringify(blobData));
        }
        // alert("file opened was: " + fullPath + " which contained " + blobData.length + " bytes");
        if (blobData != null && blobData.length > 0) {
            try {
                // var data = blackberry.utils.blobToString(blobData);
                // this.log("data from blackberry default encoding: " + data);
                // this.log("data.length: " + data.length);

                stringData = blackberry.utils.blobToString(blobData, "UTF-8");
                // this.log("stringData from blackberry in UTF-8: " + stringData);
                // this.log("stringData.length: " + stringData.length);
                // this.log("parsed: " + parsed);
                this.setItemsAll( enyo.json.parse(stringData) );
                if (Util.isDebug()) {
                    this.log("items loaded from file system: " + this.getItemsAll().length);
                }
            } catch (e) {
                this.error(e);
            }
        }
    },

    storeItemsAllToFileSystem : function() {
        if (Util.isDebug()) {
            this.log("START");
        }
        // first remove it from local storage
        localStorage.removeItem("items");
        
        if (Platform.isPlaybook()) {
            dirs = blackberry.io.dir.appDirs.app.storage.path;
        } else if (Platform.isBB10()) {
        	dirs = blackberry.io.home;
        } else if (Platform.isWebOS()) {
            dirs = "/media/internal/appdata/" + enyo.fetchAppInfo().id;
        }
        filePath = String(dirs) + "/items.data";
        
        if (Platform.isPlaybook()) {
            try {
                blob_data =  blackberry.utils.stringToBlob(JSON.stringify(this.getItemsAll())/*, "UTF-8"*/);
                // this.log("stored blob_data in UTF-8: " + blob_data);
                // this.log("stored blob_data with default endocing: " + blob_data);
                if (blackberry.io.file.exists(filePath)) {
                    blackberry.io.file.deleteFile(filePath);
                }
                blackberry.io.file.saveFile(filePath, blob_data);
            }
            catch (e) {
                alert("error in saving file:"+e);
                this.error("error in saving file:"+e);
            }     
        } else if (Platform.isBB10()) {
            try {
//                blob_data =  blackberry.utils.stringToBlob(JSON.stringify(this.getItemsAll())/*, "UTF-8"*/);
//                // this.log("stored blob_data in UTF-8: " + blob_data);
//                // this.log("stored blob_data with default endocing: " + blob_data);
//                if (blackberry.io.file.exists(filePath)) {
//                    blackberry.io.file.deleteFile(filePath);
//                }
//                blackberry.io.file.saveFile(filePath, blob_data);
            }
            catch (e) {
                alert("error in saving file:"+e);
                this.error("error in saving file:"+e);
            }     
        }
        if (Util.isDebug()) {
            this.log("END");
        }
    },
    
    loadItems : function( notebook, tags, type ) {
        if (notebook == undefined) {
            return; 
        }

        if (Util.isDebug()) {
            this.log("START");
            this.log("notebook: " + notebook);
            this.log("tags: " + tags);
            this.log("type: " + type);
        }

        localStorage.setItem("notebook", notebook );
        localStorage.setItem("filterTags", tags );
        localStorage.setItem("filterType", type );
        Settings.getSettings( true );
        
        if (Util.isDebug()) {
            this.log("Settings.getSettings().notebook: " + Settings.getSettings().notebook);
            this.log("Settings.getSettings().filterTags: " + Settings.getSettings().filterTags);
            this.log("Settings.getSettings().filterType: " + Settings.getSettings().filterType);
        }

        // try to reload from complete list
        this.setFeedItems( this.getFeedItemsByStateAndTag( notebook, tags, type ) );
        // if feedItems not loaded, they should be grabbed
        if (Util.isDebug()) {
            this.log("loaded items:" + this.getFeedItems().length);
        }
        if (this.getFeedItems().length == 0) { 
            if (Util.isDebug()) {
                this.log(" -> no feed items loaded from storage!");
            }
        }
        else {
            if (Util.isDebug()) {
                this.log(" -> " + this.getFeedItems().length + " feed items ('" + Settings.getSettings().notebook + "') loaded from storage!");
            }
        }
        if (this.getBackground() == false) {
            this.owner.$.itemListPane.updateCountLabel();
            this.owner.$.itemListPane.$.feedList.refresh();
        }
        if (Util.isDebug()) {
            this.log("END");
        }
    },
    
    loadItemsByTag : function( tags ) {
        if (Util.isDebug()) {
            this.log("START");
        }
        if (tags == undefined) {
            return; 
        }
        // try to reload from complete list
        this.setFeedItems( this.getFeedItemsByStateAndTag( Settings.getSettings().notebook, tags, Settings.getSettings().filterType ) );
        if (Util.isDebug()) {
            this.log(" -> " + this.getFeedItems().length + " feed items ('" + tags + "') loaded from storage!");
        }
        if (this.getBackground() == false) {
            // show content
            this.owner.$.itemListPane.$.feedList.render();
            this.owner.$.itemListPane.$.feedList.refresh();        
            this.owner.$.itemListPane.$.countLabel.setContent(this.getFeedItems().length + " " + $L("items"));
        }
        if (Util.isDebug()) {
            this.log("END");
        }
    },
    
    loadItemsByType : function( type, searchInAll ) {
        if (Util.isDebug()) {
            this.log("START");
        }
        if (type == undefined) {
            return; 
        }

        // try to reload from complete list
        this.setFeedItems( this.getFeedItemsByType( type, searchInAll ) );
        if (Util.isDebug()) {
            this.log(" -> " + this.getFeedItems().length + " feed items ('" + type + "') loaded from storage!");
        }
        if (this.getBackground() == false) {
            // show content
            this.owner.$.itemListPane.$.feedList.render();
            this.owner.$.itemListPane.$.feedList.refresh();        
            this.owner.$.itemListPane.$.countLabel.setContent(this.getFeedItems().length + " " + $L("items"));
        }
        if (Util.isDebug()) {
            this.log("END");
        }
    },
    
    syncFinished : function( ) {
        if (Util.isDebug()) {
            this.log("START");
        }

    	this.log("clearing interval: " + this.downloadImagesInterval);
        clearInterval( this.downloadImagesInterval );

        localStorage.setItem("syncInProgress", false);
        Settings.getSettings( true );

        for (key in this.getFailedImages()) {
        	var fi = this.getFailedImages()[key];
        	this.getImagesToDownload().push(fi);
        }
        
        localStorage.setItem("imagesToDownload", JSON.stringify(this.getImagesToDownload()) );
        this.setCancelImageDownload( false );

        if (this.getBackground() == false) {
            this.owner.$.itemListPane.$.countLabel.setContent(this.getItemsAll().length + " " + $L("items"));
            // show stored itemlist
            this.owner.showItemsFromStorage();
            this.owner.$.notebookListPane.hideListSpinner();
            this.owner.$.notebookListPane.refreshList();
            this.owner.$.notebookListPane.updateCountLabel();
            if (this.getNotebooks().length > 0 ) {
                if (Util.isDebug()) {
                    this.log("switching to notebook list... :-)");
                }
                this.owner.$.notebookListPane.selectView("feedList");
            } else {
                this.owner.$.notebookListPane.selectView("emptyList");
            }
            if (this.getItemsAll().length > 0 ) {
                if (Util.isDebug()) {
                    this.log("switching to item list... :-)");
                }
                this.owner.$.itemListPane.selectView("feedList");
            } else {
                this.owner.$.itemListPane.selectView("emptyList");
            }
            // this.owner.$.itemListPane.$.feedList.render();        
            // this.owner.$.itemListPane.$.feedList.refresh();        

            this.owner.disableItemListPaneControls( false );
//            this.$.progressDialog.close();
        	this.$.syncDialog.finished();
        } else {
            // restart bg-sync
            var func = enyo.bind(this.scope, this.funcname);
            var value = func();
        }
        if (Util.isDebug()) {
            this.log("END");
        }
    },

    requestThemesSuccess : function( inSender, inResponse, inRequest ) {
        // this.log("START");
        // this.log(enyo.json.stringify(inResponse));
        
        this.setSpringpadThemes([]);
        this.setSpringpadAccents([]);
        
        for (key in inResponse.themes)
        {
            // this.log("themes key: " + key);
            // obj.key = key;
            if (inResponse.themes[key].backgroundPattern !== undefined && inResponse.themes[key].backgroundPattern != null) {
                pos = inResponse.themes[key].backgroundPattern.lastIndexOf("/");
                inResponse.themes[key].backgroundPattern = "images/bg" + inResponse.themes[key].backgroundPattern.substr(pos, inResponse.themes[key].backgroundPattern.length) ;
                // this.log("obj.backgroundPattern: " + obj.backgroundPattern);
            }
            // this.log("themes obj: " + enyo.json.stringify(obj));
            this.getSpringpadThemes().push(inResponse.themes[key]);
        }
        
        if (Util.isDebug()) {
            this.log("saving " + this.getSpringpadThemes().length + " themes...");
        }
//        localStorage.removeItem("springpadThemes");
        localStorage.setItem("springpadThemes", JSON.stringify(this.getSpringpadThemes()));
        

        for (key in inResponse.accents)
        {
            // this.log("accents key: " + key);
            // this.log("accents obj: " + enyo.json.stringify(obj));
            this.getSpringpadAccents().push(inResponse.accents[key]);
        }
        
        if (Util.isDebug()) {
            this.log("saving " + this.getSpringpadAccents().length + " accents...");
        }
//        localStorage.removeItem("springpadAccents");
        localStorage.setItem("springpadAccents", JSON.stringify(this.getSpringpadAccents()));
        
        // var result = ArrayUtils.getThemeByName( this.getSpringpadThemes(), "sienna");
        // this.log( "result: " + enyo.json.stringify(result) );

        // this.log("END");
    },
    
    requestThemesFailure : function( inSender, inResponse, inRequest ) {
        this.error("START");
        this.error(enyo.json.stringify(inResponse));

        this.error("END");
    },    
    
    deleteItem : function( uuid, scope, onSuccessHandler ) {

        this.uuid = uuid;
        this.onSuccessDeleteHandlerScope = scope;
        this.onSuccessDeleteHandler = onSuccessHandler;
        
        data = [];
        step = [];
        step.push("delete");
        step.push(uuid);
        data.push(step);
        
        if (Settings.getSettings().online == true) {
        	// send create data to springpad
            this.$.springpadApi.onFetchSuccess = "deleteItemSuccess";
            this.$.springpadApi.onFetchFailure = "deleteItemFailure";
            this.$.springpadApi.fetchData("users/me/commands", "POST", JSON.stringify(data) );
        } else {
        	// store data offline
        	datanew = data;
        	for (key in datanew) {
            	this.getStoredOffline().push( datanew[key] );
        	}
            // save items to storage
//            localStorage.removeItem("storedOffline");
            localStorage.setItem("storedOffline", enyo.json.stringify(this.getStoredOffline()));
            if (this.item != null) {
                this.updateItemInList( this.item );
            }
            this.deleteItemSuccess( null, { "success" : true } );
        }

    },
    
    deleteItemSuccess : function( inSender, responseText ) {
        // this.log();    
        if (Util.isDebug()) {
            this.log(JSON.stringify(responseText));
        }
        if (this.getBackground() == false) {
            this.owner.$.feedWebViewPane.hideSpinner();
            this.owner.$.itemListPane.stopItemSpinner();        
            this.owner.$.notebookListPane.hideListSpinner();        
        }
        if (responseText.success == true) {
            // this.owner.$.itemListPane.$.feedList.$.scroller.punt();
            if (this.getBackground() == false) {
                this.owner.$.itemListPane.clearSelection();
                this.owner.$.feedWebViewPane.showEmptyPage();
                
                // FIXME use enyo-event!!!
                var func = enyo.bind(this.onSuccessDeleteHandlerScope, this.onSuccessDeleteHandler);
                // the value of this.foo(3)
                func( this.uuid );
  
                // this.loadItemList( );
            }
        }
    },
     
    deleteItemFailure : function( inSender, responseText, inRequest ) {
        this.error(JSON.stringify(responseText));
        this.error(JSON.stringify(inRequest.xhr));
        if (this.getBackground() == false) {
            this.owner.$.feedWebViewPane.hideSpinner();
            this.owner.$.itemListPane.stopItemSpinner();          
            this.owner.$.notebookListPane.hideListSpinner();        
        }
    },
     
    cancelDownloadImages : function ( ) {
        if (Util.isDebug()) {
            this.log();
        }
        this.cancelDownload();
    },
    
    cancelDownload: function() {
        if (Util.isDebug()) {
            this.log("START");
        }
        this.cancel = true;
        this.setCancelImageDownload( true );
        this.setTotalItemsToDownload([]);
        this.setCurrentlyWaiting([]);
        this.setCurrentlyLoading([]);
    	this.log("clearing interval: " + this.downloadImagesInterval);
        clearInterval( this.downloadImagesInterval );
        this.owner.$.notebookListPane.hideListSpinner();
        this.owner.disableItemListPaneControls(false);
//        this.$.progressDialog.resetDialog();            
//        this.$.progressDialog.close();
//    	this.$.syncDialog.update( Const.SYNC_DIALOG_ABORTED );
//    	this.$.syncDialog.abort();
        localStorage.setItem("syncInProgress", false);
//        localStorage.removeItem("imagesToDownload");
        for (key in this.getFailedImages()) {
        	var fi = this.getFailedImages()[key];
        	this.getImagesToDownload().push(fi);
        }
        localStorage.setItem("imagesToDownload", JSON.stringify(this.getImagesToDownload()) );
        Settings.getSettings( true );
        if (this.getItemsAll().length > 0) {
            this.owner.showItemsFromStorage();
        }   
        if (Util.isDebug()) {
            this.log("END");
        }
    },

    deleteDownloadedImages : function() {
        // delete downloaded articles
        this.log("count: " + this.getDownloadedImages().length);
        for (key in this.getDownloadedImages()) {
            var obj = this.getDownloadedImages()[key];
//            this.log("obj: " + JSON.stringify(obj));
            this.$.fileUtils.deleteFile( obj );
        }
        this.setDownloadedImages([]);
        localStorage.setItem("downloadedImages", enyo.json.stringify(this.getDownloadedImages()));
    },

    deleteFile : function( ticket ) {
       this.$.deleteDownloadFile.call({"ticket" : ticket});
    },

    deleteFinished : function( inSender, inResponse ) {
       // this.log("deleteDownloadedFile success, results=" + enyo.json.stringify(inResponse));
    },

    deleteFail : function( inSender, inResponse ) {
       this.error("deleteDownloadedFile failure, results=" + enyo.json.stringify(inResponse));
    },  

    isImageAlreadyDownloaded : function( url ) {
        // this.log("START");
        // this.log("looking for id: " + id);
        var url = StringUtils.getFilenameFromURL( url );
        // this.log("this.getDownloadedArticles().length: " + this.getDownloadedArticles().length);
        for (var key in this.getDownloadedImages()) {
            // this.log("key: " + key);
            // this.log("obj.item_id: " + obj.item_id);
            if (StringUtils.getFilenameFromURL( this.getDownloadedImages()[key] ) == url) {
                // this.log("id: " + id + " has already been downloaded!");
                // this.log("END");
                return true;
            }
        }
        // this.log("id: " + id + " has NOT been downloaded!");
        // this.log("END");
        return false;
    },
    
    isItemCurrentlyDownloading : function( url ) {
        // this.log("START");
        // this.log("url: " + url);
        
        var pos = String(url).lastIndexOf("//");
        var url = StringUtils.getFilenameFromURL(url.substring(pos, url.length));        
        if (Util.isDebug()) {
            this.log("url: " + url);
        }        
        
        for (var key in this.getCurrentlyLoading()) {
            var obj = this.getCurrentlyLoading()[key];
            var pos2 = obj.lastIndexOf("//");
            // this.log("key: " + key);
            var obj = StringUtils.getFilenameFromURL( obj.substring(pos2, obj.length ) );
            if (Util.isDebug()) {
                this.log("obj: " + obj);
            }
            if (obj == url) {
                // this.log("true");
                // this.log("END");
                return true;
            }
        }
        if (Util.isDebug()) {
            this.log("false");
        }
        // this.log("END");
        return false;
    },
    
    isItemCurrentlyWaiting : function( url ) {
        // this.log("START");
        // this.log("index: " + index);
        url = StringUtils.getFilenameFromURL( url );
        for (var key in this.getCurrentlyWaiting()) {
            var obj = this.getCurrentlyWaiting()[key];
            obj = StringUtils.getFilenameFromURL( obj );
            // this.log("obj: " + obj);
            if (obj == url) {
                // this.log("true: " + obj.item_id);
                // this.log("END");
                return true;
            }
        }
        // this.log("item " + index + " is currently not downloading!");
        // this.log("END");
        return false;
    },

    doDownloadImages : function() {
        if (Util.isDebug()) {
            this.log("START");
        }
        for (key in this.getImagesToDownload())
        {
            if (Util.isDebug()) {
                this.log("key: " + key);
            }
            obj = this.getImagesToDownload()[key];
            if (Util.isDebug()) {
                this.log("obj: " + JSON.stringify(obj));
            }
            if (!this.isImageAlreadyDownloaded( obj ) && !this.isItemCurrentlyWaiting( obj )) {
                this.getCurrentlyWaiting().push(obj);
            }
        }
        
        this.setTotalItemsToDownload( this.getCurrentlyWaiting().length );
        if (Util.isDebug()) {
            this.log("currently waiting unique urls: " + this.getTotalItemsToDownload());
        }
        
        if (this.getTotalItemsToDownload() > 0) {
            if (this.getBackground() == true) {
                localStorage.setItem("lastActivity", new Date().getTime());
            }
            if (Util.isDebug()) {
                this.log("starting download images job");
            }
            this.log("this.downloadImagesInterval: " + this.downloadImagesInterval);
            this.downloadImagesInterval = setInterval( enyo.bind(this, this.downloadImages), 1000 );
            this.log("this.downloadImagesInterval: " + this.downloadImagesInterval);
        } else {
            if (this.getBackground() == true) {
                localStorage.setItem("lastActivity", new Date().getTime());
            }
            if (Util.isDebug()) {
                this.log("no images to download...");
            }
            this.syncFinished();
        }
        
        if (Util.isDebug()) {
            this.log("END");
        }
    },
    
    downloadImages : function() {
        // this.log("START");

        if (Util.isDebug()) {
            this.log("currently waiting for downloading images: " + this.getCurrentlyWaiting().length);
            this.log("currently downloading images: " + this.getCurrentlyLoading().length);
            this.log("max simultaneously images: " + this.getCurrentMaxDownloads());
        }

        if (this.getBackground() == true) {
            localStorage.setItem("lastActivity", new Date().getTime());
        }
        
        // if no more items waiting for download -> finished!   
        if ((this.getCurrentlyWaiting().length == 0 && this.getCurrentlyLoading().length == 0) || (this.getCurrentlyLoading().length == 0 && this.getCancelImageDownload() == true)) {
            if (Util.isDebug()) {
                this.log("finished!");
            }
        	this.log("clearing interval: " + this.downloadImagesInterval);
            clearInterval( this.downloadImagesInterval );
            if (this.getBackground() == false) {
                this.owner.$.notebookListPane.hideListSpinner();
                this.owner.disableItemListPaneControls(false);
//                this.$.progressDialog.resetDialog();            
//                this.$.progressDialog.close();
            }
            localStorage.setItem("syncInProgress", false);
            Settings.getSettings( true );
            if (this.background == true && this.funcname !== undefined && this.scope !== undefined) {
                if (Util.isDebug()) {
                    this.log("there is some unfinished business to do... ;-)");
                }
                // a function that binds this to this.foo
                var func = enyo.bind(this.scope, this.funcname);
                // the value of this.foo(3)
                var value = func( true );
            }
            
            // FIXME anzahl der objekte wird benötigt!!!
            this.syncFinished();
            // this.log("END");
            return;
        }
        
        
        if (this.getCurrentlyLoading().length >= this.getCurrentMaxDownloads()) {
            if (Util.isDebug()) {
                this.log("waiting another " + this.getMillisToWait() + " ms. returning!")
            }
            return;
        }

        if (this.getBackground() == false) {
//            this.owner.$.notebookListPane.showListSpinner();
            this.owner.disableItemListPaneControls(true);
        }
        
        if (this.getCurrentlyLoading().length < this.getCurrentMaxDownloads() && this.getCurrentlyWaiting().length == 0 && this.getCurrentlyLoading().length > 0) {
            if (Util.isDebug()) {
                this.log("no more images waiting, waiting for current downloads to be finished!");
            }

            var total = this.getTotalItemsToDownload();
            var sum = this.getCurrentlyWaiting().length + this.getCurrentlyLoading().length;
            var actual = total - sum;
            if (actual < 0) {
                actual = 0;
            }
//            if (this.getBackground() == false) {
                // this.owner.showProgressPopup( "2", "Downloading new articles", 100 / total * actual, actual, total, false, "cancelDownloadArticles" );
//                this.showProgressPopup( $L("Downloading new images"), Math.round(100 / Number(total) * Number(actual)), Number(actual), Number(total), false, "cancelDownloadImages", this );
//            }
        }
        
        while (this.getCurrentlyLoading().length < this.getCurrentMaxDownloads() && this.getCurrentlyWaiting().length > 0  && this.getCancelImageDownload() == false) {

            if (Util.isDebug()) {
                this.log("download new image!");
            }

            var waitingItem = this.getCurrentlyWaiting()[0];
            if (waitingItem === undefined || waitingItem == "undefined") {
                this.error("waitingItem == undefined");
                ArrayUtils.removeElementByItemId( this.getCurrentlyWaitingImages(), 0);
                return;
            }
            ArrayUtils.removeElement( this.getCurrentlyWaiting(), waitingItem);
            if (Util.isDebug()) {
                this.log("add to currently loading: " + waitingItem);
            }
            this.getCurrentlyLoading().push(waitingItem);

            this.$.fileUtils.onLoadFileSuccess = "loadImageSuccess";
        	this.$.fileUtils.onLoadFileFailure = "loadImageFailure";
        	this.$.fileUtils.downloadFileFromURL( waitingItem, Constants.DOWNLOAD_TYPE_APP_IMAGE );

        	
            if (Util.isDebug()) {
            	this.log("currently downloading images: " + this.getCurrentlyLoading().length);
            }
            
            var total = this.getTotalItemsToDownload();
            var sum = this.getCurrentlyWaiting().length + this.getCurrentlyLoading().length;
            var actual = total - sum;
            if (actual < 0) {
                actual = 0;
            }
            if (this.getBackground() == true) {
                localStorage.setItem("lastActivity", new Date().getTime());
            } else if (this.getBackground() == false) {
                // this.owner.showProgressPopup( "2", "Downloading new articles", 100 / total * actual, actual, total, false, "cancelDownloadArticles" );
//                this.showProgressPopup( $L("Downloading new images"), Math.round(100 / Number(total) * Number(actual)), Number(actual), Number(total), false, "cancelDownloadImages", this );
            }
        }

        // this.log("END");
    },
    
    updateData : function( data, item, scope, what ) {
        if (this.getBackground() == false) {
            if (Util.isDebug()) {
                this.log("showing progress dialog...");
            }
//            this.showProgressPopup( $L("Storing Data"), 10, "unknown", "unknown", false );
            this.$.syncDialog.openAtCenter();
            this.$.syncDialog.resetDialog();
        	this.$.syncDialog.update( Const.SYNC_DIALOG_STORING_LOCAL_DATA );
        }
//        if (Util.isDebug()) {
//            this.log("item: " + JSON.stringify(item));
//        }
        this.what = what;

        if (Util.isDebug()) {
            this.log("data: " + JSON.stringify(data));
        }
        var tmp = data.indexOf("\"set\"");
//        if (Util.isDebug()) {
//            this.log("tmp: " + tmp);
//        }
        if (tmp != -1) {
            this.funcname = "onSaveResult";
            this.scope = scope;
        }
        
        this.item = item;
        if (Settings.getSettings().online == true) {
        	// send update data to springpad
            this.$.springpadApi.onFetchSuccess = "updateSuccess";
            this.$.springpadApi.onFetchFailure = "updateFailure";
            this.$.springpadApi.fetchData("users/me/commands", "POST", data );
        } else {
        	// store data offline
        	datanew = JSON.parse(data);
        	for (key in datanew) {
            	this.getStoredOffline().push( datanew[key] );
        	}
            // save items to storage
//            localStorage.removeItem("storedOffline");
            localStorage.setItem("storedOffline", enyo.json.stringify(this.getStoredOffline()));
        	for (key in this.getStoredOffline()) {
            	this.log("stored: " + this.getStoredOffline()[key] );
        	}
        	enyo.asyncMethod( this, this.updateItemInList, this.item );
            this.updateSuccess( null, { "success" : true } );
        }
    },
    
    updateSuccess : function( inSender, responseText ) {
        // this.log();    
        if (Util.isDebug()) {
            this.log(JSON.stringify(responseText));
        }
        // if (this.getBackground() == false) {
            // this.owner.$.feedWebViewPane.hideSpinner();
        // }
        if (responseText.success == true && this.what != "notebook") {
            // update item in localStorage
        	enyo.asyncMethod( this, this.updateItemInList, this.item );
        }
        if (this.funcname !== undefined && this.scope !== undefined) {
            // a function that binds this to this.foo
            var func = enyo.bind(this.scope, this.funcname );
            // the value of this.foo(3)
            var value = func( responseText.success, responseText.errors, this.what );
        }
    },
     
    updateFailure : function( inSender, responseText, inRequest ) {
        this.error(JSON.stringify(responseText));
        this.error(JSON.stringify(inRequest.xhr));
        // if (this.getBackground() == false) {
            // this.owner.$.feedWebViewPane.hideSpinner();
        // }
        if (this.funcname !== undefined && this.scope !== undefined) {
            // a function that binds this to this.foo
            var func = enyo.bind(this.scope, this.funcname );
            // the value of this.foo(3)
            var value = func( false, responseText.errors );
        }
    },
    
    updateItemInList : function ( inItem ) {
        if (Util.isDebug()) {
            this.log("START");
        }
        if (this.getBackground() == false) {
//            if (Util.isDebug()) {
//                this.log("showing progress dialog...");
//            }
//            this.showProgressPopup( $L("Storing Data"), 50, "unknown", "unknown", false );
        }
        item = ArrayUtils.getElementFromArrayById( this.getItemsAll(), inItem.uuid );
//      if (Util.isDebug()) {
//          this.log("item: " + JSON.stringify(item));
//      }
      if (item !== undefined && item !== null) {
            // item aus der liste entfernen
            if (Util.isDebug()) {
                this.log("found item, remove it from local storage...");
            }
            ArrayUtils.removeElement( this.getItemsAll(), item);
            
            now = Math.round(new Date().getTime() / 1000);

            if (Util.isDebug()) {
                this.log("item.title: " + inItem.name);
            }
            // item.time_updated = now;
            
            // item neu in die liste packen
            if (Util.isDebug()) {
                this.log("adding item: " + inItem.name);
            }
            this.getItemsAll().push(inItem);

            this.setItemsAll( ArrayUtils.sortSpringpadData( this.getItemsAll(), Settings.getSettings().sortOrder ) );
    
            // save itemlist
            this.storeItemsAll();

	        item = ArrayUtils.getElementFromArrayById( this.getFeedItems(), inItem.uuid );
	        if (item !== undefined) {
	            // item aus der liste entfernen
	            if (Util.isDebug()) {
	                this.log("found item, remove it from local storage...");
	            }
	            if (ArrayUtils.removeElement( this.getFeedItems(), item) == true) {
		            now = Math.round(new Date().getTime() / 1000);
		
		            if (Util.isDebug()) {
		                this.log("item.title: " + inItem.name);
		            }
		            // item.time_updated = now;
		            
		            // item neu in die liste packen
		            this.getFeedItems().push(inItem);
		
		            this.setFeedItems( ArrayUtils.sortSpringpadData( this.getFeedItems(), Settings.getSettings().sortOrder ) );
		            this.owner.$.itemListPane.refresh();
	            }
	        }
        
        } else {
//            this.error("item not found with uuid: " + inItem.uuid );
            if (Util.isDebug()) {
                this.log("item not found, adding it to local storage...");
            }
            // item neu in die liste packen
            if (Util.isDebug()) {
                this.log("updating item: " + inItem.name);
            }
            this.getItemsAll().push(inItem);

            this.setItemsAll( ArrayUtils.sortSpringpadData( this.getItemsAll(), Settings.getSettings().sortOrder ) );
    
            // save itemlist
            this.storeItemsAll();
            
            this.owner.$.itemListPane.refresh();
        }
        if (this.getBackground() == false) {
            if (Util.isDebug()) {
                this.log("closing progress dialog...");
            }
        	this.$.syncDialog.abort();
        }
        if (Util.isDebug()) {
            this.log("END");
        }
    },
    
    createData : function( data, item, scope, what ) {
        this.funcname = "onCreateResult";
        this.scope = scope;
        this.what = what;
        this.item = item;
        if (Util.isDebug()) {
        	this.log("this.funcname: " + this.funcname);
        	this.log("this.scope: " + this.scope);
            this.log("this.what: " + this.what);
            this.log("this.item: " + JSON.stringify(this.item));
        }

        // this.item = item;
        
        if (Settings.getSettings().online == true) {
        	// send create data to springpad
            this.$.springpadApi.onFetchSuccess = "createSuccess";
            this.$.springpadApi.onFetchFailure = "createFailure";
            this.$.springpadApi.fetchData("users/me/commands", "POST", data );
        } else {
        	// store data offline
        	datanew = JSON.parse(data);
        	for (key in datanew) {
            	this.getStoredOffline().push( datanew[key] );
        	}
            // save items to storage
//            localStorage.removeItem("storedOffline");
            localStorage.setItem("storedOffline", enyo.json.stringify(this.getStoredOffline()));
            if (this.item != null) {
                this.updateItemInList( this.item );
            }
            this.createSuccess( null, { "success" : true } );
        }
    },
    
    createSuccess : function( inSender, responseText ) {
        if (Util.isDebug()) {
            this.log("this.what: " + this.what);    
            this.log("this.item: " + JSON.stringify(this.item));
            this.log(JSON.stringify(responseText));
        }
        // if (this.getBackground() == false) {
            // this.owner.$.feedWebViewPane.hideSpinner();
        // }
        if (responseText.success == true) {
            // TODO: create local item
            if (this.item != null) {
                this.updateItemInList( this.item );
            }
        }
        if (this.funcname !== undefined && this.scope !== undefined) {
            // a function that binds this to this.foo
            var func = enyo.bind(this.scope, this.funcname );
            // the value of this.foo(3)
            var value = func( responseText.success, responseText.errors, this.what );
        }
    },
     
    createFailure : function( inSender, responseText, inRequest ) {
        this.error(JSON.stringify(responseText));
        this.error(JSON.stringify(inRequest.xhr));
        // if (this.getBackground() == false) {
            // this.owner.$.feedWebViewPane.hideSpinner();
        // }
        if (this.funcname !== undefined && this.scope !== undefined) {
            // a function that binds this to this.foo
            var func = enyo.bind(this.scope, this.funcname );
            // the value of this.foo(3)
            var value = func( false, responseText.errors );
        }
    },

   closeDialog : function() {
       if (Util.isDebug()) {
           this.log();
       }
       this.$.failureDialog.close();  
       this.syncFinished();
   },
   
    showProgressPopup : function ( caption, pos, number, total, finished, func ) {
        // this.log("pos: " + pos);
//        if (this.$.progressDialog === undefined || this.$.progressDialog == null) {
//        	this.log("creating new progress dialog component");
//        	this.$.progressDialog = this.createComponent( {name: "progressDialog", kind: "ProgressDialog"}, {owner: this} );
//        	this.render();
//        }
//        this.$.progressDialog.openAtCenter();  
//        this.$.progressDialog.updateProgress( caption, pos, number, total, finished, func );
    },
    
    callbackBackup: function (inType, inResponse) {
        if (Util.isDebug()) {
            this.log("RESPONSE:", inResponse);
        }
        if (inResponse.returnValue) {
            enyo.windows.addBannerMessage($L("Backuped") + " " + inType, enyo.json.stringify({}));
        }
    },
    
    checkOnlineState : function() {
        this.$.getIP.call();
    },
    
    startCheckOnlineStateJob : function() {
    	if (Platform.isWebOS()) {
    		return;
    	}
        if (Util.isDebug()) {
            this.log();
        }
    	this.changeOnlineState( false );
        this.checkOnlineState();
        this.checkInterval = setInterval( enyo.bind(this, this.checkOnlineState), 30000 );
    },
    
    receivedIP : function( sender, response ) {
    	this.log();
        ip = response.ip;
        if (ip !== undefined) {
        	if (Settings.getSettings().online == false) {
                this.changeOnlineState( true );
        	}
        } else {
        	this.error();
        	if (Platform.isBrowser() == true) {
                if (Util.isDebug()) {
                    this.log("browser detected")
                }
                var inResponse = { "isInternetConnectionAvailable": true };
                this.changeOnlineState( true );
            } else if (Platform.isPlaybook()) {
                var conn = blackberry.system.hasDataCoverage();
                this.changeOnlineState( conn );
            }
        }
    },
    
    failedIP : function() {
    	this.error();
    	if (Platform.isBrowser() == true) {
            if (Util.isDebug()) {
                this.log("browser detected")
            }
            var inResponse = { "isInternetConnectionAvailable": true };
            this.changeOnlineState( true );
        } else if (Platform.isPlaybook()) {
            var conn = blackberry.system.hasDataCoverage();
            this.changeOnlineState( conn );
        }
    },
    
    changeOnlineState : function( online ) {
        if (Util.isDebug()) {
            this.log("client is now: " + (online == false ? "offline!" : "online!"));
        }
    	
    	localStorage.setItem("online", online);
    	Settings.getSettings( true );

        if (this.owner.$.itemListPane) {
        	this.owner.$.itemListPane.setOnline( online );
        }

        if (this.owner.$.notebookListPane) {
        	this.owner.$.notebookListPane.setOnline( online );
        }
    },

    processOfflineData : function( refresh) {
        if (Util.isDebug()) {
            this.log("START");
        }
        this.refresh = refresh;
        
//        this.log(this.getStoredOffline().length);
        if (this.getStoredOffline().length == 0) {
            if (Util.isDebug()) {
                this.log("nothing to do...");
            }
            if (refresh == true) {
                this.loadItemList( false );
            }
        } else {
            // send data to springpad
            if (Util.isDebug()) {
                this.log("data to be stored to springpad: " + JSON.stringify(this.getStoredOffline()));
            }
            this.$.springpadApi.onFetchSuccess = "postOfflineSuccess";
            this.$.springpadApi.onFetchFailure = "postOfflineFailure";
            this.$.springpadApi.fetchData("users/me/commands", "POST", JSON.stringify(this.getStoredOffline()) );

//            this.setStoredOffline([]);
//            localStorage.removeItem("storedOffline");
        }

        if (Util.isDebug()) {
            this.log("END");
        }
    },
    
    postOfflineSuccess : function( inSender, responseText ) {
        if (Util.isDebug()) {
            this.log(JSON.stringify(responseText));
        }
        if (responseText.success == true) {
        	// everything is fine and as expected
            this.setStoredOffline([]);
            localStorage.removeItem("storedOffline");
            this.$.offlineSuccessDialog.openAtCenter();
        } else {
        	// something went wrong :(
            this.$.offlineFailureDialog.openAtCenter();
        }
    },
     
    postOfflineFailure : function( inSender, responseText, inRequest ) {
        this.error(JSON.stringify(responseText));
        this.error(JSON.stringify(inRequest.xhr));
    	// something went wrong :(
        this.$.offlineFailureDialog.openAtCenter();
    },

    closeSuccessDialog : function() {
        this.$.offlineSuccessDialog.close();
        if (this.refresh == true) {
            this.loadItemList( false );
            this.refresh = false;
        }
    },
    
    closeFailureDialog : function() {
        this.$.offlineFailureDialog.close();
        if (this.refresh == true) {
            this.loadItemList( false );
            this.refresh = false;
        }
    },

    updateOrInsertItem : function( inItem ) {
    	if (inItem.uuid === undefined || inItem.uuid == "undefined") {
    		return;
    	}
        item = ArrayUtils.getElementFromArrayById( this.getItemsAll(), inItem.uuid );
        if (item !== undefined && item != null && item != "undefined") {
            if (Util.isDebug()) {
                this.log("removing item: " + inItem.uuid);
            }
            ArrayUtils.removeElement( this.getItemsAll(), item);
        }
        if (Util.isDebug()) {
            this.log("inserting item: " + inItem.uuid);
        }
        this.getItemsAll().push(inItem);
    },

    loadImageSuccess : function( inSender, url, targetFilename, fullPath, ticket) {
		this.log("fullPath: " + fullPath);
		if (ArrayUtils.isElementInArray(this.getCurrentlyLoading(), url) 
				&& ArrayUtils.isElementInArray(this.getImagesToDownload(), url)) {
			this.saveDownloadedImage( targetFilename, fullPath, (ticket !== undefined ? ticket : 0) );
			this.removeCurrentItem( true );
		} else {
			this.error("deleting downloaded image, because an error occured: " + targetFilename);
			this.$.fileUtils.deleteFile({"file": targetFilename});
			this.removeCurrentItem( true );
		}
		this.log("finished image!");
    },
    
    loadImageFailure : function( inSender, url, targetFilename, result ) {
		if (result !== undefined && result != null) {
			this.error("Error code: " + result.code);
			this.error("HTTP status: " + result.http_status);
			this.error("Source: " + result.source);
			this.error("Target: " + result.target);
		}
		// something went wrong :-(
		// remove from array of currently downloading items
		var targetFilename = StringUtils.getFilenameFromURL(url);
		this.error("download of image failed: " + targetFilename + "");
		this.removeCurrentItem( false );
    },
    
    removeCurrentItem : function( success) {
        if (Util.isDebug()) {
            this.log();
        }
		// remove from array of currently downloading items
		this.getCurrentlyLoading().splice(0, 1);

		if (success) {
			this.getImagesToDownload().splice(0, 1);
		} else {
			// re-add it to images to download, but at the end of the list 
			// and only if not tried before
			var downloadItem = this.getImagesToDownload()[0];
			this.getImagesToDownload().splice(0, 1);
			
			if (!ArrayUtils.isElementInArray(this.getFailedImages(), downloadItem)) {
		        if (Util.isDebug()) {
		            this.log("try the following url to download again later: " + downloadItem);
		        }
		        this.getFailedImages().push( downloadItem );
				this.getImagesToDownload().push( downloadItem );
				if (Util.isDebug()) {
					this.log("this.getFailedImages().length: " + this.getFailedImages().length);
				}
			}
		}
    },
    
    saveDownloadedImage : function( filename, fullpathFilename, ticket ) {
    	this.log("filename: " + filename);
    	this.log("fullpathFilename: " + fullpathFilename);
    	this.log("ticket: " + ticket);
		// save item
		var item = {
			"targetFilename" : filename,
			"file" : fullpathFilename,
			"ticket" : (ticket !== undefined ? ticket : 0),
		};
		this.log("saving item: " + JSON.stringify(item) );
		this.getDownloadedImages().push(item);
		localStorage.removeItem("downloadedImages");
		localStorage.setItem("downloadedImages", enyo.json.stringify(this.getDownloadedImages()));
		this.log("downloaded image: " + this.getDownloadedImages().length + " (" + filename + ")");
        this.$.syncDialog.update( Const.SYNC_DIALOG_DOWNLOADING_IMAGES, null, this.getDownloadedImages().length );
    },

});

