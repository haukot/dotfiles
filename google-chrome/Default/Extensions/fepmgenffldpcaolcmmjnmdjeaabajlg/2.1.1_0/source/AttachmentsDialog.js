enyo.kind({
    name: "AttachmentsDialog",
    kind: enyo.ModalDialog,
    /*height: (Platform.isWebOS() ?  
                (Platform.isTouchpad() ? "580px" : (Platform.isTouchpadOrPre3() ? "395px" : "285px"))
                : (Platform.isTablet() || Platform.isBrowser() ? "580px" : "395px")),*/
    width: (Platform.isTablet() ? "580px" : "100%"),
    caption: $L("Attachments"),
    events: {
        onSelectObject: "",
        onUpdateItem: ""
    },
    components: [
        {kind: "ApplicationEvents", onWindowHidden: "close"},
        {name: "springpadApi", kind: "SpringpadApi"},
        {kind: "FileUtils", onRemoveCurrent: "removeCurrentItem"},
        {
            name : "openService",
            kind : "PalmService",
            service : "palm://com.palm.applicationManager",
            method : "open",
            onSuccess : "openSuccess",
            onFailure : "openFailure",
            subscribe : true
        },
        /*{name: "downloadImageService", kind: "WebService", onSuccess: "downloadImageSuccess",  onFailure: "downloadImageSuccess"},*/
        {kind: "NoHandlerFoundDialog", name: "noHandlerFoundDialog"},
        {name: "imageViewer", kind: "ImageViewer"},
        {name: "onlyOnlineDialog", kind: "OnlyOnlineDialog"},
        {name: "addAttachmentDialog", kind: "AddAttachmentDialog", onFileSelected: "onFileSelected", onFileSelectedChrome: "onFileSelectedChrome"},
        {name: "scroller", kind: enyo.Scroller, flex: 1, 
                height: (Platform.isWebOS() ?  
                    (Platform.isTouchpad() ? "460px" : (Platform.isTouchpadOrPre3() ? "275px" : "165px"))
                    : (Platform.isTablet() || Platform.isBrowser() ? "400px" : "275px")), 
                autoHorizontal: false, horizontal: false, components: [
            {name: "theParent", layoutKind: "VFlexLayout", components: [
            ]},
        ]},
        {layoutKind: "HFlexLayout", style: "padding-top: 10px; ", components: [
        	{name: "cancelButton", kind: "Button", caption: $L("Close"), flex: 1, className: "enyo-button-dark", onclick: "close"},
        	(Platform.isTablet() || Platform.isBB10() ? {name: "newButton", kind: "Button", caption: $L("New"), flex: 1, className: "enyo-button-affirmative", onclick: "addFile"} : null)
    	]},
        {kind: "ModalDialog", name: "noOpenDialog", caption: $L("File could not be opened!"), components:[
             {content: $L("This file-type can not be opened on this device. You can find this file in your download-folder."), className: "enyo-paragraph"},
             {layoutKind: "HFlexLayout", components: [
                 {kind: "Button", caption: $L("Ok"), className: "enyo-button-negative", flex: 1, onclick: "closeNoOpenDialog"},
             ]}
        ]},
        {kind: "ModalDialog", name: "noOpenYetDialog", caption: $L("File could not be opened!"), components:[
             {content: $L("This entry have to be synced once to be able to be opened!"), className: "enyo-paragraph"},
             {layoutKind: "HFlexLayout", components: [
                 {kind: "Button", caption: $L("Ok"), className: "enyo-button-negative", flex: 1, onclick: "closeNoOpenYetDialog"},
             ]}
        ]},
        {kind: "ModalDialog", name: "fileToBigDialog", caption: $L("File is to big!"), components:[
             {content: $L("This file is to big to be downloaded on this device."), className: "enyo-paragraph"},
             {layoutKind: "HFlexLayout", components: [
                 {kind: "Button", caption: $L("Ok"), className: "enyo-button-negative", flex: 1, onclick: "closeFileToBigDialog"},
             ]}
        ]},
    ],
    
    createDialog : function( item ) {
        this.item = item;
        this.attachments = item.properties.attachments;
        var attachments = this.attachments;
        // this.log("item.properties: " + JSON.stringify(item.properties));
        this.$.theParent.destroyControls(); 

        if (attachments !== undefined && attachments != null && attachments.length > 0 && !Platform.isBrowser()) {
            this.$.theParent.createComponent( {nodeTag: "hr"}, { owner: this } );
            this.$.theParent.createComponent( {content: $L("You can find all downloaded items in your download-folder on this device!"), style: "padding-left: 10px; font-size: 16px; overflow: hidden; margin-top: 5px;", name: "hinweis", pack: "center"}, { owner: this } ); 
            this.$.theParent.createComponent( {nodeTag: "hr"}, { owner: this } );
        }

        var count = 0;
        
        // build the attachments
        for (key in attachments) {

            var obj = attachments[key];
            if (obj.deleted == true || obj.deleted == "true") {
                continue;
            }
            count++;
            // this.log("key: " + key);
            if (Util.isDebug()) {
                this.log("obj: " + JSON.stringify(obj));
            }
            var type = String( StringUtils.getValueFromString( obj.type ) ).toLowerCase();
            var img = "images/types/" + type + "_48.png";
            var description = (obj.properties !== undefined && obj.properties.description !== undefined && obj.properties.description != null ? obj.properties.description : "");
            var added = StringUtils.getValueFromString(obj.created);
            var d = new Date();
            d.setTime( added );
            dateFmt = new enyo.g11n.DateFmt( {"format" : "short"} );
            var dateValue = $L("Added: ") + dateFmt.format( d );
            
            this.$["kind" + key] = this.$.theParent.createComponent( {name: "kind" + key, layoutKind: "HFlexLayout", align: "top", pack: "center"}, { owner: this } );
            if (Platform.isTablet() == true) {
                this.$["kind" + key].createComponent( {kind: "Image", src: img}, { owner: this } );
            } 
            var fn = Util.getFileNameFromObject( obj );
            this.$["contentBox" + key] = this.$["kind" + key].createComponent( {name: "contentBox" + key, kind: "VFlexBox", flex:1, align: "start", pack: "top"}, { owner: this } ); 
            this.$["contentBox" + key].createComponent( {content: fn, style: "padding-left: 10px; font-size: 16px; overflow: hidden; font-weight:bold; text-overflow: ellipsis;"}, { owner: this } ); 
            this.$["contentBox" + key].createComponent( {content: description, style: "padding-left: 10px; font-size: 16px; overflow: hidden; margin-top: 5px;"}, { owner: this } ); 
            this.$["contentBox" + key].createComponent( {content: dateValue, style: "padding-left: 10px; font-size: 14px; overflow: hidden; margin-top: 5px;"}, { owner: this } );
            if (Platform.isTablet() == true) {
                this.$["buttonDelete" + key] = this.$["kind" + key].createComponent( {kind: "ActivityButton", caption: $L("Delete"), className: "enyo-button-negative", value: key, onclick: "deleteClick", layoutKind: "HFlexLayout", align: "center", style: "height: 35px;"}, { owner: this } );
                this.$["button" + key] = this.$["kind" + key].createComponent( {kind: "ActivityButton", caption: $L("Download"), className: "enyo-button-affirmative", value: key, onclick: "handleClick", layoutKind: "HFlexLayout", align: "center", style: "height: 35px;"}, { owner: this } );
            } else {
                this.$["buttonDelete" + key] = this.$["contentBox" + key].createComponent( {kind: "ActivityButton", caption: $L("Delete"), style: "padding-left: 10px; margin-top: 5px;", className: "enyo-button-negative", value: key, onclick: "deleteClick", layoutKind: "HFlexLayout", align: "center"}, { owner: this } );
                this.$["button" + key] = this.$["contentBox" + key].createComponent( {kind: "ActivityButton", caption: $L("Download"), style: "padding-left: 10px; margin-top: 5px;", className: "enyo-button-affirmative", value: key, onclick: "handleClick", layoutKind: "HFlexLayout", align: "center"}, { owner: this } );
            }
            this.$.theParent.createComponent( {nodeTag: "hr"}, { owner: this } );

            if (type != "hyperlink") {
                var fn = Util.getFileNameFromObject( obj );
                var fileExists = this.$.fileUtils.fileExists( fn, Constants.DOWNLOAD_TYPE_SHARED_FILE );
                if (Util.isDebug()) {
                    this.log("fileExists: " + fileExists);
                }
                if (obj.properties.url === undefined) {
                    this.$["button" + key].setCaption( $L("Open") );
                    this.$["button" + key].value = "notopen-" + key;
                } else if (fileExists || Platform.isBrowser()) {
                    this.$["button" + key].setCaption( $L("Open") );
                    this.$["button" + key].value = "open-" + key;
                }            
            } else {
                this.$["button" + key].setCaption( $L("Open") );
                this.$["button" + key].value = "open-" + key;
            }
            
           
        }

        // build the sources
        this.sources = item.properties.user_service_actions;
        var sources = this.sources;
        if (Util.isDebug()) {
            this.log("sources: " + JSON.stringify(sources));
        }
        for (key in sources) {

            var obj = sources[key];
            count++;
            // this.log("key: " + key);
            if (Util.isDebug()) {
                this.log("obj: " + JSON.stringify(obj));
            }
            var img = "images/types/bookmark_48.png";
            var description = obj.title;
            
            this.$["skind" + key] = this.$.theParent.createComponent( {name: "skind" + key, layoutKind: "HFlexLayout", align: "top", pack: "center"}, { owner: this } );
            if (Platform.isTablet() == true) {
                this.$["skind" + key].createComponent( {kind: "Image", src: img}, { owner: this } );
            } 
            this.$["scontentBox" + key] = this.$["skind" + key].createComponent( {name: "contentBox" + key, kind: "VFlexBox", flex:1, align: "start", pack: "top"}, { owner: this } ); 
            this.$["scontentBox" + key].createComponent( {content: obj.host, style: "padding-left: 10px; font-size: 16px; overflow: hidden; font-weight:bold; text-overflow: ellipsis;"}, { owner: this } ); 
            this.$["scontentBox" + key].createComponent( {content: description, style: "padding-left: 10px; font-size: 16px; overflow: hidden; margin-top: 5px;"}, { owner: this } ); 
            if (Platform.isTablet() == true) {
                /*this.$["sbuttonDelete" + key] = this.$["skind" + key].createComponent( {kind: "ActivityButton", caption: $L("Delete"), className: "enyo-button-dark", value: key, onclick: "deleteClick", layoutKind: "HFlexLayout", align: "center", style: "height: 35px;"}, { owner: this } );*/
                this.$["sbutton" + key] = this.$["skind" + key].createComponent( {kind: "ActivityButton", caption: $L("Open"), className: "enyo-button-affirmative", value: "sopen-" + key, onclick: "handleClick", layoutKind: "HFlexLayout", align: "center", style: "height: 35px;"}, { owner: this } );
            } else {
                /*this.$["sbuttonDelete" + key] = this.$["scontentBox" + key].createComponent( {kind: "ActivityButton", caption: $L("Delete"), style: "padding-left: 10px; margin-top: 5px;", className: "enyo-button-negative", value: key, onclick: "deleteClick", layoutKind: "HFlexLayout", align: "center"}, { owner: this } );*/
                this.$["sbutton" + key] = this.$["scontentBox" + key].createComponent( {kind: "ActivityButton", caption: $L("Open"), style: "padding-left: 10px; margin-top: 5px;", className: "enyo-button-affirmative", value: "sopen-" + key, onclick: "handleClick", layoutKind: "HFlexLayout", align: "center"}, { owner: this } );
            }
            this.$.theParent.createComponent( {nodeTag: "hr"}, { owner: this } );
        }
        
        if (count == 0) {
            if (Util.isDebug()) {
                this.log("no attachments found");
            }
            var key = "";
            this.$.theParent.createComponent( {nodeTag: "hr"}, { owner: this } );
            this.$["kind" + key] = this.$.theParent.createComponent( {name: "kind" + key, layoutKind: "HFlexLayout", align: "center", pack: "center"}, { owner: this } );
            // this.$["kind" + key].createComponent( {kind: "Image", src: img}, { owner: this } ); 
            this.$["kind" + key].createComponent( {content: $L("No Attachments found!"), flex: 1, style: "align: center; padding-left: 10px; font-size: 16px; overflow: hidden;"}, { owner: this } ); 
            // this.$["button" + key] = this.$["kind" + key].createComponent( {kind: "ActivityButton", caption: $L("Download"), className: "enyo-button-affirmative", value: key, onclick: "handleClick", layoutKind: "HFlexLayout", align: "center"}, { owner: this } );
            this.$.theParent.createComponent( {nodeTag: "hr"}, { owner: this } );
        }
        this.render();      
    },
    
    handleClick : function( inSender ) {
        // this.log( inSender.value );
        pos = String(inSender.value).indexOf("notopen-");
        if (pos != -1) {
        	this.$.noOpenYetDialog.openAtCenter();
        } else {
            pos = String(inSender.value).indexOf("sopen-");
            if (pos != -1 ) {
            	this.openSource( String(inSender.value).substring(6, String(inSender.value).length) );
            } else {
    	        pos = String(inSender.value).indexOf("open-");
    	        if ( pos != -1 ) {
    	        	this.openObject( String(inSender.value).substring(5, String(inSender.value).length) );
    	        } else {
    	            this.downloadObject( inSender.value );
    	        }
            }
        }
    },
    
    deleteClick : function( inSender ) {
        this.deleteIndex = inSender.value;
        this.$["buttonDelete" + this.deleteIndex].setActive( true );
        // this.log( deleteIndex );
        var obj = this.attachments[ this.deleteIndex ];
        this.owner.getDataManager().deleteItem( obj.uuid, this, "onDeleteSuccess");
    },

    onDeleteSuccess : function( uuid ) {
        if (Util.isDebug()) {
            this.log("uuid: " + uuid);
        }
        if (this.item.properties.attachments !== undefined) {
            if (Util.isDebug()) {
                this.log("remove from attachments");
            }
            ArrayUtils.removeElementByUUID( this.item.properties.attachments, uuid );
        }
        if (this.item.properties.user_service_actions !== undefined) {
            if (Util.isDebug()) {
                this.log("remove from sources");
            }
            ArrayUtils.removeElementByUUID( this.item.properties.user_service_actions, uuid );
        }

        this.owner.getDataManager().updateItemInList( this.item );
        this.$["buttonDelete" + this.deleteIndex].setActive( true );
        this.createDialog( this.item );
    },
    
    openObject : function( index ) {
        var obj = this.attachments[ index ];
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

    openSuccess: function(inSender, inResponse) {
        // this.log("Open success, results=" + enyo.json.stringify(inResponse));
    },          
    
    openFailure: function(inSender, inError, inRequest) {
        this.error(enyo.json.stringify(inError));
        
        this.$.noHandlerFoundDialog.openAtCenter();
        var fileName = StringUtils.getFilenameFromURL( inError.errorText );
        this.$.noHandlerFoundDialog.setMessage( $L("Found no default app for:") + "<br><b>" + fileName + "</b>!<br><br>" + $L("But you can access the file in the downloads-folder with an appropriate app."));
    },

    openSource : function( index ) {
        // this.log( index );
        var obj = this.sources[ index ];
        if (Util.isDebug()) {
//            this.log("obj: " + obj);
            this.log("open url: " + obj.url);
        }
        Platform.browser( obj.url, this )();
    },
        
    downloadObject : function( index ) {

        if (Settings.getSettings().online == true) {
            this.index = index;
            // this.log( index );
            this.$["button" + index].setActive( true );
            var obj = this.attachments[ index ];
    
            var objUrl = (obj.properties.url !== undefined ? obj.properties.url : obj.image);
        
            var url = encodeURI( objUrl );
            if (url === undefined || url == undefined || url == "undefined" || url == null) {
                url = "http://springpad-user-data.s3.amazonaws.com/" + obj.properties.key;
            }
            if (Util.isDebug()) {
                this.log("downloading: " + url);
            }
            
            var fn = obj.properties.fileName; 
            this.$.fileUtils.onLoadFileSuccess = "loadFileSuccess";
        	this.$.fileUtils.onLoadFileFailure = "loadFileFailure";
        	this.$.fileUtils.downloadFileFromURL( url, Constants.DOWNLOAD_TYPE_SHARED_FILE, fn );

        } else {
            this.$.onlyOnlineDialog.openAtCenter();
        }
        
    },

    loadFileSuccess : function( inSender, url, targetFilename, fullPath, ticket) {
		this.log("fullPath: " + fullPath);
        this.$["button" + this.index].setCaption( $L("Open") );
        this.$["button" + this.index].value = "open-" + this.index;
        this.$["button" + this.index].setActive( false );
    },
    
    loadFileFailure : function( inSender, url, targetFilename, result ) {
		this.error("download of file failed: " + targetFilename + "");
		if (result !== undefined && result != null) {
			this.error("Error code: " + result.code);
			this.error("HTTP status: " + result.http_status);
			this.error("Source: " + result.source);
			this.error("Target: " + result.target);
		}
		// something went wrong :-(
		// remove from array of currently downloading items
        this.$["button" + this.index].setActive( false );
    },
    
   closeNoHandlerFoundDialog : function() {
       this.$.noHandlerFoundDialog.close();  
   }, 
   
   addFile: function() {
       this.$.addAttachmentDialog.openAtCenter();
       this.$.addAttachmentDialog.clearDialog();
       this.$.addAttachmentDialog.setItem(this.item);
   },
   
   onFileSelected : function( inEvent, inValue ) {
       // this.log("inEvent: " + inEvent );   
	   this.file = inValue[0];
       var description = inValue[1]; 
       if (Util.isDebug()) {
           this.log("this.file: " + this.file );    
           this.log("description: " + description );
           }   
       
       // TODO create new file object and send to springpad
       this.name = this.file.split('/').pop();
       if (Util.isDebug()) {
           this.log("name: " + this.name );
           }   
       // if (content != null && content != "") {
           
        var mimeType = Util.finagleMimeType(this.file);
        var fileType = "File";
        if (mimeType.indexOf("image") != -1) {
            fileType = "Photo";
        }

           var d = new Date();

           this.uuid = Util.createUuid();
           this.uuid = "/UUID(" + this.uuid + ")/";
           
           this.newAttachment = {
               "type": "/Type(" + fileType + ")/",
               "uuid": this.uuid,
               "name": this.name,
               "created": "/Date(" + d.getTime() + ")/",
               "properties": {
                   "fileName": this.name,
                   "description": description,
                   "isAttachment": true
               },
                
           };

            var result = [];
    
            var step = [];
            step.push("create", fileType, this.uuid);
            result.push( step );
    
            step = [];
            step.push("set", "fileName", this.name);
            result.push( step );
    
            step = [];
            step.push("set", this.uuid, "name", this.name);
            result.push( step );
    
            step = [];
            step.push("set", this.uuid, "description", description);
            result.push( step );
    
            step = [];
            step.push("set", this.uuid, "isAttachment", true);
            result.push( step );
    
            step = [];
            step.push("add", this.item.uuid, "attachments", this.uuid);
            result.push( step );
    
            if (Util.isDebug()) {
                this.log("result: "+ JSON.stringify(result));
            }

            this.$.springpadApi.onFetchSuccess = "createFileSuccess";
            this.$.springpadApi.onFetchFailure = "createFileFailure";
            this.$.springpadApi.fetchData("users/me/commands", "POST", JSON.stringify(result) );
       // } else {
           // this.error("file is empty?!");
       // }
   },
   
   onFileSelectedChrome : function( inEvent, inValue ) {

	   this.file = inValue[0];
       var description = inValue[1]; 
       this.form = inValue[2];

       if (Util.isDebug()) {
           this.log("this.file: " + JSON.stringify(this.file) );    
           this.log("description: " + description );
       }   
       
       // TODO create new file object and send to springpad
       this.name = this.file.name;
       if (Util.isDebug()) {
           this.log("name: " + this.name );
           }   
       // if (content != null && content != "") {
           
        this.mimeType = this.file.type;
        this.fileType = "File";
        if (this.mimeType.indexOf("image") != -1) {
            this.fileType = "Photo";
        }

        var d = new Date();

        this.uuid = Util.createUuid();
        this.uuid = "/UUID(" + this.uuid + ")/";
       
        this.newAttachment = {
           "type": "/Type(" + this.fileType + ")/",
           "uuid": this.uuid,
           "name": this.name,
           "created": "/Date(" + d.getTime() + ")/",
           "properties": {
               "fileName": this.name,
               "description": description,
               "isAttachment": true
           },
            
        };
       
        var result = [];

        var step = [];
        step.push("create", this.fileType, this.uuid);
        result.push( step );

        step = [];
        step.push("set", "fileName", this.name);
        result.push( step );

        step = [];
        step.push("set", this.uuid, "name", this.name);
        result.push( step );

        step = [];
        step.push("set", this.uuid, "description", description);
        result.push( step );

        step = [];
        step.push("set", this.uuid, "isAttachment", true);
        result.push( step );

        step = [];
        step.push("add", this.item.uuid, "attachments", this.uuid);
        result.push( step );

        if (Util.isDebug()) {
            this.log("result: "+ JSON.stringify(result));
        }
        this.$.springpadApi.onFetchSuccess = "createFileSuccess";
        this.$.springpadApi.onFetchFailure = "createFileFailure";
        this.$.springpadApi.fetchData("users/me/commands", "POST", JSON.stringify(result) );
   },
   
   createSuccess : function( inSender, responseText ) {
        if (Util.isDebug()) {
            if (responseText !== undefined) {
                this.log("responseText: " + enyo.json.stringify(responseText));    
            } else {
                this.log();
            }
        }
        if (this.item.properties.attachments === undefined) {
            this.item.properties.attachments = [];
        }

        this.$.addAttachmentDialog.closeDialog();
        this.item.properties.attachments.push( this.newAttachment );
        this.owner.getDataManager().updateItemInList( this.item );
        this.createDialog( this.item );
    },
     
    createFailure : function( inSender, responseText, inRequest ) {
        this.error(JSON.stringify(responseText));
        this.error(JSON.stringify(inRequest.xhr));
        // if (this.getBackground() == false) {
            // this.owner.$.feedWebViewPane.hideSpinner();
        // }
        this.$.addAttachmentDialog.setActive( false );
        this.$.addAttachmentDialog.setError( responseText.message );
    },

    createFileSuccess : function( inSender, responseText ) {
        
        // this.log("inSender: " + inSender);    
        // this.log("responseText: " + responseText);    
        if (Util.isDebug()) {
            this.log(JSON.stringify(responseText));
            this.log("this.name: " + this.name );
            }   
        
        if (Platform.isWebOS()) {
            var content = Util.loadBinaryFile( this.file );
            if (Util.isDebug()) {
                this.log("content.length: " + content.length );
                this.log("content: " + content );
            }
            this.postDataToSpringpad(this.file, content);   
/*        } else if (Platform.isBlackBerry()) {
            blackberry.io.file.readFile(this.file, enyo.bind( this, this.handleOpenedFile), false);
            // var content = Util.loadBinaryFile( this.file );
            // this.log("content.length: " + content.length );
            // this.log("content: " + content );
            // this.postDataToSpringpad(this.file, content);   */
        } else if (Platform.isBrowser() || Platform.isBlackBerry()) {
        	this.uploadPickedFile_ChromeNEU();
        }
    },
    
    createFileFailure : function( inSender, responseText, inRequest ) {
        this.error(JSON.stringify(responseText));
        this.error(JSON.stringify(inRequest.xhr));
        // if (this.getBackground() == false) {
            // this.owner.$.feedWebViewPane.hideSpinner();
        // }
        this.$.addAttachmentDialog.setActive( false );
        this.$.addAttachmentDialog.setError( responseText.message );
    },

    postDataToSpringpad :function( file, data ) {
        var binaryContent;
        if (Platform.isWebOS()) {
            binaryContent = Util.base64Encode(data);
            binaryContent = "data:base64," + binaryContent;
        } else {
            binaryContent = btoa(data);
        }
        // this.log("binaryContent: " + binaryContent );   
        if (Util.isDebug()) {
            this.log("binary content.length: " + binaryContent.length );
            }   

        if (binaryContent.length > 0 ) {
            var mimeType = Util.finagleMimeType(file);
            if (Util.isDebug()) {
                this.log("mimeType: " + mimeType );
                }   

            var fileType = "files";
            if (mimeType.indexOf("image") != -1) {
                fileType = "photos";
            }
            if (Util.isDebug()) {
                this.log("fileType: " + fileType);
            }

            this.$.springpadApi.onFetchSuccess = "createSuccess";
            this.$.springpadApi.onFetchFailure = "createFailure";
            this.$.springpadApi.postData("users/me/blocks/" +  StringUtils.getValueFromString( this.uuid ) + "/" + fileType, binaryContent, mimeType, this.name, file );
        } else {
            this.$.addAttachmentDialog.setActive( false );
            this.$.addAttachmentDialog.setError( "File is empty!" );
        } 
    },
     
    closeNoOpenDialog : function() {
        this.$.noOpenDialog.close();  
    },
    
    closeFileToBigDialog : function() {
        this.$.fileToBigDialog.close();  
    },
    
    checkChromeUpload: function(xhr) {
        if (xhr.readyState === 4 && xhr.status === 200) {
            this.createSuccess({}, {completed: true, responseString: xhr.responseText});
        } else if (xhr.status > 200) {
            // it failed, handle with an error message, or re-do the upload (set a flag to do this only once and only on the PlayBook due to its XHR upload bug)
            this.error(JSON.stringify(xhr));
        }
    },

    closeNoOpenYetDialog : function() {
        this.$.noOpenYetDialog.close();  
    },
    
    uploadPickedFile_ChromeNEU: function() {
        try {
        	this.log();
            
            var fileType = (this.fileType == "File" ? "files" : "photos");
            this.log("this.uuid: " + this.uuid);
            var url = "http://springpad.com/api/users/me/blocks/" +  StringUtils.getValueFromString( this.uuid ) + "/" + fileType;
            url += "?filename=" + encodeURIComponent(this.name);
            this.log("url: " + url);
            this.log("this.mimeType: " + this.mimeType);
            
            var xhr = new XMLHttpRequest();
            xhr.open('POST', url, true);
            
            var reqHeaders = {
                "X-Spring-Username": Settings.getSettings().username, 
                "X-Spring-Password" : Settings.getSettings().password,
                "X-Spring-Api-Token" : Settings.getSettings().apiKey, 
                "X-Spring-Client-Version": "1.0.0", 
                "X-Spring-Client": "SpingOnTouch", 
//                "Content-Type": this.mimeType,
//                "Referer": "http://sven-ziegler.com", 
                "X-Spring-Api-Version" : "7"
            };
            for (var header in reqHeaders) {
                xhr.setRequestHeader(header, reqHeaders[header]);
            }
            
            xhr.onreadystatechange = enyo.bind(this, this.checkChromeUpload, xhr);
            xhr.send(this.file);
        } catch(e) {
           this.error(e);
        }
    },
    

});