{
    handleClick : function(cmp, event) {
                
        var attributeValue = cmp.get("v.text");
        console.log("current text: " + attributeValue);
        helper.helpLog(cmp);
        
        var target;
        if (event.getSource) {
            // handling a framework component event
            target = event.getSource(); // this is a Component object
            cmp.set("v.text", target.get("v.label"));
        } else {
            // handling a native browser event
            target = event.target.value; // this is a DOM element
            cmp.set("v.text", event.target.value);
        }
    },
}