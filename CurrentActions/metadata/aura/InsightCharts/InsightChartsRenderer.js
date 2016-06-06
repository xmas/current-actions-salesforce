({
	render: function(component, helper) {
        var ret = this.superRender();
        console.log('now the renderer is getting called');
        helper.renderCharts(component);
        return ret;
    }
})