/**
    Copyright: Arthur Thornton 2012
    License: MIT Open Source
    Cost: FREE
*/

enyo.kind({
    kind: enyo.Control,
    name: "ImageInput",
    nodeTag: "input",
    events: {
        onChange: "",
        onclose: ""
    },
    domAttributes: {
        type: "file",
        accept: "*",
        name: "",
        style: "visibility:hidden;height:0px;width:0px;" // MUST BE visibility:hidden
    },
    published: {
        nodeName: ""
    },
    rendered: function() {
    //  this.changeHandler = enyo.bind(this, this.doChange);
    },
    changeHandler: function(inValue) {
        this.log("inValue: " + inValue);
        
        this.doChange(inValue);
    },
    closeHandler: function() {
    },
    focus: function() {
        this.hasNode();
        this.node.click();
    },
    nodeNameChanged: function() {
        this.hasNode();
        this.node.setAttribute('name', this.nodeName);
    }
});
enyo.kind({
    name: "UploaderInput",
    kind: enyo.Control,
    nodeTag: "input",
    domAttributes: {
        type: "input",
        name: "",
        style: "visibility:hidden;height:0px;width:0px;" // MUST BE visibility:hidden
    },
    rendered: function() {
        this.valueChanged();
        this.nodeNameChanged();
    },
    valueChanged: function() {
        this.hasNode();
        this.node.setAttribute('value', this.value);
    },
    nodeNameChanged: function() {
        this.hasNode();
        this.node.setAttribute('name', this.nodeName);
    }
});
enyo.kind({
    name: "UploaderForm",
    kind: enyo.Control,
    nodeTag: "form",
    domAttributes: {
        style: "visibility:hidden;height:0px;width:0px;" // MUST BE visibility:hidden
    },
    getNode: function() {
        this.hasNode();
        return this.node;
    }
});

enyo.kind({
    name: "ImagePicker",
    kind: enyo.ModalDialog,
    events: {
        onchange: "",
        onCancel: ""
    },
    properties: {
        fileLabel: ""
    },
    components: [
        {
            kind: "UploaderForm",
            components: [
                {
                    kind: "ImageInput",
                    onChange: "changed",
                    onclose: "close",
                    name: "input"
                },/*
                {
                    kind: "UploaderInput",
                    nodeName: "consumerKey",
                    value: Common.twitter_api.consumerKey
                },
                {
                    kind: "UploaderInput",
                    nodeName: "consumerSecret",
                    value: Common.twitter_api.consumerSecret
                }*/
            ],
            name: "form"
        },
        {
            className: "enyo-item enyo-first",
            content: $L("Choose")
        },
        {
            className: "enyo-item enyo-last",
            components: [
                {
                    kind: enyo.Button,
                    caption: $L("Cancel "),
                    onclick: "cancel"
                }
            ]
        }
    ],
    changed: function(inSender, inValue) {
    	this.log("inValue: " + inValue);
        this.doChange(inValue);
        this.close();
    },
    cancel: function() {
        this.close();
        this.doCancel();
    },
    /*
    API compliance with the built-in webOS FilePicker
    --
    pickFile()
    --
    open the file picker
    */
    pickFile: function() {
        this.openAtCenter();
        this.$.input.focus();
//        this.log("this.fileLabel: " + this.fileLabel);
        this.$.input.setNodeName(this.fileLabel);
    }
});