enyo.kind({
    name: "CreateTagDialog",
    kind: enyo.ModalDialog,
    height: "185px",
    width: "380px",
    caption: $L("Create New Tag"),
    events: {
        onAccept: ""
    },
    components: [
        {kind: "ApplicationEvents", onWindowHidden: "close"},
         {kind: "RowGroup", components: [
            {name: "name", hint: $L("Name"), kind: "Input", alwaysLooksFocused: true, autoCapitalize: "lowercase", oninput: "setDirty"},
         ]},
        {layoutKind: "HFlexLayout", components: [
            {name: "cancelButton", kind: "Button", caption: $L("Cancel "), flex: 1, onclick: "closeDialog"},
            {name: "addButton", kind: "ActivityButton", caption: $L("Create"), flex: 1, className: "enyo-button-affirmative", onclick: "onSubmit"},
        ]}
    ],
    
    published: {
        funcName: "",
        scope: "",
        isDirty: false
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
    
    clearDialog : function( value ) {
        this.isDirty = false;
        this.$.addButton.setActive( false ); 
        if (value !== undefined && value != null && value != "") {
            this.$.name.setValue( value );
        } else {
            this.$.name.setValue("");
        }
        if (Platform.isTablet() || Platform.isTouchpadOrPre3()) {
            this.$.name.forceFocusEnableKeyboard();  
        }
    },
    
    closeDialog : function( ) {
        this.close();
    },
    
    setActive : function ( value ) {
        this.$.addButton.setActive( value ); 
        this.$.name.setDisabled( !value ); 
    },
    
    onSubmit : function( ) {
        if (Util.isDebug()) {
            this.log("this.getFuncName(): " + this.getFuncName());
        }
        var name = this.$.name.getValue().trim();
        if (this.getFuncName().length > 0 && name.length > 0) {
            // this.setActive( true ); 
            enyo.nextTick(this.getFuncName(), enyo.bind(this.getScope(), this.getFuncName(), name.toLowerCase()));
            // a function that binds this to this.foo
            
            this.closeDialog();
        }
    },
    
    setDirty : function() {
        // this.log();
        this.isDirty = true;
        this.$.addButton.addClass("enyo-button-affirmative");
        this.$.addButton.setDisabled( false );
    },
    
});