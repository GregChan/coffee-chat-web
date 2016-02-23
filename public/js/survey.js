$(document).ready(function(){
        $.get('/cat/info/1/getSurvey', function(data) {
           survey = data; 
        });
        $('select').material_select();
        $('.collapsible').collapsible({
            accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
        });
	$('.submit').on('click', function() {
              var selections = [];
                for(var i = 0; i < survey.fields.length; i++){
                    var field = survey.fields[i];
                    console.log(field);
                    var choice = {};
                    choice["fieldID"] = field.fieldID;
                    choice["choices"] = [];
                    console.log(choice);
                    if(field.grouped == true){
                        for(var val in field.values){                        
                            for(var val2 in val.values){
                                if(field.displayType == 1){
                                    if(document.getElementById(val.id).checked){
                                        choice["choices"].push(val2.id);
                                    }
                                }
                                if(field.displayType == 2){
                                    if(document.getElementById(val.id).value){
                                        choice["choices"].push(val2.id);
                                    }
                                }
                            }
                        }
                    }
                    else{
                        for(var val in field.values){   
                            if(field.displayType == 1){
                                    if(document.getElementById(val.id).checked){
                                        choice["choices"].push(val2.id);
                                    }
                                }
                                if(field.displayType == 2){
                                    if(document.getElementById(val.id).value){
                                        choice["choices"].push(val2.id);
                                    }
                                }
                        }
                    }
                    console.log(choice);
                    selections.push(choice);
                }
            console.log(selections);
            
            $.post('/cat/info/1/addSurveyData', selections, function(data) {
                console.log(data); 
            }, "json");
    });
    
});





