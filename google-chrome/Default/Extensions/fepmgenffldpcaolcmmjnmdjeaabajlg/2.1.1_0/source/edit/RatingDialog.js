enyo.kind({
    kind: "ModalDialog", 
    name: "RatingDialog", 
    caption: $L("Rate this Object"), 
    events: { 
        onSaveRating: ""
    },
    components:[
         {layoutKind: "VFlexLayout", components: [
             {name: "button0", value: "0", kind: "Button", onclick: "rate", layoutKind: "HFlexLayout", align: "center", pack: "center", components: [
                {kind: "Image", src: "images/0-star.png"}, {name: "spinner0", kind: "Spinner"}
             ]},
             {name: "button1",value: "1", kind: "Button", onclick: "rate", layoutKind: "HFlexLayout", align: "center", pack: "center", components: [
                {kind: "Image", src: "images/1-star.png"}, {name: "spinner1", kind: "Spinner"}
             ]},
             {name: "button2",value: "2", kind: "Button", onclick: "rate", layoutKind: "HFlexLayout", align: "center", pack: "center", components: [
                {kind: "Image", src: "images/2-star.png"}, {name: "spinner2", kind: "Spinner"}
             ]},
             {name: "button3",value: "3", kind: "Button", onclick: "rate", layoutKind: "HFlexLayout", align: "center", pack: "center", components: [
                {kind: "Image", src: "images/3-star.png"}, {name: "spinner3", kind: "Spinner"}
             ]},
             {name: "button4",value: "4", kind: "Button", onclick: "rate", layoutKind: "HFlexLayout", align: "center", pack: "center", components: [
                {kind: "Image", src: "images/4-star.png"}, {name: "spinner4", kind: "Spinner"}
             ]},
             {name: "button5",value: "5", kind: "Button", onclick: "rate", layoutKind: "HFlexLayout", align: "center", pack: "center", components: [
                {kind: "Image", src: "images/5-star.png"}, {name: "spinner5", kind: "Spinner"}
             ]},
         ]},
         {layoutKind: "HFlexLayout", components: [
             {kind: "Button", caption: $L("Cancel "), flex: 1, onclick: "closeDialog", className: "enyo-button-negative"},
         ]}
    ],
    published: {
        item: null,    
    },
    
    rate : function( inSender, inEvent ) {
        if (Util.isDebug()) {
            this.log(inSender.value);
        }
        this.$["spinner" + inSender.value].show( );
        
        // uuid = "/UUID(" + uuid + ")/";
        var result = [];
        var step = [];
        step.push("set", this.item.uuid, "personalRating", inSender.value);
        result.push( step );

        if (Util.isDebug()) {
            this.log("result: "+ JSON.stringify(result));
        }
        
        this.item.properties.personalRating = inSender.value;
        this.item.modified = "/Date(" + new Date().getTime() + ")/";
        
        enyo.asyncMethod( this, "doSaveRating", [ JSON.stringify(result), this.item ] );

        // this.closeDialog();
    },
     
    closeDialog : function( ) {
        this.$["spinner0"].hide( );
        this.$["spinner1"].hide( );
        this.$["spinner2"].hide( );
        this.$["spinner3"].hide( );
        this.$["spinner4"].hide( );
        this.$["spinner5"].hide( );
        this.close();
    },
    
});
