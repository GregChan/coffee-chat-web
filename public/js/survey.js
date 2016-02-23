$(document).ready(function(){
        $('select').material_select();
        $('.collapsible').collapsible({
            accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
        });
	$('.submit').click(function() {
              var selections = [];
                for(var field in survey.fields){
                    var choice = {};
                    choice["fieldID"] = field.fieldID;
                    choice["choices"] = [];
                    for(var val in field.values){
                        if(field.fieldID == 2){
                            for(var val2 in val.values){
                                if(document.getElementById(val.id).checked){
                                choice["choices"].append(val2.id);
                                }
                            }
                        }
                        else{
                            if(document.getElementById(val.id).checked){
                                choice["choices"].append(val.id);
                            }
                        }
                    }
                    selections.append(choice);
                }
            console.log(selections);
            window.location.href = '/';
    });
});





