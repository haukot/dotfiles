enyo.kind({
    name: "MediaContent",
    kind: "enyo.Control",
    components: [
        {kind: "FileUtils"},
        {kind: enyo.PalmService,
            name: "downloadService",
            service: "palm://com.palm.downloadmanager/",
            method: "download",
            timeout: 30000,
            subscribe: true,
            resubscribe: true,
            onSuccess: "grabImageSuccess",
            onFailure: "grabImageFailure",
        },
        {
            name : "openService",
            kind : "PalmService",
            service : "palm://com.palm.applicationManager",
            method : "open",
            onSuccess : "openSuccess",
            onFailure : "openFailure",
            subscribe : true
        },
        {name: "content", className: Util.getClassName("content"), style: "min-height: " + Util.getMinContentHeight(), components: [
            {name: "headline_description", className: Util.getClassName("subtext-headline")},
            {name: "description", className: Util.getClassName("subtext-content"), allowHtml: true},
            {name: "headline_image", className: Util.getClassName("subtext-headline")},
            {name: "image", className: Util.getClassName("subtext-content"), allowHtml: true},
            {name: "downloadButton", kind: "ActivityButton", caption: $L("Download"), style: "padding-left: 10px; margin-top: 5px;", className: "enyo-button-affirmative", onclick: "handleClick", layoutKind: "HFlexLayout", align: "center"}, 
        ]},
        {kind: "NoHandlerFoundDialog", name: "noHandlerFoundDialog"},
        {name: "imageViewer", kind: "ImageViewer"},
        {kind: "ModalDialog", name: "noOpenDialog", caption: $L("File could not be opened!"), components:[
             {content: $L("This file-type can not be opened on this device. You can find this file in your download-folder."), className: "enyo-paragraph"},
             {layoutKind: "HFlexLayout", components: [
                 {kind: "Button", caption: $L("Ok"), flex: 1, onclick: "closeNoOpenDialog"},
             ]}
        ]},
    ],

    published: {
       item: "",                                                                                                                                               
    },                                                                                                                                                          
                                                                                                                                                                
    update : function( item, filter, highlight ) {                                                                                                              
        if (Util.isDebug()) {
            this.log("highlight: " + highlight);                                                                                                                    
        }
                                                                                                                                                                
        this.item = item;                                                                                                                                       
                                                                                                                                                                
        var description = item.properties.description;                                                                                                          
        if (Util.isDebug()) {
            this.log("description: " + description);
        }                                                                                                                
                                                                                                                                                                
        if (filter !== undefined && filter != null && filter != "" && highlight == true) {                                                                      
            description = StringUtils.applyFilterHighlight( description, filter, "searchResult");                                                                      
        }                                                                                                                                                       
                                                                                                                                                                
        if (description != "" && description !== undefined) {                                                                                                   
            this.$.headline_description.setContent( $L("Description") );                                                                                        
            this.$.description.setContent( description );                                                                                                       
        }            
        
        if (item.type == "/Type(Photo)/") {
	        this.$.headline_image.setContent( $L("Photo") );                                                                                        
	        var url = item.properties.url;
	        if (url !== undefined && url != "" && Settings.getSettings().online == true) {                                                                                                   
	        	this.$.image.setContent( "<img border=0 src='" + url + "'>" );
	        } else {
	        	this.$.image.setContent( $L("Photo is currently only available online!") );
	        }
        }
                                                                                                                                                                
        var fn = Util.getFileNameFromObject( item );                                                                                                            
        var fileExists = this.$.fileUtils.fileExists( fn, Constants.DOWNLOAD_TYPE_SHARED_FILE );
        if (Util.isDebug()) {
            this.log("fileExists: " + fileExists);
        }                                                                                                                  
        if (fileExists || Platform.isBrowser()) {                                                                                                                                       
            this.$.downloadButton.setCaption( $L("Open") );                                                                                                     
            this.$.downloadButton.value = "open";                                                                                                               
        }                                                                                                                                                       
                                                                                                                                                                
    },                                                                                                                                                          
                                                                                                                                                                
    handleClick : function( inSender ) {                                                                                                                        
        // this.log( inSender.value );                                                                                                                          
        var pos = -1;                                                                                                                                           
        if (inSender.value !== undefined) {                                                                                                                     
            pos = String(inSender.value).indexOf("open");                                                                                                       
        }                                                                                                                                                       
        if ( pos != -1 ) {                                                                                                                                      
            this.openObject( );                                                                                                                                 
        } else {                                                                                                                                                
            this.downloadObject( );                                                                                                                             
        }                                                                                                                                                       
    },                                                                                                                                                          
                                                                                                                                                                
    openObject : function( ) {                                                                                                                                  
        var obj = this.item;                                                                                                                                    
        var type = String( StringUtils.getValueFromString( obj.type ) ).toLowerCase();                                                                                 
        if (Util.isDebug()) {
            this.log("type: " + type);
        }                                                                                                                              
        if (type != "hyperlink") {                                                                                                                              
            var fn = Util.getFileNameFromObject( obj );
            var path = this.$.fileUtils.getPath( Constants.DOWNLOAD_TYPE_SHARED_FILE );
            var fileNameAndPath = (path != "" ? path + "/" + fn : fn);
            if (Util.isDebug()) {
                this.log("fileNameAndPath: " + fileNameAndPath);
            }
                                                                                                                                                                
            var mimeType = Util.finagleMimeType( fileNameAndPath );                                                                                             
            if (Util.isDebug()) {
                this.log("mimeType: " + mimeType);
            }                                                                                                                  
            if (String(mimeType).indexOf("image") != -1 && !Platform.isBrowser()) {
                if (Util.isDebug()) {
                    this.log("showing image: " + fileNameAndPath);
                }                                                                                                  
                this.$.imageViewer.openAtCenter();                                                                                                              
                this.$.imageViewer.setImage( fileNameAndPath );                                                                                                 
            } else {                                                                                                                                            
                if (Platform.isWebOS()) {                                                                                                                           
                    if (Util.isDebug()) {
                        this.log("open file: " + fileNameAndPath);
                    }                                                                                                  
                    this.$.openService.call({ "target": fileNameAndPath} );                                                                                     
                } else {                                                                                                                                        
                	if (String(mimeType).indexOf("image") != -1 && Platform.isPlaybook()) {
                		this.$.noOpenDialog.openAtCenter();
                	} else {
                        var objUrl = (obj.properties.url !== undefined ? obj.properties.url : obj.image);
                        
                        var url = encodeURI( objUrl );
                        if (url === undefined || url == undefined || url == "undefined" || url == null) {
                            url = "http://springpad-user-data.s3.amazonaws.com/" + obj.properties.key;
                        }
                        Platform.browser( url, this )();
                	}
                }                                                                                                                                               
            }                                                                                                                                                   
        } else {                                                                                                                                                
            if (Util.isDebug()) {
                this.log("open url: " + obj.properties.url);
            }                                                                                                        
            Platform.browser( obj.properties.url, this )();                                                                                                     
        }                                                                                                                                                       
    },                                                                                                                                                          
                                                                                                                                                                
    downloadObject : function( ) {
        if (Settings.getSettings().online == true) {
            this.$.downloadButton.setActive( true );                                                                                                            
            var obj = this.item;                                                                                                                                
    
            var objUrl = (obj.properties.url !== undefined ? obj.properties.url : obj.image);
        
            var url = encodeURI( objUrl );
            if (url === undefined || url == undefined || url == "undefined" || url == null) {
                url = "http://springpad-user-data.s3.amazonaws.com/" + obj.properties.key;
            }
            if (Util.isDebug()) {
                this.log("downloading: " + url);
            }
            
            var fn = obj.properties.fileName; 
            this.$.fileUtils.onLoadFileSuccess = "grabImageSuccess";
        	this.$.fileUtils.onLoadFileFailure = "grabImageFailure";
        	this.$.fileUtils.downloadFileFromURL( url, Constants.DOWNLOAD_TYPE_SHARED_FILE, fn );

        } else {
            this.$.onlyOnlineDialog.openAtCenter();
        }
    },

    grabImageSuccess: function(inSender, inResponse) {                                                                                                          
        this.$.downloadButton.setCaption( $L("Open") );                                                                                                     
        this.$.downloadButton.value = "open";                                                                                                 
        this.$.downloadButton.setActive( false );                                                                                                           
    },                                                                                                                                                          
                                                                                                                                                                
    grabImageFailure : function( inSender, url, targetFilename, result ) {
		this.error("download of file failed: " + targetFilename + "");
		if (result !== undefined && result != null) {
			this.error("Error code: " + result.code);
			this.error("HTTP status: " + result.http_status);
			this.error("Source: " + result.source);
			this.error("Target: " + result.target);
		}
		// something went wrong :-(
		// remove from array of currently downloading items
        this.$.downloadButton.setActive( false );                                                                                                               
    },
                                                                                                                                                                
    openSuccess: function(inSender, inResponse) {                                                                                                               
        // this.log("Open success, results=" + enyo.json.stringify(inResponse));                                                                                
    },                                                                                                                                                          
                                                                                                                                                                
    openFailure: function(inSender, inError, inRequest) {                                                                                                       
        if (Util.isDebug()) {
            this.log(enyo.json.stringify(inError));
        }                                                                                                                 
                                                                                                                                                                
        this.$.noHandlerFoundDialog.openAtCenter();                                                                                                             
        var fileName = StringUtils.getFilenameFromURL( inError.errorText );                                                                                            
        this.$.noHandlerFoundDialog.setMessage( $L("Found no default app for:") + "<br><b>" + fileName + "</b>!<br><br>" + $L("But you can access the file in the downloads-folder with an appropriate app."));
    },                                                                                                                                                          
                                                                                                                                                                
    closeNoHandlerFoundDialog : function() {                                                                                                                     
       this.$.noHandlerFoundDialog.close();                                                                                                                     
    },                                                                                                                                                           
                                                                                                                                                                
    closeNoOpenDialog : function() {                                                                                                                            
        this.$.noOpenDialog.close();                                                                                                                            
    },                                                                                                                                                          
                                                                                                                                                                
    /*processBinaryDataOnPlaybook: function( request, targetFilename, url, sizeInBytes ) {                                                                        
        // this.log();                                                                                                                                          
        if(request.readyState == 4) {                                                                             
            if(request.status == 200 || request.status == 304){                                                                                                 
                try {                                                                                                                                           
                    var startReady1 = new Date();                                                                                                               
                    // this.log("duration: " + DateTimeUtils.ms_between(startReady0, startReady1));                                                                      
                                                                                                                                                                
                    if (Util.isDebug()) {
                        this.log("targetFilename: " + targetFilename);                                                                                              
                        this.log("url: " + url);
                    }
                                                                                                                                            
                                                                                                                                                                
                    var filename = blackberry.io.dir.appDirs.shared.downloads.path + "/" + targetFilename;                                                      
                                                                                                                                                                
                    if (Platform.isBlackBerry()) {                                                                                                                    
                                                                                                                                                                
                        var response = request.response;                                                                                                        
                                                                                                                                                                
                        var startReady2 = new Date();                                                                                                           
                        // console.log("duration: " + DateTimeUtils.ms_between(startReady1, startReady2));                                                               
                                                                                                                                                                
                        // try {                                                                                                                                
                            if (Util.isDebug()) {
                                this.log("encoding data");
                            }                                                                                                          
                            var encoded = Util.base64ArrayBuffer(response);                                                                                     
                            var startReady3 = new Date();                                                                                                       
                            // this.log("duration: " + DateTimeUtils.ms_between(startReady2, startReady3));                                                              
                                                                                                                                                                
                            // console.log("encoded: " + encoded);                                                                                              
                            if (Util.isDebug()) {
                                this.log("creating blob data");
                            }                                                                                                     
                            var blob_data =  blackberry.utils.stringToBlob(encoded, "binary");                                                                  
                            var startReady4 = new Date();                                                                                                       
                            // this.log("duration: " + DateTimeUtils.ms_between(startReady3, startReady4));                                                              
                                                                                                                                                                
                            if (Util.isDebug()) {
                                this.log("blob_data: " + blob_data);
                            }                                                                                                
                            // var filename = blackberry.io.dir.appDirs.app.storage.path + "/STREETBALL_WHUDAT-1.jpg";                                          
                            if (blackberry.io.file.exists(filename)) {                                                                                          
                                if (Util.isDebug()) {
                                    this.log("delete existing file");
                                }                                                                                            
                                blackberry.io.file.deleteFile(filename);                                                                                        
                            }                                                                                                                                   
                            var startReady5 = new Date();                                                                                                       
                            // this.log("duration: " + DateTimeUtils.ms_between(startReady4, startReady5));                                                              
                                                                                                                                                                
                            if (Util.isDebug()) {
                                this.log("saving file");
                            }                                                                                                            
                            blackberry.io.file.saveFile(filename, blob_data);                                                                                   
                            var startReady6 = new Date();                                                                                                       
                            // this.log("duration: " + DateTimeUtils.ms_between(startReady5, startReady6));                                                              
                                                                                                                                                                
                            // console.log("overall duration: " + DateTimeUtils.ms_between(startReady0, startReady6));                                                   
                            if (Util.isDebug()) {
                                this.log("overall response processing: " + DateTimeUtils.ms_between(startReady1, startReady6));
                            }                                              
                        // } catch (e) {                                                                                                                        
                            // console.error("**********************************************************");                                                     
                            // console.error("file could not be saved because of: " + e);                                                                       
                            // console.error("**********************************************************");                                                     
                        // }                                                                                                                                    
                                                                                                                                                                
                        if (Util.isDebug()) {
                            this.log("finished file handling");
                        }                                                                                                     
                    }                                                                                                                                           
                                                                                                                                                                
                                                                                                                                                                
                if (Util.isDebug()) {
                    this.log("saved object: " + filename );
                }                                                                                                         
                                                                                                                                                                
                this.$.downloadButton.setCaption( $L("Open") );                                                                                                 
                this.$.downloadButton.value = "open-" + this.index;                                                                                             
                this.$.downloadButton.setActive( false );                                                                                                       
                                                                                                                                                                
                } catch (e) {                                                                                                                                   
                    this.error("**********************************************************");                                                                   
                    this.error(e);                                                                                                                              
                    this.error("**********************************************************");                                                                   
                }                                                                                  
            }                                                                                                                                                   
        }                                                                                                                                                       
    },*/                                                                                                                                                          
                                                                                                                                                                
});