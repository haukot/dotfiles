enyo.kind({
    name: "ImageViewer",
    kind: enyo.Popup,
    dismissWithClick: true,
    scrim: true,
    /*style: "height: 100%; width: 100%; ",*/
    style: "height: 100%; width: 100%; -webkit-box-sizing:content-box; padding: 0 !important; border-width: 0px !important; text-align: center;",
    components: [
                    // {name: "tmpImage", id: "image_id", kind: "enyo.Image"}
    ],

    setImage: function( inImage ) {
        // this.$.imageView.applyStyle("height", window.innerHeight - 20 + "px");
        if (inImage !== undefined && inImage != null) {
            
            var img = document.createElement("img");
            img.src = inImage;

            var width = img.width;
            var height = img.height;
            
            if (width == 0 || height == 0) {
            	this.close();
                return;
            }

            if (Util.isDebug()) {
                this.log("width: " + width);
                this.log("height: " + height);
            }
            
            // scale on tp differently
            var maxSize = 0.75;
            // if (!Platform.isTouchpad() == false) {
                // maxSize = 0.75;
            // }
            
            var additionalBgStyle = "";
            var tooWidth = Number(width) >= Number(Platform.screenWidth * maxSize);
            var tooHeight = Number(height) >= Number(Platform.screenHeight * maxSize);
            
            if (Platform.isWebOS() && !Platform.isTouchpad()) {
                // width and height are swapped on the pre3
                if (Util.isDebug()) {
                    this.error("width: " + width);
                    this.error("height: " + height);
                    this.error("Platform.screenHeight: " + Platform.screenHeight);
                    this.error("Platform.screenWidth: " + Platform.screenWidth);
                    this.error("tooWidth: " + tooWidth);
                    this.error("tooHeight: " + tooHeight);
                }
            }

            if (Util.isDebug()) {
                this.log("tooWidth: " + tooWidth);
                this.log("tooHeight: " + tooHeight);
            }
            
            
            if ( tooWidth ) {
                this.warn("image width to big, reducing...");
                additionalBgStyle = "background-size: " + Number(maxSize*100) + "% auto;";
            } else if ( tooHeight ) {
                this.warn("image height to big, reducing...");
                additionalBgStyle = "background-size: auto " + Number(maxSize*100) + "%;";
            }
            if (Util.isDebug()) {
                this.log("additionalBgStyle: " + additionalBgStyle);
            }
            
            if (this.$.imageView != null) {
                this.$.imageView.destroy();
            }
            this.$.imageView = this.createComponent( {name: "imageView", kind: "HtmlContent", content: "&nbsp;", onclick: "close", style:"background:url(" + inImage + ") center center no-repeat transparent; " + additionalBgStyle + " width: 100%; height: 100%;"} );
            this.render();
        } else {
            this.error("inImage: " + inImage);
            return;
        }
    },

    createBgImage : function( w, h ) {
        if (Util.isDebug()) {
            this.log("w: " + w);
            this.log("h: " + h);
        }
    }
});