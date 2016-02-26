$(document).ready(function() {
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
            url: '/cat/user/community/1/update',
            success: function(data) {
                window.location.href =  data.url
            },
            data: data
        });
    });
});