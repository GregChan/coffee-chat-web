(function() {
    $(document).ready(function() {
        var submitted = false,
            finishedCallback = function() {
                if (submitted == false) {
                    submitted = true;
                } else {
                    window.location.href = "/";
                }
            };
        $('select').material_select();
        $('.collapsible').collapsible({
            accordion: false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
        });

        $('[data-companycode]').click(function(e) {
            $.ajax({
                url: "/cat/community/join",
                method: "PUT",
                data: {
                    communityCode: $('#companyCode').val()
                },
                success: function(data) {
                    console.log(data);
                }
            });
        });

        $('[data-submit]').click(function(e) {
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
                        fieldData.choices = $(this).val();
                    }
                });

                data.data.push(fieldData);
            });

            console.log(data);

            $.ajax({
                type: 'POST',
                url: '/cat/user/community/1/update',
                success: function(data) {
                    Materialize.toast('Success!', 2000);
                    $('[data-save-prompt]').hide();

                    finishedCallback();
                },
                data: data
            });
        });

        $('[data-edit]').hide();
        $('[data-edit-icon]').hide();
        $('[data-survey]').hide();
        $('[data-delete-icon]').hide();

        var hideEdit = function(selector) {
                var parentEditable = $(selector).closest('[data-editable]');
                parentEditable.find('[data-edit]').hide();
                parentEditable.find('[data-display]').show();
            },
            processWorkAndEducationData = function(selector, postData, isEdu) {
                var deleted = 0;
                if ($(selector).is(':hidden')) {
                    deleted = 1;
                }
                var positionElement = $(selector).find('[data-position]');
                var companyElement = $(selector).find('[data-company]');
                if (companyElement.val() != "" && positionElement.val() != "") {
                    postData.positions.push({
                        positionID: positionElement.attr('data-id'),
                        company: companyElement.val(),
                        title: positionElement.val(),
                        isEdu: isEdu,
                        deleted: deleted
                    });
                    postData.companies.push({
                        companyID: companyElement.attr('data-id'),
                        company: companyElement.val()
                    });
                }
            },
            makeEditable = function() {
                $('[data-edit-area]').hover(function(e) {
                    $(this).css('background-color', '#FAFAFA');
                    $(this).find('[data-edit-icon]').show();
                    $(this).find('[data-add-icon]').show();
                    $(this).find('[data-delete-icon]').show();
                }, function(e) {
                    $(this).find('[data-edit-icon]').hide();
                    $(this).find('[data-add-icon]').hide();
                    $(this).find('[data-delete-icon]').hide();
                    $(this).css('background-color', 'white');
                });

                $('[data-edit-icon]').click(function(e) {
                    var parentEditable = $(this).closest('[data-editable]');
                    parentEditable.find('[data-edit]').show();
                    parentEditable.find('[data-display]').hide();
                });

                $('[data-confirm-icon]').click(function(e) {
                    var parentEditable = $(this).closest('[data-editable]');
                    var value = parentEditable.find('[data-edit-input]').val();
                    parentEditable.find('[data-display-value]').html(value);
                    hideEdit(this);
                    $('[data-save-prompt]').show();
                });

                $('[data-cancel-icon]').click(function(e) {
                    var parentEditable = $(this).closest('[data-editable]');
                    var value = parentEditable.find('[data-display-value]').html();
                    parentEditable.find('[data-edit-input]').val(value);
                    hideEdit(this);
                });

                $('[data-delete-icon]').click(function() {
                    var parentEditable = $(this).closest('[data-position-pair]');
                    parentEditable.hide();
                    $('[data-save-prompt]').show();
                });                
            };

        $('[data-add-icon]').click(function() {
            var target = $(this).attr('data-add-icon');
            var type = $(this).attr('data-type');
            var newEditableTemplate = $('[data-edit-template]').clone();
            newEditableTemplate.attr(type, '');
            newEditableTemplate.removeClass('hide');
            newEditableTemplate.removeAttr('data-edit-template');
            newEditableTemplate.find('[data-edit]').show();
            newEditableTemplate.find('[data-display]').hide();
            $('[' + target + ']').append(newEditableTemplate);
            makeEditable();
        });

        $('[data-save]').click(function(e) {
            var postData = {
                companies: [],
                positions: []
            }
            $('[data-work-experience]').each(function() {
                processWorkAndEducationData(this, postData, 0);
            });
            $('[data-education]').each(function() {
                processWorkAndEducationData(this, postData, 1);
            });
            console.log(postData);
            $.ajax({
                type: 'POST',
                url: '/settings',
                data: postData,
                success: function(data) {
                    Materialize.toast('Success!', 2000);
                    $('[data-save-prompt]').hide();

                    finishedCallback();
                }
            });
        });

        $('[data-more]').click(function(e) {
            $('[data-survey]').toggle();
            if ($('[data-survey]').is(':visible')) {
                $('[data-more]').html('SHOW FEWER SETTINGS');
            } else {
                $('[data-more]').html('SHOW MORE SETTINGS');
            }
        });

        makeEditable();
    });
}());