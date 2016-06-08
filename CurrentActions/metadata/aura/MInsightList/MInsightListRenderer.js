({
	render: function(component, helper) {
        var rend = this.superRender();

        var oneHeader = document.getElementById('oneHeader');
        if (!oneHeader) {
            return rend;
        }
        oneHeader.style.backgroundColor='#292731';
        oneHeader.style.transition = 0.5;

        var x = document.getElementsByClassName("toggleNav")[0];
        var sf1_color = x.style.color;
        component.set("v.sf1_color", sf1_color);

        var remove_color_changer = function () {
          x.removeEventListener("click", color_changer);
        };

        var color_changer = function(){
            oneHeader.style.backgroundColor = sf1_color;//component.get("v.sf1_color");
            document.getElementById('oneHeader').style.transition = 0.5;
            remove_color_changer();
        };

        x.addEventListener("click", color_changer);

		return rend;


	}

})