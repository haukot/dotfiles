enyo.kind({
    name: "MyPopupDialog",
    kind: enyo.ModalDialog,
    width: (Platform.isTablet() ? "420px" : "320px"), 
    events: {
        onAccept: ""
    },
    components: [
        {kind: "ApplicationEvents", onWindowHidden: "close"},
        {layoutKind: "VFlexLayout", components:[
            {name: "message", kind: enyo.HtmlContent, content: "", className:"enyo-paragraph"},
            {name: "buttonOrientation", layoutKind: "HFlexLayout", components: [
                {name: "cancelButton", kind: "Button", flex:1, caption: $L("No"), onclick: "close"},
                {name: "acceptButton", kind: "ActivityButton", flex:1, caption: $L("Ok"), className: "enyo-button-affirmative", onclick: "acceptButtonClick"}
            ]}
        ]}
    ],
    published: {
        value: ""
    },
    
    create : function () {
        this.inherited(arguments);
    },
    
    setTitle: function(title) {
        if (title !== undefined) {
            this.setCaption(title);
        }
    },  
    
    setMessage: function(message) {
        if (message !== undefined) {
            this.$.message.setContent(message);
        } 
    },  
    
    setAcceptButtonCaption: function(caption) {
        if (caption !== undefined) {
            this.$.acceptButton.setCaption(caption);
        }
    },   
       
    setCancelButtonCaption: function(caption) {
        if (caption !== undefined) {
            this.$.cancelButton.setCaption(caption);
        }
    },    
    
    hideAcceptButton: function() {
        this.$.acceptButton.hide();
    },      
    
    hideCancelButton: function() {
        this.$.cancelButton.hide();
    },
    
    acceptButtonClick: function() {
        this.close();
        this.doAccept( this.value );
    },
    
    setAcceptButtonActive: function( active ) {
        if (active !== undefined) {
            this.$.acceptButton.setActive(active);
        }
    },   
       
    setAcceptButtonStyle: function( style ) {
        if (style !== undefined) {
            this.$.acceptButton.setStyle(style);
        }
    },   
       
});