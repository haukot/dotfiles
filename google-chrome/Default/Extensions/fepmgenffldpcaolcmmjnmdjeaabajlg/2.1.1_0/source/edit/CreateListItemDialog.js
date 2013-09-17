enyo.kind({
    name: "CreateListItemDialog",
    kind: enyo.ModalDialog,
    /*height: "285px",*/
    width: (Platform.isTablet() ? "680px" : "320px"),
    caption: $L("New List Entry"),
    events: {
        onAccept: "",
        onCreateItem: "",
        onAddNewRow: ""
    },
    components: [
        {kind: "ApplicationEvents", onWindowHidden: "close"},
        {name: "springpadApi", kind: "SpringpadApi"},
        {name: "scroller", kind: enyo.Scroller, flex: 1, height: "100px", autoHorizontal: false, horizontal: false, components: [
            {name: "container", kind: "RowGroup", components: [
            ]},
        ]},
        {layoutKind: "HFlexLayout", style: "padding-top: 10px;", components: [
            {name: "cancelButton", kind: "Button", caption: $L("Cancel "), flex: 1, onclick: "closeDialog"},
            {name: "newRowButton", kind: "Button", caption: $L("New Row"), flex: 1, className: "enyo-button-dark", onclick: "addNewRowHandler"},
            {name: "addButton", kind: "ActivityButton", caption: $L("Create"), flex: 1, className: "enyo-button", onclick: "onSubmit"},
        ]},
        {kind: "ModalDialog", name: "popupDialog", caption: $L("Error"), components:[
             {name: "inhalt", content: "", className: "enyo-paragraph"},
             {layoutKind: "HFlexLayout", components: [
                 {kind: "Button", caption: $L("Ok"), flex: 1, onclick: "closeDialog"},
             ]}
         ]},
    ],
    
    published: {
    	item: null,
    	dialogItem: [{"checked": false, "value": ""}],
        counter: 0,
        rowHeight: 80,
        deleteARow: false,
        isDirty: false
    },
    
    rendered : function() {
        this.inherited(arguments);
        if (Util.isDebug()) {
            this.log("setting focus...");
        }
        if (Platform.isTablet() || Platform.isTouchpadOrPre3()) {
            this.$.addButton.setDisabled( true );
//            if (this.counter == 0 && this.$.name0) {
//                this.$.name0.forceFocusEnableKeyboard();  
//            }
        } else {
            this.$.addButton.addClass("enyo-button-affirmative");        
        }
    },
    
    clearDialog : function( ) {
        this.$.addButton.setActive( false ); 
        this.$.cancelButton.setDisabled( false ); 
//        this.$.name0.setDisabled( false ); 
//        this.$.name0.setValue("");
        if (this.$["name" + this.counter]) {
            if (Platform.isTablet() || Platform.isTouchpadOrPre3()) {
            	this.$["name" + this.counter].forceFocusEnableKeyboard();  
            }
        }
        this.deleteARow = false;
    },
    
    closeDialog : function( ) {
        this.close();
    },
    
    setActive : function ( value ) {
        this.$.addButton.setActive( value ); 
        this.$.cancelButton.setDisabled( !value ); 
        this.$.name0.setDisabled( !value ); 
    },
    
    onSubmit : function( ) {
        this.setActive( true );
        var result = [];

        if (this.item.properties.items === undefined) {
            this.item.properties.items = [];
        }

    	for (var key = 0; key <= this.counter; key++) {
            var name = this.$["name" + key].getValue().trim();
            
            var uuid = Util.createUuid();
            uuid = "/UUID(" + uuid + ")/";
            var d = new Date();
            // var result = "[[\"create\", \"CheckListItem\", \"" + uuid + "\"],";
            // result += "[\"set\", \"" + uuid + "\", \"name\", \"" + name + "\" ],";
            // // result += "[\"set\", \"" + this.item.uuid + "\", \"modified\", \"/Date(" + d.getTime() + ")/\" ],";
            // result += "[\"add\", \"" + this.item.uuid + "\", \"items\", \"" + uuid + "\" ]]";

            var step = [];
            step.push("create", "CheckListItem", uuid);
            result.push( step );

            step = [];
            step.push("set", uuid, "name", name);
            result.push( step );

            step = [];
            step.push("set", this.item.uuid, "modified", "/Date(" + d.getTime() + ")/");
            result.push( step );

            step = [];
            step.push("add", this.item.uuid, "items", uuid);
            result.push( step );

            var newItem = {
                    "uuid" : uuid,
                    "name" : name,
                    "properties" : {}    
                };
            this.item.properties.items.push( newItem );
    	}
                
        this.item.modified = "/Date(" + new Date().getTime() + ")/";
        
        if (Util.isDebug()) {
            this.log("result: "+ JSON.stringify(result));
        }

        enyo.asyncMethod( this, "doCreateItem", [ JSON.stringify(result), this.item, "listitem" ] );
    },
    
    createSuccess : function( inSender, responseText ) {
        this.setActive( false );
        // this.log();    
        if (Util.isDebug()) {
            this.log(JSON.stringify(responseText));
        }
        if (responseText.success == true) {
            // TODO: create local item

        }
        this.closeDialog();
    },
     
    createFailure : function( inSender, responseText, inRequestinSender, responseText, inRequest ) {
        this.setActive( false );
        this.error(JSON.stringify(responseText));
        this.error(JSON.stringify(inRequest.xhr));
        this.showFailurePopup( responseText );
    },

    showFailurePopup : function ( message ) {
        if (Util.isDebug()) {
            this.log("message: " + JSON.stringify(message));
        }
        if (this.$.tempControl !== undefined) {
            this.$.tempControl.setActive( false );
        }
        this.$.popupDialog.openAtCenter();  
        if (message[0] !== undefined) {
            if (Util.isDebug()) {
                this.log("code: " + message[0].code);
            }
            this.$.inhalt.setContent( $L("Item could not be saved!") + " ( Code: " + message[0].code + ", Message: " + message[0].message + ", Command: " + message[0].command + " )");
        }
    },
    
    setDirty : function() {
        if (Util.isDebug()) {
            this.log();
        }
        this.isDirty = true;
        this.$.addButton.addClass("enyo-button-affirmative");
        this.$.addButton.setDisabled( false );
    },
    
    addNewRow : function( checked, value ) {
    	this.counter = Number(Number(this.counter)+1);
    	var number = (Number(this.counter) < 2 ? Number(this.counter) : 2); 
    	var scrollHeight = Number(number) * Number(this.rowHeight);
    	scrollHeight = Number(Number(scrollHeight) + 100); 
    	this.log("scrollHeight: " + scrollHeight);
    	this.$.scroller.applyStyle("height", scrollHeight+"px");
    	
        var width = (Platform.isTablet() ? "530px;" : "205px;");
        if (this.counter == 0) {
        	width = (Platform.isTablet() ? "580px;" : "205px;");
        }
                      
                      
        this.$["contentBox" + this.counter] = this.$.container.createComponent( {name: "contentBox" + this.counter, kind: "HFlexBox", flex:1, align: "start", pack: "top"}, { owner: this } );
        this.$["cb" + this.counter] = this.$["contentBox" + this.counter].createComponent( {kind: "CheckBox", name: "cb"+this.counter,  onChange: "setDirty"/*, style: "padding-right: 10px;"*/, value: this.counter}, {owner: this} );
        
        var newKind = (Platform.isWebOS() ? "RichText" : "Textarea");
        var newObj = {
        		name: "name" + this.counter, 
        		style: "border-width:1px; border-style:solid; border-color:black; padding: 3px; padding-left: 8px; margin-left: 10px; background-color: white; min-height: 60px; width: " + width, 
        		kind: newKind, 
        		richContent: true, 
        		oninput: "setDirty"
		};
        
        this.log("newObj: " + JSON.stringify(newObj));
//        this.log("newObj: " + newObj);
        this.$["name" + this.counter] = this.$["contentBox" + this.counter].createComponent( newObj , {owner: this} );
        if (this.counter > 0) {
            this.$["deleteRow" + this.counter] = this.$["contentBox" + this.counter].createComponent( {kind: "IconButton", className: "enyo-button-negative", style: "margin-top: 0px; height: 20px;", icon: "images/delete.png", onclick: "deleteRow", value: this.counter} , {owner: this} );
        }
        this.render();
    },
    
    deleteRow : function( inSender, inEvent ) {
    	var row = inSender.value;
    	this.log("row: " + row);
    	
/*    	this.counter = Number(Number(this.counter)-1);
    	var scrollHeight = Number(this.counter) * Number(this.rowHeight);
    	scrollHeight = Number(Number(scrollHeight) + 100); 
    	this.log("scrollHeight: " + scrollHeight);
    	this.$.scroller.applyStyle("height", scrollHeight+"px");
    	
        this.$["contentBox" + row].destroy();
        this.$.container.render();*/

    	this.dialogItem = [];
    	for (var key = 0; key <= this.counter; key++) {
    		if (key != row) {
        		var checked = false;
    			var value = "";
        		if (this.$["name" + key]) {
        			value = this.$["name" + key].getValue();
        		}
        		if (this.$["cb" + key]) {
        			checked = this.$["cb" + key].getChecked();
        		}
        		var tmpObj = { "checked": checked, "value": value };
        		this.dialogItem.push( tmpObj );
    		}
    	}
    	this.deleteARow = true;
    	
    	this.log("this.dialogItem: " + JSON.stringify(this.dialogItem));
    	this.doAddNewRow();
    },

    addNewRowHandler : function( inSender, inEvent ) {
    	this.dialogItem = [];
    	for (var key = 0; key <= this.counter; key++) {
    		var checked = false;
			var value = "";
    		if (this.$["name" + key]) {
    			value = this.$["name" + key].getValue();
    		}
    		if (this.$["cb" + key]) {
    			checked = this.$["cb" + key].getChecked();
    		}
    		var tmpObj = { "checked": checked, "value": value };
    		this.dialogItem.push( tmpObj );
    	}
    	this.log("this.dialogItem: " + JSON.stringify(this.dialogItem));
    	this.doAddNewRow( this.dialogItem );
    },
    
    createDialog : function( initial, deleted ) {
    	this.log("initial: " + initial);
    	this.log("deleted: " + deleted);
    	if (this.$.container) {
    		this.$.container.destroyComponents();
    		this.$.container.destroy();
    	}
    	this.$.container = this.$.scroller.createComponent( {name: "container", kind: "RowGroup"}, { "owner": this});
    	this.counter = -1;
    	
    	this.log("this.dialogItem.length: " + this.dialogItem.length);
    	if (true == initial) {
    		this.dialogItem = [{"checked": false, "value": ""}];
    	}
    	
    	// re-add old entries
    	for (var key in this.dialogItem) {
    		this.addNewRow();
    	}
    	if (true != initial && true != deleted) {
        	// add new row!
    		this.addNewRow();
    	}
    },

    setData : function ( items ) {
    	if (items === undefined || items == "undefined") {
    		items = [{"checked": false, "value": ""}];
    	}
    	this.log("this.counter: " + this.counter);
    	this.log("items: " + JSON.stringify(items));
    	this.dialogItem = items;
    	for (var key in this.dialogItem) {
    		this.log("key: " + key);
    		this.$["cb" + key].setChecked(this.dialogItem[key].checked); 
    		this.$["name" + key].setValue(this.dialogItem[key].value); 
    		this.$["name" + key].setSelection({start: 0, end: 0}); 
    	}
    	
        if (Number(this.counter) >= 2) {
        	this.log("scroll to bottom...");
        	this.$.scroller.scrollToBottom();
        }

        if (this.$["name" + this.counter]) {
            if (Platform.isTablet() || Platform.isTouchpadOrPre3()) {
            	this.$["name" + this.counter].forceFocusEnableKeyboard();  
            }
        }

    }
});