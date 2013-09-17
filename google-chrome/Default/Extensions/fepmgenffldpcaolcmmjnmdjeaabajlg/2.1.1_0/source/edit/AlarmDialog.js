enyo.kind({
    kind: "ModalDialog", 
    name: "AlarmDialog", 
    caption: $L("Add to calendar"), 
    height: (Platform.isWebOS() ?  
                (Platform.isTouchpad() ? Util.getAbsolutPixel( "h", 0.80) : (Platform.isTouchpadOrPre3() ? "400px" : "350px"))
                : (Platform.isTablet() || Platform.isBrowser() ? Util.getAbsolutPixel( "h", 0.80) : "400px")),
    width: (Platform.isTablet() ? "420px" : "320px"),
    events: { 
        onSaveAlarm: ""
    },
    components:[
         {name: "scroller", kind: enyo.Scroller, flex: 1, height: (Platform.isWebOS() ?  
                 (Platform.isTouchpad() ? "400px" : (Platform.isTouchpadOrPre3() ? "275px" : "165px"))
                 : (Platform.isTablet() || Platform.isBrowser() ? "400px" : "275px")), autoHorizontal: false, horizontal: false, components: [
             {nodeTag: "hr"},
             {content: $L("Attention") + ":", style: "font-weight: bold; padding-left: 10px; font-size: 16px; overflow: hidden; margin-top: 5px;", name: "hinweis", pack: "center"},
             {content: $L("Existing calendar entries will not be updated! That must be done with the calendar app. Here you can only add a new entry to the calendar."), style: "padding-left: 10px; font-size: 16px; overflow: hidden; margin-top: 5px;", name: "hinweis", pack: "center"},
             {nodeTag: "hr"},
             {kind: "RowGroup", caption: $L("Start date and time"), components: [
                 {layoutKind: "VFlexLayout", components: [
                    {name: "datepicker1", kind: "DatePicker", onChange: "setDirty"},
                    {name: "timepicker1", kind: "TimePicker", onChange: "setDirty"}
                 ]},
             ]},
             {kind: "RowGroup", caption: $L("End date and time"), components: [
                 {layoutKind: "VFlexLayout", components: [
                    {name: "datepicker2", kind: "DatePicker", onChange: "setDirty"},
                    {name: "timepicker2", kind: "TimePicker", onChange: "setDirty"}
                 ]},
             ]},
         ]},
         {layoutKind: "HFlexLayout", style: "padding-top: 0px;", components: [
             {kind: "Button", caption: $L("Cancel "), flex: 1, onclick: "closeDialog", className: "enyo-button-negative"},
             {name: "saveButton", kind: "ActivityButton", caption: $L("Save"), flex: 1, onclick: "saveAlarm", className: "enyo-button-affirmative"}
         ]}
    ],
    published: {
    },
    
    rendered : function( ) {
        if (Util.isDebug()) {
            this.log();
        }
        this.inherited(arguments);
        this.resize();        
    },    
    
    resize : function() {
        var height = (Platform.isWebOS() ?  
                (Platform.isTouchpad() ? Util.getAbsolutPixel( "h", 0.80) : (Platform.isTouchpadOrPre3() ? "400px" : "350px"))
                : (Platform.isTablet() || Platform.isBrowser() ? Util.getAbsolutPixel( "h", 0.80) : "400px"));
        if (Util.isDebug()) {
            this.log("height: " + height);
            }                
        this.applyStyle("height", height);
        
        if (this.$.scroller != undefined) {
            var scrollerH = (Platform.isWebOS() ?  
                    (Platform.isTouchpad() ? Util.getAbsolutPixel( "h", 0.80, 120) : (Platform.isTouchpadOrPre3() ? "275px" : "165px"))
                    : (Platform.isTablet() || Platform.isBrowser() ? Util.getAbsolutPixel( "h", 0.80, 120) : "275px"));
            if (Util.isDebug()) {
                this.log("scrollerH: " + scrollerH);
            }
            this.$.scroller.applyStyle("height", scrollerH);
        }
    },
        
    setItem : function( time1, time2 ) {
        this.$.saveButton.setActive( false );

        if (Util.isDebug()) {
            this.log("time1: " + time1);
            this.log("time2: " + time2);
        }
        
        var d = new Date();
        if (time1 !== undefined && time1 !== null) {
            d.setTime( time1 );
        }
        this.$["datepicker1"].setValue( d ); 
        this.$["timepicker1"].setValue( d );
        
        if (time2 !== undefined && time2 !== null) {
            d = new Date();
            d.setTime( time2 );
        }
        this.$["datepicker2"].setValue( d ); 
        this.$["timepicker2"].setValue( d );
            
    },
    
    saveAlarm : function( inSender, inEvent ) {
        
        this.$.saveButton.setActive( true );
        
        // save start date and time
        var valueDate1 = this.$.datepicker1.getValue();
        if (Util.isDebug()) {
            this.log("valueDate1: "+ valueDate1);
        }
        var valueTime1 = this.$.timepicker1.getValue();
        if (Util.isDebug()) {
            this.log("valueTime1: "+ valueTime1);
        }
 
        var value1 = 0;
        if (valueDate1 !== undefined && valueDate1 != null && valueTime1 !== undefined && valueTime1 != null) {
            valueDate1.setHours( valueTime1.getHours() );
            valueDate1.setMinutes( valueTime1.getMinutes() );
            value1 = valueDate1.getTime();
        }
        if (Util.isDebug()) {
            this.log("value1: "+ value1);
        }

        // save end date and time
        var valueDate2 = this.$.datepicker2.getValue();
        if (Util.isDebug()) {
            this.log("valueDate2: "+ valueDate2);
        }
        var valueTime2 = this.$.timepicker2.getValue();
        if (Util.isDebug()) {
            this.log("valueTime2: "+ valueTime2);
        }
 
        var value2 = 0;
        if (valueDate2 !== undefined && valueDate2 != null && valueTime2 !== undefined && valueTime2 != null) {
            valueDate2.setHours( valueTime2.getHours() );
            valueDate2.setMinutes( valueTime2.getMinutes() );
            value2 = valueDate2.getTime();
        }
        if (Util.isDebug()) {
            this.log("value2: "+ value2);
        }
        
        this.doSaveAlarm( value1, value2 );
    },
     
    closeDialog : function( ) {
        this.$.saveButton.setActive( false );
        this.close();
    },
    
});
