enyo.kind({
	name : "FileUtils",
	kind : "Component",
	
	events : {
		onLoadFileSuccess: "",
		onLoadFileFailure: "",
		onRemoveCurrent: ""
	},
	
	components : [
		{
			kind : enyo.PalmService,
			name : "downloadService",
			service : "palm://com.palm.downloadmanager/",
			method : "download",
			timeout : 30000,
			subscribe : true,
			resubscribe : true,
			onSuccess : "downloadServiceSuccess",
			onFailure : "downloadServiceFailure",
		},
        {kind: enyo.PalmService,
            name: "deleteDownloadFile",
            service: "palm://com.palm.downloadmanager/",
            method: "deleteDownloadedFile",
            onSuccess : "deleteFinished",
            onFailure : "deleteFail",
         },
	],
	
	downloadFileFromURL : function(url, type, newName, prefix, dir) {
		if (Util.isDebug()) {
			this.log("START");
			this.log("url: " + url);
			this.log("type: " + type);
			this.log("prefix: " + prefix);
		}
		var targetFilename = StringUtils.getFilenameFromURL(url);
		if (newName !== undefined && newName != null) {
			targetFilename = newName;
		}
		if (prefix !== undefined) {
			targetFilename = prefix + targetFilename;
		}
		if (Util.isDebug()) {
			this.log("targetFilename: " + targetFilename);
		}
		if (Platform.isWebOS()) {
			this.downloadBinaryOnWebOS( url, targetFilename, type );
		} else if (Platform.isPlaybook()){
			this.downloadBinaryOnPlaybook( url, targetFilename, type );
		} else if (Platform.isBB10()) {
			this.downloadBinaryOnBB10( url, targetFilename, type );
		} else if (Platform.isBrowser()) {
			this.downloadBinaryOnChrome( url, targetFilename, type );
		} else if (Platform.isAndroid() || Platform.isiOS()) {
			this.downloadBinaryOnPhonegap( url, targetFilename, type, dir );
		}
		if (Util.isDebug()) {
			this.log("END");
		}
	},

    downloadBinaryOnWebOS : function( url, targetFilename, type ) {
		if (Util.isDebug()) {
			this.log("webOS");
			this.log("type: " + type);
		}
		var targetDir = this.getPath( type ); 
		if (Util.isDebug()) {
			this.log("targetDir: " + targetDir);
		}
		var params = {
			"target" : url,
			"targetDir" : targetDir,
			"keepFilenameOnRedirect" : true,
			"targetFilename" : targetFilename
		};
		this.$.downloadService.call(params);
    },
    
    downloadBinaryOnPlaybook : function( url, targetFilename, type ) {
		if (Util.isDebug()) {
			this.log("playbook");
			this.log("type: " + type);
		}
		// Check the file size
		var sizeInBytes = 0;
		try {
			sizeInBytes = blackberry.io.fileTransfer.getRemoteFileSize(url);
		} catch (e) {
			this.error("ERROR: " + e);
		}
		if (Util.isDebug()) {
			this.log("filesize: " + sizeInBytes);
		}

		if (sizeInBytes == 0) {
			if (type == Constants.DOWNLOAD_TYPE_APP_IMAGE) {
				// file is to big or to small, ignoring it
				// remove from array of actualy downloading items
				if (Util.isDebug()) {
					this.log("removing url from download list, because of the filesize: " + url + " (" + sizeInBytes + " bytes)");
				}
				this.doRemoveCurrent();
			} else if (type == Constants.DOWNLOAD_TYPE_SHARED_FILE) {
				this.doLoadFileFailure( {"url": url, "targetFilename": targetFilename} );
			}
			
		} else {
			var request = new XMLHttpRequest();
			try {
				request.open("GET", url, true);
				request.setRequestHeader("name", targetFilename);
				request.setRequestHeader("url", url);
				request.responseType = "arraybuffer";
				var startReady0 = new Date();
				request.onreadystatechange = enyo.bind(this, this.processBinaryDataOnPlaybook, request, targetFilename, url, sizeInBytes, type);
				request.send("name=" + targetFilename + "&url=" + url);
			} catch (e) {
				console.error("**********************************************************");
				console.error(e);
				console.error("**********************************************************");
			}
		}
    },

    downloadBinaryOnBB10 : function( url, targetFilename, type ) {
		if (Util.isDebug()) {
			this.log("bb10!");
			this.log("type: " + type);
		}
		try {
			var callbackSuccess = enyo.bind(this, this.loadFileSuccess);
			var callbackError = enyo.bind(this, this.loadFileError);
			var targetDir = this.getPath( type ); 
			if (Util.isDebug()) {
				this.log("targetDir: " + targetDir);
			}
			blackberry.io.filetransfer.download(url, targetDir + "/" + targetFilename, function(result) {
				enyo.log("FileUtils.downloadBinaryOnBB10(): success!");
				
				// datei umbenennen
 	            /*window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
       			window.requestFileSystem(window.PERSISTENT, 0, function(fs) {
       				
       			  var dirReader = fs.root.createReader();
       			  var entries = [];

       			function listResults(entries) {

       			  entries.forEach(function(entry, i) {
       			    console.log("name: " + entry.name);
       			  });
       			}
       			  // Call the reader.readEntries() until no more results are returned.
       			  var readEntries = function() {
       			     dirReader.readEntries (function(results) {
       			      if (!results.length) {
       			        listResults(entries.sort());
       			      } else {
       			        entries = entries.concat(toArray(results));
       			        readEntries();
       			      }
       			    }, function(e) {
					  console.log("fehler!");
					  callbackError(e);
				  });
       			  };

       			  readEntries(); // Start reading dirs.       				
       				
       			}, callbackError);*/
       			// waiting for success hook!
				callbackSuccess(result, url, targetFilename);

			}, function(result) {
				enyo.log("FileUtils.downloadBinaryOnBB10(): error!");
				callbackError(result, url);
			});
		} catch (e) {
			this.error(e);
			// alert(e);
		}
    },

    downloadBinaryOnChrome : function( url, targetFilename, type ) {
		if (Util.isDebug()) {
			this.log("browser!");
			this.log("type: " + type);
		}

		var errorHandler = enyo.bind( this, this.errorHandler);
		
		var xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);
		xhr.responseType = 'blob';

		var callbackSuccess = enyo.bind(this, this.loadFileSuccess);
		var callbackError = enyo.bind(this, this.loadFileError);

		    FS.getFilesystem().root.getFile(targetFilename, {create: true}, function(fileEntry) {
		    	var fullPath = fileEntry.toURL();
		    	fileEntry.createWriter(function(writer) {
		    	writer.onwriteend = function(e) {
		    		console.log("filesize: " + e.loaded);
		    		if (Number(e.loaded) > 4) {
			    		callbackSuccess({"fullPath": fullPath}, url, targetFilename);
		    		} else {
		    			console.log("--- FILE IS EMPTY !!!! ---");
	    				callbackError(null, url);
		    		}
        	    };
        	    writer.onerror = function(result) {
    				callbackError(result, url);
    			};

		        var bb = new Blob([xhr.response]);
		        writer.write(bb);

		      }, errorHandler);
		    }, errorHandler);
//		};

		xhr.send();
	},

    downloadBinaryOnPhonegap : function( url, targetFilename, type, dir ) {
    	
    	var completeLocalPath = dir + "/" + targetFilename;
    	
		if (Util.isDebug()) {
			this.log("phonegap!");
			this.log("type: " + type);
			this.log("completeLocalPath: " + completeLocalPath);
		}

		var callbackSuccess = enyo.bind(this, this.loadFileSuccess);
		var callbackError = enyo.bind(this, this.loadFileError);
		
		var fileTransfer = new FileTransfer();

		fileTransfer.download(
			url,
			completeLocalPath,
		    function(entry) {
				console.log("yeah completeLocalPath: " + completeLocalPath);
	    		callbackSuccess({"fullPath": completeLocalPath}, url, targetFilename);
		    },
		    function(error) {
		        console.log("download error source " + error.source);
		        console.log("download error target " + error.target);
		        console.log("upload error code" + error.code);
				callbackError(null, url);
		    }
		);
	},

	processBinaryDataOnPlaybook : function(request, targetFilename, url, sizeInBytes, type) {
//		if (Util.isDebug()) {
//			this.log("START");
//		}
		if (request.readyState == 4) {
			if (request.status == 200 || request.status == 304) {
				try {
					var startReady1 = new Date();

					if (Util.isDebug()) {
						this.log("targetFilename: " + targetFilename);
						this.log("url: " + url);
					}

					var targetDir = this.getPath( type ); 
					if (Util.isDebug()) {
						this.log("targetDir: " + targetDir);
					}
					var filename = targetDir + "/" + targetFilename;

					if (Platform.isPlaybook()) {
						var response = request.response;

						if (Util.isDebug()) {
							this.log("encoding data...");
						}
						var encoded = Util.base64ArrayBuffer(response);

						if (Util.isDebug()) {
							// this.log("encoded: " + encoded);
							this.log("creating blob data...");
						}
						var blob_data = blackberry.utils.stringToBlob(encoded, "binary");

						if (Util.isDebug()) {
							this.log("check file exist: " + filename);
						}
						if (blackberry.io.file.exists(filename)) {
							if (Util.isDebug()) {
								this.log("deleting file...");
							}
							blackberry.io.file.deleteFile(filename);
						}

						if (Util.isDebug()) {
							this.log("saving file...");
						}
						blackberry.io.file.saveFile(filename, blob_data);
						var startReady6 = new Date();

						if (Util.isDebug()) {
							this.log("overall response processing: " + DateTimeUtils.ms_between(startReady1, startReady6));
						}

						request = null;
						response = null;
						encoded = null;
						blob_data = null;

						if (Util.isDebug()) {
							this.log("finished file handling");
						}
					}

					this.doLoadFileSuccess( {"url": url, "targetFilename": targetFilename, "filename": filename} );
				} catch (e) {
					this.error("**********************************************************");
					this.error("saving of image failed: " + targetFilename + " because of: ");
					this.error(e);
					this.error("**********************************************************");

					this.doLoadFileFailure( {"url": url, "targetFilename": targetFilename} );
				}

			} else {
				// something went wrong :-(
				this.doLoadFileFailure( {"url": url, "targetFilename": targetFilename} );
			}
		}
//		if (Util.isDebug()) {
//			this.log("END");
//		}
	},

	loadFileSuccess : function(result, url, targetFilename) {
		this.doLoadFileSuccess( {"url": url, "targetFilename": targetFilename, "filename": result.fullPath, "result": result} );
	},

	loadFileError : function(result, url, targetFilename) {
		this.doLoadFileFailure( {"url": url, "targetFilename": targetFilename, "filename": result} );
	},

	downloadServiceSuccess : function(inSender, inResponse) {
//		if (Util.isDebug()) {
//	   	    this.log("START");
//			this.log(JSON.stringify(inResponse));
//		}
		var ticket = inResponse.ticket;
//		if (Util.isDebug()) {
//	  	    this.log("ticket: " + ticket);
//		}

		var completionStatusCode = inResponse.completionStatusCode;
//		if (Util.isDebug()) {
//			this.log("completionStatusCode: " + completionStatusCode);
//		}

		var completed = inResponse.completed;
//		if (Util.isDebug()) {
//			this.log("completed: " + completed);
//		}

		var obj = inResponse.url;
		if (completed == true && completionStatusCode == 200) {
			var targetFilename = StringUtils.getFilenameFromURL(inResponse.target);
			if (inResponse.headers !== undefined && inResponse.headers.targetFilename !== undefined) {
				targetFilename = inResponse.headers.targetFilename;
				if (Util.isDebug()) {
					this.log("got new targetFilename from headers: " + targetFilename);
				}
			}

			if (Util.isDebug()) {
				this.log("inResponse.url: " + inResponse.url);
			}
			
			this.doLoadFileSuccess( {"url": inResponse.url, "targetFilename": inResponse.destFile, "filename": inResponse.target, "ticket": ticket} );

		} else {
			var interrupted = inResponse.interrupted;
			this.error("interrupted: " + interrupted);

			if (interrupted == true || completionStatusCode !== undefined) {
				var targetFilename = StringUtils.getFilenameFromURL(inResponse.target);
				this.error("download of image failed: " + targetFilename + "");
				this.doLoadFileFailure( {"url": inResponse.url, "targetFilename": inResponse.target} );
			} else {
				if (completed !== undefined) {
					this.error("completed: " + completed);
					this.error(JSON.stringify(inResponse));
				}
			}
		}
//		if (Util.isDebug()) {
//			this.log("END");
//		}
	},

	downloadServiceFailure : function(inSender, inResponse, inRequest) {
		this.error("START");
		this.error(JSON.stringify(inResponse));
		this.error("END");
	},

    errorHandler : function (fileError) {
		if (Util.isDebug()) {
	    	this.log();
		}
    	var msg = '';

        switch (fileError.code) {
            case FileError.QUOTA_EXCEEDED_ERR:
                msg = 'QUOTA_EXCEEDED_ERR';
                break;
            case FileError.NOT_FOUND_ERR:
                msg = 'NOT_FOUND_ERR';
                break;
            case FileError.SECURITY_ERR:
                msg = 'SECURITY_ERR';
                break;
            case FileError.INVALID_MODIFICATION_ERR:
                msg = 'INVALID_MODIFICATION_ERR';
                break;
            case FileError.INVALID_STATE_ERR:
                msg = 'INVALID_STATE_ERR';
                break;
            case FileError.NO_MODIFICATION_ALLOWED_ERR:
                msg = 'NO_MODIFICATION_ALLOWED_ERR';
                break;
            default:
                msg = 'File Error';
                break;
        };

        this.error('Error: ' + msg);
//        alert('Error: ' + msg);
    },

    deleteFile : function( obj ) {
		if (Util.isDebug()) {
	        this.log(obj);
		}
    	if (Platform.isWebOS()) {
    		if (Util.isDebug()) {
    	        this.log("webOS");
    		}
           this.$.deleteDownloadFile.call({"ticket" : obj.ticket});
        } else if (Platform.isPlaybook()) {
    		if (Util.isDebug()) {
    	        this.log("playbook");
    		}
           if (blackberry.io.file.exists( obj.file )) {
               blackberry.io.file.deleteFile( obj.file );
           }
        } else if (Platform.isBB10() || Platform.isBrowser()) {
    		if (Util.isDebug()) {
            	this.log("bb10 or browser");
    		}
        	var callbackSuccess = enyo.bind(this, this.deleteSuccess);
        	var errorHandler = enyo.bind( this, this.errorHandler);
        	if (FS.getFilesystem() != null) {
            	FS.getFilesystem().root.getFile(obj.file, {create: false}, function(fileEntry) {

        		    fileEntry.remove(function() {
        		      callbackSuccess( obj.file );
        		    }, errorHandler);

        		  }, errorHandler);
        	} else {
        		this.error("no access to the file system!");
        	}
    	}
    },

    deleteSuccess : function( file ) {
		if (Util.isDebug()) {
	        this.log('File removed: ' + file);
		}
    },
    
    deleteFinished : function( inSender, inResponse ) {
		if (Util.isDebug()) {
	    	this.log();
		}
    },

    deleteFail : function( inSender, inResponse ) {
       this.error("deleteDownloadedFile failure, results=" + enyo.json.stringify(inResponse));
    },  

    fileExists : function ( filename, type ) 
    { 
    	if (Platform.isBrowser()) {
    		return false;
    	}
    	
		var targetDir = this.getPath( type );
		var pathAndName = targetDir + "/" + filename;
		if (Platform.isAndroid() || Platform.isBB10()) {
			pathAndName = filename;
		}
		
		if (Util.isDebug()) {
			this.log("looking for: " + pathAndName);
			this.log("type: " + type);
		}
    	if (!Platform.isPlaybook() && !Platform.isBB10()) {
            // console.log("filename: " + filename);
            var xmlHTTP = new XMLHttpRequest(); 
            try 
            { 
                xmlHTTP.open("GET", pathAndName, false); 
                xmlHTTP.send(null); 
            } 
            catch (e) { 
                this.error("error: " + e);
                return false; 
            } 
            //console.log("xmlHTTP: " + JSON.stringify( xmlHTTP) );
            if (xmlHTTP.responseText != "") {
                return true;
            }
    	} else if (Platform.isPlaybook()){
            try {
                if (blackberry.io.file.exists(pathAndName)) {
                	return true;
                }
            }
            catch (e) {
                this.error("error: "+e);
            }     
    	} else if (Platform.isBB10()) {
        	if (FS.getFilesystem() != null) {
            	var errorHandler = enyo.bind( this, this.errorHandler);
            	var feResult = false;
            	FS.getFilesystem().root.getFile(pathAndName, {}, function(fileEntry) {
            		feResult = fileEntry.isFile(); 
	    	    }, errorHandler);
        	} else {
				this.error("ERROR: no access to the file system!");
        	}
        	return feResult;
    	}
        return false;
    },
    
	getPath : function( type ) {
		if (Platform.isWebOS()) {
			if (type == Constants.DOWNLOAD_TYPE_APP_IMAGE) {
				return "/media/internal/appdata/" + Util.fetchAppInfo().id + "/.images";
			} else if (type == Constants.DOWNLOAD_TYPE_SHARED_FILE) {
				return "/media/internal/downloads";
			}
		} else if (Platform.isBB10()) {
			if (type == Constants.DOWNLOAD_TYPE_APP_IMAGE) {
				return blackberry.io.home;
			} else if (type == Constants.DOWNLOAD_TYPE_SHARED_FILE) {
				return blackberry.io.home;
				// FIXME this should be correct!
//				return blackberry.io.sharedFolder;
			}
		} else if (Platform.isPlaybook()) {
			if (type == Constants.DOWNLOAD_TYPE_APP_IMAGE) {
				return blackberry.io.dir.appDirs.app.storage.path;
			} else if (type == Constants.DOWNLOAD_TYPE_SHARED_FILE) {
				return blackberry.io.dir.appDirs.shared.downloads.path;
			}
		} else if (Platform.isAndroid()) {
			if (type == Constants.DOWNLOAD_TYPE_APP_IMAGE) {
				return "";
			} else if (type == Constants.DOWNLOAD_TYPE_SHARED_FILE) {
				return blackberry.io.dir.appDirs.shared.downloads.path;
			}
		} else if (Platform.isBrowser()) {
			return "";
		}
	},
	
    
});