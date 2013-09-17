enyo.kind({
    name: "Tags",
    kind: "enyo.Control",
    events: {
      onFilter: "",
    },
    components: [
        {name: "footer", className: "footer"},
        {name: "popupDialog", kind: "MyPopupDialog", onAccept: "onAccept"},
    ],
    
    published: {
        tags: [],
    },
    
    update : function( item, filter, highlight ) {
        if (Util.isDebug()) {
            this.log();
        }
        this.createTags( item, filter, highlight );
    },
    
    createTags : function( item, filter, highlight ) {
        this.tags = item.properties.tags;
        if (this.tags !== undefined && this.tags != null) {
            if (Util.isDebug()) {
                this.log("this.tags.length: " + this.tags.length);
            }
        }
        
        if (this.$.footer) {
            this.$.footer.destroyControls();
        }
        
        if (this.tags !== undefined && this.tags != null && this.tags.length > 0) {
            for (key in this.tags) {
                if (Util.isDebug()) {
                    this.log("this.tags[key]: " + this.tags[key]);
                }
                var uuid = StringUtils.getValueFromString( item.uuid );
                this.$.footer.createComponent( {kind: "Button", onclick: "tagClicked", name: "tag"+key, className: "tag", caption: this.tags[key] }, {owner: this});
            }
        } else {
            if (Util.isDebug()) {
                this.log("no tags defined...");
            }
            this.$.footer.createComponent( {kind: "Button", onclick: "tagClicked", name: "notags", className: "notag", content: $L("no tags defined") }, {owner: this});
        }
        this.render();
    },
    
    tagClicked : function( inSender, inEvent ) {
        var tag = inSender.name;
        var firstthree = tag.substring(0,3);
        if ("tag" == firstthree) {
            var key = tag.substring(3, tag.length);
            tag = this.tags[key]
        }
        if (Util.isDebug()) {
            this.log("inSender.name: " + inSender.name);
        }
        inEvent.preventDefault();
        inEvent.stopPropagation();     
        // this.owner.tagClicked( tag )   
        this.showTagPopup( tag );
    },

    showTagPopup : function( tag ) {
        if (Util.isDebug()) {
            this.log("START");
        }
        this.$.popupDialog.openAtCenter();
        this.$.popupDialog.setValue( tag );  
        this.$.popupDialog.setTitle( $L("Filter by Tag") );
        var str = $L("Do you really want to filter by tag '<b>#{tag}</b>'?");
        if (tag!="notags") {
            str = str.replace("#{tag}", tag);
        } else {
            str = $L("Do you really want to filter by no tag?");   
        }
        // var str = $L("Do you really want to filter by tag '<b>#{tag}</b>'?");
        // str = str.replace("#{tag}", tag);
        this.$.popupDialog.setMessage( str );
        if (Util.isDebug()) {
            this.log("END");
        }
    },
    
    onAccept : function( inSender, inValue ) {
        if (Util.isDebug()) {
            this.log("accepted tag: " + inValue);
        }
        this.doFilter( inValue );
    }
});