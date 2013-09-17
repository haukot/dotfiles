enyo.kind({
    name: "TypeDialog",
    kind: enyo.ModalDialog,
    caption: $L("Select Type"),
    events: {
        onAccept: ""
    },
    components: [
        {kind: "ApplicationEvents", onWindowHidden: "close"},
        {name: "scroller", kind: enyo.Scroller, flex: 1, height: (Platform.isWebOS() ?  
                (Platform.isTouchpad() ? Util.getAbsolutPixel( "h", 0.86, 125) : (Platform.isTouchpadOrPre3() ? "330px" : "220px"))
                : (Platform.isTablet() || Platform.isBrowser() ? Util.getAbsolutPixel( "h", 0.86, 125) : "330px")), autoHorizontal: false, horizontal: false, components: [
            {name: "rowGroupTags", kind: "RowGroup", caption: $L("Tags") , components: [
            ]},
        ]},
        /*{kind: "RowGroup", caption: $L("Selection") , components: [
            {kind: "LabeledContainer", className: "enyo-text-body", label: $L("Search only in current selection?"), components: [
                {kind: "CheckBox", name: "searchNotInAll"}
            ]},
        ]},*/
        {layoutKind: "HFlexLayout", style: "padding-top: 10px; ", components: [
            {name: "clearButton", kind: "Button", caption: (Platform.isTablet() ? $L("Clear ") : $L("Clear")), flex: 1, className: "enyo-button-negative", onclick: "onClear"},
            {name: "cancelButton", kind: "Button", caption: (Platform.isTablet() ? $L("Cancel ") : $L("Cancel")), flex: 1, className: "enyo-button-dark", onclick: "closeDialog"},
            {name: "okButton", kind: "ActivityButton", caption: $L("Filter"), flex: 1, className: "enyo-button-affirmative", onclick: "onSubmit"},
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
        type: "",
        allTypes: [],
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
                (Platform.isTouchpad() ? Util.getAbsolutPixel( "h", 0.86, 125) : (Platform.isTouchpadOrPre3() ? "330px" : "220px"))
                : (Platform.isTablet() || Platform.isBrowser() ? Util.getAbsolutPixel( "h", 0.86, 125) : "330px"));
        if (Util.isDebug()) {
            this.log("scrollerH: " + scrollerH);
        }
        this.$.scroller.applyStyle("height", scrollerH);
    },
    
    setValues : function( allTypes, type ) {
        if (type === undefined) {
            type = "";
        }
        
        if (this.$.rowGroupTags) {
            if (Util.isDebug()) {
                this.log("deleting old type elements...");
            }
            this.$.rowGroupTags.destroyControls();
        }
        
        if (Util.isDebug()) {
            this.log("allTypes: " + allTypes);
            this.log("type: " + type);
        }
        
        // create type
        for (key in allTypes) {
            var obj = allTypes[key];
            // this.log("key: " + key);
            // this.log("obj: " + obj);
            var t = obj;
            var kindItem = {
                kind: "LabeledContainer", 
                label: $L(t), 
                name: "lc"+t,
                components:[
                    {kind : "CheckBox", name : "cb"+t, onChange : "typeChanged" }
                ]
            };
            this.$.rowGroupTags.createComponent( kindItem, {owner: this});
        }

        if (type != "") {
            var t = StringUtils.getValueFromString(type);
            
            if (this.$["cb"+type]) {
                this.$["cb"+type].setChecked(true);
            }
        }
        
        this.setType( type );

        // put values from storage in ui
        this.$.rowGroupTags.render();
        
        this.$.rowGroupTags.setCaption( $L("Types"));
    },
        
    typeChanged : function ( inValue ) {
        if (inValue === undefined || inValue == "" || inValue.name === undefined) {
            return;
        }
        
        if (this.getType() != "") {
            this.$["cb" + this.getType()].setChecked(false);
        }
        
        if (Util.isDebug()) {
            this.log("inValue.name: " + inValue.name);
        }
        var newValue = inValue.name.substr(2, inValue.name.length); 
        if (Util.isDebug()) {
            this.log("type: " + newValue);
        }
        var checked = inValue.getChecked();
        if (checked == true) {
            // add tag to tag-list
            this.setType( newValue );
        } else {
            // remove tag from tag-list
            this.setType( "" );
        }
        
        if (Util.isDebug()) {
            this.log("selected type: " + this.getType());
        }
    },
    
    closeDialog : function( ) {
        if (Util.isDebug()) {
            this.log();
        }
        if (this.$.rowGroupTags) {
            this.$.rowGroupTags.destroyControls();
        }
        this.setAllTypes( [] );
        this.destroy();
        this.close();
    },
    
    onClear : function( ) {
        if (Util.isDebug()) {
            this.log();
        }
        this.setType( "" );
       // store filter
        localStorage.removeItem("filterType");     
        localStorage.setItem("filterType", this.getType());
        Settings.getSettings( true );
     
        this.onSubmit( undefined, undefined, true );        
    },

    /*onSubmit : function( force ) {
        this.log("this.getFuncName(): " + this.getFuncName());
        if (this.getFuncName().length > 0) {
            
            var fn = enyo.bind(this.getScope(), this.getFuncName());
            fn( this.getType(), !this.$.searchNotInAll.getChecked() );
        }
    },*/
    
    setActive : function ( value ) {
        this.$.okButton.setActive( value ); 
    },
    
    onSubmit : function( inSender, inEvent, force ) {
        if (Util.isDebug()) {
            this.log("this.getFuncName(): " + this.getFuncName());
            this.log("force: " + force);
            this.log("this.getType(): " + this.getType());
        }
        if (this.getFuncName().length > 0) {
            this.setActive( true ); 
            // a function that binds this to this.foo
            var fn = enyo.bind(this.getScope(), this.getFuncName());

            var result = fn( Settings.getSettings().notebook, Settings.getSettings().filterTags, this.getType(), force );

            if (Util.isDebug()) {
                this.log("result.length: " + result.length);
            }
            if (result.length > 0 || force == true) {
                if (this.getFuncName2().length > 0) {
                    // store filter
                    localStorage.removeItem("filterType");     
                    localStorage.setItem("filterType", this.getType());
                    Settings.getSettings( true );

                    if (Util.isDebug()) {
                        this.log("calling " + this.getFuncName2());
                    }
                    // a function that binds this to this.foo
                    var fn2 = enyo.bind(this.getScope(), this.getFuncName2());
                    // the value of this.foo(3)
                // this.log("force: " + force);
                    var value = fn2( Settings.getSettings().notebook, Settings.getSettings().filterTags, this.getType() );
                }
                this.setActive( false ); 
                
                
                this.closeDialog();
            } else {
                this.setActive( false ); 
                this.$.popupDialog.openAtCenter();  
            }
        }
    },

    closeFailureDialog : function( ) {
        this.$.popupDialog.close();
    },
    
});