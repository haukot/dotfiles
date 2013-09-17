enyo.kind({
    name : "NotebookList",
    kind : enyo.SlidingView,
    layoutKind : enyo.VFlexLayout,
    components : [
        {name: "headerToolbar", kind: "Toolbar", pack : "justify", style : "max-height: 57px;", components: [
            {name: "menuButton", kind: "IconButton", className: "enyo-button-dark", depressed: false, down: false, toggling: false, icon : "images/settings.png", onclick: "showMenuDialog" },
            {name: "infoButton", kind: "IconButton", className: "enyo-button-dark", depressed: false, down: false, toggling: false, icon : "images/info.png", onclick : "showInfo", align: "left"},
            {flex : 1},
            {kind: enyo.Spinner, name: "listSpinner"},
            {name: "editButton",      kind: "IconButton", className: "enyo-button-dark", style: "margin-top: 7px; height: 20px;", depressed: false, down: false, toggling: false, icon : "images/edit.png",      align: "right", onclick: "editItem"},
            {name: "deleteButton",    kind: "IconButton", className: "enyo-button-negative", style: "margin-top: 7px; height: 20px;", depressed: false, down: false, toggling: false, icon : "images/delete.png", align: "right", onclick: "showDeleteItem"},
            // {name: "lastSyncLabel", content: "", kind: enyo.HtmlContent, style : "color: #FFFFFF; font-size: 16px; margin-left: 0px; padding-left: 5px;"},
        ]},
        {kind: "Pane", name: "contentPane", flex: 1, transitionKind: enyo.transitions.Simple, style: "background-color: white; ", components: [
            /*{name: "scroller", kind: enyo.Scroller, flex : 1, components : [*/
                {name : "feedList", kind : (Platform.isBrowser() ? "ekl.List.VirtualList" : "enyo.VirtualList"), onSetupRow : "getItem", onclick : "doListTap", components : [
                    {name : "feedItem", className: Util.getClassName("feeditem"), kind: (Platform.isWebOS() ? "SwipeableItem" : "Item"), onDrag: "dragstartHandler", onSwipe: "onSwipe", onConfirm: "deleteItem", cancelCaption: $L("Cancel "), confirmCaption: $L("Delete nb?"), tapHighlight : true, layoutKind: "HFlexLayout", components: [
                        {name : "caption", kind: enyo.HtmlContent, content : "",  style: "font-size: 0.9em; padding: 0px; margin-right: 10px;" },
                        {name : "additionalCaption", kind: enyo.HtmlContent, content : "",  style: "color: grey; font-size: 0.7em; padding: 0px; margin-right: 10px; margin-top: 3px; text-overflow:ellipsis; overflow:hidden; white-space: nowrap; height: 18px;"},
                        {flex : 1},
                        {kind: enyo.Spinner, name: "itemSpinner", style: "width: 10px, height: 10px"},
                        {name: "groupimage", kind: enyo.HtmlContent, allowHtml: true},
                    ]}             
                ]},
            /*]}, */
            {name: "emptyList", kind: "HFlexBox", align: "center", pack: "top", components: [
                {kind: (Platform.isWebOS() && !Platform.isTouchpadOrPre3() ? enyo.Scroller : null), flex: 1, height: "280px", autoHorizontal: false, horizontal: false, components: [
                    {content: $L("<b>No notebooks found!</b>") ,
                        style: "text-align: center; margin: 10px;",
                        className: "enyo-text-body"},
                    {content: $L("Do you have already synced? If not, hit the refresh-icon at the bottom of this list."),
                        style: "text-align: center; margin: 10px;",
                        className: "enyo-text-body"},
                    {content: $L("If you have already synced then try to add a new object via the add-icon at the bottom of this list."),
                        style: "text-align: center; margin: 10px;",
                        className: "enyo-text-body"},
                    {content: $L("For more informations go to the menu and click on 'Help'."),
                        style: "text-align: center; margin: 10px;",
                        className: "enyo-text-body"},
                ]}, 
            ]}
        ]}, 
        {name: "footerToolbar", kind: "Toolbar", pack : "justify", style : "max-height: 57px;", components: [
            {name: "countLabel", kind: enyo.HtmlContent,style : "color: #FFFFFF; font-size: 16px; margin-left: 0px; padding-left: 5px;"},
            {flex : 1},
            {kind: "IconButton", className: "enyo-button-dark", style: "margin-top: 7px; height: 20px;", depressed: false, down: false, toggling: false, name: "addButton", icon : "images/add.png", onclick : "doAddItem", align : "right"},
            {kind: "IconButton", className: "enyo-button-dark", style: "margin-top: 7px; height: 20px;", depressed: false, down: false, toggling: false, name: "refreshButton", icon : "images/sync.png", onclick : "doRefreshTap", align : "right"},
            (Platform.isTouchpad() == false ?  
            {flex : 1} : null), 
        ]},
        {name: "createNotebookDialog", kind: "CreateNotebookDialog"},
        {name: "infoDialog", kind: "InfoDialog"},
        {kind: "ModalDialog", name: "deleteDialog", caption: $L("Delete Notebook"), components:[
             {content: $L("Are you sure you want to delete this notebook (the items will not be deleted!)?"), className: "enyo-paragraph"},
             {layoutKind: "HFlexLayout", components: [
                 {kind: "Button", caption: $L("Cancel "), flex: 1, onclick: "closeDialog"},
                 {kind: "ActivityButton", caption: $L("Delete"), flex: 1, className: "enyo-button-negative", onclick: "deleteItem"},
             ]}
        ]},
        {kind: "ModalDialog", name: "notYetDialog", caption: $L("Calm down..."), components:[
             {content: $L("This dialog is not implemented yet, sorry..."), className: "enyo-paragraph"},
             {layoutKind: "HFlexLayout", components: [
                 {kind: "Button", caption: $L("Ok "), flex: 1, onclick: "closeNotYetDialog"},
             ]}
        ]},
    ],
    events : {
        "onListTap" : "",
        "onRefreshTap" : "",
    },
    
    published: {
        selectedObj: null
    },
    
    create : function( ) {
        if (Util.isDebug()) {
            this.log();
        }
        this.inherited(arguments);
        if (Platform.isVeer()) { // only veer and other devices
            this.$.headerToolbar.applyStyle( "-webkit-border-image", "none !important");
            this.$.footerToolbar.applyStyle( "-webkit-border-image", "none !important");
            this.$.feedList.$.scroller.setAccelerated( false );
        }
        if (!Platform.isTouchpad() && !Platform.isBlackBerry()) { 
            this.$.feedList.$.scroller.setAccelerated( false );
        }
        if (Platform.isWebOS()) {
            this.$.menuButton.hide();
        }
    },
    
    rendered : function( ) {
        this.inherited(arguments);
        if (Util.isDebug()) {
            this.log("START");
        }
        // this.$.addButton.setDisabled(!Settings.getSettings().online);
                 
        if (Settings.getSettings().username != "" && Settings.getSettings().password != "") {
            this.$.refreshButton.setDisabled(!Settings.getSettings().online);
        }
        this.updateCountLabel(); 
        this.$.feedList.$.scroller.punt();
        this.calculateButtons();
        if (Util.isDebug()) {
            this.log("END");
        }
    },
    
    updateCountLabel : function() {
        notebookCount = this.owner.$.dataManager.getNotebooks().length;
        notebookLabel = $L("Notebooks");
        if (notebookCount == 1) {
            notebookLabel = $L("Notebook");
        }
        this.$.countLabel.setContent( notebookCount + " " + notebookLabel );
    },
    
    doListTap: function( inSender, inEvent ) {

        if (this.isScrolling == true || this.dragging == true || enyo.application.AndroidScrollHack == true) {
            // this.log("returning...");
            return;
        }

        if (Util.isDebug()) {
            this.log("START");
        }
        // this.log("doListTap()");
        
        if (inEvent !== undefined) {
            if (Util.isDebug()) {
                this.log(" -> clicked item #" + inEvent.rowIndex);
            }
            this.selectedRow = inEvent.rowIndex;
            this.selectedObj = this.owner.$.dataManager.getNotebooks()[inEvent.rowIndex];

            if(this.selectedObj) {
                // this.log("this.selectedObj.name: " + this.selectedObj.name);
                listtapUuid = "All_My_Stuff";
                if (this.selectedObj.uuid) {
                    listtapUuid = StringUtils.getValueFromString( this.selectedObj.uuid );
                }
                if (Util.isDebug()) {
                    this.log("listtapUuid: " + listtapUuid);
                }
                
                // store filter
                localStorage.removeItem("notebook");     
                localStorage.setItem("notebook", listtapUuid);
                Settings.getSettings(true);
                
                this.calculateButtons();
                
                this.$.itemSpinner.show();
                this.$.feedList.refresh();
                // this.clearItemList();
                // select items
                enyo.nextTick( this, this.loadNotebookItems() );
                enyo.nextTick( this, this.owner.$.itemListPane.renderAndRefresh() );
                enyo.nextTick( this, this.owner.$.feedWebViewPane.showEmptyPage() );

                if (Platform.isHandy() || (!Platform.isTablet() && Platform.isPortraitMode() && Settings.getSettings().maximizeView == true) || (Platform.isPlaybook() && Platform.isPortraitMode())) {
                    this.owner.zoomInItemListPanel();
                }
                
}
        } else {
            this.error("inEvent is undefined!");
        }
        if (Util.isDebug()) {
            this.log("END");
        }
    },
    
    calculateButtons : function() {
        if (Settings.getSettings().notebook == "All_My_Stuff") {
            if( this.$.editButton.getShowing( ) == true ) {
                this.$.editButton.hide(); 
            }
            if( this.$.deleteButton.getShowing( ) == true ) {
                this.$.deleteButton.hide(); 
            }
        } else {
            if( this.$.editButton.getShowing( ) == false ) {
                this.$.editButton.show(); 
            }
            if (Settings.getSettings().hideDelete == false) {
                if( this.$.deleteButton.getShowing( ) == false ) {
                    this.$.deleteButton.show(); 
                }
            } else {
                if( this.$.deleteButton.getShowing( ) == true ) {
                    this.$.deleteButton.hide(); 
                }
            }
        }
    },
    
    clearItemList : function() {
        this.owner.$.itemListPane.$.feedList.$.scroller.punt();
        this.owner.$.dataManager.setFeedItems([]);
        this.owner.$.itemListPane.renderAndRefresh();
    },
    
    loadNotebookItems : function() {
        this.owner.$.itemListPane.$.searchBox.setValue("");
        // this.owner.$.dataManager.getFeedItemsByStateAndTag( Settings.getSettings().notebook, Settings.getSettings().filterTags, Settings.getSettings().filterType, true );
        this.owner.$.dataManager.loadItems( Settings.getSettings().notebook, Settings.getSettings().filterTags, Settings.getSettings().filterType );
        this.$.feedList.prepareRow( this.selectedRow );
        this.$.itemSpinner.hide();
        this.$.feedItem.render(); 
    },
    
    getItem : function( inSender, inIndex ) {
        // this.log("START");
        // this.log("inIndex: " + inIndex);

        if (inIndex >= this.owner.$.dataManager.getNotebooks().length || inIndex < 0) {
            // this.log("END");
            // this.log("aha2");
            return false;
        }

        // check if the row is selected
        isNotebookSelected = false;
        getitemObj = this.owner.$.dataManager.getNotebooks()[inIndex];
        if (getitemObj.uuid) {
            getitemUuid = StringUtils.getValueFromString( getitemObj.uuid );
            // this.log("Settings.getSettings().notebook: " + Settings.getSettings().notebook);
            // this.log("uuid: " + uuid);
            isNotebookSelected = (Settings.getSettings().notebook == getitemUuid);
        } else {
            isNotebookSelected = (Settings.getSettings().notebook == "All_My_Stuff");
        }

        // format the colors 
        if (getitemObj) {
            if (isNotebookSelected == false) {
                // this.log("nein...");
                this.$.feedItem.removeClass("item-selected");
                this.$.feedItem.addClass("item-not-selected");
            } else if (isNotebookSelected == true) {
                // this.log("ja!");
                this.$.feedItem.removeClass("item-not-selected");
                this.$.feedItem.addClass("item-selected");
            }

            this.setFeedItemAccent( getitemObj );                 
            
            getitemCaption = (getitemObj.name != "All My Stuff" ? getitemObj.name : $L("All My Stuff"));
            this.$.caption.setContent( getitemCaption );
            
            getitemCount = 0;
            if (getitemObj.properties) {
                getitemCount = (getitemObj.properties["/workbook/block_count"] !== undefined ? getitemObj.properties["/workbook/block_count"] : 0);
            } else if (getitemObj.name == "All My Stuff") {
                getitemCount = this.owner.$.dataManager.getItemsAll().length
            }
            this.$.additionalCaption.setContent( "(" + getitemCount + ")" );
            
            getitemCollab = "";
            // is notebook collab?
            if (getitemObj.properties) {
                // this.log("inRecord.name: " + inRecord.name);
                if (getitemObj.properties["/collab/members"] !== undefined) {
                    // this.log("tmp: " + JSON.stringify(tmp));
                    // this.log("setting group icon...");
                    getitemCollab = "<img border=0 src='images/group.png' />"; 
                    this.$.groupimage.setContent(getitemCollab);
                } else {
                    this.$.groupimage.setContent("");
                }
            } else {
                    this.$.groupimage.setContent("");
            }
            
            this.$.feedItem.render();
            // this.log("END");
            return true;
        }

        // this.log("END");
        return false;
    },
    
    setFeedItemAccent : function( item ) {
        itemaccent = "";
        if (item.properties !== undefined && item.properties.accent !== undefined) {
            itemaccent = item.properties.accent;
        }

        accent = ArrayUtils.getAccentByName( this.owner.$.dataManager.getSpringpadAccents(), itemaccent);

        this.$.feedItem.applyStyle( "border-left", "5px solid " + accent.backgroundColor );
    },
    
    doRefreshTap : function( ) {
        if (Util.isDebug()) {
            this.log("START");
        }
        if (Settings.getSettings().online == true || this.owner.getCalledFromExtern() == true) {
            this.$.feedList.$.scroller.punt();
//            this.showListSpinner();
            // enyo.nextTick( this, this.clearItemList );
            enyo.nextTick( this.owner, this.owner.refreshFeedItemsListLite() );
        }
        if (Util.isDebug()) {
            this.log("END");
        }
    },

    hideListSpinner: function( ) {
        // this.log("START");
        if( this.$.listSpinner.getShowing( ) == true ) {
            this.$.listSpinner.hide(); 
        }
        // this.log("END");
    },
    
    showListSpinner: function( ) {
        // this.log("START");
        // this.log();
        if( this.$.listSpinner.getShowing( ) == false ) {
            this.$.listSpinner.show(); 
        }
        // this.log("END");
    },
    
    selectView : function( name ) {
        if (Util.isDebug()) {
            this.log("selecting view: " + name);
        }
        this.$.contentPane.selectViewByName( name, true );   
        // this.$.feedList.render(); 
        this.$.feedList.refresh();
    },
    
    refreshList : function() {
        this.$.feedList.refresh();
    },
    
    doAddItem : function() {
        if (Util.isDebug()) {
            this.log();
        }
        this.$.createNotebookDialog.openAtCenter();    
        this.$.createNotebookDialog.clearDialog();
        this.$.createNotebookDialog.setData( this.owner.$.dataManager.getSpringpadAccents() );
        this.$.createNotebookDialog.setFuncName( "createNewNotebook" );
        this.$.createNotebookDialog.setScope( this );
    },
    
    createNewNotebook : function( inValue, accent, uuid, pub ) {
        if (Util.isDebug()) {
            this.log("START");
            this.log("inValue: " + inValue);
            this.log("accent: " + accent);
            this.log("pub: " + pub);
        }
        
        // add notebook if not already exists
        var alreadyExists = false;
        var existingUuid = null;
        if (uuid !== undefined && uuid != null) {
            existingUuid = StringUtils.getValueFromString( uuid );
            if (Util.isDebug()) {
                this.log("existingUuid: " + existingUuid);
            }
            if (existingUuid != null) {
                alreadyExists = true;
            }
            if (Util.isDebug()) {
                this.log("existingUuid: " + existingUuid);
            }
        }
        if (Util.isDebug()) {
            this.log("alreadyExists: " + alreadyExists );
        }
        
        if (!alreadyExists) {
            uuid = Util.createUuid();

            var newUuid = "/UUID(" + uuid + ")/";
            // var result = "[[\"create\", \"Workbook\", \"" + newUuid + "\"],";
            // result += "[\"set\", \"name\", \"" + inValue + "\" ]";

            var result = [];
            var step = [];

            step.push("create", "Workbook", newUuid);
            result.push( step );

            step = [];
            step.push("set", "name", inValue);
            result.push( step );

            if (accent !== undefined && accent != null && accent != "standard") {
                // result += ",[\"set\", \"accent\", \"" + accent + "\"]"
                step = [];
                step.push("set", "accent", accent);
                result.push( step );
            }
            if (pub !== undefined && pub != null) {
                // result += ",[\"set\", \"/meta/published\", " + pub + "]"
                step = [];
                step.push("set", "/meta/published", pub);
                result.push( step );
            }
            // result += "]";
            // this.log("result: " + result);

            if (Util.isDebug()) {
                this.log("result: "+ JSON.stringify(result));
            }

            var newKind = {
                "uuid": newUuid,
                "name": inValue
            }

            existingUuid = newUuid;
            
            if (Util.isDebug()) {
                this.log("newKind: " + JSON.stringify(newKind));
            }
            this.owner.getDataManager().getNotebooks().push( newKind );
            
            // enyo.asyncMethod( this, "doCreateItem", [ result, this.item ] );
            this.owner.$.dataManager.createData( JSON.stringify(result), null, this, "notebook" );
    
        } else {
            var newUuid = "/UUID(" + existingUuid + ")/";

            // var result = "[";
            // result += "[\"set\", \"" + newUuid + "\", \"name\", \"" + inValue + "\" ]";

            var result = [];
            var step = [];

            step.push("set", newUuid, "name", inValue);
            result.push( step );

            if (accent !== undefined && accent != null && accent != "standard") {
                // result += ",[\"set\", \"accent\", \"" + accent + "\"]"
                step = [];
                step.push("set", "accent", accent);
                result.push( step );
            }
            if (pub !== undefined && pub != null) {
                // result += ",[\"set\", \"/meta/published\", " + pub + "]"
                step = [];
                step.push("set", "/meta/published", pub);
                result.push( step );
            }
            // result += "]";
            // this.log("result: " + result);

            if (Util.isDebug()) {
                this.log("result: "+ JSON.stringify(result));
            }
            
            // update existing notebook-item
            this.selectedObj.properties.accent = accent;
            this.selectedObj.properties["/meta/published"] = pub;
            
            this.owner.$.dataManager.updateData( JSON.stringify(result), this.selectedObj, this, "notebook" );
            
        }
        
        // store filter
        localStorage.removeItem("notebook");     
        localStorage.setItem("notebook", existingUuid);
        Settings.getSettings(true);
        
        if (Util.isDebug()) {
            this.log("END");
        }
    },

    onCreateResult : function( success, message, what ) {
        if (Util.isDebug()) {
            this.log("success: " + success);
        }
        if (success == true) {
            // TODO watt nu? sync?
            this.updateCountLabel(); 
            this.doRefreshTap();
        } else {
            if (Util.isDebug()) {
                this.log("message: " + message);
            }
        }
    },

    onSaveResult : function( success, message, what ) {
        if (Util.isDebug()) {
            this.log("success: " + success);
            this.log("message: " + JSON.stringify(message));
        }
        if (this.$.createNotebookDialog) {
            this.$.createNotebookDialog.setActive( false );  
        }
        if (success == true) {
            this.$.createNotebookDialog.closeDialog();
            // TODO watt nu? sync?
            this.doRefreshTap();
        } else {
            this.$.createNotebookDialog.showFailurePopup( message );
        }
    },

    editItem : function() {
        // this.log();
        if (Util.isDebug()) {
            this.log("this.selectedObj: " + this.selectedObj);
        }
        this.setSelectedObject();
        this.$.createNotebookDialog.openAtCenter();    
        this.$.createNotebookDialog.setFuncName( "createNewNotebook" );
        this.$.createNotebookDialog.setScope( this );
        this.$.createNotebookDialog.clearDialog();
        this.$.createNotebookDialog.setData( this.owner.$.dataManager.getSpringpadAccents(), this.selectedObj );
    },
    
    setSelectedObject : function() {
        if (this.selectedObj === undefined || this.selectedObj == null) {
            if (Settings.getSettings().notebook != "All_My_Stuff") {
                if (Util.isDebug()) {
                    this.log("Settings.getSettings().notebook: " + Settings.getSettings().notebook);
                }
                this.selectedObj = ArrayUtils.getElementFromArrayById(this.owner.$.dataManager.getNotebooks(), "/UUID("+Settings.getSettings().notebook+")/");
                if (Util.isDebug()) {
                    this.log("this.selectedObj: " + this.selectedObj);
                }
            }
        }
    },

    showMenuDialog : function() {
        if (Util.isDebug()) {
            this.log();
        }
        this.owner.showMenuDialog();  
    },  

    showInfo : function() {
        if (Util.isDebug()) {
            this.log();
        }
        this.$.infoDialog.openAtCenter();
        this.$.infoDialog.refresh();
    },
    
   showDeleteItem : function( ) {
       this.$.deleteDialog.openAtCenter();  
   },
   
   closeDialog : function() {
       this.$.deleteDialog.close();  
   },
   
   deleteItem : function( inSender, inIndex ) {
       if (Util.isDebug()) {
           this.log("inSender:" + inSender + ", inIndex: " + inIndex );
       }
       
       this.setSelectedObject();
 
       var obj = this.selectedObj;
       this.$.deleteDialog.close();  
       this.showListSpinner();
       if (Util.isDebug()) {
           this.log("obj: " + JSON.stringify(obj));
           this.log("name: " + obj.name);
           this.log("_id: " + obj._id);
           this.log("uuid: " + obj.uuid);
       }
       
       this.owner.$.dataManager.deleteItem( obj.uuid, this, "onDeleteSuccess" );
   },
   
    onDeleteSuccess : function( uuid ) {
        if (Util.isDebug()) {
            this.log("uuid: " + uuid);
            this.log("remove from notebooks");
        }
        ArrayUtils.removeElementByUUID( this.owner.$.dataManager.getNotebooks(), uuid );

        // save notebooks
        if (Util.isDebug()) {
            this.log("saving notebooks...");
        }
        var storageType = "notebooks";
        localStorage.removeItem(storageType);
        localStorage.setItem(storageType, JSON.stringify(this.owner.$.dataManager.getNotebooks()));

        // this.$.feedList.render(); 
        this.$.feedList.refresh();

        this.updateCountLabel(); 
        
        // check if it was the active notebook
        var strUuid = StringUtils.getValueFromString(uuid);
        if (strUuid == Settings.getSettings().notebook) {
            localStorage.setItem("notebook", "All_My_Stuff");
            Settings.getSettings( true );
            this.owner.$.dataManager.setFeedItems( this.owner.$.dataManager.getFeedItemsByStateAndTag(Settings.getSettings().notebook, Settings.getSettings().filterTags, Settings.getSettings().filterType ) );
            this.owner.$.itemListPane.renderAndRefresh();
        }
        
    },
    
    closeNotYetDialog : function() {
        this.$.notYetDialog.close();
    },

    dragstartHandler: function(inSender, inEvent) {
      // this.log();
      this.setAndroidScrollHack();
    }, 
    
    setAndroidScrollHack: function(inSender, inEvent)
    {
        // this.log();
        enyo.application.AndroidScrollHack = true;
        setTimeout(enyo.bind(this, function() { enyo.application.AndroidScrollHack = false; }), 200);
    },
    
    getDataManager : function() {
        if (Util.isDebug()) {
            this.log();
        }
        return this.owner.$.dataManager;
    },
    
    setOnline : function ( ) {
//        if (Util.isDebug()) {
//            this.log("START");
//        }
        if (Settings.getSettings().username != "" && Settings.getSettings().password != "" && Settings.getSettings().accountVerified == true) {
            this.$.refreshButton.setDisabled(!Settings.getSettings().online);
        } 
//        if (Util.isDebug()) {
//            this.log("END");
//        }
    },
    
});
