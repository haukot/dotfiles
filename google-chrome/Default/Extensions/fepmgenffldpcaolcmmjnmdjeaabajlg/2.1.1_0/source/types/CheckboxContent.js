enyo.kind({
    name: "CheckboxContent",
    kind: "enyo.Control",
    events: {
      onCheckboxClicked: "",
      onUpdateItem: "",
    },
    components: [
        {name: "springpadApi", kind: "SpringpadApi"},
        {name: "contextMenu", kind: "PopupSelect", onSelect: "contextMenuSelect", onClose: "closedPopup", items: [
            {name: "moveItemTop", caption: $L("Move Top"), value: "moveTop", icon: "images/list_fullup.png"}, 
            {name: "moveItemUp", caption: $L("Move Up"), value: "moveUp", icon: "images/list_up.png"}, 
            {name: "editItem", caption: $L("Edit Item"), value: "edit", icon: "images/list_edit.png"}, 
            {name: "deleteItem", caption: $L("Delete Item"), value: "delete", icon: "images/list_delete.png"}, 
            /*{caption: "<hr>", disabled: true},*/ 
            {name: "moveItemDown", caption: $L("Move Down"), value: "moveDown", icon: "images/list_down.png"}, 
            {name: "moveItemBottom", caption: $L("Move Bottom"), value: "moveBottom", icon: "images/list_fulldown.png"}, 
        ]},
        {name: "editListItemDialog", kind: "EditListItemDialog", onUpdateItem: "onSaveItem"},
        {kind: "ModalDialog", name: "deleteDialog", caption: $L("Delete Item"), components:[
            {content: $L("Are you sure you want to delete this item?"), className: "enyo-paragraph"},
            {layoutKind: "HFlexLayout", components: [
                {kind: "Button", caption: $L("Cancel "), flex: 1, onclick: "closeDialog"},
                {name: "deleteButton", kind: "ActivityButton", caption: $L("Delete"), flex: 1, className: "enyo-button-negative", onclick: "deleteItem"},
            ]}
        ]},
        {name: "onlyOnlineDialog", kind: "OnlyOnlineDialog"},
    ],
    
    published: {
        item: null,
        items: [],
        inhalt: "",
        // showChecked: true,
    },
    
    update : function( item, filter, highlight ) {
        // this.log("START");
        this.createItem( item, filter, highlight );
        // this.log("END");
    },
    
    createItem : function( inItem, filter, highlight ) {
        this.item = inItem;
        this.filter = filter;
        this.highlight = highlight;
        // this.log("item: " + item);
        // this.log("this.item.name: " + this.item.name);
        // this.log("this.item.properties.filterCompletedOn: " + this.item.properties.filterCompletedOn);
        if (this.$.content !== undefined) {
            // this.log("deleting content component");
            this.$.content.destroyComponents();
            this.$.content.destroy();
        }
        this.$.content = this.createComponent( {name: "content", className: Util.getClassName("content"), style: "min-height: " + Util.getMinContentHeight()}, { owner: this } );
        // this.$.content.render();

        this.items = this.item.properties.items;
        for (key in this.items) {
            obj = this.items[key];
//            this.log("obj: " + JSON.stringify(obj));
            className = "checkbox-unselected";
            cichecked = false;
            if ( obj.properties !== undefined && obj.properties.complete !== undefined && obj.properties.complete == true) {
                className = "checkbox-selected";
                cichecked = true;
            }
            
            cistr = obj.name;
            if (filter !== undefined && filter != null && filter != "" && highlight == true) {
                cistr = StringUtils.applyFilterHighlight( cistr, filter, "searchResult");
                // this.log("str: " + str);
            }
            cistr = str = StringUtils.createLink( cistr );
            
            this.$["item" + key] = this.$.content.createComponent( {name: "item"+key, kind: "HFlexBox", className: "checkbox-row", style: "padding: 3px;", onmousehold: "onMousehold"}, {owner: this} );
            // this.$["item" + key].render();
            
            this.$["cb"+key]     = this.$["item" + key].createComponent( {kind: "CheckBox", disabled: false, name : "cb"+key, className: className, checked: cichecked, onclick: "onclick", onChange : "clickedCheckbox" }, {owner: this} );
            // this.$["cb"+key].render(); 
            
            this.$["lc"+key]     = this.$["item" + key].createComponent( {kind: "HtmlContent", name: "lc"+key, className: "list-label", allowHtml: true, onLinkClick: "linkClicked", content: cistr}, {owner: this} );
            // this.$["lc"+key].render();
        }
        this.$.content.createComponent( {kind: "HtmlContent", content:"<br><br>"}, {owner: this} );
        // brTag.render();
        this.render();
        this.showList();
    },
    
    showList : function( ) {
        if (Util.isDebug()) {
            if (this.item.properties.filterCompletedOn == true || this.item.properties.filterCompletedOn == "true" ) {
                this.log("hiding complete items...");
            } else {
                this.log("showing all items...");
            }
        }
        childs = this.$.content.getControls();
        for (key in childs) {
            firstNestedChild = childs[key].getControls()[0];
            if (firstNestedChild !== undefined) {
                // this.log("firstNestedChild: " + firstNestedChild.name);
                if( this.$[firstNestedChild.name].checked == true ) {
                    if (this.item.properties.filterCompletedOn == true || this.item.properties.filterCompletedOn == "true") {
                        if( this.$[childs[key].name].getShowing( ) == true ) {
                            this.$[childs[key].name].hide(); 
                        }
                    } else {
                        if( this.$[childs[key].name].getShowing( ) == false ) {
                            this.$[childs[key].name].show(); 
                        }
                    }
                }
            }
        }
    },
    
    toggleView : function( ) {
        // this.showChecked = !this.showChecked;
        if (Util.isDebug()) {
            this.log("old this.item.properties.filterCompletedOn: " + this.item.properties.filterCompletedOn);
        }
        this.item.properties.filterCompletedOn = !this.item.properties.filterCompletedOn;
        if (Util.isDebug()) {
            this.log("new this.item.properties.filterCompletedOn: " + this.item.properties.filterCompletedOn);
        }
        this.showList();
        
        // ["set", {uuid}, {propertyName}, {value}]
        // var data = "[[\"set\", \"" + this.item.uuid + "\", \"filterCompletedOn\", \"" + this.item.properties.filterCompletedOn + "\"]]";
        // var message = "[[\"delete\", \"" + uuid + "\"]]" ;

        result = [];
        step = [];
        step.push("set", this.item.uuid, "filterCompletedOn", this.item.properties.filterCompletedOn);
        result.push( step );

        if (Util.isDebug()) {
            this.log("result: "+ JSON.stringify(result));
        }
        
        // this.log("data: " + data);
        return JSON.stringify(result);
    },
    
    clickedCheckbox : function( inValue, inEvent ) {
        if (inValue.name === undefined) {
            return;
        }

        if (inEvent) {
            if (Util.isDebug()) {
                this.log("preventing default event handling");
            }
            // inEvent.preventDefault();
            // inEvent.stopPropagation();
            return; 
        }

        // this.log("this.lastClick: " + this.lastClick);
        now = new Date();
        
        index = inValue.name.substring(2, inValue.length);
        // this.log("inValue.name: " + inValue.name );
        // this.log("index: " + index );
        listItem = this.items[index];
        // this.log("listItem: " + JSON.stringify(listItem));

        
        
        if (this.lastClick != null) {
            lastClick = new Date()
            lastClick.setTime( this.lastClick );

            // Convert both dates to milliseconds
            date1_ms = now.getTime();
            date2_ms = lastClick.getTime();
        
            // Calculate the difference in milliseconds
            difference_ms = Math.abs(date1_ms - date2_ms);
            if (difference_ms < 200) {
                if (Util.isDebug()) {
                    this.log("this click was too fast, so we will ignore it.");
                }
                oldValue = ( this.item.properties.items[index].properties.complete !== undefined ? this.item.properties.items[index].properties.complete : false);
                // this.log("oldValue: " + oldValue);
                if (this.$[inValue.name]) {
                    this.$[inValue.name].setChecked( oldValue );
                }
                
                if (inEvent) {
                    if (Util.isDebug()) {
                        this.log("preventing default event handling");
                    }
                    inEvent.preventDefault();
                    inEvent.stopPropagation();
                }
                return;         
            }
        }
        this.lastClick = now.getTime();
        
        if (this.$[inValue.name]) {
            ccchecked = this.$[inValue.name].getChecked();
            // var data = null;

            result = [];
            step = [];
    
            if (ccchecked == false || ccchecked == "false") {
                // data = "[[\"remove\", \"" + listItem.uuid + "\", \"complete\", true]]";
                step.push("remove", listItem.uuid, "complete", true);
                result.push( step );
            } else {
                // data = "[[\"set\", \"" + listItem.uuid + "\", \"complete\", " + this.$[inValue.name].getChecked() + "]]"; 
                step.push("set", listItem.uuid, "complete", this.$[inValue.name].getChecked());
                result.push( step );
                if (true == this.item.properties.filterCompletedOn) {
                    itemKey = "item" + index;
                    if( this.$[itemKey].getShowing( ) == true ) {
                        this.$[itemKey].hide(); 
                    }
                }
            }
            // this.log("old this.item.properties.items[index].properties.complete: " + this.item.properties.items[index].properties.complete);
            this.item.properties.items[index].properties.complete = this.$[inValue.name].getChecked();
            this.item.modified = "/Date(" + new Date().getTime() + ")/";
            // this.log("new this.item.properties.items[index].properties.complete: " + this.item.properties.items[index].properties.complete);
            // this.log("data: " + data);
            if (Util.isDebug()) {
                this.log("result: "+ JSON.stringify(result));
            }

            enyo.asyncMethod( this, "doCheckboxClicked", [ JSON.stringify(result), this.item ] );
            // this.doCheckboxClicked( [ data, this.item ] );
            // this.showList();
        } 
        
    },
    
    onclick : function( inSender, inEvent ) {
        if (Util.isDebug()) {
            this.log();
        }
        inEvent.preventDefault();
        inEvent.stopPropagation();        
    },
    
    getShowChecked : function( ) {
        if (Util.isDebug()) {
            this.log("this.item.properties.filterCompletedOn: " + this.item.properties.filterCompletedOn);
        }
        if (this.item.properties.filterCompletedOn == true || this.item.properties.filterCompletedOn == "true") {
            return true;
        }
        return false;
    },
    
    onMousehold : function( inSender, inEvent ) {
        inSender.ishold = true;
        
        this.onHoldIndex  = inSender.name.substring(4, inSender.name.length);
        if (Util.isDebug()) {
            this.log("this.onHoldIndex: " + this.onHoldIndex);
        }
        this.onHoldObject = this.items[this.onHoldIndex];

        this.$["item" + this.onHoldIndex].applyStyle("border", "3px dashed");
        this.$["item" + this.onHoldIndex].applyStyle("border-radius", "10px");

        if (Util.isDebug()) {
            this.log("name: " + this.onHoldObject.name);
        }

        this.$.contextMenu.openAt({
            top : inEvent.clientY-50,
            left : (Platform.isTablet() == true ? inEvent.clientX : 20)
        });        

    },
    
    contextMenuSelect : function( inSender, inValue ) {
        inSender.ishold = false;
        if (Util.isDebug()) {
            this.log("START");
            // this.log("inSender: " + inSender);
            this.log("inValue: '" + inValue.value +"'");
        }
            if (inValue !== undefined) {
                switch (inValue.value) {
                case "delete":
                    if (Util.isDebug()) {
                        this.log("delete action...");
                    } 
                    this.$["item" + this.onHoldIndex].applyStyle("border", "3px dashed");
                    this.$["item" + this.onHoldIndex].applyStyle("border-radius", "10px");
                    this.showDeleteItem();
                    break;
                case "edit":
                    if (Util.isDebug()) {
                        this.log("edit action...");
                    } 
                    this.$["item" + this.onHoldIndex].applyStyle("border", "3px dashed");
                    this.$["item" + this.onHoldIndex].applyStyle("border-radius", "10px");
                    this.$.editListItemDialog.openAtCenter();
                    this.$.editListItemDialog.clearDialog();
                    this.$.editListItemDialog.setItem( this.onHoldObject, this.item );
                    this.$.editListItemDialog.setFuncName( "onSaveItem" );
                    this.$.editListItemDialog.setScope( this );
                    break;
                case "moveUp":
                    if (Util.isDebug()) {
                        this.log("move entry up...");
                        this.log("index: " + this.onHoldIndex);
                    } 
                    this.$["item" + this.onHoldIndex].applyStyle("border", "3px dashed");
                    this.$["item" + this.onHoldIndex].applyStyle("border-radius", "10px");
                    
                    if (this.onHoldIndex > 0) {
                    	// calc new position of item
                    	this.getNextVisibleItemAbove( Number(this.onHoldIndex-1) );
            	    	newPos = this.nextVisibleItemPosAbove;
                    	
                        if (Util.isDebug()) {
                            this.log("newPos: " + newPos);
                        } 
                        this.updatePosition( this.onHoldIndex, newPos );
                    }
                    break;
                case "moveTop":
                    if (Util.isDebug()) {
                        this.log("move entry to top...");
                        this.log("index: " + this.onHoldIndex);
                    } 
                    this.$["item" + this.onHoldIndex].applyStyle("border", "3px dashed");
                    this.$["item" + this.onHoldIndex].applyStyle("border-radius", "10px");
                    
                    if (this.onHoldIndex > 0) {
                    	// calc new position of item
            	    	newPos = 0;
                    	
                        if (Util.isDebug()) {
                            this.log("newPos: " + newPos);
                        } 
                        this.updatePosition( this.onHoldIndex, newPos );
                    }
                    break;
                case "moveDown":
                    if (Util.isDebug()) {
                        this.log("move entry down...");
                        this.log("index: " + this.onHoldIndex);
                        this.log("this.items.length: " + this.items.length);
                    } 
                    this.$["item" + this.onHoldIndex].applyStyle("border", "3px dashed");
                    this.$["item" + this.onHoldIndex].applyStyle("border-radius", "10px");

                    if (this.onHoldIndex < Number(Number(this.items.length) - Number(1))) {
                    	// calc new position of item
                    	this.getNextVisibleItemBeyond( Number(Number(this.onHoldIndex) + Number(1)) );
            	    	newPos = this.nextVisibleItemPosBeyond;

                    	if (Util.isDebug()) {
                            this.log("newPos: " + newPos);
                        } 
//                        this.updatePosition( newPos, this.onHoldIndex );
                        this.updatePosition( this.onHoldIndex, newPos );
                    }
                    break;
                case "moveBottom":
                    if (Util.isDebug()) {
                        this.log("move entry to bottom...");
                        this.log("index: " + this.onHoldIndex);
                        this.log("this.items.length: " + this.items.length);
                    } 
                    this.$["item" + this.onHoldIndex].applyStyle("border", "3px dashed");
                    this.$["item" + this.onHoldIndex].applyStyle("border-radius", "10px");

                    if (this.onHoldIndex < Number(Number(this.items.length) - Number(1))) {
                    	// calc new position of item
            	    	newPos = Number(this.items.length - 1);

                    	if (Util.isDebug()) {
                            this.log("newPos: " + newPos);
                        } 
//                        this.updatePosition( newPos, this.onHoldIndex );
                        this.updatePosition( this.onHoldIndex, newPos );
                    }
                    break;
                default: 
                    break;
                }
            }

        if (Util.isDebug()) {
            this.log("END");
        }
    },
    
    getNextVisibleItemAbove : function( idx ) {
    	this.log("START - " + idx);
    	if (idx < 0) {
    		return -1;
    	}
    	// show only not completed items
        if (true == this.item.properties.filterCompletedOn) {
            if( this.$["item" + idx].getShowing( ) == true ) {
            	this.log("item is visible!");
    	    	this.log("END - " + Number(idx));
    	    	this.nextVisibleItemPosAbove = Number(idx);
            } else {
            	this.log("item is NOT visible!");
            	this.getNextVisibleItemAbove( Number(idx-1) );
            }
        } else {
	    	this.log("END - " + Number(idx));
	    	this.nextVisibleItemPosAbove = Number(idx);
        }
    	this.log("END - without return");
    },
    
    getNextVisibleItemBeyond : function( idx ) {
    	this.log("START - " + idx);
    	if (idx >= Number(this.items.length)) {
    		return -1;
    	}
    	// show only not completed items
        if (true == this.item.properties.filterCompletedOn) {
            if( this.$["item" + idx].getShowing( ) == true ) {
            	this.log("item is visible!");
    	    	this.log("END - " + Number(idx));
    	    	this.nextVisibleItemPosBeyond = Number(idx);
            } else {
            	this.log("item is NOT visible!");
            	this.getNextVisibleItemBeyond( Number(idx+1) );
            }
        } else {
	    	this.log("END - " + Number(idx));
	    	this.nextVisibleItemPosBeyond = Number(idx);
        }
    	this.log("END - without return");
    },
    
    updatePosition : function( oldPos, newPos ) {
    	if (newPos == -1 || newPos === undefined || newPos == "undefined") {
    		// TODO popup anzeigen: "Korrekte Position konnte nicht ermittelt werden."
            this.$["item" + this.onHoldIndex].applyStyle("border", "0px");
    		return;
    	}
    	
        if (Util.isDebug()) {
	        this.log("oldPos: " + oldPos);
	        this.log("newPos: " + newPos);
        } 

        ts = new Date().getTime();
        startPos = (newPos < oldPos ? newPos : oldPos);
    	
        // delete list items from startPos til the end of the list
        data = [];
        for (var c = startPos; c < this.items.length; c++) {
        	step = [];
            step.push("delete", this.items[c].uuid);
            data.push( step );
        }
        if (Util.isDebug()) {
            this.log("data: " + JSON.stringify(data));
        } 
        this.$.springpadApi.onFetchSuccess = "success";
        this.$.springpadApi.onFetchFailure = "failure";
    	this.$.springpadApi.fetchData("users/me/commands", "POST", JSON.stringify(data) );
        
    	// make backup of old item list 
    	tmpList = this.items.slice();
    	// make backup of old item 
    	backupItem = tmpList[oldPos];
        if (Util.isDebug()) {
            this.log("backupItem: " + JSON.stringify(backupItem));
        } 
    	// insert changed item into oldlist
        ArrayUtils.removeElement( tmpList, tmpList[oldPos] );
    	tmpList.splice( newPos, 0, backupItem );
        if (Util.isDebug()) {
            this.log("tmpList: " + JSON.stringify(tmpList));
        } 
        
        // remove old list items from original item list
        this.items.splice(startPos, Number(this.items.length-startPos) );
        if (Util.isDebug()) {
            this.log("this.items after splice: " + JSON.stringify(this.items));
        } 
        
        // create list items from newPos again
        data = [];
        for (var c = startPos; c < tmpList.length; c++) {
            uuid = Util.createUuid();
            uuid = "/UUID(" + uuid + ")/";

            step = [];
            step.push("create", "CheckListItem", uuid);
            data.push( step );

            step = [];
            step.push("set", uuid, "name", tmpList[c].name);
            data.push( step );
            
            step = [];
            step.push("set", uuid, "complete", tmpList[c].properties.complete);
            data.push( step );
            
            step = [];
            step.push("add", this.item.uuid, "items", uuid);
            data.push( step );

            newItem = {
                    "uuid" : uuid,
                    "name" : tmpList[c].name,
                    "type" : "/Type(CheckListItem)/",
                    "created" : ts,
                    "modified" : ts,
                    "properties" : {
                    	"complete" : tmpList[c].properties.complete
                    }    
                };
            this.items.push( newItem );
        }
        step = [];
        step.push("set", this.item.uuid, "modified", "/Date(" + ts + ")/");
        data.push( step );

        if (Util.isDebug()) {
            this.log("data: " + JSON.stringify(data));
        } 
        this.$.springpadApi.onFetchSuccess = "success";
        this.$.springpadApi.onFetchFailure = "failure";
    	this.$.springpadApi.fetchData("users/me/commands", "POST", JSON.stringify(data) );
    
        if (Util.isDebug()) {
            this.log("this.items after push: " + JSON.stringify(this.items));
        } 
        
        // update item
        this.item.properties.items = this.items;
        this.item.modified = "/Date(" + new Date().getTime() + ")/";
        if (Util.isDebug()) {
            this.log("this.item.properties.items: " + JSON.stringify(this.item.properties.items));
        } 

        // refresh item in storage
        this.owner.getDataManager().updateItemInList( this.item );
        // refresh list
        this.update( this.item, this.filter, this.highlight );
    },
    
    onSaveItem : function( inSender, inValue ) {
        // this.log("inSender: " + inSender);
        if (Util.isDebug()) {
            this.log("inValue: " + inValue);
        }
        this.owner.getDataManager().updateData( inValue[0], inValue[1], this );
    },
    
    onSaveResult : function( success, message ) {
        if (Util.isDebug()) {
            this.log("success: " + success);
            this.log("message: " + JSON.stringify(message));
        }
        this.$.editListItemDialog.setActive( false );  
        if (success == true) {
            this.$.editListItemDialog.closeDialog();
            this.$["item" + this.onHoldIndex].applyStyle("border", "0px");
            // update list item
            var str = enyo.string.runTextIndexer( this.onHoldObject.name );
            this.$["lc"+this.onHoldIndex].setContent( str );
        } else {
            this.$.editListItemDialog.showFailurePopup( message );
        }
    },

    deleteItemSuccess : function( inSender, responseText ) {
        if (Util.isDebug()) {
            this.log();
        }    
        this.$.deleteButton.setActive( false );
        this.$.deleteDialog.close( );
        
        if (Util.isDebug()) {
            this.log(JSON.stringify(responseText));
        }
        if (responseText.success == true) {
            this.$["item"+this.onHoldIndex].hide( );
            this.log("this.items.length: " + this.items.length);
            ArrayUtils.removeElementByUUID( this.item.properties.items, this.onHoldObject.uuid );
            this.items = this.item.properties.items;
            this.log("this.items.length: " + this.items.length);
            this.item.modified = "/Date(" + new Date().getTime() + ")/";
            this.owner.getDataManager().updateItemInList( this.item );
            this.update( this.item, this.filter, this.highlight );
        }
    },
     
    deleteItemFailure : function( inSender, responseText, inRequest ) {
        if (Util.isDebug()) {
            this.log();
        }    
        this.$.deleteButton.setActive( false );
        this.$.deleteDialog.close( );
        
        this.$.editListItemDialog.showFailurePopup( responseText );
    },
    
    deleteItem : function( ) {
        this.$["item" + this.onHoldIndex].applyStyle("border", "0px");
        this.$.deleteButton.setActive( true );
        
        // var result = "[[\"delete\", \"" + this.onHoldObject.uuid + "\" ]]";
        // this.log("result: "+ result);

        result = [];
        step = [];
        step.push("delete", this.onHoldObject.uuid);
        result.push( step );

        if (Util.isDebug()) {
            this.log("result: "+ JSON.stringify(result));
        }
        
        this.$.springpadApi.onFetchSuccess = "deleteItemSuccess";
        this.$.springpadApi.onFetchFailure = "deleteItemFailure";
        this.$.springpadApi.fetchData("users/me/commands", "POST", JSON.stringify(result) );
    },
   
    showDeleteItem : function( ) {
        this.$.deleteDialog.openAtCenter();  
    },
   
    closeDialog : function() {
        this.$["item" + this.onHoldIndex].applyStyle("border", "0px");
        this.$.deleteDialog.close();  
    },
     
    linkClicked: function (inSender, inEvent) {
        if (Util.isDebug()) {
            this.log("inEvent: " + inEvent);
        }
        Platform.browser( inEvent, this )();
    },
    
    closedPopup : function() {
        // this.log();
//        this.$["item" + this.onHoldIndex].applyStyle("background-color" ,"#ffffff");  
        this.$["item" + this.onHoldIndex].applyStyle("border", "0px");
    },
    
    success : function() {
    	
    },

    failure : function( inSender, responseText, inRequest ) {
        this.error(JSON.stringify(responseText));
        this.error(JSON.stringify(inRequest.xhr));
//        this.showFailurePopup( responseText );
    },
});