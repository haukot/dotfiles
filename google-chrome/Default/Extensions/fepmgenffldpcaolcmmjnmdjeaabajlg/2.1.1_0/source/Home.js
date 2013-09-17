enyo.kind({
    name: "Home",
    kind: enyo.Control,
    className: "hg",
    components: [
        
    ],

    update : function( notebooks ) {
        if (Util.isDebug()) {
            this.log();
        }
        this.notebooks = notebooks;
        
        if (notebooks != null) {
            if (Util.isDebug()) {
                this.log( notebooks.length );
            }
            
            var info = enyo.fetchDeviceInfo();
            var width = info.screenWidth;
            var height = info.screenHeight;
            
            var isPortrait = Platform.isPortraitMode();
            
            var scrollerHeight = (isPortrait == true ? width - 20 : height - 20);
            if (Util.isDebug()) {
                this.log("scrollerHeight: " + scrollerHeight);
            }
            
            if (this.$.scroller) {
                this.$.scroller.destroy();
            }
            
            this.$.scroller = this.createComponent( {name: "scroller", kind: enyo.Scroller, flex: 1, style: "height: " + scrollerHeight + "px;", autoHorizontal: false, horizontal: false }, {owner: this} );
            
            for (key in notebooks) {
                var obj = notebooks[key];
                if (Util.isDebug()) {
                    this.log("obj: " + JSON.stringify(obj));
                }
                this.$.scroller.createComponent( {className: "book", value: key, onclick: "clicked", components: [
                            {className: "booktop"},
                            {content: obj.name, className: "bookname"},
                            {content: "x Items", className: "items"}]}, {owner: this});
            }
            this.render();     
        } else {
            this.error("notebooks are not available!");
        }
    },
    
    clicked : function( inSender, inEvent ) {
        if (Util.isDebug()) {
            this.log("inSender: " + inSender);
            this.log("inSender.value: " + inSender.value);
        }
        var notebook = this.notebooks[ inSender.value ];
        if (Util.isDebug()) {
            this.log("selected notebook: " + JSON.stringify(notebook) );
        }
        if (notebook.uuid == undefined ) {
            notebook.uuid = "All_My_Stuff";
        }
        
        var uuid = StringUtils.getValueFromString( notebook.uuid );
        
        localStorage.setItem("notebook", uuid);
        Settings.getSettings( true );
        
        var fn2 = enyo.bind(this.owner.$.dataManager, "loadItems");
        // the value of this.foo(3)
    // this.log("force: " + force);
        var value = fn2( Settings.getSettings().notebook, "", "", true );

        this.owner.$.pane.selectViewByName("feedSlidingPane");

    },
  
    
});