enyo.kind({
    name: "FullVersionNeededDialog",
    kind: enyo.ModalDialog,
    width: "350px",
    components: [
         {name: "inhalt", content: $L("You must have the full version of this app to be able to do this."), className: "enyo-paragraph"},
         {kind: "Button", onclick: "openAppCat", layoutKind: "HFlexLayout", align: "center", pack: "center", components: [
             {kind: "Image", src: "images/appcat.png"}, {content: $L("Buy now!"), style: "font-size: 25pt; padding: 10px"}
         ]},
         {layoutKind: "HFlexLayout", components: [
             {kind: "Button", caption: "Ok", flex: 1, onclick: "closeFullVersionNeededDialog"},
         ]}
    ],

    create : function () {
        this.inherited(arguments);
    },
    
    closeFullVersionNeededDialog : function() {
        this.close();  
    },
    
    openAppCat: function() {
        url = Platform.getReviewURL();
        Platform.browser( url, this )();
    },
});
