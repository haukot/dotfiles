enyo.kind({
    name: "TaskContent",
    kind: "enyo.Control",
    events: {
        onCheckboxClicked: "",
      },
    components: [
        {name: "content", className: Util.getClassName("content"), style: "min-height: " + Util.getMinContentHeight(), components: [
            {name: "headline_name", className: Util.getClassName("subtext-headline")},
            {name: "name", className: Util.getClassName("subtext-content"), allowHtml: true},
            {name: "headline_due", className: Util.getClassName("subtext-headline")},
            {name: "due", className: Util.getClassName("subtext-content"), allowHtml: true},
            {name: "headline_category", className: Util.getClassName("subtext-headline")},
            {name: "category", className: Util.getClassName("subtext-content"), allowHtml: true},
            {name: "headline_complete", className: Util.getClassName("subtext-headline")},
         	{name: "complete_box", className: "subtext-content", components: [
              	{name: "complete", kind: "CheckBox", onclick: "onclick", onChange : "clickedCheckbox" },
            ]},
            {name: "headline_description", className: Util.getClassName("subtext-headline")},
            {name: "description", className: Util.getClassName("subtext-content"), allowHtml: true},
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
        this.filter = filter;                                                                                                                                       
        this.highlight = highlight;                                                                                                                                       
                                         
        // name
        var name = item.name;                                                                                                          
        if (Util.isDebug()) {
            this.log("name: " + name);
        }                                                                                                                
                                                                                                                                                                
        // due
        var due = "";
        var value = StringUtils.getValueFromString( item.properties.date.properties.date );
        if (value != null) {
            var mydate = new Date();
            mydate.setTime( value );
            var dateFmt = new enyo.g11n.DateFmt( {"date" : "short"} );
            due = dateFmt.format( mydate );
        }
        
        // complete
        var className = "checkbox-unselected";
        var checked = false;
        if ( item.properties !== undefined && item.properties.complete !== undefined && item.properties.complete == true) {
            className = "checkbox-selected";
            checked = true;
        }
        if (Util.isDebug()) {
            this.log("className: " + className);
            this.log("checked: " + checked);
        }                         
        this.$.headline_complete.setContent($L("Complete"));
        this.$.complete.addClass( className );
        this.$.complete.setChecked( checked );

        // description
        var description = item.properties.description;                                                                                                          
        if (Util.isDebug()) {
            this.log("description: " + description);
        }                                                                                                                
                         
        // set filter highlight
        
        if (filter !== undefined && filter != null && filter != "" && highlight == true) {                                                                      
            description = StringUtils.applyFilterHighlight( description, filter, "searchResult");                                                                      
        	name = StringUtils.applyFilterHighlight( name, filter, "searchResult");                                                                      
        }                                                                                                                                                       
        
        // set values to ui
       
        if (name != "" && name !== undefined) {                                                                                                   
            this.$.headline_name.setContent( $L("Name") );                                                                                        
            this.$.name.setContent( name );                                                                                                       
        }      

        if (due != "" && due !== undefined) {                                                                                                   
            this.$.headline_due.setContent( $L("Due") );                                                                                        
            this.$.due.setContent( due );                                                                                                       
        }      

        if (description != "" && description !== undefined) {                                                                                                   
            this.$.headline_description.setContent( $L("Description") );                                                                                        
            this.$.description.setContent( description );                                                                                                       
        }      
        
        this.render();                                                                                                                                                        
    },                                                                                                                                                          
                                                                                                                                                                
    onclick : function( inSender, inEvent ) {
        if (Util.isDebug()) {
            this.log();
        }
        inEvent.preventDefault();
        inEvent.stopPropagation();        
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

        this.log("this.lastClick: " + this.lastClick);
        now = new Date();
        
        
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
                oldValue = ( this.item.properties.complete !== undefined ? this.item.properties.complete : false);
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
                step.push("remove", this.item.uuid, "complete", true);
                result.push( step );
            } else {
                // data = "[[\"set\", \"" + listItem.uuid + "\", \"complete\", " + this.$[inValue.name].getChecked() + "]]"; 
                step.push("set", this.item.uuid, "complete", this.$[inValue.name].getChecked());
                result.push( step );
            }
            // this.log("old this.item.properties.items[index].properties.complete: " + this.item.properties.items[index].properties.complete);
            this.item.properties.complete = this.$[inValue.name].getChecked();
            this.item.modified = "/Date(" + new Date().getTime() + ")/";
            // this.log("new this.item.properties.items[index].properties.complete: " + this.item.properties.items[index].properties.complete);
            // this.log("data: " + data);
            if (Util.isDebug()) {
                this.log("result: "+ JSON.stringify(result));
            }

            enyo.asyncMethod( this, "doCheckboxClicked", [ JSON.stringify(result), this.item ] );
            // this.doCheckboxClicked( [ data, this.item ] );
            // this.showList();
            this.owner.setDurchgestrichen( !this.owner.getDurchgestrichen() );
            this.owner.updateHeader( );
        } 
        
    },
    
                                    
});