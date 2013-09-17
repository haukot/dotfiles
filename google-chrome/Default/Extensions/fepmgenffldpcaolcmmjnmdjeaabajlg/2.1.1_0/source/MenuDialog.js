enyo.kind({
    name: "MenuDialog",
    kind: enyo.ModalDialog,
    /*height: "560px",*/
    width: "320px",
    caption: $L("Menu"),
    events: {
        onMenuSelect: "",
    },
    components: [
        {kind: "ApplicationEvents", onWindowHidden: "close"},
        {name: "scroller", kind: enyo.Scroller, flex: 1, height: "470px", autoHorizontal: false, horizontal: false, components: [
            {layoutKind: "VFlexLayout", components: [
                {flex:1, kind: "Button", caption: $L("Preferences & Accounts"), value: "1", className: "enyo-button", onclick: "menuClicked"},
                {nodeTag: "hr"},
                {flex:1, kind: "Button", caption: $L("Import from Evernote"), value: "6", className: "enyo-button", onclick: "menuClicked"},
                {flex:1, kind: "Button", caption: $L("Import from Google Note"), value: "7", className: "enyo-button", onclick: "menuClicked"},
                {nodeTag: "hr"},
                {flex:1, kind: "Button", caption: $L("Show Changelog"), value: "3", className: "enyo-button", onclick: "menuClicked"},
                {flex:1, kind: "Button", caption: $L("About"), value: "4", className: "enyo-button", onclick: "menuClicked"},
                {flex:1, kind: "Button", caption: $L("Help"), value: "5", className: "enyo-button", onclick: "menuClicked"},
                {nodeTag: "hr"},
                {flex:1, kind: "Button", caption: $L("Rate Me!"), value: "8", className: "enyo-button", onclick: "menuClicked"},
                {flex:1, kind: "Button", caption: $L("More Apps by this Developer"), value: "9", className: "enyo-button", onclick: "menuClicked"},
                {nodeTag: "hr"},
            ]},
            {kind: "Button", caption: $L("Close"), flex: 1, className: "enyo-button-dark", onclick: "close"}
        ]},
    ],
    
    rendered : function() {
        this.inherited(arguments);
        this.$.scroller.setScrollTop(0);
    },

    menuClicked : function( inSender ) {
        // this.log("inSender: " + inSender.value);    
        // this.log("inEvent: " + inEvent);  
        this.doMenuSelect( inSender.value );  
    },
});