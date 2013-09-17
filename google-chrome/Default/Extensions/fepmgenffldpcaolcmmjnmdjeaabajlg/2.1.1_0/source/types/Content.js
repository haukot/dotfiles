enyo.kind({
    name: "Content",
    kind: "enyo.Control",
    components: [
        {name: "launchAppCall", kind: "PalmService", service: "palm://com.palm.applicationManager/", method: "launch", onSuccess: "launchFinished", onFailure: "launchFail", onResponse: "gotResponse"},
    ],
    
    published: {
        inhalt: "",
    },

    update : function( item, filter, highlight ) {
        if (Util.isDebug()) {
            this.log("START");
        }
        this.createItem( item, filter, highlight );
        if (Util.isDebug()) {
            this.log("END");
        }
    },
    
    createItem : function( item, filter, highlight ) {
        if (Util.isDebug()) {
            this.log("START");
        }
        if (this.$.content !== undefined) {
            this.$.content.destroyComponents();
            this.$.content.destroy();
        }
        
        var type = StringUtils.getValueFromString( item.type );
        if (Util.isDebug()) {
            this.log("type: " + type);
        }
        this.props = ObjectDescription.getProperties( type );
        // this.log("this.props: " + JSON.stringify(this.props));
        
        var str = '';
        if (type == "Note" || this.props == null) {
            if (this.props == null) {
                str = StringUtils.stripHtmlCodes(this.inhalt);
                // str = this.inhalt;
            } else {
                var text = item.properties.text;
                str = StringUtils.stripHtmlCodes( text );
            }
            if (filter !== undefined && filter != null && filter != "" && highlight == true) {
                str = StringUtils.applyFilterHighlight( str, filter, "searchResult");
            }
            str = StringUtils.createLink( str );

            str = String(str).replace(/\r\n/gi, "");
            str = String(str).replace(/\n/gi, "<br>");
            str = String(str).replace(/\r/gi, "");  
        }
        if (Util.isDebug()) {
            this.log("str: " + str);
        }
        this.$.content = this.createComponent( {name: "content", className: Util.getClassName("content"), content: str, allowHtml: true, style: "min-height: " + Util.getMinContentHeight(), onLinkClick: "linkClicked" }, { owner: this } );

        // iterate over object description
        for (key in this.props) {
            var obj = this.props[key];
            if (obj.propertyName != "name") {
                // this.log("obj: " + JSON.stringify(obj));
                if (type != "Note" && obj.propertyLabel == "Source") {
                    this.createSourceElement( item, filter, highlight, type );
                } else if (obj.propertyName == "properties.contactInfo") {
                    this.createAddressElement( item, filter, highlight );
                } else if (obj.propertyName == "properties.scraper_urls") {
                    this.createScraperElement( item, filter, highlight );
                } else if (type != "Note"){

                    if (Util.isDebug()) {
                        this.log("obj.propertyName: " + obj.propertyName );
                    }
                    
                    var value = Property.getValue( item, obj.propertyName );
                    if (value === undefined || value == "undefined" || value == null) {
                        if (Util.isDebug()) {
                            this.log( obj.propertyName + " does not exists!" );
                        }
                    }

                    if (obj.propertyType != "DatePicker" && obj.propertyType != "TimePicker" && obj.propertyType != "DateTime") {
    
    
    
                        if (value !== undefined && value != null && value != "") {
                            value = String(value).replace(/(<iframe[^<]+<\/iframe>)/gi, "");
                            value = String(value).replace(/(<script[^<]+<\/script>)/gi, "");

                            value = String(value).replace(/\r\n/gi, "");
                            value = String(value).replace(/\n/gi, "<br>");
                            value = String(value).replace(/\r/gi, "");  
                        }
                        if (filter !== undefined && filter != null && filter != "" && highlight == true) {
                            value = StringUtils.applyFilterHighlight( value, filter, "searchResult");
                        }
                        
                    // } else if (obj.propertyType == "Boolean") {
                        
                    } else {
                        
                        value = StringUtils.getValueFromString( value );
                        var mydate = new Date();
                        mydate.setTime( value );
                        var dateFmt = null;
                            
                        if (obj.propertyType == "DateTime") {
                            dateFmt = new enyo.g11n.DateFmt( {"format" : "full"} );
                        } else if (obj.propertyType == "DatePicker") {
                            dateFmt = new enyo.g11n.DateFmt( {"date" : "short"} );
                        } else {
                            dateFmt = new enyo.g11n.DateFmt( {"time" : "short"} );
                        }                     

                        var value = dateFmt.format( mydate );
                    }

                    if (Platform.isVeer()) {
                        if (Util.isDebug()) {
                            this.log("stripping html codes...");
                        }
                        value = StringUtils.stripHtmlCodes( value );
                    }
                    
                    if (Util.isDebug()) {
                        this.log("value: " + value);
                    }

                    if (value !== undefined && value != null && value != "" && value != "undefined") {
                        this.$["headline" + obj.propertyLabel] = this.$.content.createComponent( {name: "headline_text", className: Util.getClassName("subtext-headline")}, { owner: this } );
                        this.$[obj.propertyLabel] = this.$.content.createComponent( {name: "text", className: Util.getClassName("subtext-content"), allowHtml: true}, { owner: this } );
    
                        this.$["headline" + obj.propertyLabel].setContent( $L(obj.propertyLabel) );
                        if (obj.propertyType != "Boolean") {
                            this.$[obj.propertyLabel].setContent( value );
                        } else {
                            var checked = (value == true || value == "true" ? "checked='checked'" : "");
                            var checkbox = "<input type='checkbox' " + checked + ">";
                            if (Util.isDebug()) {
                                this.log("checkbox: " + checkbox);
                            }
                            this.$[obj.propertyLabel].setContent( checkbox );
                        }                        
                    }
                    
                    
                }
                
                
            }
            
        }
        
        this.$.content.render();
        if (Util.isDebug()) {
            this.log("END");
        }
    },
    
    createSourceElement : function( item, filter, highlight, type ) {
        var link;
        var title;
        
        if (type == "/Type(Recipe)/") {
        	link = item.properties.source_url
        } else {
        	link = (item.properties.url !== undefined ? item.properties.url : item.properties["/meta/sourceUrl"]);
        }
        if (link === undefined) {
        	link = "",
        	title = '';
        } else
        {
            title = StringUtils.getHostname( link );
        }
        if (Util.isDebug()) {
            this.log("link: " + link );
            this.log("title: " + title );
        }

        if (link != "" && title != "") {
            if (filter !== undefined && filter != null && filter != "" && highlight == true) {
                title = StringUtils.applyFilterHighlight( title, filter, "searchResult");
            }
            
            this.$.source = this.$.content.createComponent( {name: "source", className: Util.getClassName("source")}, { owner: this });
            this.$.headline_source = this.$.source.createComponent( {name: "headline_source", className: Util.getClassName("subtext-headline")}, { owner: this });
            this.$.image = this.$.source.createComponent( {name: "image", kind: "Image", src: ""}, { owner: this });
            this.$.caption = this.$.source.createComponent( {name: "caption", className: Util.getClassName("caption"), kind: enyo.HtmlContent, content : "", allowHtml: true, onLinkClick: "linkClicked" }, { owner: this }  );
            this.$.caption_print = this.$.source.createComponent( {name: "caption_print", className: "caption-print", kind: enyo.HtmlContent, content : "", allowHtml: true, onLinkClick: "linkClicked" }, { owner: this }  );
    
            this.$.headline_source.setContent( $L("Source") );
    
            var favicon = "http://www.google.com/s2/favicons?domain=" + title;
            var faciconImgSmall = "<img style=\"width: 16px; height: 16px;\" border=0 src=" + favicon + ">";
            this.$.image.setSrc( favicon );

            var content = title;
            if (Util.isDebug()) {
                this.log("Platform.isVeer(): " + Platform.isVeer());
            }
            if (Platform.isVeer() == false) {
                content = "<a href=\"" + link  + "\">" + title + "</a>";
            }
            if (Util.isDebug()) {
                this.log("content: " + content);
            }


            // content = enyo.string.runTextIndexer( link );
            this.$.caption.setContent( content );
            this.$.caption_print.setContent( link );
        }
    },
    
    linkClicked: function (inSender, inEvent) {
        if (Util.isDebug()) {
            this.log("inEvent: " + inEvent);
        }
        Platform.browser( inEvent, this )();
    },

    createAddressElement : function( item, filter, highlight ) {
        
        var text = "";
        if (Util.isDebug()) {
            this.log("item.properties.contactInfo: " + JSON.stringify( item.properties.contactInfo) );
        }
        // this.log("item.properties: " + JSON.stringify( item.properties) );
        if (enyo.isArray(item.properties.contactInfo) && item.properties.contactInfo.length > 0) {
            if (Util.isDebug()) {
                this.log("item.properties.contactInfo.length: " + item.properties.contactInfo.length);
            }
            
            var index = item.properties.contactInfo.length -1;
            if (Util.isDebug()) {
                this.log("index: " + index);
            }
            if (item.properties.contactInfo[0].properties !== undefined && item.properties.contactInfo[0].properties.text !== undefined) {
                text = item.properties.contactInfo[0].properties.text;
            } else {
                this.error("this should not happen!");
            }
        } else if (String(item.properties.contactInfo).length > 0) {
            text = item.properties.contactInfo;
        }
        
        if (Util.isDebug()) {
            this.log("text: " + text);
        }
        if (text != "" && text !== undefined) {
            if (filter !== undefined && filter != null && filter != "" && highlight == true) {
                text = StringUtils.applyFilterHighlight( text, filter, "searchResult");
            }
            
            this.$["headlineAddress"] = this.$.content.createComponent( {name: "headlineAddress", className: Util.getClassName("subtext-headline")}, { owner: this } );
            this.$["Address"] = this.$.content.createComponent( {name: "Address", className: Util.getClassName("subtext-content"), allowHtml: true}, { owner: this } );

            this.$["headlineAddress"].setContent( $L("Address") );
            this.$["Address"].setContent( text );


            this.$["headlineAddressMap"] = this.$.content.createComponent( {name: "headlineAddressMap", className: Util.getClassName("subtext-headline")}, { owner: this } );
            this.$["AddressMap"] = this.$.content.createComponent( {name: "AddressMap", className: Util.getClassName("subtext-content"), allowHtml: true}, { owner: this } );

            var size = "640x400";
            // if (Platform.isPlaybook()) {
                // if (Platform.screenWidth > Platform.screenHeight) {
                    // size = "450x220";
                // } else {
                    // size = "300x300";
                // }
            // } else if (Platform.isTouchpad()) {
                // size = "450x350";
            // }
            if (Util.isDebug()) {
                this.log("size: " + size);
            }
            var addr = encodeURI(text);
            var mapImage = "http://maps.google.com/maps/api/staticmap?center=" + addr + "&zoom=15&size=" + size + "&markers=" + addr + "&sensor=false";
            if (Util.isDebug()) {
                this.log("mapImage: " + mapImage);
            }

            this.$["headlineAddressMap"].setContent( $L("Map") );
            
            if (Settings.getSettings().online == true) {
                this.$["AddressMap"].setContent( "<img border=0 src='" + mapImage + "'>" );
            } else {
                this.$["AddressMap"].setContent( $L("Map currently only available online!") );
            }
        }
    },
    
    createScraperElement : function( item, filter, highlight ) {
        
        var link = "";
        if (Util.isDebug()) {
            this.log("item.properties.scraper_urls: " + JSON.stringify( item.properties.scraper_urls) );
        }
        if (enyo.isArray(item.properties.scraper_urls) && item.properties.scraper_urls.length > 0) {
            if (Util.isDebug()) {
                this.log("item.properties.scraper_urls.length: " + item.properties.scraper_urls.length);
            }
            
            var index = item.properties.scraper_urls.length -1;
            link = item.properties.scraper_urls[index];
        }
         
        if (link != "") {
            this.$.source = this.$.content.createComponent( {name: "source", className: Util.getClassName("source")}, { owner: this });
            this.$.headline_source = this.$.source.createComponent( {name: "headline_source", className: Util.getClassName("subtext-headline")}, { owner: this });
            this.$.image = this.$.source.createComponent( {name: "image", kind: "Image", src: ""}, { owner: this });
            this.$.caption = this.$.source.createComponent( {name: "caption", className: Util.getClassName("caption"), kind: enyo.HtmlContent, content : "", allowHtml: true, onLinkClick: "linkClicked" }, { owner: this }  );
            this.$.caption_print = this.$.source.createComponent( {name: "caption_print", className: "caption-print", kind: enyo.HtmlContent, content : "", allowHtml: true, onLinkClick: "linkClicked" }, { owner: this }  );
    
            this.$.headline_source.setContent( $L("Source") );
    
            var host = StringUtils.getHostname( link );
            var favicon = "http://www.google.com/s2/favicons?domain=" + host;
            var faciconImgSmall = "<img style=\"width: 16px; height: 16px;\" border=0 src=" + favicon + ">";

            if (Platform.isTouchpadOrPre3() == true || Platform.isTablet() == true) {
                content = " <a href=\"" + link  + "\">" + host + "</a>";
            } else {
                content = host;
            }
            this.$.image.setSrc( favicon );

            this.$.caption.setContent( content );
            this.$.caption_print.setContent( link );
        }
    },
    

});