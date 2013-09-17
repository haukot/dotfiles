enyo.kind({
    name: "AboutDialog",
    kind: enyo.ModalDialog,
    layoutKind:"VFlexLayout",
    width: (Platform.isTablet() ? "420px" : "320px"), 
    events: {
        onAccept: ""
    },
    components: [
        {kind: "ApplicationEvents", onWindowHidden: "close"},
        /*{layoutKind: "VFlexLayout", components:[*/
            {kind: enyo.Scroller, flex: 1, height: (Platform.isTablet() ? "300px" : "300px"), autoHorizontal: false, horizontal: false, components: [
                {name: "wwwLabel", flex: 1, kind: "HtmlContent", allowHtml: true, onLinkClick: "linkClicked", className:"enyo-paragraph"},
            ]},
            {name: "buttonOrientation", layoutKind: "HFlexLayout", components: [
                {name: "acceptButton", kind: "Button", flex:1, caption: $L("OK"), onclick: "acceptButtonClick"}
            ]},
        /*]}*/
    ],
    
    rendered : function () {
        this.inherited(arguments);
        // this.setCaption($L("About"));
        var appinfo = enyo.fetchAppInfo();
        
        var width = "20;"
        
        var test = "<table border=\"0\" width=\"100%\">";
        test += "<tr>";
        test += "<td>" + $L("Name:") + "</td>";
        test += "<td width=" + width + ">&nbsp;</td>";
        test += "<td>" + appinfo.title + "</td>";
        var img = "images/64r2ws.png";
        if (Platform.isBlackBerry()) {
            img = "images/48.png";
        }
        test += "<td rowspan=\"3\" align=\"right\" valign=\"top\"><img border=\"0\" src='" + img + "'></td>";
        test += "</tr>";
        test += "<tr>";
        test += "<td>" + $L("Version") + ":</td>";
        test += "<td width=" + width + ">&nbsp;</td>";
        test += "<td>" + appinfo.version + "</td>";
        test += "</tr>";
        test += "<tr>";
        test += "<td>" + $L("Developer") + ":</td>";
        test += "<td width=" + width + ">&nbsp;</td>";
        test += "<td>" + appinfo.vendor + "</td>";
        test += "</tr>";
        test += "<tr>";
        test += "<td colspan=4><hr></td>";
        test += "</tr>";
        test += "<tr>";
        test += "<td valign=\"top\">eMail:</td>";
        test += "<td width=" + width + ">&nbsp;</td>";
        test += "<td colspan=2><a href=\"mailto:" + appinfo.vendormail + "\">" + appinfo.vendormail + "</a></td>";
        test += "</tr>";
        test += "<tr>";
        test += "<td valign=\"top\">Web:</td>";
        test += "<td width=" + width + ">&nbsp;</td>";
        test += "<td colspan=2><a href=\"http://sven-ziegler.com\">http://sven-ziegler.com</a></td>";
        test += "</tr>";
        test += "<tr>";
        test += "<td valign=\"top\">Twitter:</td>";
        test += "<td width=" + width + ">&nbsp;</td>";
        test += "<td colspan=2><a href=\"http://twitter.com/svzi\">@svzi</a></td>";
        test += "</tr>";

        test += "<tr>";
        test += "<td colspan=4><hr></td>";
        test += "</tr>";
        test += "<tr>";
        test += "<td valign=\"top\">" + $L("Icons / Graphics:") + "</td>";
        test += "<td width=" + width + ">&nbsp;</td>";
        test += "<td colspan=2><a href=\"mailto:reischuck.micha@googlemail.com\">Micha Reischuck</a></td>";
        test += "</tr>";
        test += "</table>";
        
        this.$.wwwLabel.setContent(test);
    },
    
    acceptButtonClick: function() {
        this.doAccept();
        this.close();
    },
    
    linkClicked: function (inSender, inEvent) {
        if (Util.isDebug()) {
            this.log("inEvent: " + inEvent);
        }
        this.owner.$.myservices.callAppManService(inEvent);  
    },

});