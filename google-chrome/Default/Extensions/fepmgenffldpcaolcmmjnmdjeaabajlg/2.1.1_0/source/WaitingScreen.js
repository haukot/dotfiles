enyo.kind({
    kind: "Popup",
    name: "ReadOnTouch.SpinnerScreen",
    width: "300px", 
    height: "300px",
    style: "opacity: 10; border-radius: 10px; border: 0; z-index: 99",
    align: "center",
    pack: "center",
    dismissWithClick: false,
    modal: true,
    scrim: true,
    components: [
        {kind: "VFlexBox", align: "center", pack: "center", style: "opacity: 1; color: white; margin: 5px 0 5px 0; padding: 0;", components: [
            {kind: "SpinnerLarge", name: "spinner"},
            /*{content: "Marking article as read ...", style: "text-align: center; font-weight: bold; color: white; padding: 5px;"}*/
        ]}
    ],
    
    showSpinner: function( ) {
        this.openAtCenter();
    },
    
    hideSpinner: function( ) {
        this.close();
    },
    
    finishOpen: function() {
        this.applyBoundsInfo();
        this.inherited(arguments);
        if( this.$.spinner.getShowing( ) == false ) {
            this.$.spinner.show(); 
        }
    },
    
    renderClose: function() {
        if (this.showHideMode == "auto") {
            this.hide();
        }
        if( this.$.spinner.getShowing( ) == true ) {
            this.$.spinner.hide(); 
        }
    },
});
