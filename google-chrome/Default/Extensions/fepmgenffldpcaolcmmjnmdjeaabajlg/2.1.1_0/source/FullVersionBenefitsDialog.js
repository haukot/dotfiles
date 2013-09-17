enyo.kind({
    name: "FullVersionBenefitsDialog",
    kind: enyo.ModalDialog,
    width: "350px",
    caption: $L("Benefits of the full version"),
    components: [
         {name: "scroller", kind: enyo.Scroller, flex: 1, height: (Platform.isWebOS() ?  
                 (Platform.isTouchpad() ? "475px" : (Platform.isTouchpadOrPre3() ? "300px" : "165px"))
                 : (Platform.isTablet() || Platform.isBrowser() ? "450px" : "275px")), autoHorizontal: false, horizontal: false, components: [
		     {htmlContent: true, content: "<table border=0>"},
		     {htmlContent: true, content: "<tr><td valign='top'><li></td><td>" + $L("Storage of items on sync and thereby offline access for your items.") + "</td></tr>", className: "enyo-paragraph", flex:1},
		     {htmlContent: true, content: "<tr><td valign='top'><li></td><td>" + $L("Create and edit notebooks.") + "</td></tr>", className: "enyo-paragraph", flex:1},
		     {htmlContent: true, content: "<tr><td valign='top'><li></td><td>" + $L("Download and delete attachments.") + "</td></tr>", className: "enyo-paragraph", flex:1},
		     {htmlContent: true, content: "<tr><td valign='top'><li></td><td>" + $L("Add ingredients from a recipe to a shopping list.") + "</td></tr>", className: "enyo-paragraph", flex:1},
		     {htmlContent: true, content: "<tr><td valign='top'><li></td><td>" + $L("No more ads!") + "</td></tr>", className: "enyo-paragraph", flex:1},
		     /*{htmlContent: true, content: "<tr><td valign='top'><li></td><td>" + $L("This popup will be missing too.") + "</td></tr>", className: "enyo-paragraph", flex:1},*/
		     {htmlContent: true, content: "</table>"},
		     {kind: "Button", onclick: "openAppCat", layoutKind: "HFlexLayout", align: "center", pack: "center", components: [
		         {kind: "Image", src: "images/appcat.png"}, {content: $L("Buy now!"), style: "font-size: 25pt; padding: 10px"}
		     ]},
		     {layoutKind: "HFlexLayout", components: [
		         {kind: "Button", caption: "Ok", flex: 1, onclick: "close"},
		     ]}
	     ]}
    ],

    create : function () {
        this.inherited(arguments);
    },
    
    openAppCat: function() {
        url = Platform.getReviewURL();
        Platform.browser( url, this )();
    },

});
