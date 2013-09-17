enyo.kind({
    name: "TagDialog",
    kind: enyo.ModalDialog,
    /*height: (Platform.isWebOS() ?  
                (Platform.isTouchpad() ? Util.getAbsolutPixel( "h", 0.86) : (Platform.isTouchpadOrPre3() ? "460px" : "360px"))
                : (Platform.isTablet() || Platform.isBrowser() ? Util.getAbsolutPixel( "h", 0.86) : "460px")),*/
    width: (Platform.isTablet() ? "480px" : "320px"),
    caption: $L("Select Tag(s)"),
    events: {
        onAccept: ""
    },
    components: [
        {kind: "ApplicationEvents", onWindowHidden: "close"},
        {name: "newTagButton", kind: "Button", caption: $L("Create New Tag"), flex: 1, className: "enyo-button-dark", onclick: "openNewTagDialog"},
        {name: "searchBox", kind: enyo.SearchInput, hint: $L("Search"), autoCapitalize: "lowercase", value: "", oninput: "onSearch", onCancel: "clearSearch", style: "margin-top: 10px; "},
        {name: "scroller", kind: enyo.Scroller, flex: 1, height: (Platform.isWebOS() ?  
                (Platform.isTouchpad() ? Util.getAbsolutPixel( "h", 0.86, 225) : (Platform.isTouchpadOrPre3() ? "240px" : "135px"))
                : (Platform.isTablet() || Platform.isBrowser() ? Util.getAbsolutPixel( "h", 0.86, 225) : "240px")), autoHorizontal: false, horizontal: false, components: [
            {name: "rowGroupTags", kind: "RowGroup", caption: $L("Tags") , components: [
            ]},
        ]},
        {flex: 1},       
        {layoutKind: "HFlexLayout", style: "padding-top: 10px; ", components: [
            {name: "clearButton", kind: "Button", caption: (Platform.isTablet() ? $L("Clear ") : $L("Clear")), flex: 1, className: "enyo-button-negative", onclick: "onClear"},
            {name: "cancelButton", kind: "Button", caption: (Platform.isTablet() ? $L("Cancel ") : $L("Cancel ")), flex: 1, className: "enyo-button-dark", onclick: "closeDialog"},
            {name: "okButton", kind: "ActivityButton", caption: $L("Ok"), flex: 1, className: "enyo-button-affirmative", onclick: "onSubmit"},
        ]},
        {kind: "ModalDialog", name: "popupDialog", caption: $L("Failure!"), components:[
            {content: $L("Your current request did not return any articles."), className: "enyo-paragraph"},
            {layoutKind: "HFlexLayout", components: [
                {kind: "Button", caption: $L("Ok"), flex: 1, onclick: "closeFailureDialog", className: "enyo-button-negative"},
            ]}
        ]},
        {name: "createTagDialog", kind: "CreateTagDialog"}
    ],
    
    published: {
        funcName: "",
        funcName2: "",
        scope: "",
        tags: "",
        allTags: [],
        createMode: false,
    },
    
    rendered : function( ) {
        if (Util.isDebug()) {
            this.log();
        }
        this.inherited(arguments);
        this.resize();        
    },    
    
    resize : function() {
        var height = (Platform.isWebOS() ?  
                (Platform.isTouchpad() ? Util.getAbsolutPixel( "h", 0.86) : (Platform.isTouchpadOrPre3() ? "460px" : "360px"))
                : (Platform.isTablet() || Platform.isBrowser() ? Util.getAbsolutPixel( "h", 0.86) : "460px"));
        if (Util.isDebug()) {
            this.log("height: " + height);
        }                
//        this.applyStyle("height", height);
        
        var width = (Platform.isTablet() ? "480px" : "320px");
        if (Util.isDebug()) {
            this.log("width: " + width);
        }                
        this.applyStyle("width", width );
        
        
        var scrollerH = (Platform.isWebOS() ?  
                (Platform.isTouchpad() ? Util.getAbsolutPixel( "h", 0.86, 225) : (Platform.isTouchpadOrPre3() ? "275px" : "165px"))
                : (Platform.isTablet() || Platform.isBrowser() ? Util.getAbsolutPixel( "h", 0.86, 225) : "275px"));
        if (Util.isDebug()) {
            this.log("scrollerH: " + scrollerH);
        }
        this.$.scroller.applyStyle("height", scrollerH);
    },
        
    setValues : function( allTags, tags, isCreate ) {
        if (tags === undefined) {
            tags = "";
        }
        
        if (this.$.rowGroupTags) {
            if (Util.isDebug()) {
                this.log("deleting old tag elements...");
            }
            this.$.rowGroupTags.destroyControls();
        }
        
        if (Util.isDebug()) {
            this.log("allTags: " + JSON.stringify(allTags));
            this.log("tags: " + tags);
            this.log("isCreate: " + isCreate);
        }
        
        // create tags
        for (key in allTags) {
            var obj = allTags[key];
            // this.log("key: " + key);
            // this.log("obj: " + enyo.json.stringify(obj));
            if (obj.isTag == true) {
                var kindItem = {
                    kind: "LabeledContainer", 
                    label: obj.tag, 
                    name: "lc"+obj.tag,
                    components:[
                        {kind : "CheckBox", name : "cb"+obj.tag, onChange : "tagChanged" }
                    ]
                };
                this.$.rowGroupTags.createComponent( kindItem, {owner: this});
                // this.error("created item: " + "lc"+obj.tag);
                this.getAllTags().push( obj.tag );
            }
        }

        if (tags != "") {
            var filterTagsArray = String(tags).split(",");
            for(key in filterTagsArray) {
                var tag = filterTagsArray[key];
                if (Util.isDebug()) {
                    this.log("tag: " + tag);
                }
                if (this.$["cb"+tag]) {
                    this.$["cb"+tag].setChecked(true);
                }
            }
        }
        
        this.setTags( tags );
        this.createMode = isCreate;
        if (this.createMode == true) {
            // this.$.clearButton.hide();
            this.$.newTagButton.show();
            this.$.okButton.setCaption( $L("Ok") );
        } else {
            // this.$.clearButton.show();
            this.$.newTagButton.hide();
            var value = (Platform.isWebOS() ?  
                (Platform.isTouchpad() ? Util.getAbsolutPixel( "h", 0.86, 185) : (Platform.isTouchpadOrPre3() ? "275px" : "165px"))
                : (Platform.isTablet() || Platform.isBrowser() ? Util.getAbsolutPixel( "h", 0.86, 185) : "275x"));
                
            this.$.scroller.applyStyle("height", value);
            this.$.okButton.setCaption( $L("Filter") );
        }

        // put values from storage in ui
        this.$.rowGroupTags.render();
        
        this.$.rowGroupTags.setCaption( $L("Tags") + " (" + this.getAllTags().length + ")");
    },
        
    tagChanged : function ( inValue ) {
        if (Util.isDebug()) {
            this.log("inValue: " + inValue.name);
        }
        var newValue = inValue.name.substr(2, inValue.name.length); 
        if (Util.isDebug()) {
            this.log("tag: " + newValue);
        }
        var checked = inValue.getChecked();
        if (checked == true) {
            // add tag to tag-list
            if (this.getTags() == "") {
                this.setTags(newValue);
            } else {
                this.setTags( this.getTags() + "," + newValue);
            }
            
        } else {
            // remove tag from tag-list
            var result = "";
            var valuesArray = String(this.getTags()).split(",");
            for(key in valuesArray) {
                var obj = valuesArray[key];
                if (obj != newValue) {
                    if (result.length != 0) {
                        result += ",";
                    }
                    result += obj;
                } 
            }
            this.setTags( result );
        }
        
        if (Util.isDebug()) {
            this.log("selected tags: " + this.getTags());
        }
    },
    
    closeDialog : function( ) {
        if (Util.isDebug()) {
            this.log();
        }
        if (this.$.rowGroupTags) {
            this.$.rowGroupTags.destroyControls();
        }
        this.setAllTags( [] );
        this.$.okButton.setActive( false );
        this.$.searchBox.setValue( "" );
        this.destroy();
        this.close();
    },
    
    onClear : function( ) {
        if (Util.isDebug()) {
            this.log();
        }
        this.setTags( "" );
        
       // store filter
        localStorage.removeItem("filterTags");     
        localStorage.setItem("filterTags", this.getTags());
        Settings.getSettings( true );
     
        this.onSubmit( undefined, undefined, true );        
    },

    onSubmitForCreate : function( force ) {
        if (Util.isDebug()) {
            this.log("this.getFuncName(): " + this.getFuncName());
        }
        if (this.getFuncName().length > 0) {
            
            // sort tags
            var resultArray = [];
            var valuesArray = String(this.getTags()).split(",");
            
            resultArray = (valuesArray.sort(function(a,b) {  
                // enyo.log(" +----> b: " + b.time_updated + ", a: " + a.time_updated);
                return a.localeCompare( b );
            }));  
        
            // a function that binds this to this.foo
            var fn = enyo.bind(this.getScope(), this.getFuncName());
            // the value of this.foo(3)
            // var tags = this.getTags();
            // this.log("tags: " + tags);
            
            fn( resultArray );
        }
    },
   
    setActive : function ( value ) {
        this.$.okButton.setActive( value ); 
    },
    
    onSubmit : function( inSender, inEvent, force ) {
        if (this.createMode == true) {
            this.onSubmitForCreate( force );
        } else {
            if (Util.isDebug()) {
                this.log("this.getFuncName(): " + this.getFuncName());
                this.log("force: " + force);
            }
            if (this.getFuncName().length > 0) {
                this.setActive( true ); 
                // a function that binds this to this.foo
                var fn = enyo.bind(this.getScope(), this.getFuncName());
    
                var result = fn( Settings.getSettings().notebook, this.getTags(), Settings.getSettings().filterType, force );
    
                if (Util.isDebug()) {
                    this.log("result.length: " + result.length);
                }
                if (result.length > 0 || force == true) {
                    if (this.getFuncName2().length > 0) {
                        // store filter
                        localStorage.removeItem("filterTags");     
                        localStorage.setItem("filterTags", this.getTags());
                        Settings.getSettings( true );
    
                        if (Util.isDebug()) {
                            this.log("calling " + this.getFuncName2());
                        }
                        // a function that binds this to this.foo
                        var fn2 = enyo.bind(this.getScope(), this.getFuncName2());
                        // the value of this.foo(3)
                    // this.log("force: " + force);
                        var value = fn2( Settings.getSettings().notebook, this.getTags(), Settings.getSettings().filterType );
                    }
                    this.setActive( false ); 
                    
                    
                    this.closeDialog();
                } else {
                    this.setActive( false ); 
                    this.$.popupDialog.openAtCenter();  
                }
            }
        }
    },
   
    
    showFailurePopup : function ( str, title ) {
        this.$.popupDialog.openAtCenter();  
        if (title !== undefined) {
            this.$.popupDialog.setTitle( title );
        } else {
            this.$.popupDialog.setTitle($L("Failure!"));
        }
        this.$.popupDialog.setMessage(str);
        this.$.popupDialog.hideCancelButton();
    },

    openNewTagDialog : function( ) {
        if (Util.isDebug()) {
            this.log();
        }
        var value = this.$.searchBox.getValue();
        this.$.createTagDialog.openAtCenter();
        this.$.createTagDialog.clearDialog( value );
        this.$.createTagDialog.setFuncName( "createNewTag" );
        this.$.createTagDialog.setScope( this );
        if (value !== undefined && value !== "") {
            this.$.createTagDialog.setDirty( true );
        }
    },
    
    createNewTag : function( inValue ) {
        if (Util.isDebug()) {
            this.log("inValue: " + inValue);
        }
        // add tag to tag-list
        if (this.getTags() == "") {
            this.setTags(inValue);
        } else {
            this.setTags( this.getTags() + "," + inValue);
        }
        
        // add tag to global tags
        var dm = this.owner.getDataManager();
        var globalTags = dm.getAvailableTags();
        var myArray = [ String(inValue).toLowerCase() ];
        dm.addGlobalTags( globalTags, myArray );
        dm.sortAvailableTags();
        globalTags = dm.getAvailableTags();
        this.setValues( globalTags, this.tags, this.createMode );
    },
    
    onSearch : function ( inSender, event ) {
        // this.log("START");
        // scroll to top of list
        this.$.scroller.setScrollTop(0);
        enyo.nextTick("filterItems", enyo.bind(this, "filterItems"));
        // this.log("END");
    },
    
    filterItems : function ( ) {
        if (Util.isDebug()) {
            this.log("START");
        }
        // this.log();
        /*if (this.oldList)
        {
            this.setAllTags(this.oldList);
            this.$.rowGroupTags.setCaption( $L("Tags") + " (" + this.getAllTags().length + ")");
        }*/
       
        if (this.$.searchBox.getValue().toLowerCase().length > 0 && Platform.isTouchpad() == false) {
            this.error("deleting items...");
            this.$.rowGroupTags.destroyControls();
        }
       
        if (this.filter && String(this.filter).length > this.$.searchBox.getValue().toLowerCase().length) {
            // filter string wurde gekuerzt
            if (Util.isDebug()) {
                this.log("resetting items...");
            }
            for (index in this.filteredItems) {
                var name = this.filteredItems[index];
                if (this.$["lc"+name]) {
                    this.$["lc"+name].destroy();
                }
            }
        }
        
        this.filter = this.$.searchBox.getValue().toLowerCase();
        if (Util.isDebug()) {
            this.log("this.filter: " + this.filter);
        }
        this.filteredItems = [];
        
        var searchList = this.getAllTags();
        searchList = (searchList.sort(function(a,b) {  
            // enyo.log(" +----> b: " + b.time_updated + ", a: " + a.time_updated);
            return a.localeCompare( b );
        }));   
        
        for (index in searchList) {
            var name = searchList[index];
            // this.error("name: " + this.$["lc"+name]);
            if (name.toLowerCase().indexOf(this.filter) != -1) {
                this.filteredItems.push(name);
                if (!this.$["lc"+name]) {
                    var kindItem = {
                        kind: "LabeledContainer", 
                        label: name, 
                        name: "lc"+name,
                        components:[
                            {kind : "CheckBox", name : "cb"+name, onChange : "tagChanged" }
                        ]
                    };
                    this.$.rowGroupTags.createComponent( kindItem, {owner: this});
                } else {
                    this.error("item already exists...");
                }
            } else {
                if (this.$["lc"+name]) {
                    this.$["lc"+name].hide();
                    // this.$["lc"+name].render();
                    this.$["lc"+name].destroy();
                } else {
                    this.error("item does not exist: " + "lc"+name);
                }
            } 
            
        }
        this.$.rowGroupTags.render();
        this.oldList = searchList;
        this.$.rowGroupTags.setCaption( $L("Tags") + " (" + this.filteredItems.length + ")");
        if (Util.isDebug()) {
            this.log("END");
        }
    },

    clearSearch : function( ) {
        if (Util.isDebug()) {
            this.log("START");
        }
        this.setValues( this.owner.getDataManager().getAvailableTags(), this.tags, this.createMode );
        if (Util.isDebug()) {
            this.log("END");
        }
    },
   
    closeFailureDialog : function( ) {
        this.$.popupDialog.close();
    },
   
});