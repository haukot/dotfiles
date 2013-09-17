enyo.kind({
    name: "ItemView",
    kind: enyo.SlidingView,
    style: "margin: 0px; padding: 0px;",
    components: [
        {kind: "FileUtils"},
        {name: "launchAppCall", kind: "PalmService", service: "palm://com.palm.applicationManager/", method: "launch", onSuccess: "launchFinished", onFailure: "launchFail", onResponse: "gotResponse"},
        {name: "footerToolbar", pack : "justify", style : "max-height: 54px;", kind: enyo.Toolbar, components: [
            {kind: enyo.HtmlContent, content: "", name: "selectedItemName", className: "itemViewHeader", flex: 1, style: (Platform.isTablet() ? "padding-left: 10px; min-width: 200px;" : "padding-left: 10px;" )},
            {kind: "Spacer"}, 
            {kind: enyo.Spinner, name: "feedWebViewSpinner", align: "left"/*, style: "padding-left: 40px;"*/},
            {kind: "Spacer", flex: 1}, 
            {name: "calendarButton",  kind: "IconButton", className: "enyo-button-dark", style: "margin-top: 7px; height: 20px;", depressed: false, down: false, toggling: false, icon : "images/calendar.png", align: "right", onclick: "manageCalendarData"},
            {name: "shoppingButton",  kind: "IconButton", className: "enyo-button-dark", style: "margin-top: 7px; height: 20px;", depressed: false, down: false, toggling: false, icon : "images/shoping-cart.png", align: "right", onclick: "addToShoppingList"},
            {name: "addButton",       kind: "IconButton", className: "enyo-button-dark", style: "margin-top: 7px; height: 20px;", depressed: false, down: false, toggling: false, icon : "images/add.png", align: "right", onclick: "addListItem"},
            {name: "showHideButton",  kind: "IconButton", className: "enyo-button-dark", style: "margin-top: 7px; height: 20px;", depressed: false, down: false, toggling: false, icon : "images/checkbox.png",      align: "right", onclick: "showAllListItems"},
            {name: "attachmentButton",kind: "IconButton", className: "enyo-button-dark", style: "margin-top: 7px; height: 20px;", depressed: false, down: false, toggling: false, icon : "images/attachment.png", align: "right", onclick: "manageAttachments"},
            {name: "infoButton",      kind: "IconButton", className: "enyo-button-dark", style: "margin-top: 7px; height: 20px;", depressed: false, down: false, toggling: false, icon : "images/info.png", align: "right", onclick : "showInfo"},
            {name: "editButton",      kind: "IconButton", className: "enyo-button-dark", style: "margin-top: 7px; height: 20px;", depressed: false, down: false, toggling: false, icon : "images/edit.png",      align: "right", onclick: "editItem"},
            {name: "deleteButton",    kind: "IconButton", className: "enyo-button-negative", style: "margin-top: 7px; height: 20px;", depressed: false, down: false, toggling: false, icon : "images/delete.png", align: "right", onclick: "showDeleteItem"},
            /*{kind: "Spacer"},*/
        ]},
        
        {kind: "Pane", name: "contentPane", flex: 1, transitionKind: enyo.transitions.Simple, style: "background-color: white; ", components: [
            {name: "articleContainer", kind: "ArticleContainer", 
                onFilterByTag: "onFilterByTag", 
                onToggleCheckboxState: "onToggleCheckboxState", 
                onImageClicked: "imageClicked", 
                onStarsClicked: "starsClicked", 
                onContentClicked: "contentClicked",
                ondblclick: "onDoubleClick"
            },
            (Platform.isTouchpad() ? {name: "webview", kind: "WebView", flex: 1} : null),
        ]},
        
        {name: "headerToolbar", style: "padding-left: 15px;", kind: "Toolbar", components: [
                {kind: "GrabButton", align : "left" },
                {kind: "Spacer"}, 
                {kind: "IconButton", className: "enyo-button-dark", style: "margin-top: 7px; height: 20px;", depressed: false, down: false, toggling: false, icon: "images/mark.png", onclick : "toggleHighlight", align : "right", name: "toggleHighlightButton"},
                {kind: "IconButton", className: "enyo-button-dark", style: "margin-top: 7px; height: 20px;", depressed: false, down: false, toggling: false, icon: "images/print.png", onclick : "onPrint", align : "right", name: "printButton"}, 
                {kind: "IconButton", className: "enyo-button-dark", style: "margin-top: 7px; height: 20px;", depressed: false, down: false, toggling: false, icon: "images/share.png", onclick: "shareItem", align: "right", name: "shareButton"},
                {kind: "IconButton", className: "enyo-button-dark", style: "margin-top: 7px; height: 20px;", depressed: false, down: false, toggling: false, icon: "images/font.png", onclick : "changeFontSettings", align : "right", name: "fontButton"},
                {kind: "IconButton", className: "enyo-button-dark", style: "margin-top: 7px; height: 20px;", depressed: false, down: false, toggling: false, icon: "images/max.png", onclick : "onDoubleClick", align : "right", name: "fullScreenButton"},
        ]}, 

        {name: "fontDialog", kind: "ReadOnTouch.FontDialog"},
        /*{name: "editDialog", kind: "EditDialog", onSaveItem: "onSaveItem", onCreateItem: "onCreateItem"},*/
        {name: "addDialog", kind: "CreateListItemDialog", onCreateItem: "onCreateItem", onAddNewRow: "onAddNewRow"},
        {name: "attachmentsDialog", kind: "AttachmentsDialog"},
        {name: "ratingDialog", kind: "RatingDialog", onSaveRating: "saveRating"},
        {name: "alarmDialog", kind: "AlarmDialog", onSaveAlarm: "saveAlarm"},
        {name: "addToShoppingListDialog", kind: "AddToShoppingListDialog", onSaveList: "saveShoppingList"},
        {name: "onlyOnlineDialog", kind: "OnlyOnlineDialog"},
        {name: "spinnerScreen", kind: "ReadOnTouch.SpinnerScreen"},
        {name: "imageViewer", kind: "ImageViewer"},
        {name: "infoDialog", kind: "ItemInfoDialog"},
        {name: "share", kind: "Share"},
        {kind: "ModalDialog", name: "deleteDialog", caption: $L("Delete Item"), components:[
             {content: $L("Are you sure you want to delete this item?"), className: "enyo-paragraph"},
             {layoutKind: "HFlexLayout", components: [
                 {kind: "Button", caption: $L("Cancel "), flex: 1, onclick: "closeDialog"},
                 {kind: "ActivityButton", caption: $L("Delete"), flex: 1, className: "enyo-button-negative", onclick: "deleteItem"},
             ]}
        ]},
        (Platform.isTouchpad() ? {name: "printDialog", kind: "PrintDialog", lazy: false, 
            copiesRange: {min: 1, max: 10}, 
            qualityOption:true,
            colorOption: true,
            duplexOption: true,
            onRenderDocument: "renderWebPage",
            appName: enyo.fetchAppInfo().title
        } : null),

    ],

    published: {
        updateArticleInProgress : false,
        articleIsCurrentlyLoading : false,
        urlClicked : "",
        fullscreen: false,
        highlight: true,
        isScrolling: false
    },
    
    create : function( ) {
        this.inherited(arguments);
        item = null;
        // if (Platform.isTouchpad()) {
            // this.$.webview.hide();
        // }
        
        this.$.contentPane.selectViewByName("webview");
        
        if (Platform.isVeer()) {
            this.$.headerToolbar.applyStyle( "-webkit-border-image", "none !important");
            this.$.footerToolbar.applyStyle( "-webkit-border-image", "none !important");
        }
        if( this.$.showHideButton.getShowing( ) == true ) {
            this.$.showHideButton.hide(); 
        }
        if( this.$.editButton.getShowing( ) == true ) {
            this.$.editButton.hide(); 
        }
        if( this.$.infoButton.getShowing( ) == true ) {
            this.$.infoButton.hide(); 
        }
        if( this.$.addButton.getShowing( ) == true ) {
            this.$.addButton.hide(); 
        }
        if( this.$.calendarButton.getShowing( ) == true ) {
            this.$.calendarButton.hide(); 
        }
        if( this.$.shoppingButton.getShowing( ) == true ) {
            this.$.shoppingButton.hide(); 
        }
        if( this.$.attachmentButton.getShowing( ) == true ) {
            this.$.attachmentButton.hide(); 
        }
        
    },
    
    rendered : function( ) {
        this.inherited(arguments);
        if (Util.isDebug()) {
            this.log("START");
        }
        // this.log();
        this.$.contentPane.selectViewByName("articleContainer");
        this.showEmptyPage();
        if (Util.isDebug()) {
            this.log("END");
        }
    },

    showEmptyPage : function( mode ) {
        if (Util.isDebug()) {
            this.log("START");
        }
        this.$.feedWebViewSpinner.hide();
        this.$.articleContainer.setActiveView( "emptyPage" );
        this.$.articleContainer.switchView( );
        this.$.selectedItemName.setContent("");
        this.$.headerToolbar.applyStyle( "background-image", null );
        this.$.headerToolbar.applyStyle( "background-color", null );
        this.$.footerToolbar.applyStyle( "background-image", null );
        this.$.footerToolbar.applyStyle( "background-color", null );
        
        if( this.$.fontButton.getShowing( ) == true ) {
            this.$.fontButton.hide(); 
        }
        if( this.$.printButton.getShowing( ) == true ) {
            this.$.printButton.hide(); 
        }
        if( this.$.fullScreenButton.getShowing( ) == true ) {
            this.$.fullScreenButton.hide(); 
        }
        
        if( this.$.deleteButton.getShowing( ) == true ) {
            this.$.deleteButton.hide(); 
        }
        if( this.$.toggleHighlightButton.getShowing( ) == true ) {
            this.$.toggleHighlightButton.hide(); 
        }
        if( this.$.shareButton.getShowing( ) == true ) {
            this.$.shareButton.hide(); 
        }
        if( this.$.addButton.getShowing( ) == true ) {
            this.$.addButton.hide(); 
        }
        if( this.$.calendarButton.getShowing( ) == true ) {
            this.$.calendarButton.hide(); 
        }
        if( this.$.shoppingButton.getShowing( ) == true ) {
            this.$.shoppingButton.hide(); 
        }
        if( this.$.editButton.getShowing( ) == true ) {
            this.$.editButton.hide(); 
        }
        if( this.$.infoButton.getShowing( ) == true ) {
            this.$.infoButton.hide(); 
        }
        if( this.$.showHideButton.getShowing( ) == true ) {
            this.$.showHideButton.hide(); 
        }
        if( this.$.attachmentButton.getShowing( ) == true ) {
            this.$.attachmentButton.hide(); 
        }

        if( this.$.articleContainer.$.accent.getShowing( ) == true ) {
            this.$.articleContainer.$.accent.hide(); 
        }
        if( this.$.articleContainer.$.accent2.getShowing( ) == true ) {
            this.$.articleContainer.$.accent2.hide(); 
        }

        if (Util.isDebug()) {
            this.log("END");
        }
    },
    
    setContent : function( pItem ) {
        // this.log("item.properties: " + enyo.json.stringify( item.properties ));
        // this.log("item.properties.tags: " + enyo.json.stringify( item.properties.tags ));
        // this.log("item.properties: " + enyo.json.stringify( item.properties ));
        
    	// setting global item variables
    	item = pItem;
        type = this.owner.$.dataManager.getValueFromString( item.type );
    	
        
        this.showSpinner();
        this.owner.$.itemListPane.hideSpinner();

        this.$.articleContainer.setActiveView( "scrollerArticle" );
        this.$.articleContainer.switchView( );
        
//        type = this.owner.$.dataManager.getValueFromString( item.type );
        if (Util.isDebug()) {
            this.log("type: " + type );
        }
        switch (type) {
            case "Note": 
                if( this.$.showHideButton.getShowing( ) == true ) {
                    this.$.showHideButton.hide(); 
                }
                if( this.$.editButton.getShowing( ) == false ) {
                    this.$.editButton.show(); 
                }
                if( this.$.addButton.getShowing( ) == true ) {
                    this.$.addButton.hide(); 
                }
                if( this.$.calendarButton.getShowing( ) == true ) {
                    this.$.calendarButton.hide(); 
                }
                if( this.$.shoppingButton.getShowing( ) == true ) {
                    this.$.shoppingButton.hide(); 
                }
                this.formatContent( item, enyo.string.runTextIndexer( item.properties.text ) );
                break;
            case "Recipe": 
                if( this.$.showHideButton.getShowing( ) == true ) {
                    this.$.showHideButton.hide(); 
                }
                if( this.$.editButton.getShowing( ) == false ) {
                    this.$.editButton.show(); 
                }
                if( this.$.addButton.getShowing( ) == true ) {
                    this.$.addButton.hide(); 
                }
                if( this.$.calendarButton.getShowing( ) == true ) {
                    this.$.calendarButton.hide(); 
                }
                if( this.$.shoppingButton.getShowing( ) == false ) {
                    this.$.shoppingButton.show(); 
                }
                this.formatContent( item, "" );
                break;
            case "Task": 
                if( this.$.showHideButton.getShowing( ) == true ) {
                    this.$.showHideButton.hide(); 
                }
                if( this.$.editButton.getShowing( ) == false ) {
                    this.$.editButton.show(); 
                }
                if( this.$.addButton.getShowing( ) == true ) {
                    this.$.addButton.hide(); 
                }
                if( Platform.isWebOS() && this.$.calendarButton.getShowing( ) == false ) {
                    this.$.calendarButton.show(); 
                }
                this.formatContent( item, enyo.string.runTextIndexer( item.properties.text ) );
                break;
            case "Reminder": 
                if( this.$.showHideButton.getShowing( ) == true ) {
                    this.$.showHideButton.hide(); 
                }
                if( this.$.editButton.getShowing( ) == false ) {
                    this.$.editButton.show(); 
                }
                if( this.$.addButton.getShowing( ) == true ) {
                    this.$.addButton.hide(); 
                }
                if( Platform.isWebOS() && this.$.calendarButton.getShowing( ) == false ) {
                    this.$.calendarButton.show(); 
                }
                this.formatContent( item, enyo.string.runTextIndexer( item.properties.text ) );
                break;
            case "Appointment": 
                if( this.$.showHideButton.getShowing( ) == true ) {
                    this.$.showHideButton.hide(); 
                }
                if( this.$.editButton.getShowing( ) == false ) {
                    this.$.editButton.show(); 
                }
                if( this.$.addButton.getShowing( ) == true ) {
                    this.$.addButton.hide(); 
                }
                if( Platform.isWebOS() && this.$.calendarButton.getShowing( ) == false ) {
                    this.$.calendarButton.show(); 
                }
                this.formatContent( item, enyo.string.runTextIndexer( item.properties.text ) );
                break;
            case "CheckList": 
            case "PackingList": 
            case "ShoppingList": 
            case "GeneralList": 
                if( this.$.showHideButton.getShowing( ) == false ) {
                    this.$.showHideButton.show(); 
                }
                if( this.$.editButton.getShowing( ) == false ) {
                    this.$.editButton.show(); 
                }
                if( this.$.addButton.getShowing( ) == false ) {
                    this.$.addButton.show(); 
                }
                if( this.$.calendarButton.getShowing( ) == true ) {
                    this.$.calendarButton.hide(); 
                }
                if( this.$.shoppingButton.getShowing( ) == true ) {
                    this.$.shoppingButton.hide(); 
                }
                this.formatContent( item, "" );
                this.updateButtonLabel();
                break;
            default: 
                if (ObjectDescription.getProperties( type ) != null) {
                    if( this.$.showHideButton.getShowing( ) == true ) {
                        this.$.showHideButton.hide(); 
                    }
                    if( this.$.editButton.getShowing( ) == false ) {
                        this.$.editButton.show(); 
                    }
                    if( this.$.addButton.getShowing( ) == true ) {
                        this.$.addButton.hide(); 
                    }
                    if( this.$.calendarButton.getShowing( ) == true ) {
                        this.$.calendarButton.hide(); 
                    }
                    if( this.$.shoppingButton.getShowing( ) == true ) {
                        this.$.shoppingButton.hide(); 
                    }
                    this.formatContent( item, "" );
                } else {
                    if( this.$.showHideButton.getShowing( ) == true ) {
                        this.$.showHideButton.hide(); 
                    }
                    if( this.$.editButton.getShowing( ) == true ) {
                        this.$.editButton.hide(); 
                    }
                    if( this.$.addButton.getShowing( ) == true ) {
                        this.$.addButton.hide(); 
                    }
                    if( this.$.calendarButton.getShowing( ) == true ) {
                        this.$.calendarButton.hide(); 
                    }
                    if( this.$.shoppingButton.getShowing( ) == true ) {
                        this.$.shoppingButton.hide(); 
                    }
                    this.formatContent( item, "Item-type '" + type + "' is not supported, yet! <br><br>Please contact the developer if you need it." );
                }
                break;
        }
        
        if( this.$.fontButton.getShowing( ) == false ) {
            this.$.fontButton.show(); 
        }
        if( this.$.infoButton.getShowing( ) == false ) {
            this.$.infoButton.show(); 
        }
        if( this.$.fullScreenButton.getShowing( ) == false ) {
            this.$.fullScreenButton.show(); 
        }
        if( (Platform.isTouchpad() || Platform.isBrowser()) && this.$.printButton.getShowing( ) == false ) {
            this.$.printButton.show(); 
        }
        if (Util.isDebug()) {
            this.log("Settings.getSettings().hideDelete: " + Settings.getSettings().hideDelete);
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
        if( this.$.shareButton.getShowing( ) == false ) {
            this.$.shareButton.show(); 
        }
        if( (Platform.isTablet() || Platform.isBB10()) && this.$.attachmentButton.getShowing( ) == false ) {
            this.$.attachmentButton.show(); 
        }
        if (Platform.isTablet() || Platform.isBB10()) {
            if (Util.isDebug()) {
            	if (type.indexOf("List") == -1) {
                    this.log("item.properties: " + JSON.stringify(item.properties));
            	}
                this.log("item.properties.attachments: " + JSON.stringify(item.properties.attachments));
                this.log("item.properties.user_service_actions: " + JSON.stringify(item.properties.user_service_actions));
            }
            existAttachments = (item.properties.attachments != undefined && enyo.isArray(item.properties.attachments) && item.properties.attachments.length > 0 ? true : false);  
            existSource = (item.properties.user_service_actions != undefined && enyo.isArray(item.properties.user_service_actions) && item.properties.user_service_actions.length > 0 ? true : false);
            
            if (existAttachments || existSource) {
                this.$.attachmentButton.setStyle("background-color: green; color: #FFFFFF; font-weight:bold; margin-top: 7px; height: 20px;");
            } else {
                this.$.attachmentButton.setStyle("margin-top: 7px; height: 20px;");
            }
        }

        
        // this.log("item.properties.workbooks: " + item.properties.workbooks);
        this.createTheme( item );
        
        this.formatArticle();
        this.hideSpinner();
        this.owner.$.itemListPane.hideSpinner();
        this.owner.$.itemListPane.stopItemSpinner();
    },
    
    createTheme : function( item ) {
        notebook = this.owner.$.dataManager.getWorkbooks( item.properties.workbooks );
        // this.log("notebook.properties: '" + JSON.stringify(notebook.properties) + "'");
        itemtheme = "";
        if (notebook !== null && notebook.properties !== undefined && notebook.properties.theme !== undefined) {
            // this.log("aha");
            itemtheme = notebook.properties.theme;
        } else if (notebook.length != null && notebook.length > 0) {
            if (notebook[0].properties !== undefined) {
                itemtheme = notebook[0].properties.theme;
            }
        }

        itemaccent = "";
        if (notebook !== null && notebook.properties !== undefined && notebook.properties.accent !== undefined) {
            // this.log("aha");
            itemaccent = notebook.properties.accent;
        } else if (notebook.length != null && notebook.length > 0) {
            if (notebook[0].properties !== undefined) {
                itemaccent = notebook[0].properties.accent;
            }
        }

        theme = ArrayUtils.getThemeByName( this.owner.$.dataManager.getSpringpadThemes(), itemtheme);
        accent = ArrayUtils.getAccentByName( this.owner.$.dataManager.getSpringpadAccents(), itemaccent);

        if( this.$.articleContainer.$.accent.getShowing( ) == false ) {
            this.$.articleContainer.$.accent.show(); 
        }
        if( this.$.articleContainer.$.accent2.getShowing( ) == false ) {
            this.$.articleContainer.$.accent2.show(); 
        }

        this.$.articleContainer.$.accent.applyStyle( "background-color", accent.backgroundColor );
        this.$.articleContainer.$.accent2.applyStyle( "background-color", accent.backgroundColor );
        this.$.selectedItemName.setContent( Util.getNotebookNames( notebook ) );
    },
    
    formatContent : function( item, content, durchgestrichen ) {
        tags = item.properties.tags;
        // this.log("tags: " + JSON.stringify(tags));

//        type = this.owner.$.dataManager.getValueFromString( item.type );
        if (type == "Task") {
            if (item.properties.complete !== undefined && item.properties.complete == true) {
                durchgestrichen = true;
            }
        }

        this.$.articleContainer.$.contentArea.setType( type );
        
        // render the image
        var imageSource = this.getImageForType( type );
        if ( item.image !== undefined) {
            if (Settings.getSettings().downloadImages == true) {
                targetDir = "";
                if (Platform.isWebOS()) {
                    targetDir = "/media/internal/appdata/" + enyo.fetchAppInfo().id + "/.images/";
                } else if (Platform.isBlackBerry()) {
                    targetDir = blackberry.io.dir.appDirs.app.storage.path + "/";
                }
                targetFilename = StringUtils.getFilenameFromURL( item.image );

                // check if file exists on device
                fe = this.$.fileUtils.fileExists( targetFilename, Constants.DOWNLOAD_TYPE_APP_IMAGE );
                
                var objImage = ArrayUtils.getElementFromArrayByFilename( this.owner.$.dataManager.getDownloadedImages(), targetFilename);
                
                if (fe == true && objImage != null) {
                	imageSource = objImage.file;
                } else {
                    if (Settings.getSettings().online == true) {
                    	imageSource = item.image;
                    }
                }
            } else {
            	imageSource = item.image;
            }
        }
        this.$.articleContainer.$.contentArea.setImage( imageSource );
        
        // render the title
        this.$.articleContainer.$.contentArea.setDurchgestrichen( durchgestrichen );
        
        // render the content
        this.$.articleContainer.$.contentArea.setInhalt( StringUtils.stripHtmlCodes(content) );

        // sort tags
        if (tags !== undefined && tags != null) {
            tags = (tags.sort(function(a,b) {  
                return a.localeCompare( b );
            }));  
        }

        // render the tags
        this.$.articleContainer.$.contentArea.setTags( tags );
        
        // render the rest
        this.$.articleContainer.$.contentArea.update( item, this.owner.$.itemListPane.$.searchBox.getValue().toLowerCase(), this.getHighlight() );
        
        if (type == "CheckList" || type == "PackingList" || type == "ShoppingList" || type == "GeneralList") {
            this.updateButtonLabel();
        }
    },
    
    getImageForType : function( type ) {
        mytype = type.toLowerCase();
        if (type == "CheckList") {
            mytype = "list";
        } else if (type == "PackingList") {
            mytype = "packinglist";
        } else if (type == "ShoppingList") {
            mytype = "shoppinglist";
        } else if (type == "GeneralList") {
            mytype = "list";
        }
        mysize = (Platform.isTablet() ? "92" : "64");
        return "images/types/" + mytype + "_" + mysize + ".png";
    },
     
    getArticleMaxWidth : function() {
        if (Platform.isTablet() == true) {
            return "690px";
        } else {
            return "300px";
        }
        return 500;
    },

    onRotateWindow : function() {
        this.formatArticle();
        if (this.$.editDialog !== undefined) {
            this.$.editDialog.resize();
        }        
        if (this.$.alarmDialog !== undefined) {
            this.$.alarmDialog.resize();
        }        
    },
    
    formatArticle : function( ) {
        this.$.articleContainer.addStyles("font-size: " + Settings.getSettings().fontsize + "; line-height: " + Settings.getSettings().lineSpacing + "; font-family: " + Settings.getSettings().fontfamily );    
        this.$.articleContainer.render();    
    },    

    refreshWebView: function( ) {
        if (Util.isDebug()) {
            this.log("START");
        }
        // this.log();
        if (this.getViewMode() == "text") {
            this.showSpinner();
//            var item = this.owner.$.itemListPane.getSelectedItem();
            if (Util.isDebug()) {
                this.log("item_id: " + item.item_id);
            }
            enyo.asyncMethod( this.owner, this.owner.$.dataManager.loadArticle( item.item_id, item.url, true ) );
            this.setUpdateArticleInProgress(true);
        }
        if (Util.isDebug()) {
            this.log("END");
        }
    },
    
    showSpinner : function( ) {
        // this.log();
        if (Platform.isTablet() == true) {
            if( this.$.feedWebViewSpinner.getShowing( ) == false ) {
                this.$.feedWebViewSpinner.show(); 
            }
        } else {
            this.$.spinnerScreen.showSpinner();
        }
    },
    
    hideSpinner : function( ) {
        // this.log();
        if (Platform.isTablet() == true) {
            if( this.$.feedWebViewSpinner.getShowing( ) == true ) {
                this.$.feedWebViewSpinner.hide(); 
            }
        } else {
            this.$.spinnerScreen.hideSpinner();
        }
    },
    
    resizeWebView: function( ) {
        if (Util.isDebug()) {
            this.log("START");
        }
        // console.log();
        if (!!window.PalmSystem) {
            this.owner.$.feedWebViewPane.$.currentArticleView.resize();
            // this.owner.$.feedWebViewPane.$.currentWebView.resize();
        }
        if (Util.isDebug()) {
            this.log("END");
        }
    },
    
    changeFontSettings : function( ) {
        this.$.fontDialog.openAtCenter();  
    },
    
    linkClicked: function (inSender, inEvent) {
        if (this.isScrolling == true) {
            if (Util.isDebug()) {
                this.log("article is currently scrolling...")
            }
            return;
        }
        if (Util.isDebug()) {
            this.log("inSender: " + inSender);
            this.log("inEvent: " + enyo.json.stringify(inEvent));
            this.log("this.gesturing: " + this.gesturing);
            this.log("this.dragging: " + this.dragging);
        }
        if (inEvent !== undefined && inEvent != null) {
//            var item = this.owner.$.itemListPane.getSelectedItem();
            var link = "";
            var appinfo = enyo.fetchAppInfo();
            var pos = inEvent.indexOf(appinfo.id + "/");
            if (Util.isDebug()) {
                this.log("pos: " + pos);
            }
            if (pos != -1 && pos + appinfo.id.length < inEvent.length) {
                var newPos = pos + appinfo.id.length;
                link = item.url + inEvent.substr(newPos+1, inEvent.length);
            } else {
                var start = inEvent.substr(0,4);
                if (Util.isDebug()) {
                    this.log("start: " + start);
                }
                if (start == "file") {
                    var str = inEvent.substr( 7, inEvent.length );
                    if (str.substr(0,1) == "/") {
                        link = StringUtils.getHostname( item.url ) + str;
                    } else {
                        link = item.url + str;
                    }
                } else {
                    link =  inEvent;
                }
            }
            if (Util.isDebug()) {
                this.log("link: " + link);
            }
            if (Settings.getSettings().useAdvancedBrowser == false) {
                this.$.launchAppCall.call({"id": "com.palm.app.browser", "params":{"target": link}});
            } else {
                this.$.launchAppCall.call({"id": "com.maklesoft.browser", "params":{"url": link}});
            }
        }
    },
    
    /*dragstartHandler: function(inSender, inEvent) {
      if (this.gesturing) { return true; }
      this.dragging = true;
    
      if (Math.abs(inEvent.dy/inEvent.dx) <= 1 && inEvent.dx <= 0) { 
          this.log("swipe: right");
        // 'right' swipe
      } else if (Math.abs(inEvent.dy/inEvent.dx) <= 1 && inEvent.dx > 0) { 
          this.log("swipe: left");
        // 'left' swipe
      } else if (Math.abs(inEvent.dy/inEvent.dx) > 1 && inEvent.dy <= 0) { 
          this.log("swipe: down");
        // 'down' swipe
      } else if (Math.abs(inEvent.dy/inEvent.dx) > 1 && inEvent.dy > 0) { 
          this.log("swipe: up");
        // 'up' swipe
      }
    }, 
    
    dragfinishHandler: function(inSender, inEvent) {
      enyo.nextTick(this, function() { this.dragging = false; } );
    },*/ 
    
    gesturestartHandler: function(inSender, inEvent) {
      this.gesturing = true;
      this.gesture = {
        x: inEvent.centerX,
        y: inEvent.centerY
      };
    }, 
    
    gestureendHandler: function(inSender, inEvent) {
      enyo.nextTick(this, function() { this.gesturing = false; } );
      var dy = inEvent.centerY - this.gesture.y;
      var dx = inEvent.centerX - this.gesture.x;
    
      if (Math.abs(dy/dx) > 1 && dy <= 0) { 
          // 'down' power swipe
          if (Util.isDebug()) {
              this.log("power-swipe: down");
          }
          if (this.viewMode == "web") {
              this.$.scrollerWeb.scrollToBottom();
          } else {
              this.$.articleContainer.$.scrollerArticle.scrollToBottom();
          }
      } else if (Math.abs(dy/dx) > 1 && dy > 0) { 
          // 'up' power swipe
          if (Util.isDebug()) {
              this.log("power-swipe: up");
          }
          if (this.viewMode == "web") {
              this.$.scrollerWeb.setScrollTop(0);
          } else {
              this.$.articleContainer.$.scrollerArticle.setScrollTop(0);
          }
      }
    },
    
    onScrollStart : function(inSender, inEvent) {
        // this.log();
        this.isScrolling = true;
    },
    
    onScrollStop : function(inSender, inEvent) {
        // this.log();
        this.isScrolling = false;
    },
    
   onDoubleClick : function( ) {
       this.fullscreen = !this.fullscreen;
       if (Util.isDebug()) {
           this.log("toggle fullscreen to: " + this.fullscreen);
       }
       var style = null;
       if (this.fullscreen == true) {
           style = "none";
           if (Platform.isTablet() == true) {
               this.owner.zoomInWebPanel();
           }
       } else {
           if (this.owner.getWebViewMaximized() == true) {
               this.owner.resizeWebView();
           }
       }
       if (Platform.isWebOS()) {
           enyo.setFullScreen( this.fullscreen );
       }
   }, 
   
   deleteItem : function( ) {
       this.$.deleteDialog.close();  
       this.showSpinner();
       this.owner.$.itemListPane.startItemSpinner( this.owner.$.itemListPane.getSelectedRow() );
       var obj = this.owner.$.itemListPane.getSelectedItem();

       if (Util.isDebug()) {
           this.log("name: " + obj.name);
           this.log("_id: " + obj._id);
           this.log("uuid: " + obj.uuid);
       }
       
       this.owner.$.dataManager.deleteItem( obj.uuid, this.owner.$.itemListPane, "onDeleteSuccess" );
   },
   
   showDeleteItem : function( ) {
       this.$.deleteDialog.openAtCenter();  
   },
   
   closeDialog : function() {
       this.$.deleteDialog.close();  
   },
   
    launchFail: function( inSender, inResponse ) {
        if (Util.isDebug()) {
            this.log("START");
        }
        this.error("Launch app failure, results=" + enyo.json.stringify(inResponse));
        if (inResponse.errorText=='"com.maklesoft.browser" was not found') {
            this.owner.$.appMissing.setAppTitle("Advanced Browser");
            this.owner.$.appMissing.setAppId("com.maklesoft.browser");
            this.owner.$.appMissing.openAtCenter();
        }

        /*if (inResponse.errorText.indexOf("maklesoft") != -1) {
            this.owner.showFailurePopup("The AdvancedBrowser could not be found. Please change your settings!", "Failure");
        }*/
        if (Util.isDebug()) {
            this.log("END");
        }
    },
    
    showAllListItems : function( ) {
        if (Util.isDebug()) {
            this.log("START");
        }
        this.$.articleContainer.$.scrollerArticle.setScrollTop(0);
        listdata = this.$.articleContainer.$.contentArea.$.tempControl.toggleView( );
        listobj = this.owner.$.itemListPane.getSelectedItem();
//        listobj.modified = "/Date(" + new Date().getTime() + ")/";
        if (Settings.getSettings().online == true) {
            this.owner.$.dataManager.updateData( listdata, listobj );
        }
        // this.showSpinner();
        this.updateButtonLabel();
        if (Util.isDebug()) {
            this.log("END");
        }
    },
    
    updateButtonLabel : function( ) {
        hideChecked = this.$.articleContainer.$.contentArea.$.tempControl.getShowChecked();
        if (Util.isDebug()) {
            this.log("hideChecked: " + hideChecked);
        }
        if (hideChecked == false || hideChecked == "false") {
//            if (Util.isDebug()) {
//                this.log("set new label: " + $L("Hide checked"));
//            }
            // this.$.showHideButton.setCaption($L("Hide checked"));
            this.$.showHideButton.setStyle("background-color: green; color: #FFFFFF; font-weight:bold; margin-top: 7px; height: 20px;");
        } else {
//            if (Util.isDebug()) {
//                this.log("set new label: " + $L("Show all"));
//            }
            // this.$.showHideButton.setCaption($L("Show all"));
            this.$.showHideButton.setStyle("margin-top: 7px; height: 20px;");
        } 
    },

    onClickCalled : function( inEvent ) {
        if (Util.isDebug()) {
            this.log("inEvent: " + inEvent);
            this.log("this.isScrolling: " + this.isScrolling);
        }
        if (this.isScrolling == true) {
            return;
        }
        if (Util.isDebug()) {
            this.log("this.fullscreen: " + this.fullscreen);
        }
        if (this.fullscreen == true) {
            if( this.$.headerToolbar.getShowing( ) == false ) {
                this.$.headerToolbar.show(); 
            } else if( this.$.headerToolbar.getShowing( ) == true ) {
                this.$.headerToolbar.hide(); 
            }
            
            if( this.$.footerToolbar.getShowing( ) == false ) {
                this.$.footerToolbar.show(); 
            } else if( this.$.footerToolbar.getShowing( ) == true ) {
                this.$.footerToolbar.hide(); 
            }

            if( this.$.articleContainer.$.accentPane.getShowing( ) == false ) {
                this.$.articleContainer.$.accentPane.show(); 
            } else if( this.$.articleContainer.$.accentPane.getShowing( ) == true ) {
                this.$.articleContainer.$.accentPane.applyStyle( "display", "none" ); 
            }
            
            if( this.$.articleContainer.$.accent2.getShowing( ) == false ) {
                this.$.articleContainer.$.accent2.show(); 
            } else if( this.$.articleContainer.$.accent2.getShowing( ) == true ) {
                this.$.articleContainer.$.accent2.applyStyle( "display", "none" ); 
            }
        }
    },
    
    onFilterByTag : function( inSender, inValue ) {
        if (Util.isDebug()) {
            this.log("inSender: " + inSender);
            this.log("inValue: " + inValue);
        }
        this.owner.$.itemListPane.doFilterByTag( inValue );
    },
    
    toggleHighlight : function( ) {
        if (Util.isDebug()) {
            this.log("this.getHighlight() old: " + this.getHighlight());
        }
        this.setHighlight( !this.getHighlight() );
        if (Util.isDebug()) {
            this.log("this.getHighlight() new: " + this.getHighlight());
        }
        
        if (this.getHighlight() == true) {
            this.$.toggleHighlightButton.setStyle("background-color: green; color: #FFFFFF; font-weight:bold; margin-top: 7px; height: 20px;");
        } else {
            this.$.toggleHighlightButton.setStyle("margin-top: 7px; height: 20px;");
        }
        
//        item = this.owner.$.itemListPane.getSelectedItem();
        this.$.articleContainer.$.contentArea.update( item, this.owner.$.itemListPane.$.searchBox.getValue().toLowerCase(), this.getHighlight() );      
    },
    
    onToggleCheckboxState : function( inSender, inValue ) {
        if (Util.isDebug()) {
            this.log("inSender: " + inSender);
            this.log("inValue: " + inValue);
        }
        this.owner.$.dataManager.updateData( inValue[0], inValue[1] );
    },
    
    editItem : function() {
        if (Util.isDebug()) {
            this.log();
        }
            
            if (this.$.editDialog) {
                this.$.editDialog.destroy();
            }
            
            cont = true;
//            item = this.owner.$.itemListPane.getSelectedItem();
//            type = this.owner.$.dataManager.getValueFromString( item.type );
            if (!Platform.isWebOS() && type == "Note") {
                cont = false;
                
                if (Platform.isBrowser()) {
                    check = confirm($L("Sadly all formatting (e.g. font-family, -style, -size) will be lost when you edit and save this object. Do you want to continue?"));
                    if (check == true) {
                        cont = true;
                    }
                } else {
                    
                    // FIXME: wird nicht wieder neu aufgerufen der dialog?!?!?!
                    
                    buttons = [$L("Yes"), $L("No")];
                    ops = {title : $L("Attention"), size : blackberry.ui.dialog.SIZE_SMALL, position : blackberry.ui.dialog.CENTER};
                    blackberry.ui.dialog.customAskAsync($L("Sadly all formatting (e.g. font-family, -style, -size) will be lost when you edit and save this object. Do you want to continue?"), buttons, enyo.bind(this, this.dialogCallBack), ops);
                }
                
            }
            
            if (cont == true) {
                this.$.editDialog = this.createComponent({name: "editDialog", kind: "EditDialog", onSaveItem: "onSaveItem", onCreateItem: "onCreateItem"}, {owner: this});
                this.$.editDialog.openAtCenter();  
                // this.$.editDialog.clearDialog();  
                this.$.editDialog.setItem( item, type );
            }
    },
    
    dialogCallBack : function( index ) {
        if (Util.isDebug()) {
            this.log("index: " + index);
        }
        if (index == 0) {
//            item = this.owner.$.itemListPane.getSelectedItem();
            this.$.editDialog = this.createComponent({name: "editDialog", kind: "EditDialog", onSaveItem: "onSaveItem", onCreateItem: "onCreateItem"}, {owner: this});
            this.$.editDialog.openAtCenter();  
            // this.$.editDialog.clearDialog();  
            this.$.editDialog.setItem( item, this.owner.$.dataManager.getValueFromString( item.type ) );
        }  
    },    
    
    onSaveItem : function( inSender, inValue ) {
        if (Util.isDebug()) {
            this.log("inSender: " + inSender);
            this.log("inValue: " + inValue);
        }
        this.owner.$.dataManager.updateData( inValue[0], inValue[1], this );
    },
    
    onSaveResult : function( success, message, what ) {
        if (Util.isDebug()) {
            this.log("success: " + success);
            this.log("message: " + JSON.stringify(message));
        }
        if (this.$.editDialog) {
            this.$.editDialog.setActive( false );  
        }
        if (success == true) {
            if (what !== undefined) {
                this.$.ratingDialog.closeDialog();
            } else {
                this.$.editDialog.onClose();
            }
//            item = this.owner.$.itemListPane.getSelectedItem();
            itemNeu = ArrayUtils.getElementFromArrayById( this.owner.$.dataManager.getFeedItems(), item.uuid);
            if (Util.isDebug()) {
                this.log("itemNeu.name: " + itemNeu.name);
            }
            // this.log("itemNeu.text: " + itemNeu.properties.text);
            this.$.articleContainer.$.contentArea.update( itemNeu, this.owner.$.itemListPane.$.searchBox.getValue().toLowerCase(), this.getHighlight() ); 
            this.createTheme( itemNeu );
            // this.owner.$.itemListPane.updateItemInList();
            this.owner.$.itemListPane.refresh();
        } else {
            this.$.editDialog.showFailurePopup( message );
        }
    },

    addItem : function( type ) {
        if (Util.isDebug()) {
            this.log();
        }
        this.$.editDialog = this.createComponent({name: "editDialog", kind: "EditDialog", onSaveItem: "onSaveItem", onCreateItem: "onCreateItem"}, {owner: this});
        this.$.editDialog.openAtCenter();  
        this.$.editDialog.setItem( null, type, Settings.getSettings().notebook );
    },
    
    onCreateItem : function( inSender, inValue ) {
        if (Util.isDebug()) {
            this.log("inSender: " + inSender);
            this.log("inValue: " + inValue);
        }
        item = inValue[1];
        this.owner.$.dataManager.createData( inValue[0], inValue[1], this, inValue[2] );
    },
    
    onCreateResult : function( success, message, what ) {
        if (Util.isDebug()) {
            this.log("success: " + success);
        }
        if (this.$.editDialog !== undefined && this.$.editDialog != null) {
            this.$.editDialog.setActive( false );  
        }
        if (success == true) {
            
            if (what !== undefined && what != "listitems") {
                this.$.addDialog.closeDialog();
//                item = this.owner.$.itemListPane.getSelectedItem();
                itemNeu = ArrayUtils.getElementFromArrayById( this.owner.$.dataManager.getFeedItems(), item.uuid);
                if (Util.isDebug()) {
                    this.log("itemNeu.name: " + itemNeu.name);
                }
                // this.log("itemNeu.text: " + itemNeu.properties.text);
                this.$.articleContainer.$.contentArea.update( itemNeu, this.owner.$.itemListPane.$.searchBox.getValue().toLowerCase(), this.getHighlight() ); 
                this.owner.$.itemListPane.updateItemInList();
            } else if (what !== undefined && what == "listitems") {
                this.$.addToShoppingListDialog.closeDialog();
//                item = this.owner.$.itemListPane.getSelectedItem();
                this.owner.$.itemListPane.refresh();
            } else {
                this.$.editDialog.onClose();
                this.owner.$.notebookListPane.loadNotebookItems();
            }
        } else {
            if (what !== undefined) {
                this.$.addDialog.showFailurePopup( message );
                
            } else if (what != "listitems") {
                this.$.editDialog.showFailurePopup( message );
            } else {
                this.$.addToShoppingListDialog.showFailurePopup( message );
            }
        }
    },
    
    getDataManager : function() {
        // this.log();
        return this.owner.$.dataManager;
    },
    
    imageClicked : function() {
        if (Util.isDebug()) {
            this.log();
        }
//        item = this.owner.$.itemListPane.getSelectedItem();
//        type = this.owner.$.dataManager.getValueFromString( item.type );

        image = "";
        if (item.image !== undefined) {
            if (Settings.getSettings().downloadImages == true) {
                targetDir = "/media/internal/appdata/" + enyo.fetchAppInfo().id + "/.images/";
                if (Platform.isBlackBerry()) {
                    targetDir = blackberry.io.dir.appDirs.app.storage.path + "/";
                }
                targetFilename = StringUtils.getFilenameFromURL( item.image );
                if (Util.getImageFromArrayByFilename(this.owner.$.dataManager.getDownloadedImages(), targetFilename) != null) {
                    image = targetDir+targetFilename ;
                } else {
                    image = item.image ;
                }
            } else {
                image = item.image ;
            }
            if (Util.isDebug()) {
                this.log("image: " + image);
            }
            this.$.imageViewer.openAtCenter();
            this.$.imageViewer.setImage( image );
        }

    },
    
    contentClicked : function() {
        if (Util.isDebug()) {
            this.log();
        }
        this.onClickCalled();    
    },

    addListItem : function() {
        if (Util.isDebug()) {
            this.log();
        }
            this.$.addDialog.openAtCenter();  
            this.$.addDialog.clearDialog();
            this.$.addDialog.setItem( item );
            this.$.addDialog.createDialog( true, false );
            this.$.addDialog.setData( [{"checked": false, "value": ""}] );
    },
   
   manageAttachments : function() {
        if (Util.isDebug()) {
            this.log();
            }    
//        item = this.owner.$.itemListPane.getSelectedItem();
        this.$.attachmentsDialog.openAtCenter();  
        this.$.attachmentsDialog.createDialog( item );
   },
    
   closeAttachmentsDialog : function() {
       this.$.attachmentsDialog.close();  
   },
   
   closeNoAttachmentsDialog : function() {
       this.$.noAttachmentsDialog.close();  
   },
   
   closeRatingDialog : function() {
       this.$.ratingDialog.close();  
   },
   
   starsClicked : function() {
        if (Util.isDebug()) {
            this.log();
        }
            rating = (item.properties.personalRating !== undefined ? item.properties.personalRating : 0);
            if (Util.isDebug()) {
                this.log("rating: " + rating);
            }
            this.$.ratingDialog.openAtCenter();  
            this.$.ratingDialog.setItem( item );
   },
    
   saveRating : function( inSender, inValue ) {
        if (Util.isDebug()) {
            this.log("inSender: " + inSender);
            this.log("inValue: " + inValue);
        }
        this.owner.$.dataManager.updateData( inValue[0], inValue[1], this, "rating" );
   },
   
   addToShoppingList : function() {
        if (Util.isDebug()) {
            this.log();
        }
    
            ingredientsText = (item.properties !== undefined && item.properties.ingredientsText !== undefined ? item.properties.ingredientsText : "");
            if (Util.isDebug()) {
                this.log("ingredientsText before: " + ingredientsText);
            }
            
            if (ingredientsText !== undefined && ingredientsText != "") {
                ingredientsText = ingredientsText.replace(/\r\n/gi, "");
                ingredientsText = ingredientsText.replace(/\n/gi, "<br>");
                ingredientsText = ingredientsText.replace(/\n/gi, "<br>");
                ingredientsText = ingredientsText.replace(/<br\/>/gi, "<br>");  
                ingredientsText = ingredientsText.replace(/<br \/>/gi, "<br>");  
            }
            if (Util.isDebug()) {
                this.log("ingredientsText after: " + ingredientsText);
            }
    
            this.$.addToShoppingListDialog.openAtCenter();  
            this.$.addToShoppingListDialog.clearDialog();
            this.$.addToShoppingListDialog.setData( this.owner.$.dataManager.getAvailableShoppingLists(), ingredientsText );
   },
    
   closeAlarmDialog : function() {
       this.$.addToShoppingListDialog.close();  
   },
   
   saveShoppingList : function( inSender, result ) {
       if (Util.isDebug()) {
           this.log("inSender: " + inSender);
           this.log("result: " + JSON.stringify(result[0]) );  
           this.log("item: " + JSON.stringify(result[1].properties) );  
           this.log("what: " + result[2]);
       }
       this.owner.$.dataManager.createData( result[0], result[1], this, result[2] );
   },
   
    shareItem : function( source, inEvent ) {
        if (Util.isDebug()) {
            this.log("START");
        }
        var item = this.owner.$.itemListPane.getSelectedItem();
        this.$.share.setItem( item );
        this.$.share.setIsNotebook( false );
        this.$.share.shareItem();
        if (Util.isDebug()) {
            this.log("END");
        }
    },
    
    onPrint : function() {
        if (Util.isDebug()) {
            this.log("START");
        }
        this.$.articleContainer.$.scrollerArticle.setScrollTop(0);
        this.$.articleContainer.$.contentArea.printContent();
        if (Util.isDebug()) {
            this.log("END");
        }
    },
    
    renderWebPage: function(inSender, inJobID, inPrintParams) {
        if (Util.isDebug()) {
            this.log("START");
            this.log("inSender: " + inSender);
            this.log("inJobID: " + inJobID);
            this.log("inPrintParams: " + JSON.stringify(inPrintParams));
        }
        this.$.contentPane.selectViewByName("webview");
        this.$.webview.callBrowserAdapter("printFrame", ["", inJobID, inPrintParams.width, inPrintParams.height, inPrintParams.pixelUnits, false, inPrintParams.renderInReverseOrder]);
        this.$.contentPane.selectViewByName("articleContainer");
        if (Util.isDebug()) {
            this.log("END");
        }
        return true;
    },
   
   manageCalendarData : function() {
        if (Util.isDebug()) {
            this.log();
        }
        this.$.alarmDialog.openAtCenter();  
        var item = this.owner.$.itemListPane.getSelectedItem();
        var type = this.owner.$.dataManager.getValueFromString( item.type );
        if (Util.isDebug()) {
            this.log("type: " + type );
        }
        switch (type) {
            case "Task":
                this.$.alarmDialog.setItem( StringUtils.getValueFromString(item.properties.date.properties.date) );
                break;
            case "Reminder":
                this.$.alarmDialog.setItem( StringUtils.getValueFromString(item.properties.date.properties.date) );
                break;
            case "Appointment":
                this.$.alarmDialog.setItem( StringUtils.getValueFromString(item.properties.date.properties.date), StringUtils.getValueFromString(item.properties.toDate.properties.date) );
                break;
            default:
                break;
        } 
   },
    
   closeAlarmDialog : function() {
       this.$.alarmDialog.close();  
   },
   
   saveAlarm : function( inSender, ts1, ts2 ) {
        if (Util.isDebug()) {
            this.log("inSender: " + inSender);
            this.log("ts1: " + ts1);
            this.log("ts2: " + ts2);
        }
        var item = this.owner.$.itemListPane.getSelectedItem();
        var type = this.owner.$.dataManager.getValueFromString( item.type );
        var description = "";
        if (Util.isDebug()) {
            this.log("type: " + type );
        }
        switch (type) {
            case "Task":
                description = item.properties.description;
                break;
            case "Reminder":
                description = item.properties.description;
                break;
            case "Appointment":
                description = item.properties.note;
                break;
            default:
                break;
        } 

        var newEvent = {};
        newEvent.dtstart = ts1.toString();
        newEvent.dtend = ts2.toString();
        newEvent.subject = item.name;
        newEvent.note = description;
        newEvent.location = "";
        
        if (Util.isDebug()) {
            this.log("newEvent: " + JSON.stringify(newEvent));
        }
        
        // Which essentialy creates a JSON object.  Use the same property names or it will not work.  Convert date/time to UNIX timestamp.
        
        // {"dtstart":"1335931200000","dtend":"1335934800000","subject":"Midnight Snack","note":"Bring Food","location":"Home"}
        
        // That I pass to PalmService:  palm://com.palm.applicationManager 
        
        var x = this.createComponent({ kind: "PalmService", service: "palm://com.palm.applicationManager/", method: "open", onSuccess: "openCalendarSuccess", onFailure: "openCalendarFailure" }, {owner: this});
        x.call( { id : "com.palm.app.calendar", params: { "newEvent" : newEvent } });
        
        this.closeAlarmDialog();
   },
   
   openCalendarSuccess: function(inSender, inResponse) {
        if (Util.isDebug()) {
            this.log("Open calendar to date success, results=" + enyo.json.stringify(inResponse));
        }
   },
   
   openCalendarFailure: function(inSender, inResponse) {
        this.error("Open calendar to date failure, results=" + enyo.json.stringify(inResponse));
   },

   showInfo : function() {
       if (Util.isDebug()) {
           this.log();
       }
       this.$.infoDialog.openAtCenter();
       this.$.infoDialog.refresh( item, this.owner.getDataManager().getWorkbooks( item.properties.workbooks ) );
   },
   
   updateOrCloseCurrentItem : function() {
       if (Util.isDebug()) {
           this.log("this.owner.$.dataManager.getFeedItems().length: " + this.owner.$.dataManager.getFeedItems().length);
           if ( item !== undefined && item != null ) {
               this.log("item.uuid: " + item.uuid);
           } else {
        	   this.log("item: undefined");
           }
       }
       if ( item != null && item !== undefined && ArrayUtils.getElementFromArrayById( this.owner.$.dataManager.getFeedItems(), item.uuid ) != null) {
		   // item still exists after sync, so do not close it, just refresh
           if (Util.isDebug()) {
        	   this.log("item still exists after sync, so do not close it, just refresh");
           }
		   this.setContent( item );
	   } else {
           if (Util.isDebug()) {
        	   this.log("item does not exist anymore, showing empty page");
           }
		   this.showEmptyPage();
	   }
   },
   
   onAddNewRow : function() {
       if (Util.isDebug()) {
           this.log();
       }
       
       var dialogItems = this.$.addDialog.getDialogItem();
       this.log("dialogItems.length: " + dialogItems.length);
       var deleteARow = this.$.addDialog.getDeleteARow();
       this.log("deleteARow: " + deleteARow);
       var isDirty = this.$.addDialog.getIsDirty();
       this.log("isDirty: " + isDirty);
       var dItem = this.$.addDialog.getItem();
       this.log("dItem: " + dItem);
    	  
       this.$.addDialog.close();
       this.$.addDialog.openAtCenter();  
       this.$.addDialog.clearDialog();
       this.$.addDialog.setItem( dItem );
       this.$.addDialog.createDialog( false, deleteARow );
       this.$.addDialog.setData( dialogItems );
       if (true == isDirty) {
    	   this.$.addDialog.setDirty();
       }
   },
  

});
