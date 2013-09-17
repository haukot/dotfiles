enyo.kind({
    name: "EditDialog",
    kind: enyo.ModalDialog,
    height: (Platform.isWebOS() ?  
                (Platform.isTouchpad() ? Util.getAbsolutPixel( "h", 0.97) : (Platform.isTouchpadOrPre3() ? "490px" : "375px"))
                : (Platform.isTablet() || Platform.isBrowser() ? Util.getAbsolutPixel( "h", 0.97) : "490px")),
    width: "100%",
    /*style: "background-image: url(../images/pattern.png);",*/
    /*style: "-webkit-border-image: url(../images/popup.png)  42 24 24 24 stretch;",*/
    /*className: "EditDialog",*/
    events: {
        onSaveItem: "",
        onCreateItem:"",
    },
    components: [
        {kind: "ApplicationEvents", onWindowHidden: "close"},
        {kind: "ModalDialog", name: "popupDialog", caption: $L("Error"), components:[
             {name: "inhalt", content: $L("Item could not be saved!"), className: "enyo-paragraph"},
             {layoutKind: "HFlexLayout", components: [
                 {kind: "Button", caption: $L("Ok"), flex: 1, onclick: "closeDialog"},
             ]}
         ]},
    ],
    
    published: {
        item: null,
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
                (Platform.isTouchpad() ? Util.getAbsolutPixel( "h", 0.97) : (Platform.isTouchpadOrPre3() ? "490px" : "375px"))
                : (Platform.isTablet() || Platform.isBrowser() ? Util.getAbsolutPixel( "h", 0.97) : "490px"));
        // this.log("height: " + height);                
        this.applyStyle("height", height);

        if (this.$.tempControl !== undefined) {
            this.$.tempControl.resize();
        }
        
    },
        
    setItem : function( item, type, notebook ) {
        
        if (item == null) {
            this.setCaption( $L("Create " + type) );
        } else {
            this.setCaption( $L("Edit " + type) );
        }
        
        this.item = item;

        if (this.$.tempControl !== undefined) {
            this.$.tempControl.destroy();
        }
        this.$.tempControl = this.createComponent( {name: "tempControl", kind: "EditContent", type: type, notebook: notebook, item: this.item, onSaveItem: "saveItem", onCreateItem: "createItem", onCloseDialog: "onClose"} );
        this.render();
    },
    
    onClose : function( ) {
        if (Util.isDebug()) {
            this.log();
        }
        this.$.tempControl.destroy();
        this.destroy();
        this.close();
    },
    
    showFailurePopup : function (message ) {
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
    
    closeDialog : function() {
        this.$.popupDialog.close();  
    },
    
    setActive : function( active ) {
        if (this.$.tempControl !== undefined) {
            this.$.tempControl.setActive( active );
        }    
    },

    saveItem : function( inSender, inValue ) {
        if (Util.isDebug()) {
            this.log("inSender: " + inSender);
            this.log("inValue: " + inValue);
        }
        this.doSaveItem( inValue );
    },
    
    createItem : function( inSender, inValue ) {
        if (Util.isDebug()) {
            this.log("inSender: " + inSender);
            this.log("inValue: " + inValue);
        }
        this.doCreateItem( inValue );
    },
    
    getDataManager : function() {
        return this.owner.getDataManager();
    },
});