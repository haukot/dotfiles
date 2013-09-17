enyo.kind({
    name: "InfoDialog",
    kind: enyo.ModalDialog,
    layoutKind:"VFlexLayout",
    width: (Platform.isTablet() ? "420px" : "320px"), 
    // height: "195px",
    events: {
        onAccept: ""
    },
    caption: $L("Info"),
    components: [
        /*{kind: enyo.Scroller, flex: 1, height: "110px", autoHorizontal: false, horizontal: false, components: [*/
            {kind: "HFlexBox", components: [
                {kind: "VFlexBox", flex:1, components: [
                    {kind: "HFlexBox", components: [
                        {content: $L("Username")+":", className:"enyo-paragraph", style: "padding-right: 30px; width: 100px;"},
                        {content: Settings.getSettings().username, name: "username", className:"enyo-paragraph"},
                    ]},
                    {kind: "HFlexBox", components: [
                        {content: $L("Last Sync")+":", className:"enyo-paragraph", style: "padding-right: 30px; width: 100px;"},
                        {content: "", name: "lastsync", className:"enyo-paragraph"},
                    ]},
                ]},
                {kind: "enyo.Image", name: "image", src: Settings.getSettings().profilepic, style: "width: 100px; height: 100px;", align: "right"},
            ]},
        /*]},*/    
        {kind: "Spacer"},
        {name: "buttonOrientation", layoutKind: "HFlexLayout", components: [
            {name: "acceptButton", kind: "Button", flex:1, caption: $L("Ok"), onclick: "close"}
        ]},
    ],
    
    refresh : function() {
        var str = "";
        var ls = Settings.getSettings().lastSync;
        if (ls == 0) {
            str = $L("Never");
        } else {
            var mydate = new Date();
            mydate.setTime( ls );
            var dateFmt = new enyo.g11n.DateFmt( {"format" : "short"} );
            str = dateFmt.format( mydate );
        }
        this.$.lastsync.setContent( str );
        
        if (Settings.getSettings().online == false || Settings.getSettings().profilepic == "" || Settings.getSettings().profilepic == "undefined" || Settings.getSettings().profilepic === undefined || Settings.getSettings().profilepic == null) {
            this.$.image.hide();
        }
        
        if (Settings.getSettings().username != "") {
            this.$.username.setContent(Settings.getSettings().username);
        } else {
            this.$.userbox.hide();
        }
    }

});