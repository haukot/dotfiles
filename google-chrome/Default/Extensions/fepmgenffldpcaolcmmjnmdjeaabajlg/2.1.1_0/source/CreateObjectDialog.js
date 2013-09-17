enyo.kind({
    name: "CreateObjectDialog",
    kind: enyo.ModalDialog,
    width: "320px",
    caption: $L("Create New Object"),
    events: {
        onSelectObject: "",
    },
    components: [
        {kind: "ApplicationEvents", onWindowHidden: "close"},
        {name: "scroller", kind: enyo.Scroller, flex: 1, height: (Platform.isWebOS() ?  
                (Platform.isTouchpad() ? "460px" : (Platform.isTouchpadOrPre3() ? "275px" : "165px"))
                : (Platform.isTablet() || Platform.isBrowser() ? "460px" : "275px")), autoHorizontal: false, horizontal: false, components: [
            {name: "theParent", layoutKind: "VFlexLayout", components: [
            ]}
        ]},
    ],
    
    rendered : function( ) {
        if (Util.isDebug()) {
            this.log();
        }
        this.inherited(arguments);
        this.resize();        
    },    
    
    resize : function() {
        var height = (Platform.isWebOS() ?  
                (Platform.isTouchpad() ? Util.getAbsolutPixel( "h", 0.86) : (Platform.isTouchpadOrPre3() ? "460px" : "350px"))
                : (Platform.isTablet() || Platform.isBrowser() ? Util.getAbsolutPixel( "h", 0.86) : "460px"));
        if (Util.isDebug()) {
            this.log("height: " + height);
            }                
//        this.applyStyle("height", height);
        
        if (this.$.scroller !== undefined) {
            var scrollerH = (Platform.isWebOS() ?  
                    (Platform.isTouchpad() ? Util.getAbsolutPixel( "h", 0.86, 120) : (Platform.isTouchpadOrPre3() ? "275px" : "165px"))
                    : (Platform.isTablet() || Platform.isBrowser() ? Util.getAbsolutPixel( "h", 0.86, 120) : "275px"));
            if (Util.isDebug()) {
                this.log("scrollerH: " + scrollerH);
            }
            this.$.scroller.applyStyle("height", scrollerH);
        }
    },
        
    createDialog : function() {
        var props = ObjectDescription.getProperties( );
        if (Util.isDebug()) {
            this.log("props: " + props);
        }

        // props = (props.sort(function(a,b) {  
            // // enyo.log(" +----> b: " + b.time_updated + ", a: " + a.time_updated);
            // enyo.log("a: " + JSON.stringify(a));
            // return 0;
            // // if (a.isTag == false || b.isTag == false) {
                // // return 0;
            // // }
// //             
            // // return a.tag.localeCompare( b.tag );
        // }));        


        for (key in props) {
            if (Util.isDebug()) {
                this.log("key: " + key);
            }
            if (this.$["kind" + key]) {
                return;
            }
            if (key == "Movie" || key == "TVShow" || key == "Book" || key == "Business" || key == "Restaurant" || key == "File" || key == "Photo" || key == "Video") {
                // this.log("und raus...");
                continue;
            }
            
            var img = "images/types/" + String(key).toLowerCase() + "_32.png";
            if (key == "GeneralList") {
                img = "images/types/list_32.png";
            }
            
            this.$["kind" + key] = this.$.theParent.createComponent( {name: "kind" + key, layoutKind: "HFlexLayout", align: "center", pack: "center"}, { owner: this } );
            this.$["kind" + key].createComponent( {kind: "Image", src: img}, { owner: this } ); 
            this.$["kind" + key].createComponent( {content: $L(key), flex: 1, style: "padding-left: 10px; font-size: 16px;"}, { owner: this } ); 
            this.$["kind" + key].createComponent( {kind: "Button", caption: $L("Create!"), className: "enyo-button-affirmative", value: key, onclick: "createObject", layoutKind: "HFlexLayout", align: "center"}, { owner: this } );
            this.$.theParent.createComponent( {nodeTag: "hr"}, { owner: this } );
            
            // var obj = props[key];
            // // create rowgroup
            // this.$["rowGroup" + obj.propertyLabel] = this.$.scroller.createComponent( {name: "rowGroup" + obj.propertyLabel, kind: "RowGroup", caption: $L(obj.propertyLabel)}, { owner: this } );
        }
        if (this.$.cancelButton) {
            return; 
        }      
        this.$.cancelButton = this.createComponent( {name: "cancelButton", kind: "Button", caption: (Platform.isTablet() ? $L("Cancel ") : $L("Cancel")), flex: 1, className: "enyo-button-dark", onclick: "close"}, { owner: this } );
        this.render();      
    },
    
    createObject : function( inSender ) {
        if (Util.isDebug()) {
            this.log( inSender.value );
        }
        this.doSelectObject( inSender.value );
        this.close();
    },
    
});