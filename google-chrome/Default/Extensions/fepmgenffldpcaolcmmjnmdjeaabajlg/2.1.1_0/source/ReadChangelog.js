/* This kind implements local parsing of the fortunes.txt file */
enyo.kind({
    name: "ReadOnTouch.ReadChangelog",
    kind: enyo.Component,
    components: [
        { kind: enyo.WebService, name: "loader", 
          url: "Changelog.txt", handleAs: "text", 
          onSuccess: "parseChangelog" } ],

    create: function () {
        this.inherited(arguments);
        this.$.loader.call({});
    },

    parseChangelog: function(inSender, inResponse, inRequest) {
        if (!inResponse) {
            return;
        }
        
        inResponse = inResponse.replace(/\- /g, "<table border=0><tr><td valign='top'><li></td><td> ").replace(/\s\n/g, "</td></tr>").replace(/\n/g, "</table>");

        if (Util.isDebug()) {
            this.log("inResponse: " + inResponse);
        }

        this.owner.updateContent( inResponse );
    },

}); 