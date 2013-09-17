enyo.kind({
    name: "NoHandlerFoundDialog",
    kind: enyo.ModalDialog,
    height: (Platform.isTablet() ? "245px" : "275px"),
    width: (Platform.isTablet() ? "420px" : "320px"), 
    events: {
        onAccept: ""
    },
    caption: $L("Failure!"),
    components: [
        {kind: "ApplicationEvents", onWindowHidden: "close"},
        {layoutKind: "VFlexLayout", style: "min-height: 170px;", components:[
            {name: "message", kind: enyo.HtmlContent, content: "", className:"enyo-paragraph", allowHtml: true},
            {kind: "Spacer"},
            {name: "buttonOrientation", layoutKind: "HFlexLayout", components: [
                {name: "acceptButton", kind: "Button", flex:1, caption: $L("Close"), className: "enyo-button-negative", onclick: "close"}
            ]}
        ]}
    ],
    
    setMessage: function(message) {
        if (message !== undefined) {
            this.$.message.setContent(message);
        } 
    },  
    
});