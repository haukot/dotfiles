enyo.kind({
    name: "SN.VirtualList",
    kind: enyo.VirtualList,

    components: [
        {flex: 1, name: "scroller", kind: (Platform.isTablet() ? enyoextras.ScrollBarsScroller : enyo.BufferedScroller), rowsPerPage: this.rowsPerScrollerPage, onGenerateRow: "generateRow", onAdjustTop: "adjustTop", onAdjustBottom: "adjustBottom", components: [
            {name: "list", kind: enyo.RowServer, onSetupRow: "setupRow"}
        ]}
    ]
});    
    