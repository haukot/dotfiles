enyo.kind({
    name: "AddLinkDialog",
    kind: enyo.ModalDialog,
    height: "250px",
    width: "380px",
    caption: $L("Add new Article"),
    events: {
        onAccept: ""
    },
    components: [
        {kind: "ApplicationEvents", onWindowHidden: "close"},
         {kind: "RowGroup", components: [
            {name: "url", hint: $L("url of new item"), kind: "Input", autoCapitalize: "lowercase", inputType: "url", alwaysLooksFocused: true},
         ]},
         {kind: "RowGroup", components: [
            {name: "title", hint: $L("title of new item"), kind: "Input", alwaysLooksFocused: true},
         ]},
        {layoutKind: "HFlexLayout", components: [
            {name: "cancelButton", kind: "Button", caption: $L("Close"), flex: 1, onclick: "onClose"},
            {name: "addButton", kind: "ActivityButton", caption: $L("Submit"), flex: 1, className: "enyo-button-affirmative", onclick: "onSubmit"},
        ]}
    ],
    
    published: {
        funcName: "",
        funcName2: "",
    },
    
    rendered : function() {
        this.inherited(arguments);
        this.$.cancelButton.setCaption("Close");
    },
    
    setParams : function( url, title, func ) {
        this.$.url.setValue( url );
        this.$.title.setValue( title );
        if (func !== undefined) {
            this.setFuncName( func );
        }
       
    },
    
    onClose : function( ) {
        if (this.getFuncName2().length > 0) {
            if (Util.isDebug()) {
                this.log("calling " + this.getFuncName2());
            }
            // a function that binds this to this.foo
            var fn = enyo.bind(this.owner, this.getFuncName2());
            // the value of this.foo(3)
            var value = fn();
        }
        this.close();
    },
    
    setFinished : function( value, func2 ) {
        this.setActive( false );
        if (value == true) {
            this.$.addButton.setCaption("Added feed!");
            this.$.addButton.setDisabled(true); 
            // this.$.cancelButton.setCaption("Ok");
            this.setCaption("Link added successfully");
            this.$.url.setDisabled(true);
            this.$.title.setDisabled(true);
            if (func2 !== undefined) {
                this.setFuncName2( func2 );
            }
        } else {
            this.$.addButton.setCaption($L("Failure!"));
            // this.$.cancelButton.setCaption("Close");
            this.setCaption("Operation failed");
        }
    },
    
    setActive : function ( value ) {
        this.$.addButton.setActive( value ); 
        this.$.url.disabled = !value; 
        this.$.title.disabled = !value; 
    },
    
    onSubmit : function( ) {
        if (Util.isDebug()) {
            this.log("this.getFuncName(): " + this.getFuncName());
        }
        var url = this.$.url.getValue().trim();
        var title = this.$.title.getValue().trim();
        if (this.getFuncName().length > 0 && url.length > 0) {
            this.setActive( true ); 
            // a function that binds this to this.foo
            var fn = enyo.bind(this.owner.$.dataManager, this.getFuncName());
            // the value of this.foo(3)
            var value = fn(url, title);
        }
    },

    resetAddItemDialog : function() {
        if (Util.isDebug()) {
            this.log("START");
        }
        // this.log();
        this.$.url.disabled = false; 
        this.$.title.disabled = false; 

        this.$.url.setValue("");
        this.$.title.setValue("");

        this.$.url.setDisabled(false);
        this.$.title.setDisabled(false);

        this.$.addButton.setDisabled(false); 
        this.$.addButton.setCaption("Submit");
        // this.$.cancelButton.setCaption("Close");
        if (Util.isDebug()) {
            this.log("END");
        }
    },

    
});