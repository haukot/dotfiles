enyo.kind({
    name: "ProgressDialog",
    kind: enyo.ModalDialog,
    height: "240px",
    width: "320px",
    events: {
        onAccept: ""
    },
    components: [
        {kind: "ApplicationEvents", onWindowHidden: "close"},
        {layoutKind: "VFlexLayout", components:[
            {name: "message", kind: enyo.HtmlContent, content: "", className:"enyo-paragraph"},
            {kind: "ProgressBar", name: "progress"},
            {kind: "LabeledContainer", name: "status", style: "font-size: 0.7em; text-align: right; "},
            {name: "cancelButton", caption: $L("Cancel "), kind: "ActivityButton", onclick: "onCancel", className: "enyo-button-negative"},
        ]}
    ],
    
    published: {
        funcName: "",
        scope: "",
    },
    
    rendered : function () {
        this.inherited(arguments);
        this.$.cancelButton.hide();
    },
    
    resetDialog : function() {
        if (this.$.cancelButton !== undefined) {
            this.$.cancelButton.setActive( false ); 
            this.$.cancelButton.setCaption($L("Cancel "));
            this.$.cancelButton.hide();
        }
    },
    
    updateProgress : function ( caption, pos, number, total, finished, func, scope ) {
        this.$.message.setContent($L("This may take a while, depending on how many items have to be downloaded...") + "<br><br>");
        if (caption !== undefined) {
            this.setCaption( caption );
        }
        if (pos !== undefined) {
            this.$.progress.setPosition( pos );
        }
        if (number !== undefined && number != "unknown") {
            this.$.status.setLabel($L("downloaded: ") + number + $L(" of total: ") + total);
        } else {
            this.$.status.setLabel("");
        }
        if (number !== undefined && number != "unknown" && number != total && finished == false) {
            this.$.cancelButton.show();    
        }
        if (func !== undefined) {
            this.setFuncName( func );
        }
        if (scope !== undefined) {
            this.setScope( scope );
        }
    },
    
    onCancel : function( ) {
        if (Util.isDebug()) {
            this.log("this.getFuncName(): " + this.getFuncName());
        }
        if (this.getFuncName() !== undefined) {
            this.$.cancelButton.show(); 
            this.$.cancelButton.setActive( true ); 
            this.$.cancelButton.setCaption("Cancel (just finishing...)");
            // a function that binds this to this.foo
            var fn = enyo.bind(this.owner, this.getFuncName());
            // the value of this.foo(3)
            var value = fn();
        }
    }
});