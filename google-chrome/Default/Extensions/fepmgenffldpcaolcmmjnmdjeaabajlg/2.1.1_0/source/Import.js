enyo.kind({
    name: "Import",
    kind: enyo.VFlexBox,
    className: "hg",
    components: [
        {
            name : "openBrowser",
            kind : "PalmService",
            service : "palm://com.palm.applicationManager",
            method : "open",
            onSuccess : "openBrowserSuccess",
            onFailure : "openBrowserFailure",
            subscribe : true
         },
        {kind: "Scroller", flex: 1, components: [
            {kind: "Control", className: "enyo-preferences-box", width: (Platform.isTablet() ? "580px" : "315px"), /*className: "zettel"*/ components: [
                {kind: "VFlexBox", name: "flexBox", className: "zettel-welcome", components: [
                    {kind: "HFlexBox", className: Util.getClassName("header-welcome"), components: [
                        {kind: "enyo.Image", name: "image", className: Util.getClassName("image"), onclick: "onClick2", src: "images/64.png"},
                        {name: "headline", className: Util.getClassName("headline-zettel"), allowHtml: true, content: $L("Import your data!")}
                    ]},    
                    {name: "content", kind: "HtmlContent", onLinkClick: "linkClicked", allowHtml: true, className: Util.getClassName("content"), components: [
                        {name: "text", allowHtml: true},
                        {kind: "VFlexBox", components: [
                            {name: "importEvernoteButton", caption: $L("Import from Evernote"), kind: "Button", onclick: "importEvernoteData", className: "enyo-button", flex: 1},
                            {name: "importGnoteButton", caption: $L("Import from Google Note"), kind: "Button", onclick: "importGnoteData", className: "enyo-button", flex: 1},
                            {name: "finishedButton", caption: $L("Finished!"), kind: "Button", onclick: "doneClick", className: "enyo-button-dark", flex: 1},
                        ]},
                    ]},
                ]},
                {name: "shadow", className: "shadow"}
              ]},
          ]},
    ],

    rendered : function( ) {
        this.inherited(arguments);
        if (Util.isDebug()) {
            this.log("START");
        }
        // this.$.saveButton.setDisabled( true );
        var content = $L("Do you already have your stuff organized in <b>Evernote</b> or in <b>Google Note</b>? ") 
        content += $L("Don't worry, some cool people wrote smart web-apps to import your data to Springpad!<br><br>Please note that I'm not responsible for that web-apps. If they did not work the way they should, please don't blame me or my app.");
        content += "<br><br>";
        this.$.text.setContent(content);
        
        if (Util.isDebug()) {
            this.log("END");
        }
    },
    
    doneClick : function( ) {
        if (Util.isDebug()) {
            this.log();
        }
        this.owner.$.contentPane.selectViewByName( "welcome", true );         
    },
    
    linkClicked: function (inSender, inEvent) {
        if (Util.isDebug()) {
            this.log("inEvent: " + inEvent);
        }
    },
    
    importEvernoteData : function( ) {
        if (Util.isDebug()) {
            this.log();
        }
        Platform.browser( "http://e-springpad.appspot.com/", this )();
    },

    importGnoteData : function( ) {
        if (Util.isDebug()) {
            this.log();
        }
        Platform.browser( "http://g-springpad.appspot.com/", this )();
    },
    
    
});