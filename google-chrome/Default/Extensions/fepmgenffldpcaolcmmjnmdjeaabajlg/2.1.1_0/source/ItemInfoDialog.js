enyo.kind({
    name: "ItemInfoDialog",
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
                        {content: $L("Creator")+":", className:"enyo-paragraph", style: "padding-right: 30px; width: 100px;"},
                        {content: Settings.getSettings().username, name: "creator", className:"enyo-paragraph"},
                    ]},
                    {kind: "HFlexBox", components: [
                        {content: $L("Created")+":", className:"enyo-paragraph", style: "padding-right: 30px; width: 100px;"},
                        {content: "", name: "created", className:"enyo-paragraph"},
                    ]},
                    {kind: "HFlexBox", components: [
                        {content: $L("Modified")+":", className:"enyo-paragraph", style: "padding-right: 30px; width: 100px;"},
                        {content: "", name: "modified", className:"enyo-paragraph"},
                    ]},
                    {kind: "HFlexBox", components: [
                        {content: $L("Public")+":", className:"enyo-paragraph", style: "padding-right: 30px; width: 100px;"},
                        {content: "", allowHtml: true, name: "ispublic", className:"enyo-paragraph",
                        width: (Platform.isTablet() ? "240px" : "140px"), style: "word-wrap: break-word;"},
                    ]},
                ]},
            ]},
        /*]},*/    
        {kind: "Spacer"},
        {name: "buttonOrientation", layoutKind: "HFlexLayout", components: [
            {name: "acceptButton", kind: "Button", flex:1, caption: $L("Ok"), onclick: "close"}
        ]},
    ],
    
    refresh : function( item, notebook ) {

    	// set creator
        this.$.creator.setContent( item.creatorUsername );
   	
    	var mydate = new Date();

        // set created
        mydate.setTime( StringUtils.getValueFromString( item.created ) );
        var dateFmt = new enyo.g11n.DateFmt( {"format" : "short"} );
        var created = dateFmt.format( mydate );
        this.$.created.setContent( created );
        
        // set modified
        mydate.setTime( StringUtils.getValueFromString( item.modified ) );
        var dateFmt = new enyo.g11n.DateFmt( {"format" : "short"} );
        var modified = dateFmt.format( mydate );
        this.$.modified.setContent( modified );

        // set public
    	var link = Util.getPublicUrl( item, notebook );
    	this.$.ispublic.setContent( (link != "" ? StringUtils.createLink(link) : $L("No") ) );

    }

});
