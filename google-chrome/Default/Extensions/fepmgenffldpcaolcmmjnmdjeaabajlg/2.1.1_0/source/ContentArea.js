enyo.kind({
    name: "ContentArea",
    kind: "VFlexBox",
    className: "zettel",   
    events: {
      onCbClickedAction: "",
      onFilterAction: "",
      onContentClick: "",
      onImageClick: "",
      onStarsClick: ""
    },
    components: [
        {kind: "HFlexBox", className: Util.getClassName("header"), components: [
            {name: "image", className: Util.getClassName("image"), allowHtml: true, onclick: "onImageClicked", components: [
                {name: "image2", className: Util.getClassName("image2"), allowHtml: true}
            ]},
            {name: "headline", className: Util.getClassName("headline-zettel"), allowHtml: true, onclick: "onClick"}
        ]},    
        {kind: "enyo.Image", name: "star", className: Util.getClassName("star"), onclick: "onStarsClicked"},       
        {name: "shadow", className: "shadow"},
        (Platform.isTouchpad() ? {name: "printDialog", kind: "PrintDialog", lazy: false, 
            copiesRange: {min: 1, max: 10}, 
            duplexOption: true,
            colorOption: true,
            appName: enyo.fetchAppInfo().title
        } : null),
    ],
    
    published: {
        inhalt: "",
        image: "",
        footer: "",
        durchgestrichen: false,
        tags: [],
        type: "Note",
    },
    
    /*rendered : function() {
        this.log("START");
        this.inherited(arguments);
        // this.log("this.$.footer.height: " + this.$.footer.height);
        this.log("END");
    },*/
    
    update : function( item, filter, highlight ) {
        if (Util.isDebug()) {
            this.log("START");
            this.log("filter: " + filter);
            this.log("highlight: " + highlight);
        }

        this.item = item;
        this.filter = filter;
        this.highlight = highlight;
        
        if (item == null) {
            this.warn("item is null!");
            return;
        }

        var type;
        if ( item.type !== undefined ) {
            type = StringUtils.getValueFromString( item.type );
        }
        this.$.image2.setContent( "<img border=0 src='" + this.getImage() + "' />" );

        var hl = item.name;
        if (Util.isDebug()) {
            this.log("hl: '" + hl + "'");
        }
        if (hl === undefined || hl == "undefined" || String(hl).trim() == "") {
            if (type == "File" || type == "Photo") {
                if (Util.isDebug()) {
                    this.log("ok");
                }
                hl = Util.getFileNameFromObject( item );
            } else {
                if (Util.isDebug()) {
                    this.log(enyo.json.stringify( item ));
                }
                hl = "";
            }
        }
        if (Util.isDebug()) {
            this.log("hl: '" + hl + "'");
        }
        
        if (filter !== undefined && filter != "" && highlight == true) {
            hl = StringUtils.applyFilterHighlight( hl, filter, "searchResult");
        }
        
        if (this.getDurchgestrichen() == true) {
            hl = "<s>" + hl + "</s>";
        } 
        this.$.headline.setContent( hl ) ;

        var rating = 0;
        if (item.properties.personalRating !== undefined) {
            rating = Number(item.properties.personalRating);
        } 
        if (rating < 0 || rating > 5) {
            rating = 0;
        }
        // this.error("rating: " + rating);
        this.$.star.setSrc( "images/" + rating + "-star.png" );
        
        
        if (this.$.tempControl) {
            this.$.tempControl.destroyControls();
            this.$.tempControl.destroyComponents();
            this.$.tempControl.destroy();
        }
        // determine content kind
        var kind = "Content";
        if (type !== undefined) {
            if (type.indexOf("List") != -1) {
                kind = "CheckboxContent";
            } else if (type.indexOf("Photo") != -1 || type.indexOf("File") != -1) {
                kind = "MediaContent";
            } else if (type.indexOf("Task") != -1) {
            	kind = "TaskContent";
            }
        } 
        
        if (kind != "") {
            this.$.tempControl = this.createComponent( {name: "tempControl", kind: kind, inhalt: this.inhalt, allowHtml: true, onCheckboxClicked: "onCheckboxClicked", onLinkClick: "linkClicked", onclick: "onClick" });
            this.$.tempControl.update( item, filter, highlight );
        }
        
        // added modified div
        if (this.$.modified) {
            this.$.modified.destroyControls();
            this.$.modified.destroyComponents();
            this.$.modified.destroy();
        }
        if (this.$.modified_text) {
            this.$.modified_text.destroyControls();
            this.$.modified_text.destroyComponents();
            this.$.modified_text.destroy();
        }
        this.$.modified = this.createComponent({name: "modified", className: "modified"}, {owner: this});
        this.$.modified_text = this.$.modified.createComponent({name: "modified_text", className: "modified_text"}, {owner: this});
        // this.$.modified_text.setContent("Zuletzt bearbeitet von michote am 28.05.2012.");
        
        
        if (this.$.tempFooter) {
            this.$.tempFooter.destroyControls();
            this.$.tempFooter.destroyComponents();
            this.$.tempFooter.destroy();
        }
        
        if (Util.isDebug()) {
            this.log("creating footer...");
        }
        this.$.tempFooter = this.createComponent( {name: "tempFooter", kind: "Tags", onFilter: "onFilter", tags: this.tags, allowHtml: true });
        this.$.tempFooter.update( item, filter, highlight );
        
        this.render();
        
        if (Util.isDebug()) {
            this.log("END");
        }
    },
    
    onClick : function( inSender, inEvent ) {
        if (Util.isDebug()) {
            this.log(inSender);
        }
        if (inEvent.target !== undefined && inEvent.target.href !== undefined) {
            if (Util.isDebug()) {
                this.log(inEvent.target.href);
            }
            Platform.browser( inEvent.target.href, this )();
        } else {
            this.doContentClick();
        }
        inEvent.preventDefault();
    },
    
    onImageClicked : function( inSender, inEvent ) {
        // this.log();
        this.doImageClick();
        inEvent.preventDefault();
    },
    
    onStarsClicked : function( inSender, inEvent ) {
        // this.log();
        this.doStarsClick();
        inEvent.preventDefault();
    },
    
    tagClicked : function( tag ) {
        if (Util.isDebug()) {
            this.log("tag: " + tag);
        }
    },
    
    onFilter: function( inSender, inValue ) {
        if (Util.isDebug()) {
            this.log("inSender: " + inSender);
            this.log("inValue: " + inValue);
        }
        this.doFilterAction( inValue );
    },
    
    onCheckboxClicked: function( inSender, inValue ) {
        if (Util.isDebug()) {
            this.log("inSender: " + inSender);
            this.log("inValue: " + inValue);
        }
        this.doCbClickedAction( inValue );
    },
    
    getDataManager : function() {
        if (Util.isDebug()) {
            this.log();
        }
        return this.owner.getDataManager();
    },
    
    printContent : function() {
        if (Util.isDebug()) {
            this.log("START");
        }
        if (Platform.isWebOS() && Platform.isTouchpad()) {
            this.$.printDialog.setFrameToPrint({name: "", landscape:false});
            this.$.printDialog.openAtCenter();  // Standard enyo.Popup method
        } else if (Platform.isBrowser()) {
            window.print();
        }
        if (Util.isDebug()) {
            this.log("END");
        }
    },
    
    linkClicked : function( inSender, inValue ) {
        if (Util.isDebug()) {
            this.log("inSender: " + inSender);
            this.log("inValue: " + inValue);
        }
        // this.doContentClicked( inValue );
    }, 
      
    updateHeader : function( ) {
        if (Util.isDebug()) {
            this.log("START");
        }
        var type;
        if ( this.item.type !== undefined ) {
            type = StringUtils.getValueFromString( this.item.type );
        }

        var hl = this.item.name;
        if (hl === undefined || hl == "undefined" || String(hl).trim() == "") {
            if (type == "File" || type == "Photo") {
                if (Util.isDebug()) {
                    this.log("ok");
                }
                hl = Util.getFileNameFromObject( this.item );
            } else {
                if (Util.isDebug()) {
                    this.log(enyo.json.stringify( this.item ));
                }
                hl = "";
            }
        }
        if (Util.isDebug()) {
            this.log("hl: '" + hl + "'");
        }
        
        if (this.filter !== undefined && this.filter != "" && this.highlight == true) {
            hl = StringUtils.applyFilterHighlight( hl, this.filter, "searchResult");
        }
        
        if (this.getDurchgestrichen() == true) {
            hl = "<s>" + hl + "</s>";
        } 
        this.$.headline.setContent( hl ) ;
     
        this.render();
        
        if (Util.isDebug()) {
            this.log("END");
        }
    },
    
});