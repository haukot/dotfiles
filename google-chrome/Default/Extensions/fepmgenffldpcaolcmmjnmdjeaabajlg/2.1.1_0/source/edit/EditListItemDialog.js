enyo.kind({
    name: "EditListItemDialog",
    kind: enyo.ModalDialog,
    /*height: "285px",*/
    width: (Platform.isTablet() ? "680px" : "320px"),
    caption: $L("Edit List Entry"),
    events: {
        onAccept: "",
        onUpdateItem: "",
    },
    components: [
        {kind: "ApplicationEvents", onWindowHidden: "close"},
        {name: "springpadApi", kind: "SpringpadApi"},
        {name: "scroller", kind: enyo.Scroller, flex: 1, height: "160px", autoHorizontal: false, horizontal: false, components: [
            {kind: "RowGroup", components: [
                /*{name: "name", hint: $L("Name"), kind: "Input", alwaysLooksFocused: true, autoCapitalize: "lowercase"},*/
                (Platform.isWebOS() ? 
                        {name: "name", style: "background-color: white; min-height: 150px;", kind: "RichText", richContent: true, oninput: "setDirty"} 
                        : {name: "name", style: "background-color: white; min-height: 150px;", kind: "Textarea", richContent: true, oninput: "setDirty"} )
            ]},
        ]},
        {layoutKind: "HFlexLayout", style: "padding-top: 10px;", components: [
            {name: "cancelButton", kind: "Button", caption: $L("Cancel "), flex: 1, onclick: "closeDialog"},
            {name: "addButton", kind: "ActivityButton", caption: $L("Update"), flex: 1, className: "enyo-button", onclick: "onSubmit"},
        ]},
        {kind: "ModalDialog", name: "popupDialog", caption: $L("Error"), components:[
             {name: "inhalt", content: $L("Item could not be saved!"), className: "enyo-paragraph"},
             {layoutKind: "HFlexLayout", components: [
                 {kind: "Button", caption: $L("Ok"), flex: 1, onclick: "closeDialog"},
             ]}
         ]},
    ],
    
    published: {
        listitem: null,
        item: null,
        funcName: "",
        scope: "",
    },
    
    rendered : function() {
        this.inherited(arguments);
        if (Platform.isTablet() || Platform.isTouchpadOrPre3()) {
            this.$.addButton.setDisabled( true );
            if (Util.isDebug()) {
                this.log("setting focus...");
            }
            this.$.name.forceFocusEnableKeyboard();  
        } else {
            this.$.addButton.addClass("enyo-button-affirmative");  
        }
    },
    
    setItem : function( listitem, item ) {
        this.listitem = listitem;
        this.item = item;
        this.$.name.setValue( listitem.name );
        this.$.name.setSelection({start: 0, end: 0});     
    },

    clearDialog : function( ) {
        this.isDirty = false;
        this.$.addButton.setActive( false ); 
        this.$.cancelButton.setDisabled( false ); 
        this.$.name.setDisabled( false ); 
        this.$.name.setValue("");
        if (Platform.isTablet() || Platform.isTouchpadOrPre3()) {
            this.$.name.forceFocusEnableKeyboard();  
            this.$.addButton.setDisabled( true );
            this.$.addButton.removeClass("enyo-button-affirmative");  
        }
    },
    
    closeDialog : function( ) {
        this.close();
    },
    
    setActive : function ( value ) {
        this.$.addButton.setActive( value ); 
        this.$.cancelButton.setDisabled( !value ); 
        this.$.name.setDisabled( !value ); 
    },
    
    onSubmit : function( ) {
        this.setActive( true );
        
        var name = this.$.name.getValue().trim();
        
        // var result = "[[\"set\", \"" + this.listitem.uuid + "\", \"name\", \"" + name + "\" ]]";
        // result += "[\"set\", \"" + this.item.uuid + "\", \"modified\", \"/Date(" + d.getTime() + ")/\" ]]";

        var result = [];
        var step = [];
        step.push("set", this.listitem.uuid, "name", name);
        result.push( step );

        // this.log("result: "+ result);
        if (Util.isDebug()) {
            this.log("result: "+ JSON.stringify(result));
        }

        
        this.listitem.name = name;
        
        for (key in this.item.properties.items) {
            var obj = this.item.properties.items[key];
            if (Util.isDebug()) {
                this.log("obj: " + JSON.stringify( obj ) );
            }
            if (obj.uuid == this.listitem.uuid) {
                if (Util.isDebug()) {
                    this.log("found it, now updating list item...");
                }
                this.item.properties.items[key] = this.listitem;
            }
        }
        
        this.item.modified = "/Date(" + new Date().getTime() + ")/";
        
        enyo.asyncMethod( this, "doUpdateItem", [ JSON.stringify(result), this.item, "listitem" ] );
    },

    createSuccess : function( inSender, responseText ) {
        this.setActive( false );
        // this.log();    
        if (Util.isDebug()) {
            this.log(JSON.stringify(responseText));
        }
        if (responseText.success == true) {
            // TODO: create local item

        }
        this.closeDialog();
    },
     
    createFailure : function( inSender, responseText, inRequest ) {
        this.setActive( false );
        this.error(JSON.stringify(responseText));
        this.error(JSON.stringify(inRequest.xhr));
        this.showFailurePopup( responseText );
    },

    showFailurePopup : function ( message ) {
        if (Util.isDebug()) {
            this.log("message: " + JSON.stringify(message));
        }
        if (this.$.tempControl !== undefined) {
            this.$.tempControl.setActive( false );
        }
        this.$.popupDialog.openAtCenter();  
        if (message !== undefined && message[0] !== undefined) {
            if (Util.isDebug()) {
                this.log("code: " + message[0].code);
            }
            this.$.inhalt.setContent( this.$.inhalt.getContent() + " ( Code: " + message[0].code + ", Message: " + message[0].message + ", Command: " + message[0].command + " )");
        }
    },
    
    setDirty : function() {
        // this.log();
        if (Util.isDebug()) {
            this.log();
        }
        this.isDirty = true;
        this.$.addButton.addClass("enyo-button-affirmative");
        this.$.addButton.setDisabled( false );
    },
    
});