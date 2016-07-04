({
    doInit : function(component, event, helper) {
        $A.logger.subscribe("INFO", logCustom);
        $A.log('initialized logger');

        function logCustom(level, message, error) {
            console.log(getTimestamp());
            console.log(error);
            console.log(error.stack)
        }

        function getTimestamp() {
            return new Date().toJSON();
        }

    }

})