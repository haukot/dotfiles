enyo.kind({
	name : "FS",
	kind : "Component",
	
	published: {
		fs: null,
	},
	
  	statics: {
  		
  	    init : function() {
  	    	enyo.log("FS.init() - START");
  	    	if (Platform.isBrowser() || Platform.isBB10()) {
  	        	var errorHandler = enyo.bind( this, this.fsError);
  	            var fsCallback = enyo.bind( this, this.fsHandler);
  	            
  	            if (Platform.isBrowser()) {
  	  	    		enyo.log("FS.init() - requesting browser storage...");
  	  	            window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
  	  	        	window.webkitStorageInfo.requestQuota(PERSISTENT, 1024*1024*100, function(grantedBytes) {
  	  	      		  window.requestFileSystem(window.PERSISTENT, grantedBytes, fsCallback, errorHandler);
  	  	      		}, errorHandler);
  	            } else if (Platform.isBB10()){
  	            	try {
  	  	  	            // un-sandbox file system to access shared folder
  	  	  	            blackberry.io.sandbox = false;        	
  	            	} catch(e) {
  	            		enyo.log("FS.init() - ERROR: " + e);
  	            	}
  	  	            window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
  	            	window.requestFileSystem(window.PERSISTENT, 0 /*1MB*/, function(fileSystem) { 
        				console.log("FS.init() - fileSystem: " + fileSystem);
        				fsCallback(fileSystem);
  	            	}, function(e) { 
  	            		console.log("FS.init() - Error detected..."); 
  	            		errorHandler(e); 
            		});
  	  	    		enyo.log("FS.init() - requested bb10 storage...");
  	            }
            } else if (Platform.isAndroid()){
  	    		enyo.log("FS.init() - requesting android storage...");
	        	var errorHandler = enyo.bind( this, this.fsError);
  	            var fsCallback = enyo.bind( this, this.fsHandler);
            	window.requestFileSystem(LocalFileSystem.PERSISTENT, 1024*1024*100 /*100MB*/, fsCallback, errorHandler);
  	    	}
  	    	enyo.log("FS.init() - END");
  	    },

  	    fsHandler : function(fileSystem) {
  	    	enyo.log("FS.fsHandler() - fileSystem granted: " + fileSystem.name );
  	    	this.fs = fileSystem;
  	  	}, 

  	    fsError : function onError(e) {
  	  		enyo.log("FS.fsError() - Error: " + e);
  	  	},
  		
  	    getFilesystem : function() {
  	  		enyo.log("FS.getFilesystem(): " + (this.fs !== undefined && this.fs != null ? this.fs.name : null));
  			return this.fs;
  		},

  	},
    
});
