var flag = 0;
var ajax_called = 0;
var a_b_traveller = 0;
/**
 * Validation for Traveler type value, should support 'Self' value only once.
 */
jQuery(document).on("change", ".field--name-field-traveler-type select.form-select", function() {
    var element = jQuery('select[name$="field_traveler_type]"]');
    var travelerType = jQuery(this).val();
    var selfType = 0;
    for(var i=0; i<element.length; i++) {
        var select = jQuery('select[name="field_travelers_information[' + i + '][subform][field_traveler_type]"');
        if(travelerType == select.val() && travelerType == 'Self') {
            selfType++;
        }
    }
    if (selfType > 1) {
        jQuery(this).val('_none').trigger('change');
        alert('Sorry! you cant use Traveler type "Self" more than once.');
        return false;
    }
});
jQuery(document).ready(function($) {
    /*Hide order coloumn*/
    $('.tabledrag-hide').hide();
    $('#edit-revision-information').hide();
    internationalFieldsValidation();
    $(".field--name-field-visa-availability select.form-select").each(function() {
        checkVisaValidity($(this));
    });
   
    $('.field--name-field-travel-type select.form-select').change(function() {
        var selectedTravelType = $('.field--name-field-travel-type select.form-select').val();
        if (selectedTravelType == 'International') {
            $('.field--name-field-justification-travel-mode textarea.form-textarea').val("");
            $('.field--name-field-justification-travel-mode').hide();
        }
        else {
            $('.field--name-field-justification-travel-mode').show();
        }
        updated_travel_type(selectedTravelType);
    });
    var travel_type = $(".form-item-field-travel-type select.form-select").val();
    var mode_of_travel = $('.field--name-field-mode-of-travel select.form-select').val();
    $('.field--name-field-traveler-type select.form-select').each(function() {
        var traveller_type = $(this).val();
        var traveller_band;
        if (traveller_type == "Self") {
            traveller_band = drupalSettings.emp_band;
            check_band(traveller_band, event);
        } else {
            if (traveller_type == "Others") {
                var other_emp_id = $(this).parent().parent().siblings(".field--name-field-traveler-employee-id").find(".form-text").val();
                var field_index = $(this).parent().parent().siblings(".field--name-field-traveler-employee-id").find(".form-text");
                ajax_get_other_emp_band(other_emp_id, event, field_index);
            }
        }
    });

    $('#node-travel-request-form #edit-submit,.node-travel-request-edit-form  .form-submit').click(function(event) {        
        var textFieldValidation1 = $(".form-text.required, .form-textarea.required, .form-number.required, .form-date.required, .form-select.required");
        for (var i = 0; i < textFieldValidation1.length; i++) {
            var obj = textFieldValidation1.eq(i);
            textFields(obj);
        }

        $(".form-date.required").each(function() {
            var dateObjEvent = $(this);
            dateChangeEvent(dateObjEvent);
        });
        $(".form-select.required").each(function() {
            var ItinDetails = $(this);
            checkChangeEvent(ItinDetails);
        });
        var travel_type = $(".form-item-field-travel-type select.form-select").val();
        var mode_of_travel = $('.field--name-field-mode-of-travel select.form-select').val();
        
        $('.field--name-field-traveler-type select.form-select').each(function() {
            var traveller_type = $(this).val();
            var traveller_band;
            if (traveller_type == "Self") {
                traveller_band = drupalSettings.emp_band;
                check_band(traveller_band, event);
            } else if (traveller_type == "Others") {
                var other_emp_id = $(this).parent().parent().siblings(".field--name-field-traveler-employee-id").find(".form-text").val();
                var field_index = $(this).parent().parent().siblings(".field--name-field-traveler-employee-id").find(".form-text");
                ajax_get_other_emp_band(other_emp_id, event, field_index);
            }
        });
        if (travel_type == "International") {
            jQuery(".field--name-field-visa-availability .form-select.required").each(function() {
                var visa_availability_status = $(this).val();
                if (visa_availability_status == '_none') {
                    flag = 1;
                    // Validation for visa availability;
                    return false;
                } else if (visa_availability_status == 'Yes') {
                    var visa_validity = jQuery(this).parent().parent().siblings('div.field--name-field-visa-validity').find('input.form-date').val();
                    if (visa_validity == '') {
                        // Validation for visa validity;
                        flag = 1;
                        return false;

                    } else {
                        flag = 0;
                        return true;
                    }
                }
                else {
                    flag = 0;
                }
            });
        }

        if (flag == 1 || jQuery("div.form-wrapper span.error").length) {
            console.log("class name " + jQuery("div.form-wrapper span.error").parent().parent().prop("className") + " id " + jQuery("div.form-wrapper span.error").parent().parent().prop("id"));
            event.preventDefault();
            alert("Please fill all mandatory fields");
            return false;
        } else {
            return true;
        }
    });

    $("body").on("blur", ".form-text.required, .form-textarea.required, .form-number.required, .form-date.required, .form-select.required", function(e) {
        var textFieldObj = $(e.target);
        textFields(textFieldObj);
    });

    $('.region-header a, .region-header-first a').on("click", function(e) {
        if (drupalSettings.corporate_lite.resetforce == true) {
            alert("Please reset password.");
            e.preventDefault();
            return false;
        }
    });
    function textFields(_textFieldObj) {
        _textFieldObj.parent().find('span.error').remove();
        _textFieldObj.removeClass('applyBorder');
        var txtval = _textFieldObj.val();
        //Fix for Travel Desk Admin, when departure date <14 OR <7 days and they modifies city name, then static "NA" added in "Justification For Policy Deviation" (to prevent validation alert)
        var justificationForAdv = jQuery('textarea[name$="[field_justification_for_advance_][0][value]"]').length;
        for(var i=0; i<justificationForAdv; i++) {
            var justificationForAdvElement = jQuery('textarea[name="field_itinerary[' +i+ '][subform][field_justification_for_advance_][0][value]"]');
            if((typeof drupalSettings.travel_desk_administrator !== "undefined") && drupalSettings.travel_desk_administrator == 'true' && justificationForAdvElement.val() =='' && justificationForAdvElement.is(':visible') == false ) {
                justificationForAdvElement.val('NA');
            }
        }
        //End
        if ((txtval.length < 1 || txtval == '_none')) {
            _textFieldObj.after('<span class="error">This field is required</span>');
            _textFieldObj.addClass('applyBorder');
            flag = 1;

        } else if (txtval && txtval.length >= 1) {
            _textFieldObj.parent().find('span.error').remove();
            _textFieldObj.removeClass('applyBorder');
            flag = 0;
        }
    }
    

    $("body").on("change", ".form-date.required", function(e) {
        var dateObject = $(e.target);
        dateChangeEvent(dateObject);
    });

    function dateChangeEvent(_dateObject) {
        _dateObject.parent().find('span.error').remove();
        _dateObject.removeClass('applyBorder');

        if (_dateObject.val().length < 1) {
            if (_dateObject.parents('.field--name-field-date-of-reporting-to-clien').length) {
                _dateObject.parent().next().after('<span class="error">This field is required</span>');
            } else {
                _dateObject.after('<span class="error">This field is required</span>');
            }
            _dateObject.addClass('applyBorder');
            flag = 1;
        } else if (_dateObject.val().length >= 1) {
            _dateObject.parent().find('span.error').remove();
            _dateObject.removeClass('applyBorder');
            flag = 0;
        }
    }
    ;

    $("body").on("change", ".form-select.required", function(e) {
        var currentObject = $(e.target);
        checkChangeEvent(currentObject);
    });

    function checkChangeEvent(_currentObject) {
        _currentObject.parent().find('span.error').remove();
        _currentObject.removeClass('applyBorder');

        if ((_currentObject[0].selectedIndex < 1) && (_currentObject[0].options[_currentObject[0].selectedIndex] && _currentObject[0].options[_currentObject[0].selectedIndex].value === '_none')) {

            _currentObject.after('<span class="error">This field is required</span>');
            _currentObject.addClass('applyBorder');
            flag = 1;
        } else if (_currentObject[0].selectedIndex >= 1) {
            _currentObject.parent().find('span.error').remove();
            _currentObject.removeClass('applyBorder');
            flag = 0;
        }
    }    

    $("#edit-field-travel-categories").on("change", function() {
        travelCategory();
    });
    function travelCategory() {
        var tra_caty = $("#edit-field-travel-categories")[0].selectedIndex;
        $('#edit-field-travel-categories').removeClass('applyBorder');
        $('#edit-field-travel-categories').next().remove();
        if (tra_caty < 1) {
            $('#edit-field-travel-categories').after('<span class="error">This field is required</span>');
            $('#edit-field-travel-categories').addClass('applyBorder');
        }
        else if (tra_caty >= 1) {
            $('#edit-field-travel-categories').next().remove();
            $('#edit-field-travel-categories').removeClass('applyBorder');
        }
    }

    $('#block-corporate-lite-content #user-form #edit-submit').click(function(e) {
        EmpEmailAddress();
    });

    $(".form-type-email input").on("keyup", function() {
        EmpEmailAddress();
    });

    function EmpEmailAddress() {
        var email_add = $(".form-type-email #edit-mail").val();
        $('#edit-mail').removeClass('applyBorder');
        $('#edit-mail').next().remove();
        if (email_add.length < 1) {
            $('#edit-mail').after('<span class="error">This field is required</span>');
            $('#edit-mail').addClass('applyBorder');
        } else {
            var regEx = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i;
            var validEmail = regEx.test(email_add);
            if (!validEmail) {
                $('#edit-mail').after('<span class="error">Enter a valid email</span>');
                $('#edit-mail').addClass('applyBorder');
            }
        }
    }

    if ($("div.field--name-field-from-country input.form-autocomplete").length) {
        $("div.field--name-field-from-country input.form-autocomplete").autocomplete({
            change: function (event, ui) {
                if (ui.item == null) {
                    //here is null if entered value is not match in suggestion list
                    $(this).val((ui.item ? ui.item.id : ""));
                }
            }
        });
    }
    if ($("div.field--name-field-to-country input.form-autocomplete").length) {
        $("div.field--name-field-to-country input.form-autocomplete").autocomplete({
            change: function (event, ui) {
                if (ui.item == null) {
                    //here is null if entered value is not match in suggestion list
                    $(this).val((ui.item ? ui.item.id : ""));
                }
            }
        });
    }

    $(".form-item-field-travel-type select.form-select").on("change", function() {
        var travel_type = $(this).val();
        var mode_of_travel = $('#edit-field-mode-of-travel').val();
        var emp_band = drupalSettings.emp_band;
        if (travel_type == "International") {
            $('#edit-field-mode-of-travel option:selected').removeAttr('selected');
            $('#edit-field-mode-of-travel').val("Flight");
            $('#edit-field-mode-of-travel option[value="Flight"]').attr('selected', 'selected');
            $('#edit-field-mode-of-travel option[value="Bus"]').attr("disabled", "disabled");
            $('#edit-field-mode-of-travel option[value="Train"]').attr("disabled", "disabled");
        }
        else if (travel_type == "Domestic") {
            jQuery("div.field--name-field-from-country input.form-autocomplete").each(function() {
                var from_country = $(this).val();
                if (from_country != '') {
                    jQuery(this).parent().parent().siblings('div.field--name-field-to-country').find('input.form-autocomplete').val(from_country);
                }
            });

            $('#edit-field-mode-of-travel option[value="Bus"]').attr('disabled', false);
            $('#edit-field-mode-of-travel option[value="Train"]').attr('disabled', false);
            if (!jQuery("form.node-travel-request-edit-form.node-form").length) {
                $('#edit-field-mode-of-travel option:selected').removeAttr('selected');
                if (emp_band == 'a' || emp_band == 'b' || emp_band.match('/a/') || emp_band.match('/b/')) {
                    $('#edit-field-mode-of-travel option[value="Train"]').attr('selected', 'selected');
                }
                else if (emp_band >= 'c') {
                    $('#edit-field-mode-of-travel option[value="Flight"]').attr('selected', 'selected');
                }
            }
        }
    });


    document.addEventListener('invalid', (function() {
        return function(e) {
            //prevent the browser from showing default error bubble/ hint
            e.preventDefault();
            // optionally fire off some custom validation handler
            // myvalidationfunction();
        };
    })(), true);

    jQuery("body").find('.form-autocomplete').each(function() {
        var val = jQuery(this).val();
        var match = val.match(/\((.*?)\)$/);
        if (match) {
            jQuery(this).data('real-value', val);
            jQuery(this).val(val.replace(' ' + match[0], ''));
        }
    });
    if (jQuery("body").find('.node-travel-request-edit-form')) {
        var selectedTravelWay = $('.field--name-field-travel-way select.form-select').val();
        if (selectedTravelWay == 'Multi-City') {
            jQuery("input.field-add-more-submit[name=field_itinerary_multicity_add_more]").show();
        }
        if (selectedTravelWay == 'Multi-City' || selectedTravelWay == 'One way') {
            jQuery('.field--name-field-return-date').hide();
            jQuery('.field--name-field-return-date input.form-date').prop('required', false).removeClass('required applyBorder').val("");
            jQuery('.field--name-field-return-date').find("h4").removeClass('label form-required');
            jQuery('.field--name-field-return-date input.form-date').parent().find("span.error").remove();
        } else {
            jQuery('.field--name-field-return-date').show();
            jQuery('.field--name-field-return-date input.form-date').prop('required', true).addClass('required');
            jQuery('.field--name-field-return-date').find("h4").addClass('label form-required');
        }
    }

//Passport field validation
    $(document).on('change', '.field--name-field-travel-type select.form-select', function(e) {
        internationalFieldsValidation();
    });

    function internationalFieldsValidation() {
        if ($('.field--name-field-travel-type select.form-select').val() == 'International') {
            $(".field--name-field-passport-number input.form-text").prop('required', true).addClass('required');
            $(".field--name-field-passport-number").find("label").addClass('label form-required');

            $(".field--name-field-passport-validity input.form-date").prop('required', true).addClass('required');
            $(".field--name-field-passport-validity").find("h4").addClass('label form-required');

            $(".field--name-field-visa-availability select.form-select").prop('required', true).addClass('required');
            $(".field--name-field-visa-availability").find("label").addClass('label form-required');
        } else {
            $(".field--name-field-passport-number input.form-text").prop('required', false).removeClass('required');
            $(".field--name-field-passport-number").find("label").removeClass('form-required');

            $(".field--name-field-passport-validity input.form-date").prop('required', false).removeClass('required');
            $(".field--name-field-passport-validity").find("label").removeClass('label form-required');

            $(".field--name-field-visa-availability select.form-select").prop('required', false).removeClass('required');
            $(".field--name-field-visa-availability").find("label").removeClass('form-required');

            $(".field--name-field-visa-validity input.form-date").prop('required', false).removeClass('required applyBorder');
            $(".field--name-field-visa-validity").find("h4").removeClass('form-required');
            $(".field--name-field-visa-validity").find('span.error').remove()
        }
    }

    $(document).on('change', '.field--name-field-visa-availability select.form-select', function(e) {
        checkVisaValidity($(this));
    });
    function ajax_get_other_emp_band(otherEmp_id, event, field_index) {
        var traveller_band = "";

        var dfd = jQuery.Deferred();
        var base_url = drupalSettings.base_url;
        (jQuery).ajax({
            type: 'POST',
            url: base_url + "/check_others_empid",
            async: false,
            dataType: "json",
            data: {"emp_id": otherEmp_id},
            beforeSend: function() {
                console.log("before ajax");
            },
            success: function(data) {
                if (data[0] == "invalid_emp_id") {
                    flag = 1;
                    field_index.addClass("applyBorder");
                    field_index.after('<span class="error">Invalid Employee ID</span>');
                    return false;
                } else {
                    flag = 0;
                    field_index.removeClass("applyBorder");
                    field_index.parent().find('span.error').remove();
                    check_band(data[0].toLowerCase(), event);
                }
            },
            complete: function(data) {
                return flag;
            }
        });

        console.log(traveller_band);
    }
    ;
    function check_band(traveller_band, event) {
        if (traveller_band == "invalid_emp_id") {
            flag = 1;
            alert("Invalid Employee ID");
            return false;
        }
        var travel_type = $(".form-item-field-travel-type select.form-select").val();
        var mode_of_travel = $('.field--name-field-mode-of-travel select.form-select').val();
        if ((travel_type == 'Domestic' && mode_of_travel == "Flight") && $('.field--name-field-justification-travel-mode textarea.form-textarea').val() == "") {
            band = traveller_band.charAt(0);

            if (band == 'a' || band == 'b') {
                $('.field--name-field-justification-travel-mode textarea.form-textarea').prop("required", "required").addClass("required applyBorder");
                $('.field--name-field-justification-travel-mode textarea.form-textarea').after('<span class="error">This field is required</span>');

                flag = 1;
                a_b_traveller = 1;
                return false;
            }
            else {
                $('.field--name-field-justification-travel-mode textarea.form-textarea').prop("required", false).removeClass("required applyBorder");
                $('.field--name-field-justification-travel-mode textarea.form-textarea').parent().find("span.error").remove();
            }
            ajax_called = 1;
        }
    }
});

function checkVisaValidity(e) {
    var visa_availability = jQuery(e).val();

    if (visa_availability == "Yes") {
        jQuery(e).parent().parent().siblings('.field--name-field-visa-validity').find('input.form-date').attr("disabled", false).addClass('required');
        jQuery(e).parent().parent().siblings('.field--name-field-visa-validity').find("h4").addClass('label form-required');

    }
    else {
        jQuery(e).parent().parent().siblings('.field--name-field-visa-validity').find('input.form-date').attr("disabled", true).prop('required', false).removeClass('required');
        jQuery(e).parent().parent().siblings('.field--name-field-visa-validity').find("h4").removeClass('form-required');
        /* jQuery(e).parent().parent().siblings('.field--name-field-visa-validity').find('h4').find('span.visa_validity_required.error').remove();*/
        jQuery(e).parent().parent().siblings('.field--name-field-visa-validity').find('span.error').remove();
        jQuery(e).parent().parent().siblings('.field--name-field-visa-validity').find('input.form-date').removeClass('applyBorder');
    }
}
