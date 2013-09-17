enyo.kind({
    name : "ItemList",
    kind : enyo.SlidingView,
    layoutKind : enyo.VFlexLayout,
    components : [
        {kind: "FileUtils"},
  		{ className: 'scroll-bar',
			name: 'scrollBar',
			hide: function() {
				this.applyStyle('-webkit-transition', 'opacity 1.2s linear');
				this.setClassName('scroll-bar hidden');
			},
			show: function() {
				this.applyStyle('-webkit-transition', '');
				this.setClassName('scroll-bar shown');
			}
		},
        {name: "headerToolbar", kind: "Toolbar", components: [
            {kind: enyo.HFlexBox, flex: 1, components: [
                /*{name: "menuButton",   kind: "IconButton", className: "enyo-button-dark", depressed: false, down: false, toggling: false, icon : "images/settings.png", onclick: "showMenuDialog" },*/
                /*{name: "homeButton",   kind: "IconButton", className: "enyo-button-dark", depressed: false, down: false, toggling: false, icon : "images/notebook.png", onclick: "doFilterByNotebook" },*/
                {name: "filterButton", kind: "IconButton", className: "enyo-button-dark", depressed: false, down: false, toggling: false, icon : "images/tags.png", onclick: "openManageTags"},
                {name: "typesButton",  kind: "IconButton", className: "enyo-button-dark", depressed: false, down: false, toggling: false, icon : "images/types.png", onclick: "openManageTypes"},
                {kind: "Spacer"}, 
                {name: "orderSelector", kind: "CustomListSelector", value: 1, onChange: "sortOrderChanged", style: "width: 100px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; font-size: 16px; color: white; margin-left: 10px; ", items: [
                    {caption: $L("Modified "), value: 1},
                    {caption: $L("Added "), value: 2},
                    {caption: $L("Name "), value: 3},
                    {caption: $L("Type "), value: 4},
                    {caption: $L("Rating "), value: 5},
                ]},
            ]}
        ]},
        {kind: enyo.SearchInput,name: "searchBox", hint: $L("Search"), autoCapitalize: "lowercase", value: "", oninput: "onSearch", onCancel: "clearSearch"},
        {kind: "Pane", name: "contentPane", flex: 1, transitionKind: enyo.transitions.Simple, style: "background-color: white; ", components: [
            /*{name: "scroller", kind: enyo.Scroller, flex : 1, components : [*/
                {name : "feedList", kind : (Platform.isBrowser() ? "ekl.List.VirtualList" : "enyo.VirtualList"), onScrollSta: "onScrollStart", onScrollSto: "onScrollStop", /*onmousehold: "onMousehold",*/ onLoadComplete: "hideListSpinner", onLoadStarted: "showListSpinner", onSetupRow : "getItem", onclick : "doListTap", components : [
                    {name : "feedItem", className: Util.getClassName("feeditem"), kind: (Platform.isWebOS() ? "SwipeableItem" : "Item"), ondrag: (!Platform.isWebOS() ? "setAndroidScrollHack" : ""), onSwipe: "onSwipe", onConfirm: "deleteItem", cancelCaption: $L("Cancel"), confirmCaption: $L("Delete item?"), tapHighlight : true, layoutKind: "HFlexLayout", components: [
                        {name: "listimage", className: Util.getClassName("listimage"), allowHtml: true, onclick: "onImageClicked", components: [
                            {name: "listimage2", className: Util.getClassName("listimage2"), allowHtml: true}
                        ]},
                        {kind: enyo.VFlexBox, flex: 1, components: [
                            {name : "caption", kind: enyo.HtmlContent, content : "",  style: "font-size: 0.9em; padding: 0px; margin-right: 10px;" },
                            {name : "additionalCaption", kind: enyo.HtmlContent, content : "",  style: "color: grey; font-size: 0.7em; padding: 0px; margin-right: 10px; margin-top: 3px; text-overflow:ellipsis; overflow:hidden; white-space: nowrap; height: 18px;"},
                        ]},
                        {kind: enyo.Spinner, name: "itemSpinner", style: "width: 10px, height: 10px"},
                    ]}             
                ]},
            /*]}, */
            {name: "emptyList", kind: "HFlexBox", align: "center", pack: "top", components: [
                {kind: (Platform.isWebOS() && !Platform.isTouchpadOrPre3() ? enyo.Scroller : null), flex: 1, height: "280px", autoHorizontal: false, horizontal: false, components: [
                    {content: $L("<b>No items found!</b>") ,
                        style: "text-align: center; margin: 10px;",
                        className: "enyo-text-body"},
                    {content: $L("You can create a new object via the add-icon at the bottom of"),
                        style: "text-align: center; margin: 10px;",
                        className: "enyo-text-body"},
                    {content: $L("For more informations go to the menu and click on 'Help'."),
                        style: "text-align: center; margin: 10px;",
                        className: "enyo-text-body"},
                ]}, 
            ]}
        ]}, 
        // {name: "findItems", kind: "DbService", dbKind: enyo.fetchAppInfo().id + ".itemsAll:1", method: "find", onResponse: "onFindItemsAllResponse"/*, subscribe: true*/, onWatch: "queryWatch"},
        /*{name: "tagSelectDialog", kind: "FilerDialog", onCreateNotebook: "createNewNotebook"},*/
        /*{name: "tagDialog", kind: "TagDialog"},*/
        /*{name: "typeDialog", kind: "TypeDialog"},*/
        {name: "createObjectDialog", kind: "CreateObjectDialog", onSelectObject: "selectedNewObject"},
        {name: "onlyOnlineDialog", kind: "OnlyOnlineDialog"},
        {name: "spinnerScreen", kind: "ReadOnTouch.SpinnerScreen"},
        {name: "contextMenu", kind: "PopupSelect", onSelect: "contextMenuSelect", items: [
            {name: "menuHeadline", disabled: true, allowHtml: true, value: "-1"}, 
            {name: "searchInSelection", caption: "", value: "1"/*, icon: "images/clipboard.png"*/}, 
            /*{name: "searchInAll", caption: "", value: "2"},*/ 
         ]},
        {name: "footerToolbar", kind: "Toolbar", pack : "justify", style : "max-height: 57px;", components: [
            {kind: "GrabButton", align : "left" },
            {flex : 1},
            {name: "countLabel", kind: enyo.HtmlContent,style : "color: #FFFFFF; font-size: 16px; margin-left: 0px; padding-left: 5px;"},
            {flex : 1},
            {kind: enyo.Spinner, name: "listSpinner", align: "right"},
            {flex : 1},
            {kind: "IconButton", className: "enyo-button-dark", style: "margin-top: 7px; height: 20px;", depressed: false, down: false, toggling: false, name: "addButton", icon : "images/add.png", onclick : "doAddItem", align : "right"},
            /*{kind: "IconButton", className: "enyo-button-dark", style: "margin-top: 7px; height: 20px;", depressed: false, down: false, toggling: false, name: "refreshButton", icon : "images/sync.png", onclick : "doRefreshTap", align : "right"},*/
            (Platform.isTouchpad() == false ?  
            {flex : 1} : null), 
        ]},
    ],
    events : {
        "onListTap" : "",
        "onRefreshTap" : "",
    },
    
    published: {
        selectedRow : -1,
        selectedObj: null,
        isScrolling: false,
    },
    
    create : function( ) {
        this.inherited(arguments);
        if (Platform.isVeer()) { // only veer and other devices
            this.$.headerToolbar.applyStyle( "-webkit-border-image", "none !important");
            this.$.footerToolbar.applyStyle( "-webkit-border-image", "none !important");
            this.$.feedList.$.scroller.setAccelerated( false );
        }
        if (!Platform.isTouchpad() && !Platform.isBlackBerry()) { 
            this.$.feedList.$.scroller.setAccelerated( false );
        }
        selectedObj = null;
        
        // show list scrollbar, if selected in preferences
        if (Settings.getSettings().showListScrollbar == true) {
			var listName = "feedList"; // the string name of your list
			
			// we need to listen for scrollStart to show bar,
			// and scrollStop to hide the bar
			this.$[listName].$.scroller.scrollStart = enyo.bind(this, this.showBar);
			this.$[listName].$.scroller.scrollStop = enyo.bind(this, this.hideBar);
			
			// we need to take the old scroll method and hold it,
			// and override it with our own, which calls the old one
			this.scrollFunc = enyo.bind(this.$[listName].$.scroller,
				this.$[listName].$.scroller.scroll);
			this.$[listName].$.scroller.scroll = enyo.bind(this, this.scroll);
        } else {
            this.$.scrollBar.destroy();
        }
    },
    
    rendered : function( ) {
        this.inherited(arguments);
        if (Util.isDebug()) {
            this.log("START");
        }
        // this.$.addButton.setDisabled(!Settings.getSettings().online); 
        // if (Settings.getSettings().username != "" && Settings.getSettings().password != "") {
            // this.$.refreshButton.setDisabled(!Settings.getSettings().online);
        // } 
        this.$.orderSelector.setValue( Settings.getSettings().sortOrder );
        this.$.feedList.$.scroller.punt();
        this.updateCountLabel();

        if (Platform.isWebOS() && Platform.isTouchpad() == false) {
            $('#headerToolbar').css("heigth", "20px" );
        }    
        if (Util.isDebug()) {
            this.log("END");
        }
    },
    
    setOnline : function ( ) {
    },
    
    doFilterByNotebook : function() {
        this.$.tagSelectDialog = this.createComponent({name: "tagSelectDialog", kind: "FilerDialog", onCreateNotebook: "createNewNotebook"}, {owner: this});
        this.$.tagSelectDialog.openAtCenter();
        this.$.tagSelectDialog.setValues( this.owner.$.dataManager.getNotebooks(), Settings.getSettings().notebook, false );
        this.$.tagSelectDialog.setScope(this.owner.$.dataManager);
        this.$.tagSelectDialog.setFuncName("getFeedItemsByStateAndTag");
        this.$.tagSelectDialog.setFuncName2("loadItems");
    },
    
    doFilterByTag : function( tag ) {
    	this.owner.$.dataManager.setFeedItems( this.owner.$.dataManager.getFeedItemsByTag( tag ) );

        this.owner.resizeWebView();
        this.owner.setWebViewMaximized( false );
        this.selectView("feedList");

        // this.$.feedList.render();
        // this.$.feedList.refresh();        
        this.updateCountLabel();

    },
    
    doFilterByType : function( type, searchInAll ) {
        this.owner.$.dataManager.setFeedItems( this.owner.$.dataManager.getFeedItemsByType( type, searchInAll ) );

        this.owner.resizeWebView();
        this.owner.setWebViewMaximized( false );
        this.selectView("feedList");

        // this.$.feedList.render();
        // this.$.feedList.refresh();        
        this.updateCountLabel();

    },
    
    doRefreshTap : function( ) {
        if (Util.isDebug()) {
            this.log("START");
        }
        if (Settings.getSettings().online == true || this.owner.getCalledFromExtern() == true) {
            if (Util.isDebug()) {
                this.log("online == true or launched from external");
            }
            this.owner.$.feedWebViewPane.showEmptyPage();
            this.$.feedList.$.scroller.punt();
            // this.showListSpinner();
            // this.owner.setJustStarted( 1 );
            this.$.searchBox.setValue( "" );
            enyo.asyncMethod( this.owner, this.owner.refreshFeedItemsListLite() );
            this.updateCountLabel();
        }
        if (Util.isDebug()) {
            this.log("END");
        }
    },

    sortOrderChanged: function( inSender, inValue, inOldValue ) {
        if (Util.isDebug()) {
            this.log("START");
            this.log(inSender + ", Value: " + inValue + ", inOldValue: " + inOldValue);
        }
        this.$.feedList.$.scroller.punt();
        
        this.owner.$.dataManager.setFeedItems( ArrayUtils.sortSpringpadData( this.owner.$.dataManager.getFeedItemsByStateAndTag(UtilSettings.getSettings().notebook, Settings.getSettings().filterTags, Settings.getSettings().filterType), inValue) );
        
        localStorage.setItem( "sortOrder", inValue );
        Settings.getSettings( true );

        this.$.feedList.refresh();
        if (Util.isDebug()) {
            this.log("END");
        }
    },

    doListTap: function( inSender, inEvent, inIndex ) {
        // this.log(inSender);
        // this.log(inEvent);
        // this.log(inIndex);
        
        // this.log("this.isScrolling: " + this.isScrolling);
        // this.log("this.dragging: " + this.dragging);
        if (this.isScrolling == true || this.dragging == true || enyo.application.AndroidScrollHack == true) {
            // this.log("returning...");
            return;
        }
        
        // if (Util.isDebug()) {
            // this.log("START");
        // }
        if (!inSender.ishold || inSender === undefined) {            
            if (inEvent !== undefined) {
                if (Util.isDebug()) {
                    this.log(" -> clicked item #" + inEvent.rowIndex);
                }
                this.selectedRow = inEvent.rowIndex;
                selectedObj = this.owner.$.dataManager.feedItems[inEvent.rowIndex];
                // this.log("obj: " + JSON.stringify(this.selectedObj.properties));
                if (Util.isDebug()) {
                    this.log("uuid: " + selectedObj.uuid);
                }
        
                if(selectedObj) {
                    this.$.itemSpinner.show();
                    this.$.feedList.refresh();
                    // Util.setItem( "lastRead", this.selectedObj.uuid);
                    // Util.setItem( "lastRow", inEvent.rowIndex);
                    // Util.setItem( "scrollerArticle", 0);
                    this.owner.$.feedWebViewPane.$.articleContainer.$.scrollerArticle.setScrollTop(0);
                    this.owner.$.feedWebViewPane.setHighlight( true );
                    
                    // FIXME the listspinner makes immense problems! don't know why!!
                    if (Platform.isTablet() && !Platform.isBrowser()) {
                         enyo.asyncMethod( this, this.showListSpinner() );
                    }
                    if (!Platform.isBrowser() && !Platform.isBB10()) {
                        enyo.nextTick( this.owner.$.feedWebViewPane, this.owner.$.feedWebViewPane.setContent, selectedObj );
                    } else {
                        this.owner.$.feedWebViewPane.setContent( selectedObj );
                    }

                    if (Util.isDebug()) {
                        this.log("Platform.isPortraitMode(): " + Platform.isPortraitMode());
                        this.log("!Platform.isTouchpad(): " + !Platform.isTouchpad());
                    }
                    if (Platform.isHandy() || (!Platform.isTablet() && Platform.isPortraitMode() && Settings.getSettings().maximizeView == true) || (Platform.isPlaybook() && Platform.isPortraitMode())) {
                        if (Util.isDebug()) {
                            this.log("zooming in...");
                        }
                        if (!Platform.isBB10()) {
                            enyo.nextTick( this.owner, this.owner.zoomInWebPanel);
                        } else {
                        	this.owner.zoomInWebPanel();
                        }
                    }
                } 
            } else {
                this.error("inEvent is undefined!");
            }
        }
        inSender.ishold = false
        
        // if (Util.isDebug()) {
            // this.log("END");
        // }
    },
    
    getSelectedItem : function( ) {
        return selectedObj;
    },
    
    startItemSpinner: function( inIndex ) { 
        // this.log("START");
        if (inIndex !== undefined) {
            this.$.feedList.prepareRow(inIndex);
            if( this.$.itemSpinner.getShowing( ) == false ) {
                this.$.itemSpinner.show(); 
            }
        } else {
            this.error("inIndex is undefined!");
        }
        // this.log("END");
    },
    
    stopItemSpinner: function( inIndex ) { 
        // this.log("START");
         if (inIndex !== undefined) {
             this.$.feedList.prepareRow( inIndex );
             if( this.$.itemSpinner.getShowing( ) == true ) {
                 this.$.itemSpinner.hide(); 
             }
         } else {
             this.$.feedList.prepareRow( this.selectedRow );
             if( this.$.itemSpinner.getShowing( ) == true ) {
                 this.$.itemSpinner.hide(); 
             }
         }
        this.$.feedItem.render(); 
        // this.log("END");
    },
    
    getItem : function( inSender, inIndex ) {
        // this.log(enyo.json.stringify(inRecord));
        if (inIndex === undefined || inIndex >= this.owner.$.dataManager.getFeedItems().length)
        {
            return false;
        }

        // this.log("START");
        // this.log(inIndex);

        // check if the row is selected
        isItemSelected = (inIndex == this.selectedRow);

        // get the selected item
        getitemObj = this.owner.$.dataManager.getFeedItems()[inIndex];

        // format the colors 
        if (getitemObj) {
            if (isItemSelected == false) {
                // this.log("nein...");
                this.$.feedItem.removeClass("item-selected");
                this.$.feedItem.addClass("item-not-selected");
            } else if (isItemSelected == true) {
                // this.log("ja!");
                this.$.feedItem.removeClass("item-not-selected");
                this.$.feedItem.addClass("item-selected");
            }
            
            getitemType = this.owner.$.dataManager.getValueFromString( getitemObj.type );
            getitemCaption = getitemObj.name;
            if (getitemCaption === undefined || getitemCaption == "undefined" || String(getitemCaption).trim().length == 0) {
                if (getitemType == "File" || getitemType == "Photo") {
                    // this.log("file or photo without name detected...");
                    getitemCaption = Util.getFileNameFromObject( getitemObj );
                    // this.log("caption: " + caption);
                } else {
                    if (Util.isDebug()) {
                        this.log(enyo.json.stringify( getitemObj ));
                    }
                    getitemCaption = "";
                }
            }
            getitemSubCaption = $L(getitemType);
            if (getitemType == "Task") {
                if (getitemObj.properties.complete !== undefined && getitemObj.properties.complete == true) {
                    getitemCaption = "<s>" + getitemObj.name + "</s>";
                }
            } else if (getitemType !== undefined && getitemType.indexOf("List") != -1) {

                if (getitemObj.properties.items !== undefined) {
                    completeItems = 0;
                    for (var i=0; i<getitemObj.properties.items.length; i++) {
                        if (getitemObj.properties.items[i].properties !== undefined && getitemObj.properties.items[i].properties.complete == true) {
                            completeItems++;
                        } 
                    }  
                    getitemSubCaption += " ( " + (Number(getitemObj.properties.items.length) - Number(completeItems)) + " | " + Number(completeItems) + " )";
                }
            }
            getitemFilter = this.$.searchBox.getValue().toLowerCase();
            if (getitemFilter != "") {
                getitemCaption = StringUtils.applyFilterHighlight( getitemCaption, getitemFilter, "searchResult");
                getitemSubCaption = StringUtils.applyFilterHighlight( getitemSubCaption, getitemFilter, "searchResult");
            }

            if (getitemObj.properties.personalRating !== undefined) {
                addiString = "";
                for (i=0; i<Number(getitemObj.properties.personalRating); i++) {
                    addiString += "<img src=\"images/star.png\" width=\"12\" height=\"12\" border=0>";
                }
                if (addiString.length > 0) {
                    getitemSubCaption += " (" + addiString + ")";
                }
            }
            
            this.$.caption.setContent( getitemCaption );
            this.$.additionalCaption.setContent( getitemSubCaption );
            
            
            var imageSource = this.getImageForType(getitemType);
            
            if (getitemObj.image !== undefined || getitemObj.properties.thumbKey !== undefined) {

            	imageSource = getitemObj.image;
                
                // check if thumbnail is available
                thumbnail = getitemObj.properties.thumbKey;
                // this.log("thumbnail: " + thumbnail);
                
                if (thumbnail !== undefined) {
                    // use thumbnail
                    if (thumbnail.indexOf("http") == -1) {
                        imageSource = "http://springpad-user-data.s3.amazonaws.com/" + thumbnail;
                    } else {
                        imageSource = thumbnail;
                    }
                }
                // this.log("imageSource: " + imageSource);

                if (Settings.getSettings().downloadImages == true) {
                    // detect target dir 
                    targetDir = "";
                    if (Platform.isWebOS()) {
                        targetDir = "/media/internal/appdata/" + enyo.fetchAppInfo().id + "/.images/";
                    } else if (Platform.isBlackBerry()) {
                        targetDir = blackberry.io.dir.appDirs.app.storage.path + "/";
                    }
                    // create local filename
                    targetFilename = StringUtils.getFilenameFromURL( imageSource );
                    
                    // check if file exists on device
                    fe = false;
                    fe = this.$.fileUtils.fileExists( targetFilename, Constants.DOWNLOAD_TYPE_APP_IMAGE );
                    
                    var objImage = ArrayUtils.getElementFromArrayByFilename( this.owner.$.dataManager.getDownloadedImages(), targetFilename);
                    
                    if (fe == true && objImage != null) {
                    	imageSource = objImage.file;
                    }
                }
            }
            this.$.listimage2.setContent( "<img border=0 src='" + imageSource + "' />" );
            this.$.feedItem.render();
            // this.log("END");
            return true;
        }

        return false;
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
        size = (Platform.isTablet() ? "48" : "32");
        return "images/types/" + mytype + "_" + size + ".png";
    },
     
    hideListSpinner: function( ) {
        // this.log("START");
        if( this.$.listSpinner.getShowing( ) == true ) {
            this.$.listSpinner.hide(); 
        }
    },
    
    showListSpinner: function( ) {
        // this.log("START");
        // this.log();
        if( this.$.listSpinner.getShowing( ) == false ) {
            this.$.listSpinner.show(); 
        }
        // this.log("END");
    },
    
    hideItem : function( ) {
        if (Util.isDebug()) {
            this.log("START");
        }
        // this.log();
        this.owner.$.dataManager.getFeedItems().splice( this.selectedRow, 1);
        this.clearSelection();
        this.updateCountLabel();
        if (Util.isDebug()) {
            this.log("END");
        }
    },
    
    clearSelection : function( ) {
        if (Util.isDebug()) {
            this.log("START");
        }
        // this.log();
        this.selectedRow = -1;
        // this.log("title: " + this.$.listItemTitle.getContent());
        // if( this.$.feedItem.getShowing( ) == true ) {
            // this.$.feedItem.hide();
        // }
        this.$.feedList.refresh();
        if (Util.isDebug()) {
            this.log("END");
        }
    },
    
    onSearch : function ( inSender, event ) {
        if (Util.isDebug()) {
            this.log("START");
        }
        // scroll to top of list
        this.$.feedList.$.scroller.punt();
        enyo.nextTick("filterItems", enyo.bind(this, "filterItems"));
        if (Util.isDebug()) {
            this.log("END");
        }
    },
    
    filterItems : function ( ) {
        // this.log("START");
        if (this.oldList)
        {
            this.owner.$.dataManager.setFeedItems(this.oldList);
            this.updateCountLabel();
        }
        
        filter = this.$.searchBox.getValue().toLowerCase();
        
        if (String(filter).trim().length > 0) {
            if( this.owner.$.feedWebViewPane.$.toggleHighlightButton.getShowing( ) == false ) {
                this.owner.$.feedWebViewPane.$.toggleHighlightButton.show();
            }
        } else {
            this.clearSearch();
        }
        this.oldList = this.owner.$.dataManager.getFeedItems();

        if (Util.isDebug()) {
            this.log("search for: '" + filter + "' in " + this.oldList.length + " items");
        }
        filteredItems = [];
        

        for (index in this.oldList) {
            filterItem = this.oldList[index];
            found = false;

            if (filterItem.name !== undefined && filterItem.name != null) {
                if (filterItem.name.toLowerCase().indexOf(filter) != -1) {
                    filteredItems.push(filterItem);
                    found = true;
                }
            }
            if (!found && filterItem.properties.tags !== undefined && filterItem.properties.tags != null && filterItem.properties.tags != "") {
                if (String(filterItem.properties.tags).toLowerCase().indexOf(filter) != -1) {
                    filteredItems.push(filterItem);
                    found = true;
                }
            }
            
            filterItemType = this.owner.$.dataManager.getValueFromString( filterItem.type );
            if (!found && filterItemType.toLowerCase().indexOf(filter) != -1) {
                filteredItems.push(filterItem);
                found = true;
            }

            filterItemTypeLocal = $L(filterItemType);
            if (!found && filterItemTypeLocal.toLowerCase().indexOf(filter) != -1) {
                filteredItems.push(filterItem);
                found = true;
            }
//            this.log("filterItemTypeLocal: " + filterItemTypeLocal);
            
            if (!found && filterItemType !== undefined && filterItemType.indexOf("List") != -1) {
                listItems = filterItem.properties.items;
                // this.log("listItems: " + listItems);
                
                for (key in listItems) {
                    listItemObj = listItems[key];
                    // this.log("obj: " + JSON.stringify(obj));
                    if (listItemObj.name.toLowerCase().indexOf(filter) != -1) {
                        filteredItems.push(filterItem);
                        found = true;
                        break;
                    }
                }                
            } else if (!found ) {
                if (!found && filterItem.properties.text !== undefined && filterItem.properties.text != null && filterItem.properties.text != "") {
                    if (filterItem.properties.text.toLowerCase().indexOf(filter) != -1) {
                        filteredItems.push(filterItem);
                        found = true;
                    }
                }  

                if (!found && filterItem.properties.description !== undefined && filterItem.properties.description != null && filterItem.properties.description != "") {
                    if (filterItem.properties.description.toLowerCase().indexOf(filter) != -1) {
                        filteredItems.push(filterItem);
                        found = true;
                    }
                } 
                // recipes
                if (!found && filterItem.properties.ingredientsText !== undefined && filterItem.properties.ingredientsText != null && filterItem.properties.ingredientsText != "") {
                    if (filterItem.properties.ingredientsText.toLowerCase().indexOf(filter) != -1) {
                        filteredItems.push(filterItem);
                        found = true;
                    }
                } 
                if (!found && filterItem.properties.preparationText !== undefined && filterItem.properties.preparationText != null && filterItem.properties.preparationText != "") {
                    if (filterItem.properties.preparationText.toLowerCase().indexOf(filter) != -1) {
                        filteredItems.push(filterItem);
                        found = true;
                    }
                } 
                // movies / tvshows
                if (!found && filterItem.properties.releaseDate !== undefined && filterItem.properties.releaseDate != null && filterItem.properties.releaseDate != "") {
                    if (filterItem.properties.releaseDate.toLowerCase().indexOf(filter) != -1) {
                        filteredItems.push(filterItem);
                        found = true;
                    }
                }  
                
                if (!found && filterItem.properties.cast !== undefined && filterItem.properties.cast != null && filterItem.properties.cast.length > 0) {
                    for (key in filterItem.properties.cast) {
                        if (filterItem.properties.cast[key].toLowerCase().indexOf(filter) != -1) {
                            filteredItems.push(filterItem);
                            found = true;
                            break;
                        }
                    }
                }
                
                if (!found && filterItem.properties.directors !== undefined && filterItem.properties.directors != null && filterItem.properties.directors.length > 0) {
                    for (key in filterItem.properties.directors) {
                        if (filterItem.properties.directors[key].toLowerCase().indexOf(filter) != -1) {
                            filteredItems.push(filterItem);
                            found = true;
                            break;
                        }
                    }
                }
                
                if (!found && filterItem.properties.writers !== undefined && filterItem.properties.writers != null && filterItem.properties.writers.length > 0) {
                    for (key in filterItem.properties.writers) {
                        if (filterItem.properties.writers[key].toLowerCase().indexOf(filter) != -1) {
                            filteredItems.push(filterItem);
                            found = true;
                            break;
                        }
                    }
                }
                
                if (!found && filterItem.properties.producers !== undefined && filterItem.properties.producers != null && filterItem.properties.producers.length > 0) {
                    for (key in filterItem.properties.producers) {
                        if (filterItem.properties.producers[key].toLowerCase().indexOf(filter) != -1) {
                            filteredItems.push(filterItem);
                            found = true;
                            break;
                        }
                    }
                }
                
                if (!found && filterItem.properties.plot !== undefined && filterItem.properties.plot != null && filterItem.properties.plot != "") {
                    if (filterItem.properties.plot.toLowerCase().indexOf(filter) != -1) {
                        filteredItems.push(filterItem);
                        found = true;
                    }
                }
                  
                if (!found && filterItem.properties.rating !== undefined && filterItem.properties.rating != null && filterItem.properties.rating != "") {
                    if (filterItem.properties.rating.toLowerCase().indexOf(filter) != -1) {
                        filteredItems.push(filterItem);
                        found = true;
                    }
                }  
            } 
            
        }
        this.owner.$.dataManager.setFeedItems(filteredItems);
        this.selectedRow = -1;
        this.renderAndRefresh();
        this.updateCountLabel();
        if (Util.isDebug()) {
            this.log("matched items: " + filteredItems.length);
        }
        
        // update current active item as well
        this.owner.$.feedWebViewPane.setHighlight( true );
        this.owner.$.feedWebViewPane.$.articleContainer.$.contentArea.update( this.getSelectedItem(), filter, this.owner.$.feedWebViewPane.getHighlight() );    

        this.owner.$.feedWebViewPane.$.toggleHighlightButton.setStyle("background-color: green; color: #FFFFFF; font-weight:bold; margin-top: 7px; height: 20px;");

        // this.log("END");
    },
    
    getSelectedRow : function() {
        return this.selectedRow;    
    },
    
    renderAndRefresh : function( ) {
        if (Util.isDebug()) {
            this.log();
        }
        if (this.$.scrollBar) {
            this.$.scrollBar.applyStyle('top', "153px");
        }
        this.$.feedList.punt();
        this.$.feedList.refresh();
        this.updateCountLabel();
    },
    
    refresh : function( ) {
        if (Util.isDebug()) {
        	this.log("selectedObj: " + selectedObj);
            this.log("selectedObj.name: " + (null != selectedObj ? selectedObj.name : "null"));
            this.log("this.selectedRow: " + this.selectedRow);
        }
        refreshIndex = (selectedObj != null ? ArrayUtils.getElementPositionFromArrayById( this.owner.$.dataManager.getFeedItems(), selectedObj.uuid ) : -1);
        if (Util.isDebug()) {
            this.log("refreshIndex: " + refreshIndex);
        }
        this.selectedRow = refreshIndex;
        this.$.feedList.refresh();
    },
    
    clearSearch : function( ) {
        if (Util.isDebug()) {
            this.log("START");
        }
        // this.log();
        if( this.owner.$.feedWebViewPane.$.toggleHighlightButton.getShowing( ) == true ) {
            this.owner.$.feedWebViewPane.$.toggleHighlightButton.hide();
        }

        clearsearchItem = this.getSelectedItem();
        this.owner.$.feedWebViewPane.setHighlight( false );
        this.owner.$.feedWebViewPane.$.articleContainer.$.contentArea.update( clearsearchItem, "", this.owner.$.feedWebViewPane.getHighlight() );    

        if (this.oldList)
        {

            this.owner.$.dataManager.feedItems = this.oldList;
            this.selectedRow = -1;
            // this.$.feedList.render();
            this.$.feedList.refresh();
            this.updateCountLabel();
            this.oldList = null;
            this.$.searchBox.value = "";
            
        }

        if (Util.isDebug()) {
            this.log("END");
        }
    },
    
    markItemRead : function( inSender, inIndex ) {
        if (Util.isDebug()) {
            this.log("inSender:" + inSender + ", inIndex: " + inIndex );
        }
        
        selectedObj = this.owner.$.dataManager.feedItems[inIndex];
    
        if(selectedObj) {
            if (Util.isDebug()) {
                this.log("selectedObj.title: " + selectedObj.title);
                this.log("selectedObj.url: " + selectedObj.url);
            }
            
            this.startItemSpinner( inIndex );
            this.owner.$.feedWebViewPane.toggleReadState( null, null, selectedObj.item_id, selectedObj.url );
        }  
    },

    onMousehold : function( inSender, inEvent ) {
        inSender.ishold = true;
        if (Util.isDebug()) {
            this.log();
            this.log("inSender: " + inSender);
            this.log("inEvent: " + inEvent);
    
            this.log("inEvent: " + inEvent.clientX);
            this.log("inEvent: " + inEvent.clientY);
        }
        
        this.onHoldObject = this.owner.$.dataManager.feedItems[inEvent.rowIndex];
        if (Util.isDebug()) {
            this.log("name: " + this.onHoldObject.name);
        }
        mouseType = this.owner.$.dataManager.getValueFromString( this.onHoldObject.type );
        
        strCap = $L("Search for type #{type} in:").replace("#{type}", mouseType);
        strSel = $L("Current Selection!");
        strAll = $L("All Notebooks!");

        this.$.contextMenu.openAt({
            top : inEvent.clientY-50,
            left : (Platform.isTablet() == true ? inEvent.clientX : 20)
        });        

        this.$.contextMenu.$.menuHeadline.setCaption( strCap );
        this.$.contextMenu.$.searchInSelection.setCaption( strSel );
        // this.$.contextMenu.$.searchInAll.setCaption( strAll );
        
    },
    
    contextMenuSelect : function( inSender, inValue ) {
        if (Util.isDebug()) {
            this.log("START");
            this.log("inSender: " + inSender);
            this.log("inValue: '" + inValue.value +"'");
        }
        if (inValue !== undefined) {
            switch (inValue.value) {
                case "1": 
                    this.doFilterByType( this.onHoldObject.type, false );
                    break;
                default: 
                    this.doFilterByType( this.onHoldObject.type, true );
                    break;
            }
        }
        if (Util.isDebug()) {
            this.log("END");
        }
    },
    
    onScrollStart : function(inSender, inEvent) {
        if (Util.isDebug()) {
            this.log();
        }
        this.isScrolling = true;
    },
    
    onScrollStop : function(inSender, inEvent) {
        if (Util.isDebug()) {
            this.log();
        }
        this.isScrolling = false;
        if (Util.isDebug()) {
            this.log("scroller: " + this.$.scroller.getScrollTop());
        }
        // this.lastClick = new Date();
    },
    
    selectView : function( name ) {
        if (Util.isDebug()) {
            this.log("selecting view: " + name);
        }
        this.$.contentPane.selectViewByName( name, true );   
        // this.$.feedList.render(); 
        this.$.feedList.refresh();
    },

    deleteItem : function( inSender, inIndex ) {
        if (Util.isDebug()) {
            this.log("inSender:" + inSender + ", inIndex: " + inIndex );
        }
        
        var obj = this.owner.$.dataManager.feedItems[inIndex];
        if (Util.isDebug()) {
            this.log("name: " + obj.name);
        }
        // this.log("_id: " + obj._id);
        if (Util.isDebug()) {
            this.log("uuid: " + obj.uuid);
        }
        
        this.startItemSpinner( inIndex );
        this.deleteRowIndex = inIndex;
        this.owner.$.dataManager.deleteItem( obj.uuid, this, "onDeleteSuccess" );
        // this.$.feedItem.hide();
        // this.$.feedList.refresh();
    },
    
    onDeleteSuccess : function( uuid ) {
        if (Util.isDebug()) {
            this.log("uuid: " + uuid);
            this.log("remove from itemsAll");
        }
        ArrayUtils.removeElementByUUID( this.owner.$.dataManager.getItemsAll(), uuid );
        if (Util.isDebug()) {
            this.log("remove from feedItems");
        }
        ArrayUtils.removeElementByUUID( this.owner.$.dataManager.getFeedItems(), uuid );

        // save itemlist
        if (Util.isDebug()) {
            this.log("saving items...");
        }
        var storageType = "items";
        localStorage.removeItem(storageType);
        localStorage.setItem(storageType, JSON.stringify(this.owner.$.dataManager.getItemsAll()));

        this.stopItemSpinner( this.deleteRowIndex );
        // this.$.feedList.render(); 
        this.$.feedList.refresh();

        // resize webview if required
        if (this.owner.getWebViewMaximized() == true || this.owner.$.feedWebViewPane.getFullscreen() == true) {
            this.owner.resizeWebView();
            this.owner.setWebViewMaximized( false );
        }
    },

    filterActive : function( active ) {
        if (Settings.getSettings().filterTags.trim() != "") {
            this.$.filterButton.setStyle("background-color: green; color: #FFFFFF; font-weight:bold;");
        } else {
            this.$.filterButton.setStyle("");
        }

        if (Settings.getSettings().filterType.trim() != "") {
            this.$.typesButton.setStyle("background-color: green; color: #FFFFFF; font-weight:bold;");
        } else {
            this.$.typesButton.setStyle("");
        }
    },

    doAddItem : function( ) {
        if (Util.isDebug()) {
            this.log("START");
        }
        this.$.createObjectDialog.openAtCenter();
        this.$.createObjectDialog.createDialog();
        if (Util.isDebug()) {
            this.log("END");
        }
    },
    
    selectedNewObject : function( inSender, type ) {
        if (Util.isDebug()) {
            this.log("START");
            this.log("type: " + type);
        }
        enyo.nextTick("addItem", enyo.bind(this.owner.$.feedWebViewPane, "addItem"), type);
        if (Util.isDebug()) {
            this.log("END");
        }
    },

    getDataManager : function() {
        return this.owner.$.dataManager;
    },

    openManageTags : function() {
        if (Util.isDebug()) {
            this.log(this.getDataManager().getAvailableTags().length);
        }
        this.$.tagDialog = this.createComponent( {name: "tagDialog", kind: "TagDialog"}, {owner: this});        
        this.$.tagDialog.openAtCenter();  
        this.$.tagDialog.setValues( this.getDataManager().getAvailableTags(), Settings.getSettings().filterTags, false );
        this.$.tagDialog.setScope(this.getDataManager());
        this.$.tagDialog.setFuncName("getFeedItemsByStateAndTag");
        this.$.tagDialog.setFuncName2("loadItems");
    },
    
    setNewTags : function( tags ) {
        if (Util.isDebug()) {
            this.log("tags: " + tags);
        }
        this.tags = tags;
        if (this.$.tagDialog) {
            this.$.tagDialog.closeDialog();
        }
        this.$.tags.setLabel ( tags );
        this.$.tags.render();
    },
    
    openManageTypes : function() {
        if (Util.isDebug()) {
            this.log(this.getDataManager().getAvailableTypes().length);
        }
        this.$.typeDialog = this.createComponent({name: "typeDialog", kind: "TypeDialog"}, {owner: this});
        this.$.typeDialog.openAtCenter();  
        this.$.typeDialog.setValues( this.getDataManager().getAvailableTypes(), Settings.getSettings().filterType );
        this.$.typeDialog.setScope(this.getDataManager());
        this.$.typeDialog.setFuncName("getFeedItemsByStateAndTag");
        this.$.typeDialog.setFuncName2("loadItems");
    },
    
    updateItemInList : function() {
        if (Util.isDebug()) {
            this.log();
        }
        this.$.feedList.updateRow( this.selectedRow );
    },

    showSpinner : function( ) {
        if (Util.isDebug()) {
            this.log();
        }
        if (Platform.isTablet() == true) {
            if( this.$.listSpinner.getShowing( ) == false ) {
                this.$.listSpinner.show(); 
            }
        } else {
            this.$.spinnerScreen.showSpinner();
        }
    },
    
    hideSpinner : function( ) {
        if (Util.isDebug()) {
            this.log();
        }
        if (Platform.isTablet() == true) {
            if( this.$.listSpinner.getShowing( ) == true ) {
                this.$.listSpinner.hide(); 
            }
        } else {
            this.$.spinnerScreen.hideSpinner();
        }
    },
    
    onRotateWindow : function() {
        if (this.$.tagSelectDialog !== undefined) {
            this.$.tagSelectDialog.resize();
        }        
        if (this.$.tagDialog !== undefined) {
            this.$.tagDialog.resize();
        }        
        if (this.$.typeDialog !== undefined) {
            this.$.typeDialog.resize();
        }  
        if (this.$.createObjectDialog !== undefined) {
            this.$.createObjectDialog.resize();
        }  
    },

    updateCountLabel : function() {
        itemcount = this.owner.$.dataManager.getFeedItems().length;
        itemlabel = $L("items");
        if (itemcount == 1) {
            itemlabel = $L("item");
        }
        this.$.countLabel.setContent( itemcount + " " + itemlabel );
    },
    
    setAndroidScrollHack: function(inSender, inEvent)
    {
        // this.log();
        enyo.application.AndroidScrollHack = true;
        setTimeout(enyo.bind(this, function() { enyo.application.AndroidScrollHack = false; }), 200);
    },
    
	showBar: function() {
        this.$.scrollBar.show(); 
	},
	
	hideBar: function() {
//		setTimeout(enyo.bind(this, function() {
			this.$.scrollBar.hide();
//		}), 25);
	},
	
	scroll: function(inSender) {
		this.scrollFunc(arguments);
		// pass the arguments to the method so the list can scroll
		
		
		
		// inSender.y - the y scroll position
		// inSender.x - the x scroll position
		// this.doGetNumberOfItems() - gets the number of
		//  items in this list
		
		var items = this.getNumberOfItems();
		var yPos = inSender.y;
		var xPos = inSender.x;
		var scrollBarHeight = 50;
		var topOffset = 103;
		var bottomOffset = 50;
		// this could be an offset from any number
		//  of things, such as a header in your box
		var sizes = [];
		var avgSize = 0;
		var listName = "feedList"; // the string name of your list
		var listItems = this.$[listName].$.scroller.heights;
		
		for (var item in listItems) {
			// go through visibile items to get their height
			// then average it out to get an estimate of
			// the average height of each item in the list
			// so we know how far to move the scroll bar
			if (item) {
				sizes.push(listItems[item]);
			}
		}
		var z = sizes.length;
		for (var i = 0; i < z; i++) {
			avgSize += parseInt(sizes[i], 10);
		}
		avgSize = avgSize/z;
		
		delete sizes;
		delete z;
		
		// top is our current position (yPos) divided by
		// the total height of all items
		var top = yPos / (items * avgSize);

//		var maxH = Platform.screenHeight;
//		maxH -= bottomOffset;
//		maxH -= topOffset;
		
		
		// then multiplied by -1 since this is going downward
		top = top * -1;
		// times the height of the list to get a pixel value
		if (this.$[listName].$.scroller.hasNode()) {
			top = top * (this.$[listName].$.scroller.node.clientHeight - bottomOffset);
//			top = top * (maxH - bottomOffset);
		}
		
		// add in the height of top offset and half of the height of the scroller bar
		top += topOffset;
		top += scrollBarHeight;
		
//		maxH = maxH + "px";
		
		// then  it has "px" added to it
		top = top + "px";
		
		this.$.scrollBar.applyStyle('top', top);
		this.$.scrollBar.applyStyle('left', (this.$[listName].hasNode().clientWidth - 8) + "px");
		// scroll bar is 6px + 2px on right
	},
	
	getNumberOfItems: function() {
		// return an integer of the number of items in your list
		// if you haven't yet set it up, return 0
		
		return this.owner.$.dataManager.getFeedItems().length;
	},    

});
