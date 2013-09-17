enyo.kind({
    name: "SyncDialog",
    kind: enyo.ModalDialog,
    width: (Platform.isTablet() ? "400px" : "320px"),
    caption: $L("Progress Dialog"),
    events: {
        onCancel: "",
        onClose: ""
    },
    components: [
        {kind: "ApplicationEvents", onWindowHidden: "close"},
        {layoutKind: "VFlexLayout", style: "height: 100%", components:[
            {kind: "HFlexBox", style: "width: 100%", components:[
                {name: "status_label",  kind: "HtmlContent", content: $L("Status: "), className:"enyo-paragraph", style: "padding-right: 10px;"},
                {name: "status_value", kind: "HtmlContent", content: "", className:"enyo-paragraph", style: "min-height: 30px; width: 85%;"},
            ]},
            (Platform.isTablet() ?
            {kind: "HFlexBox", style: "width: 100%;", components:[
                {name: "item_label",  kind: "HtmlContent", content: $L("Items processed: "), className:"enyo-paragraph", style: "padding-right: 10px;"},
                {name: "item_value",  kind: "HtmlContent", content: "0", className:"enyo-paragraph", style: "padding-right: 10px;"},
                {name: "time_label",  kind: "HtmlContent", content: $L("Time elapsed: "), className:"enyo-paragraph", style: "padding-right: 10px;"},
                {name: "time_value",  kind: "HtmlContent", content: "0s", className:"enyo-paragraph", style: "padding-right: 10px;"},
            ]} :
            {kind: "HFlexBox", style: "width: 100%;", components:[
                {name: "item_label",  kind: "HtmlContent", content: $L("Items processed: "), className:"enyo-paragraph", style: "padding-right: 10px;"},
                {name: "item_value",  kind: "HtmlContent", content: "0", className:"enyo-paragraph", style: "padding-right: 10px;"},
            ]}),
            (!Platform.isTablet() ?
            {kind: "HFlexBox", style: "width: 100%;", components:[
                {name: "time_label",  kind: "HtmlContent", content: $L("Time elapsed: "), className:"enyo-paragraph", style: "padding-right: 10px;"},
                {name: "time_value",  kind: "HtmlContent", content: "0s", className:"enyo-paragraph", style: "padding-right: 10px;"},
            ]} : {flex : 1}),
            {flex : 1},
            {kind: "HFlexBox", style: "width: 100%", align: "end", components:[
                {kind: enyo.Spinner, name: "spinner"},
                {flex : 1},
                {name: "button", caption: $L("Cancel "), kind: "ActivityButton", onclick: "cancel", className: "enyo-button-negative", align: "end"},
            ]}
        ]}
    ],
    
    finished : function() {
        if (Util.isDebug()) {
            this.log();
        }
    	clearInterval( this.timeInterval );
    	clearInterval( this.statusInterval );
    	this.update( Const.SYNC_DIALOG_FINISHED );
    	this.updateStatus();
        this.$.spinner.hide();
        this.$.button.removeClass("enyo-button-negative");
    	this.$.button.addClass("enyo-button-affirmative");
    	this.$.button.setCaption($L("Close") + " (" + Const.SYNC_DIALOG_CLOSE_TIMEOUT + "s )" );
        this.closeTime = new Date();
        this.closeTime.setTime( this.closeTime.getTime()  + Number( Const.SYNC_DIALOG_CLOSE_TIMEOUT * 1000) );
        this.closeInterval = setInterval( enyo.bind(this, this.closeFinishedDialog), 1000 );
		this.log("this.closeInterval: " + this.closeInterval);
    },
    
    cancel : function() {
        if (Util.isDebug()) {
            this.log();
        }
    	clearInterval( this.timeInterval );
    	clearInterval( this.statusInterval );
    	this.close();
    	this.doCancel();
    },
    
    error : function( msg ) {
        if (Util.isDebug()) {
            this.log(msg);
        }
        if (this.$.spinner) {
            this.$.spinner.hide();
        }
    	clearInterval( this.timeInterval );
    	clearInterval( this.statusInterval );
		this.$.status_value.setContent( msg );
    	this.$.status_value.render();
	},

    abort : function() {
        if (Util.isDebug()) {
            this.log();
        }
        if (this.$.spinner) {
            this.$.spinner.hide();
        }
        clearInterval( this.timeInterval );
    	clearInterval( this.statusInterval );
    	this.close();
    },

    resetDialog : function() {
        if (Util.isDebug()) {
            this.log();
        }
        this.startTime = new Date();
        this.timeInterval = setInterval( enyo.bind(this, this.updateTimeElapsed), 1000 );
        this.statusInterval = setInterval( enyo.bind(this, this.updateStatus), 100 );
    	if (this.$.spinner) {
            this.$.spinner.show();
    	}
    	if (this.$.button) {
			this.$.button.show();
        	this.$.button.addClass("enyo-button-negative");
        	this.$.button.setCaption($L("Cancel "));
    	}
    	this.$.time_value.setContent( "0s" );
    	this.counter = 0;
    	this.$.item_value.setContent( this.counter );
    },

    update : function ( status, message, counter ) {
//        if (Util.isDebug()) {
//            this.log();
//        }
    	if (counter !== undefined && counter != undefined) {
    		this.counter = counter;
    	}
    	switch (Number(status)) {
			case Const.SYNC_DIALOG_OTHER : 
				this.status_value = message;
				break;
			case Const.SYNC_DIALOG_DOWNLOADING : 
				this.status_value = $L("Downloading new items...");
				break;
    		case Const.SYNC_DIALOG_PROCESSING : 
    			this.status_value = $L("Processing new items...");
    			break;
    		case Const.SYNC_DIALOG_STORING : 
    			this.status_value = $L("Storing new items...");
    			break;
    		case Const.SYNC_DIALOG_FINISHED : 
    			this.status_value = $L("Finished Synchronization!");
    			break;
			case Const.SYNC_DIALOG_DOWNLOADING_IMAGES : 
				this.status_value = $L("Downloading new images...");
				break;
			case Const.SYNC_DIALOG_STORING_LOCAL_DATA :
				this.status_value = $L("Storing modified local data...");
    			this.$.button.hide();
    			break;
    	}
    },
    
    updateTimeElapsed: function(){
//      if (Util.isDebug()) {
//          this.log();
//      }
		var diff = DateTimeUtils.seconds_between( this.startTime, new Date() );
		this.$.time_value.setContent( diff + "s" );
		this.$.status_value.setContent( this.status_value );
    	this.$.status_value.render();
	},

	updateStatus: function(){
//      if (Util.isDebug()) {
//          this.log();
//      }
//		this.log("setting new status: " + this.status_value);
//		this.log("setting new counter: " + this.counter);
		this.$.status_value.setContent( this.status_value );
    	this.$.status_value.render();
    	this.$.item_value.setContent( this.counter );
    	this.$.item_value.render();
	},

	closeFinishedDialog: function(){
        if (Util.isDebug()) {
            this.log();
        }
		var diff = DateTimeUtils.seconds_between( this.closeTime, new Date() );
        if (Util.isDebug()) {
            this.log("diff: " + diff);
        }
        this.clearCloseInterval( diff );
		this.$.button.setCaption($L("Close") + " (" + diff + "s )" );
		this.render();
	},
	
	clearCloseInterval : function( diff ) {
		if (Number(diff) == 0 || Number(diff) > 9) {
			this.log("clearing interval: " + this.closeInterval);
			clearInterval( this.closeInterval );
			this.closeInterval = null;
	    	this.doClose();
	    	this.close();
		}
	}
	
});