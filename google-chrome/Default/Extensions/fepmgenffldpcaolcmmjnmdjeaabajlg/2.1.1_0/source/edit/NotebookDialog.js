enyo.kind({
    name: "NotebookDialog",
    kind: enyo.ModalDialog,
    /*height: (Platform.isWebOS() ?  
                (Platform.isTouchpad() ? Util.getAbsolutPixel( "h", 0.86) : (Platform.isTouchpadOrPre3() ? "460px" : "360px"))
                : (Platform.isTablet() || Platform.isBrowser() ? Util.getAbsolutPixel( "h", 0.86) : "460px")),*/
    width: (Platform.isTablet() ? "480px" : "320px"),
    caption: $L("Select Notebook"),
    events: {
        onAccept: "",
        onCreateNotebook: ""
    },
    components: [
        {kind: "ApplicationEvents", onWindowHidden: "close"},
        {name: "newNotebookButton", kind: "Button", caption: $L("Create New Notebook"), flex: 1, className: "enyo-button-dark", onclick: "openNewNotebookDialog"},
        {name: "scroller", kind: enyo.Scroller, flex: 1, height: (Platform.isTablet() ? Util.getAbsolutPixel( "h", 0.86, 170) : (Platform.isTouchpadOrPre3() ? "295px" : "190px")), autoHorizontal: false, horizontal: false, components: [
            {name: "rowGroupNotebooks", kind: "RowGroup", caption: $L("Notebooks") , components: [
            ]},
        ]},
        {flex: 1},       
        {layoutKind: "HFlexLayout", style: "padding-top: 10px; ", components: [
            {name: "cancelButton", kind: "Button", caption: $L("Cancel "), flex: 1, className: "enyo-button-dark", onclick: "closeDialog"},
            {name: "okButton", kind: "Button", caption: $L("Ok"), flex: 1, className: "enyo-button-affirmative", onclick: "onSubmit"},
        ]},
        {name: "createNotebookDialog", kind: "CreateNotebookDialog"},
        {kind: "ModalDialog", name: "popupDialog", caption: $L("Failure!"), components:[
            {content: $L("That notebook already exists!"), className: "enyo-paragraph"},
            {layoutKind: "HFlexLayout", components: [
                {kind: "Button", caption: $L("Ok"), flex: 1, onclick: "closeFailureDialog", className: "enyo-button-negative"},
            ]}
        ]},
    ],
    
    published: {
        funcName: "",
        funcName2: "",
        scope: "",
        notebook: "",
        notebooks: "",
        allNotebooks: [],
        createMode: false,
    },
    
    rendered : function() {
        this.inherited(arguments);
        if (Util.isDebug()) {
            this.log();
        }
    },
    
    setValues : function( allNotebooks, notebooks, isCreate ) {
        if (notebooks === undefined || notebooks == "undefined") {
            notebooks = "";
        }

        if (this.$.rowGroupNotebooks) {
            if (Util.isDebug()) {
                this.log("deleting old notebook elements...");
            }
            this.$.rowGroupNotebooks.destroyControls();
        }
                
        if (Util.isDebug()) {
            this.log("allNotebooks: " + allNotebooks);
            this.log("allNotebooks.length: " + allNotebooks.length);
            this.log("notebooks: " + notebooks);
            this.log("isCreate: " + isCreate);
        }
        
        // create notebooks
        for (key in allNotebooks) {
            var obj = allNotebooks[key];
            if (obj == null) {
                continue;
            }
            // this.log("key: " + key);
            // this.log("obj: " + enyo.json.stringify(obj));
            // str = str.replace();
            var name = StringUtils.getValueFromString( obj.uuid )
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
            this.getAllNotebooks().push( name );
        }
        
        if (notebooks != "") {
            var filterTagsArray = String(notebooks).split(",");
            for(key in filterTagsArray) {
                var notebook = filterTagsArray[key];
                if (Util.isDebug()) {
                    this.log("notebook: " + notebook);
                }
                if (this.$["cbn"+notebook]) {
                    this.$["cbn"+notebook].setChecked(true);
                } else {
                    if (filterTagsArray.length == 1) {
                        this.$["cbnundefined"].setChecked(true);
                    }
                }
            }
        } else {
            this.$["cbnundefined"].setChecked(true);
            notebooks = "undefined";
        }
        
        this.setNotebooks( notebooks );
        // this.setNotebook( notebook );
        this.setAllNotebooks( allNotebooks );

        // put values from storage in ui
        this.$.rowGroupNotebooks.render();
    },
        
    notebookChanged : function ( inValue ) {
        if (inValue === undefined || inValue == null || inValue == "") {
            return;
        }
        if (Util.isDebug()) {
            this.log("inValue: " + inValue);
            this.log("inValue.name: " + inValue.name);
        }
        var newValue = inValue; 
        if (inValue.name !== undefined) {
            newValue = inValue.name.substr(3, inValue.name.length); 
        }
        if (Util.isDebug()) {
            this.log("notebook: " + newValue);
        }
        var checked;
        if (inValue.name !== undefined) {
            checked = inValue.getChecked();    
        } else {
            checked = true;
        }
        if (checked == true) {
            // add tag to tag-list
            if (newValue == "undefined") {
                for (key in this.allNotebooks) {
                    var obj = this.allNotebooks[key];
                    if (Util.isDebug()) {
                        this.log("obj: " + obj);
                    }
                    this.$["cbn"+obj].setChecked(false);
                }
                this.$["cbnundefined"].setChecked( true );
                this.setNotebooks(newValue);
            } else {
                if (this.getNotebooks() == "") {
                    this.setNotebooks(newValue);
                } else {
                    
                    // check if All_My_Stuff was selected before, if so unselect that!
                    if (this.getNotebooks() == "undefined") {
                        this.$["cbnundefined"].setChecked( false );
                        this.setNotebooks(newValue);
                    } else {
                        this.setNotebooks( this.getNotebooks() + "," + newValue);
                    }
                }
            }
            
        } else {
            // remove tag from tag-list
            var posStart = String(this.getNotebooks()).indexOf(newValue);
            if (Util.isDebug()) {
                this.log("posStart: " + posStart);
                this.log("newValue.length: " + String(newValue).length);
                this.log("this.getNotebooks().length: " + this.getNotebooks().length);
            }
            if (posStart != -1) {
                if (posStart + newValue.length == this.getNotebooks().length) {
                    this.setNotebooks( String(this.getNotebooks()).substr(0, posStart-1));
                } else if (posStart == 0){
                    this.setNotebooks( String(this.getNotebooks()).substr(newValue.length+1, String(this.getNotebooks()).length));
                } else {
                    var str1 = String(this.getNotebooks()).substr(0, posStart-1);
                    var str2 = String(this.getNotebooks()).substr(posStart + newValue.length, String(this.getNotebooks()).length);
                    if (Util.isDebug()) {
                        this.log("str1: " + str1);
                        this.log("str2: " + str2);
                    }
                    this.setNotebooks( str1 + str2 );
                }
            }
        }
        if (String(this.getNotebooks()).length == 0) {
            this.$["cbnundefined"].setChecked( true );
            this.setNotebooks("All_My_Stuff");
        }
        
        if (Util.isDebug()) {
            this.log("selected notebooks: " + this.getNotebooks());
        }

        // var childs = this.$.rowGroupTags.getControls();
        // for (key in childs) {
            // // this.log("child: " + childs[key].name);
            // if (childs[key].name == newValue) {
                // this.log("obj: " + childs[key].name);
            // }
        // }
    },
    
    closeDialog : function( ) {
        if (Util.isDebug()) {
            this.log();
        }
        if (this.$.rowGroupNotebooks) {
            this.$.rowGroupNotebooks.destroyControls();
        }
        this.setAllNotebooks( [] );
        this.close();
    },
    
    onSubmit : function( force ) {
        if (Util.isDebug()) {
            this.log("this.getFuncName(): " + this.getFuncName());
        }
        if (this.getFuncName().length > 0) {
            // a function that binds this to this.foo
            var fn = enyo.bind(this.getScope(), this.getFuncName());
            // the value of this.foo(3)
            var notebooks = this.getNotebooks();
            if (Util.isDebug()) {
                this.log("notebooks: " + notebooks);
            }
            if (notebooks == "All_My_Stuff") {
                notebooks = "";
            }
            if (Util.isDebug()) {
                this.log("notebooks: " + notebooks);
            }
            
            var result = [];
            if (notebooks != "") {
                var filterTagsArray = String(notebooks).split(",");
                for(key in filterTagsArray) {
                    var notebook = filterTagsArray[key];
                    result.push( notebook );
                }
            }
            fn( result );
        }
    },
    
    openNewNotebookDialog : function( ) {
        if (Util.isDebug()) {
            this.log();
        }
        this.$.createNotebookDialog.openAtCenter();
        this.$.createNotebookDialog.clearDialog();
        this.$.createNotebookDialog.setData( this.owner.getDataManager().getSpringpadAccents() );
        this.$.createNotebookDialog.setFuncName( "createNewNotebook" );
        this.$.createNotebookDialog.setScope( this );
    },
    
    createNewNotebook : function( inValue ) {
        if (Util.isDebug()) {
            this.log("inValue: " + inValue);
        }
        
        // add notebook if not already exists
        var alreadyExists = false;
        var existingUuid;
        for (key in this.owner.getDataManager().getNotebooks()) {
            var obj = this.owner.getDataManager().getNotebooks()[key];
            if (String(obj.name).toLowerCase() == String(inValue).toLowerCase()) {
                alreadyExists = true;
                existingUuid = StringUtils.getValueFromString( obj.uuid );
                if (Util.isDebug()) {
                    this.log("existingUuid: " + existingUuid);
                }
            }
        }
        if (Util.isDebug()) {
            this.log("alreadyExists: " + alreadyExists );
        }
        
        var oldNotebooks = ((this.notebooks != "" && this.notebooks !== undefined && this.notebooks != "undefined") ? this.notebooks + "," : "");
        if (Util.isDebug()) {
            this.log("oldNotebooks: " + oldNotebooks );
        }
        
        if (!alreadyExists) {
            var uuid = Util.createUuid();

            var newUuid = "/UUID(" + uuid + ")/";
            var newKind = {
                "uuid": newUuid,
                "name": inValue
            }
            if (Util.isDebug()) {
                this.log("newKind: " + newKind);
            }
            this.allNotebooks.push( newKind );
            
            this.notebooks = oldNotebooks + uuid;
            if (Util.isDebug()) {
                this.log("this.notebooks: " + this.notebooks );
            }
            enyo.asyncMethod( this, "doCreateNotebook", [ uuid, inValue ] );
        } else {
            this.notebooks = oldNotebooks + existingUuid;
            if (Util.isDebug()) {
                this.log("this.notebooks: " + this.notebooks );
            }
            if (this.$["cbn"+existingUuid]) {
                if (Util.isDebug()) {
                    this.log("setting checked...");
                }
                this.$["cbnundefined"].setChecked(false);
                this.$["cbn"+existingUuid].setChecked(true);
            } else {
                if (Util.isDebug()) {
                    this.log("not setting checked... :-()");
                }
            }
            // this.$.popupDialog.openAtCenter();
        }

        this.setValues( this.allNotebooks, this.notebooks, this.createMode );
    },

    closeFailureDialog : function( ) {
        if (Util.isDebug()) {
            this.log();
        }
        this.$.popupDialog.close();
    },
   
});