enyo.kind({
    name: "DateTimeUtils",
    kind: "Component",
    statics: {
        
    	getDaysUntilDate : function ( nextXmas ) {
            var oneMinute = 60 * 1000;
            var oneHour = oneMinute * 60;
            var oneDay = oneHour * 24;
            var today = new Date();
            /*var nextXmas = new Date();
            nextXmas.setMonth(10); // 11 = december, 10 = november, ...
            nextXmas.setDate(11);
            if (today.getMonth() >= 10 && today.getDate() > 11) {
                return 0;
            }*/
            var diff = nextXmas.getTime() - today.getTime();
            diff = Math.floor(diff/oneDay);
            return diff;
        },
        
        days_between : function (date1, date2) {
            // The number of milliseconds in one day
            var ONE_DAY = 1000 * 60 * 60 * 24;
        
            // Convert both dates to milliseconds
            var date1_ms = date1.getTime();
            var date2_ms = date2.getTime();
        
            // Calculate the difference in milliseconds
            var difference_ms = Math.abs(date1_ms - date2_ms);
            
            // Convert back to days and return
            return Math.round(difference_ms/ONE_DAY);
        },
    
        hours_between : function (date1, date2) {
            // The number of milliseconds in one day
            var ONE_DAY_IN_HOURS = 1000 * 60 * 60;
        
            // Convert both dates to milliseconds
            var date1_ms = date1.getTime();
            var date2_ms = date2.getTime();
        
            // Calculate the difference in milliseconds
            var difference_ms = Math.abs(date1_ms - date2_ms);
            
            // Convert back to days and return
            return Math.round(difference_ms/ONE_DAY_IN_HOURS);
        },
        
        minutes_between : function (date1, date2) {
            // The number of milliseconds in one day
            var ONE_DAY_IN_MINUTES = 1000 * 60;
        
            // Convert both dates to milliseconds
            var date1_ms = date1.getTime();
            var date2_ms = date2.getTime();
        
            // Calculate the difference in milliseconds
            var difference_ms = Math.abs(date1_ms - date2_ms);
            
            // Convert back to days and return
            return Math.round(difference_ms/ONE_DAY_IN_MINUTES);
        },
        
        seconds_between : function (date1, date2) {
            
            if (date1 === undefined || date2 === undefined) {
                return 0;
            }
            
            // The number of milliseconds in one day
            var ONE_DAY_IN_SECONDS = 1000;
        
            // Convert both dates to milliseconds
            var date1_ms = date1.getTime();
            var date2_ms = date2.getTime();
        
            // Calculate the difference in milliseconds
            var difference_ms = Math.abs(date1_ms - date2_ms);
            
            // Convert back to days and return
            return Math.round(difference_ms/ONE_DAY_IN_SECONDS);
        },
        
        ms_between : function (date1, date2) {
            
            if (date1 === undefined || date2 === undefined) {
                return 0;
            }
            
            // Convert both dates to milliseconds
            var date1_ms = date1.getTime();
            var date2_ms = date2.getTime();
        
            // Calculate the difference in milliseconds
            var difference_ms = Math.abs(date1_ms - date2_ms);
            
            // Convert back to days and return
            return difference_ms;
        },
        
    },
});

