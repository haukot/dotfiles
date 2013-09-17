enyo.kind({
    name: "StartScreen",
    kind: enyo.VFlexBox,
    align: "center", 
    pack: "center",
    components: [
        {kind: "SpinnerLarge", name: "spinner"},   
        {content: $L("Loading") + "...", style: "text-align: center", className: "enyo-text-body"}
    ],
    
    rendered : function() {
        this.inherited(arguments);
        if (Util.isDebug()) {
            this.log();
        }
        this.$.spinner.show();    
    }, 
});
