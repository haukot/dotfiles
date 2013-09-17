enyo.kind({
    kind: "ModalDialog", 
    name: "AddToShoppingListDialog", 
    caption: $L("Add To Shopping List"), 
    width: (Platform.isTablet() ? "480px" : "320px"),
    events: { 
        onSaveList: ""
    },
    components:[
         {name: "scroller", kind: enyo.Scroller, flex: 1, height: (Platform.isTablet() ? Util.getAbsolutPixel( "h", 0.86, 125) : (Platform.isTouchpadOrPre3() ? "335px" : "230px")), autoHorizontal: false, horizontal: false, components: [
             {name: "lists", kind: "RowGroup", caption: $L("ShoppingList") , components: [
             ]},
             {name: "container", kind: "RowGroup", caption: $L("Ingredients") , components: [
             ]},
         ]},
         {layoutKind: "HFlexLayout", style: "padding-top: 10px;", components: [
             {name: "cancelButton", kind: "Button", caption: $L("Cancel "), flex: 1, onclick: "closeDialog", className: "enyo-button-negative"},
             {name: "addButton", kind: "ActivityButton", caption: $L("Save"), flex: 1, onclick: "addToList", className: "enyo-button"}
         ]},
         {kind: "ModalDialog", name: "popupDialog", caption: $L("Error"), components:[
             {name: "inhalt", content: $L("You must have a ShoppingList object already! Please create before trying to add something to it."), className: "enyo-paragraph"},
             {layoutKind: "HFlexLayout", components: [
                 {kind: "Button", caption: "Ok", flex: 1, onclick: "closeDialog"},
             ]}
         ]},
        {kind: "ModalDialog", name: "popupDialogSave", caption: $L("Error"), components:[
             {name: "inhalt", content: $L("Item could not be saved!"), className: "enyo-paragraph"},
             {layoutKind: "HFlexLayout", components: [
                 {kind: "Button", caption: $L("Ok"), flex: 1, onclick: "closeDialogSave"},
             ]}
         ]},
    ],
    published: {
        item: null,    
    },
    
    rendered : function() {
        this.inherited(arguments);
        if (Platform.isTouchpadOrPre3()) {
            this.$.addButton.setDisabled( true );
        } else {
            this.$.addButton.addClass("enyo-button-affirmative");        
        }
    },
    
    clearDialog : function( ) {
        this.$.addButton.setActive( false ); 
        this.$.scroller.setScrollTop( 0 );
        if (Platform.isTouchpadOrPre3()) {
            this.$.addButton.setDisabled( true ); 
            this.$.addButton.addClass("enyo-button");
        } else {
            this.$.addButton.addClass("enyo-button-affirmative");
        }
    },
    
    setData : function( lists, ingredients ) {

        this.lists = lists;

        if (lists.length == 0) {
            this.$.popupDialog.openAtCenter();  
        }
        
        
        if (this.$.container) {
            if (Util.isDebug()) {
                this.log("deleting old ingredients...");
            }
            this.$.container.destroyControls();
        }
        
        if (this.$.lists) {
            if (Util.isDebug()) {
                this.log("deleting old list ui-elements...");
            }
            this.$.lists.destroyControls();
        }

        var items = [];
        var selectedIndex = 0;        
        for (key in lists) {
            obj = lists[key];
            lists[key].key = key;
            // this.log("obj: " + JSON.stringify(obj) );
            // this.$.listSelector.createComponent( {caption: obj.name}, {owner: this} );
            // items.push( $L(obj.name) );
            items.push( { caption: obj.name, value: key } );
            if (Settings.getSettings().shoppingList == obj.uuid) {
                selectedIndex = key;
            }
        }
        if (Util.isDebug()) {
            this.log("items: " + JSON.stringify(items) );
        }

        var kind = {name: "listSelector", kind: "CustomListSelector", style: "text-overflow: ellipsis; overflow: hidden; white-space: nowrap; margin-left: 10px;", onChange: "listChanged" };
        this.$.listSelector = this.$.lists.createComponent( kind, {owner: this} );

        this.$.listSelector.setItems( items );
        this.$.listSelector.setValue( selectedIndex );
        
        
        var ingArray = String(ingredients).split("<br>");  
        this.ingredients = ingArray;
        if (Util.isDebug()) {
            this.log("ingArray: " + ingArray.length);
        }      
        var width = (Platform.isTablet() ? "365px;" : "205px;");
        for(key in ingArray) {
            var ing = ingArray[key];
            if (Util.isDebug()) {
                this.log("ing: " + ing);
            }
                      
            this.$["contentBox" + key] = this.$.container.createComponent( {name: "contentBox" + key, kind: "HFlexBox", flex:1, align: "start", pack: "top"}, { owner: this } ); 
            this.$["contentBox" + key].createComponent( {kind: "CheckBox", name: "cb"+key, onChange: "setDirty"/*, style: "padding-right: 10px;"*/, value: key}, {owner: this} );
            
            newKind = (Platform.isWebOS() ? "RichText" : "Textarea");
            newObj = {
            		name: "input" + key, 
            		style: "border-width:1px; border-style:solid; border-color:black; padding: 3px; padding-left: 8px; margin-left: 10px; background-color: white; min-height: 90px; width: " + width, 
            		kind: newKind, 
            		richContent: true, 
            		oninput: "setDirty", 
            		value: ing 
    		};
            
            this.log("newObj: " + JSON.stringify(newObj));
            this.$["input" + key] = this.$["contentBox" + key].createComponent( newObj , {owner: this} );
        }
        this.render();
        this.item = ArrayUtils.getElementFromArrayById( this.owner.getDataManager().getItemsAll(), lists[selectedIndex].uuid );
        
        if (Util.isDebug()) {
            if (this.item != null) {
                this.log("this.item: " + JSON.stringify( this.item.properties) );
            } else {
                this.error("this.item is null!");
            }
        }
        
        this.checkedItems = 0;

        for(key in ingArray) {            
            this.$["input" + key].setValue( ingArray[key] );
        }
    },
    
    setActive : function ( value ) {
        this.$.addButton.setActive( value ); 
        this.$.cancelButton.setDisabled( !value ); 
    },

    addToList : function( inSender, inEvent ) {
        if (Util.isDebug()) {
            this.log(inSender.value);
        }
        this.setActive( true );

        resultValues = [];
        for(key in this.ingredients) {
            // var ing = ingArray[key];
            if (Util.isDebug()) {
                this.log("key: " + key);
            }
            if (this.$["cb" + key].getChecked()) {
                // ab damit auf die liste
                var value = this.$["input" + key].getValue();
                if (Util.isDebug()) {
                    this.log("value: " + value);
                }
                resultValues.push( value );
            }
        }
        
        // var result = "[";
        result = [];

        d = new Date();

        for (key in resultValues) {
            uuid = Util.createUuid();
            uuid = "/UUID(" + uuid + ")/";
            // if (result.length > 1) {
                // result += ", ";
            // }
            // result += "[\"create\", \"CheckListItem\", \"" + uuid + "\"],";
            // result += "[\"set\", \"" + uuid + "\", \"name\", \"" + resultValues[key] + "\" ],";
            // result += "[\"add\", \"" + this.item.uuid + "\", \"items\", \"" + uuid + "\" ]";
            
            step = [];
            step.push("create", "CheckListItem", uuid);
            result.push( step );

            step = [];
            step.push("set", uuid, "name", resultValues[key]);
            result.push( step );

            step = [];
            step.push("set", this.item.uuid, "modified", "/Date(" + d.getTime() + ")/");
            result.push( step );
        
            step = [];
            step.push("add", this.item.uuid, "items", uuid);
            result.push( step );

            
            var newItem = {
                "uuid" : uuid,
                "name" : resultValues[key],
                "properties" : {}    
            };
            if (this.item.properties.items === undefined) {
                this.item.properties.items = [];
            }
            this.item.properties.items.push( newItem );
        }
        // result += "]";
        if (Util.isDebug()) {
            this.log("result: "+ JSON.stringify(result));
        }


        this.item.modified = "/Date(" + new Date().getTime() + ")/";
        
        enyo.asyncMethod( this, "doSaveList", [ JSON.stringify(result), this.item, "listitems" ] );
    },
     
    closeDialog : function( ) {
        this.close();
    },
    
    setDirty : function( inSender, inEvent ) {
        if (Util.isDebug()) {
            this.log(inSender);
        }
        if (inSender == "enyo.CheckBox") {
            if (inSender.getChecked() == true) {
                this.checkedItems++;
            } else {
                this.checkedItems--;
            }
        } else if (inSender == "enyo.RichText") {
            // this.log(inSender.name);
            // this.log(inSender.value);
            var index = String(inSender.name).substring(5, String(inSender.name).length);
            if (Util.isDebug()) {
                this.log("index: " + index);
            }
            var checkedBefore = this.$["cb" + index].getChecked();
            if (Util.isDebug()) {
                this.log("checkedBefore: " + checkedBefore);
            }
            if (checkedBefore == false) {
                this.$["cb" + index].setChecked( true );
                this.checkedItems++;                
            } 
        }
        
        // this.log("currently checked items: " + this.checkedItems);
        
        if (this.checkedItems > 0) {
            this.isDirty = true;
            this.$.addButton.addClass("enyo-button-affirmative");
            this.$.addButton.setDisabled( false );
        } else {
            if (Platform.isTouchpadOrPre3()) {
                this.$.addButton.setDisabled( true );
                this.$.addButton.addClass("enyo-button");        
            }
        }
    },
    
    listChanged: function( inSender, inValue, inOldValue ) {
        if (Util.isDebug()) {
            this.log(inSender + ", inValue: " + inValue + ", inOldValue: " + inOldValue);
        }
        
        // find corresponding listitem
        for (key in this.lists) {
            obj = this.lists[key];
            if (Util.isDebug()) {
                this.log("obj: " + JSON.stringify(obj) );
            }
            if (obj.key == inValue ) {
                this.item = ArrayUtils.getElementFromArrayById( this.owner.getDataManager().getItemsAll(), obj.uuid ); 
                return;
            }
        }
    },
    
    showFailurePopup : function (message ) {
        if (Util.isDebug()) {
            this.log("message: " + JSON.stringify(message));
        }
        this.$.popupDialogSave.openAtCenter();  
        if (message !== undefined && message[0] !== undefined) {
            if (Util.isDebug()) {
                this.log("code: " + message[0].code);
            }
            this.$.inhalt.setContent( this.$.inhalt.getContent() + " ( Code: " + message[0].code + ", Message: " + message[0].message + ", Command: " + message[0].command + " )");
        }
    },
    
    closeDialogSave : function() {
        this.$.popupDialogSave.close();  
    },
    
    
});
