enyo.kind({
    kind: "ModalDialog", 
    name: "OnlyOnlineDialog", 
    caption: $L("Attention"), 
    components:[
         {content: $L("This function is currently only available when the client is online."), className: "enyo-paragraph"},
         {layoutKind: "HFlexLayout", components: [
             {kind: "Button", caption: $L("Ok"), flex: 1, onclick: "close", className: "enyo-button-affirmative"},
         ]}
    ],
     
});
