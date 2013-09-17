enyo.kind({
    name: "FilerDialog",
    kind: enyo.ModalDialog,
    height: (Platform.isWebOS() ?  
                (Platform.isTouchpad() ? Util.getAbsolutPixel( "h", 0.86) : (Platform.isTouchpadOrPre3() ? "460px" : "350px"))
                : (Platform.isTablet() || Platform.isBrowser() ? Util.getAbsolutPixel( "h", 0.86) : "460px")),
    width: (Platform.isTablet() ? "480px" : "320px"),
    caption: $L("Select Notebook"),
    style: "padding: 0px; margin: 0px;",
    events: {
        onAccept: "",
        onCreateNotebook: "",
    },
    components: [
        {kind: "ApplicationEvents", onWindowHidden: "close"},
        {name: "newNotebookButton", kind: "Button", caption: $L("Create New Notebook"), flex: 1, className: "enyo-button-dark", onclick: "openNewNotebookDialog"},
        {name: "scroller", kind: enyo.Scroller, flex: 1, height: (Platform.isWebOS() ?  
                (Platform.isTouchpad() ? Util.getAbsolutPixel( "h", 0.86, 225) : (Platform.isTouchpadOrPre3() ? "275px" : "165px"))
                : (Platform.isTablet() || Platform.isBrowser() ? Util.getAbsolutPixel( "h", 0.86, 225) : "275px")), autoHorizontal: false, horizontal: false, components: [
            {name: "rowGroupNotebooks", kind: "RowGroup", caption: $L("Notebook") , components: [
            ]},
        ]},
        {layoutKind: "HFlexLayout", style: "padding-top: 10px; ", components: [
            {name: "clearButton", kind: "Button", caption: (Platform.isTablet() ? $L("Clear ") : $L("Clear")), flex: 1, className: "enyo-button-negative", onclick: "onClear"},
            {name: "cancelButton", kind: "Button", caption: (Platform.isTablet() ? $L("Cancel ") : $L("Cancel")), flex: 1, className: "enyo-button-dark", onclick: "onClose"},
            {name: "filterButton", kind: "ActivityButton", caption: $L("Filter"), flex: 1, className: "enyo-button-affirmative", onclick: "onSubmit"},
        ]},
        {kind: "ModalDialog", name: "popupDialog", caption: $L("Failure!"), components:[
            {content: $L("Your current request did not return any articles."), className: "enyo-paragraph"},
            {layoutKind: "HFlexLayout", components: [
                {kind: "Button", caption: $L("Ok"), flex: 1, onclick: "closeFailureDialog", className: "enyo-button-negative"},
            ]}
        ]},
        {kind: "ModalDialog", name: "popupDialog", caption: $L("Failure!"), components:[
            {content: $L("Your current request did not return any articles."), className: "enyo-paragraph"},
            {layoutKind: "HFlexLayout", components: [
                {kind: "Button", caption: $L("Ok"), flex: 1, onclick: "closeFailureDialog", className: "enyo-button-negative"},
            ]}
        ]},
        {name: "createNotebookDialog", kind: "CreateNotebookDialog"}
    ],
    
    published: {
        funcName: "",
        funcName2: "",
        scope: "",
        notebook: "",
        force: false,
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
        this.applyStyle("height", height);
        
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
        
    setValues : function( notebooks, notebook, isCreate ) {
        if (Util.isDebug()) {
            this.log("notebooks: " + notebooks);
            this.log("notebook: " + notebook);
            this.log("isCreate: " + isCreate);
        }
        
        this.setForce( false );
        
        this.setNotebook( notebook );
        // this.toggleButton( notebook );

        // create notebooks
        for (key in notebooks) {
            var obj = notebooks[key];
            if (Util.isDebug()) {
                this.log("key:` " + key);
                this.log("obj: " + enyo.json.stringify(obj));
            }
            // str = str.replace();
            var name = StringUtils.getValueFromString( obj.uuid );
            var label = obj.name.replace(/\s/gi, "_");
            // this.log("name: " + name);
            var kindItem = {
                kind: "LabeledContainer", 
                label: obj.name, 
                name: "lcn"+name,
                components:[
                    {kind : "CheckBox", name : "cbn"+name, onChange : "notebookChanged" }
                ]
            };
            this.$.rowGroupNotebooks.createComponent( kindItem, {owner: this});
        }
        // this.$["cbn"+notebook.replace(/\s/gi, "_")].setChecked(true);
        if (this.$["cbn"+notebook]) {
            this.$["cbn"+notebook].setChecked(true);
        } else if (this.$["cbnundefined"]){
            this.$["cbnundefined"].setChecked(true);
        }
        
        // put values from storage in ui

        this.createMode = isCreate;
        if (this.createMode == true) {
            this.$.newNotebookButton.show();
        } else {
            this.$.newNotebookButton.hide();
            var value = (Platform.isWebOS() ?  
                (Platform.isTouchpad() ? Util.getAbsolutPixel( "h", 0.86, 125) : (Platform.isTouchpadOrPre3() ? "335px" : "225px"))
                : (Platform.isTablet() || Platform.isBrowser() ? Util.getAbsolutPixel( "h", 0.86, 125) : "335px"));
            this.$.scroller.applyStyle("height", value);
            // this.render();
        }

        this.$.rowGroupNotebooks.render();
    },
    
    notebookChanged : function( inValue ) {
        
        if (inValue.name === undefined) {
            return;
        }
        
        var newState = inValue.getChecked();
        
        if (Util.isDebug()) {
            this.log("inValue: " + inValue.name );
            this.log("newState: " + newState );
            this.log("this.$[inValue.name].getChecked(): " + this.$[inValue.name].getChecked());
        }

        var childs = this.$.rowGroupNotebooks.getControls();
        for (key in childs) {
            var firstNestedChild = childs[key].getControls()[0];
            if (firstNestedChild !== undefined) {
                // this.log("firstNestedChild: " + firstNestedChild.name);
                this.$[firstNestedChild.name].setChecked(false);
            }
        }
        this.$[inValue.name].setChecked( newState );

        var newValue = inValue.name.substr(3, inValue.name.length);

        if (newState == false) {
            newValue = "undefined";
        }
        
        if (Util.isDebug()) {
            this.log("newValue: " + newValue);
        }
        // var newValue = inValue.name.substr(0, inValue.name.length);
        if (newValue == "undefined") {
            newValue = "All_My_Stuff";
            this.$["cbnundefined"].setChecked( true );
        }
        this.setNotebook( newValue );
    },
    
    onClose : function( ) {
        if (Util.isDebug()) {
            this.log();
        }
        this.$.rowGroupNotebooks.destroyControls();
        this.destroy();
        this.close();
    },
    
    
    setActive : function ( value ) {
        this.$.filterButton.setActive( value ); 
    },
    
    onSubmit : function( inSender, inEvent, force ) {
        if (Util.isDebug()) {
            this.log("this.getFuncName(): " + this.getFuncName());
            this.log("this.getForce(): " + this.getForce());
        }
        if (this.getFuncName().length > 0) {
            this.setActive( true ); 
            // a function that binds this to this.foo
            var fn = enyo.bind(this.getScope(), this.getFuncName());
            // the value of this.foo(3)
            var nb = this.getNotebook();
            if (Util.isDebug()) {
                this.log("nb: " + nb);
            }
            if (nb == "undefined") {
                nb = "All_My_Stuff";
            }
            if (Util.isDebug()) {
                this.log("nb: " + nb);
            }
            var result = fn( nb, Settings.getSettings().filterTags, Settings.getSettings().filterType, force );
            if (Util.isDebug()) {
                this.log("result.length: " + result.length);
            }
            if (result.length > 0 || force == true) {
                if (this.getFuncName2().length > 0) {
                    if (Util.isDebug()) {
                        this.log("calling " + this.getFuncName2());
                    }
                    // a function that binds this to this.foo
                    var fn2 = enyo.bind(this.getScope(), this.getFuncName2());
                    // the value of this.foo(3)
                // this.log("force: " + force);
                    var value = fn2( nb, Settings.getSettings().filterTags, Settings.getSettings().filterType );
                }
                this.setActive( false ); 
                
                // store filter
                localStorage.removeItem("itemState");     
                localStorage.setItem("itemState", this.getNotebook());
                
                this.onClose();
            } else {
                this.setActive( false ); 
                this.$.popupDialog.openAtCenter();  
            }
        }
    },
    
    onClear : function( ) {
        if (Util.isDebug()) {
            this.log();
        }
        this.setNotebook( "All_My_Stuff" );
        
       // store filter
        localStorage.removeItem("notebook");     
        localStorage.setItem("notebook", this.getNotebook());
        Settings.getSettings( true );
     
        this.onSubmit( undefined, undefined, true );        
    },

    closeFailureDialog : function( ) {
        this.$.popupDialog.close();
    },

    openNewNotebookDialog : function( ) {
        if (Util.isDebug()) {
            this.log();
        }
        this.$.createNotebookDialog.openAtCenter();
        this.$.createNotebookDialog.setFuncName( "createNewNotebook" );
        this.$.createNotebookDialog.setScope( this );
    },
    
    createNewNotebook : function( inValue ) {
        if (Util.isDebug()) {
            this.log("inValue: " + inValue);
        }
        // add tag to tag-list
        this.setNotebook(inValue);
        
        // add notebook if not already exists
        var alreadyExists = false;
        for (key in this.owner.getDataManager().getNotebooks()) {
            var obj = this.owner.getDataManager().getNotebooks()[key];
            if (String(obj.name).toLowerCase() == String(inValue).toLowerCase()) {
                alreadyExists = true;
            }
        }
        
        if (!alreadyExists) {

            var uuid = Util.createUuid();
            uuid = "/UUID(" + uuid + ")/";
            // var result = "[[\"create\", \"Workbook\", \"" + uuid + "\"],";
            // result += "[\"set\", \"name\", \"" + inValue + "\" ]]";

            var result = [];

            var step = [];
            step.push("create", "Workbook", uuid);
            result.push( step );

            step = [];
            step.push("set", "name", inValue);
            result.push( step );
    
            if (Util.isDebug()) {
                this.log("result: "+ JSON.stringify(result));
            }

           enyo.asyncMethod( this, "doCreateNotebook", [ JSON.stringify(result) ] );
        }

        this.setValues( globalTags, this.tags, this.createMode );
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

    closeFailureDialog : function( ) {
        this.$.popupDialog.close();
    },
   
});