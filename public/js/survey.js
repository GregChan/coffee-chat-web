$(document).ready(function() {
    $.get('/cat/info/1/getSurvey', function(data) {
        survey = data;
    });
    $('select').material_select();
    $('.collapsible').collapsible({
        accordion: false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });
    
    $('.submit').on('click', function() {
        var fields = $('[data-field]');
        var data = {
            data: []
        };

        $('[data-field]').each(function() {
            var fieldId = $(this).attr('data-field-id'),
                fieldData = {
                    fieldID: fieldId,
                    choices: []
                };
            $(this).find('[data-field-input]').each(function() {
                var type = $(this).attr('type');
                if (type == 'checkbox') {
                    if ($(this).attr('data-input-id') && this.checked) {
                        fieldData.choices.push($(this).attr('data-input-id'));
                    }
                } else if (type == 'select' && $(this).val()) {
                    fieldData.choices.push($(this).val());
                }
            })

            data.data.push(fieldData);
        });

        $.ajax({
            type: 'POST',
            url: '/cat/user/1/addSurveyData',
            success: function() {
                alert('success');
            },
            data: data
        });
    });
});