enyo.kind({
	name: "GeneralSettings",
	kind: "Component",
	statics: {

		getSettings: function(forceReload) {
		},

		setItem: function(name, value) {
			localStorage.setItem(name, value);
		},

		getItem: function(name, defValue) {
			// this.log("name: " + name + ", defValue: " + defValue);
			var result = localStorage.getItem(name);
			if (result == undefined || result == null || result.trim().length == 0) {
				// this.log("property was not stored");
				localStorage.setItem(name, defValue);
				return defValue;
			}
			// this.log("read property value: " + result );
			return result;
		},

		getBooleanItem: function(name, defValue) {
			// this.log("name: " + name + ", defValue: " + defValue);
			var result = localStorage.getItem(name);
			if (result == undefined || result == null || result.trim().length == 0) {
				// this.log("property was not stored");
				localStorage.setItem(name, defValue);
				return defValue;
			}
			// this.log("read property value: " + result );
			return result == "true" ? true : false
		},

		getAlarmTimeFromSettings: function() {
			if (this.getSettings().bgSyncInterval == "never") {
				return null;
			}
			var pos = this.getSettings().bgSyncInterval.indexOf("S");
			if (pos != -1) {
				return "00:00:" + this.getSettings().bgSyncInterval.substr(0, pos);
			}
			pos = this.getSettings().bgSyncInterval.indexOf("M");
			if (pos != -1) {
				return "00:" + this.getSettings().bgSyncInterval.substr(0, pos) + ":00";
			}
			pos = this.getSettings().bgSyncInterval.indexOf("H");
			if (pos != -1) {
				var str = this.getSettings().bgSyncInterval.substr(0, pos);
				if (str.length < 2) {
					str = "0" + str;
				}
				return str + ":00:00";
			}
			return null;
		},

	},
});
