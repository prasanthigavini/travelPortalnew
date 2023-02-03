var diffDays = 0;
jQuery(document).ready(function($) {
    var roles = drupalSettings.roles;

    $(window).scroll(function() {
        if ($(this).scrollTop() != 0) {
            $(".to-top").addClass("show");
        } else {
            $(".to-top").removeClass("show");
        }
    });

    $(document).on('change focusout', '.field--name-field-date-of-reporting-to-clien input.form-date', function(e) {
        var curDate = new Date();
        var flag = 1;
        var today = new Date();
        var notvalid = 0;
        var present_time = Math.abs(today.getTime());

        var reporting_date = new Date($(this).val());
        var reporting_time = Math.abs(reporting_date.getTime());
        if (!isValidDate($(this).val())) {
            flag = 0;
        }
        var travel_way = $(".field--name-field-travel-way .form-select").val();
        var departure_date = $(this).parents(".field--name-field-date-of-reporting-to-clien").siblings(".field--name-field-departure-date").find(".form-date").val();

        var date2 = new Date(departure_date);
        var dep_time = Math.abs(date2.getTime());
        var current_time = Math.abs(curDate.getTime());

        if ((reporting_time < dep_time) || (notvalid === 1)) {
            $(this).parent().parent().parent().find('span.error').remove();
            $(this).parent().parent().after('<span class="error custom-error">Date of reporting/Return Date cannot be prior to Date of Travel</span>');
            $(this).focus();
            flag = 0;
        } else {
            $(this).parent().parent().parent().find('span.error').remove();
        }

        if (flag == 0) {
            $(this).val('');
            $(this).parent().parent().find(".form-time").val('');
            return false;
        }
    });
    $(document).on('change focusout', '.field--name-field-return-date input.form-date', function(e) {
        var flag = 1;
        var today = new Date();
        var present_time = Math.abs(today.getTime());
        var return_date = new Date($(this).val());
        var return_time = (return_date != "") ? Math.abs(return_date.getTime()) : "";

        if (!isValidDate($(this).val())) {
            flag = 0;
        }
        if(flag != 0 && isPastDate(new Date($(this).val())) === true) {
            $(this).parent().parent().parent().find('span.error').remove();
            $(this).parent().parent().after('<span class="error custom-error">Return Date cannot be prior to Current Date</span>');
            $(this).focus();
            flag = 0;
            $(this).val('');
            return false;
        }
        
        var travel_way = $(".field--name-field-travel-way .form-select").val();
        var departure_date = $(this).parents(".field--name-field-return-date").siblings(".field--name-field-departure-date").find(".form-date").val();
        var date2 = new Date(departure_date);

        var dep_time = (date2 != "") ? Math.abs(date2.getTime()) : "";
        var reporting_date = new Date($(this).parents(".field--name-field-return-date").siblings(".field--name-field-date-of-reporting-to-clien").find(".form-date").val());
        var reporting_time = (reporting_date != "" ) ? Math.floor(reporting_date.getTime()) : "";
        
        if (travel_way == 'Round trip' || travel_way == '_none') {
            //return date must be > reporting to client date
            if (((return_time != "" && dep_time != "") && (return_time < dep_time))) {
                $(this).parent().parent().parent().find('span.error').remove();
                $(this).parent().parent().after('<span class="error custom-error">Date of Return cannot be prior to Date of Travel</span>');
                $(this).focus();
                flag = 0;
            } else if (((reporting_time != "" && return_time != "") && ( reporting_time > return_time))) {
                $(this).parent().parent().parent().find('span.error').remove();
                $(this).parent().parent().after('<span class="error custom-error">Date of Return should be greater than Reporting to client date</span>');
                $(this).focus();
                flag = 0;
            } else {
                $(this).parent().parent().parent().find('span.error').remove();
            }
        }
        if (flag == 0) {
            $(this).val('');
            $(this).parent().parent().find(".form-time").val('');
            return false;
        }
    });
    
    $(document).on('change focusout', '.field--name-field-passport-validity input.form-date', function(e) {
        var passport_validity_date = new Date($(this).val());
        //prevent to select past dates
        if(isPastDate(passport_validity_date) === true) {
            $(this).parent().parent().parent().find('span.error').remove();
            $(this).parent().parent().after('<span class="error custom-error">Passport Validity Date cannot be prior to Current Date</span>');
            //$(this).focus();
            $(this).val('');
            return false;
        } else {
            $(this).parent().parent().parent().find('span.error').remove();
        }
    });
    
    $(document).on('change focusout', '.field--name-field-visa-validity input.form-date', function(e) {
        var visa_validity_date = new Date($(this).val());
        //prevent to select past dates
        if(isPastDate(visa_validity_date) === true) {
            $(this).parent().parent().parent().find('span.error').remove();
            $(this).parent().parent().after('<span class="error custom-error">Visa Validity Date cannot be prior to Current Date</span>');
            //$(this).focus();
            $(this).val('');
            return false;
        } else {
            $(this).parent().parent().parent().find('span.error').remove();
        }
    });
    
    $(document).on('change focusout', '.field--name-field-departure-date input.form-date', function(e) {
        var flag = 1;
        var departure_date = new Date($(this).val());
        var dep_time = Math.abs(departure_date.getTime());
        var today = new Date();
        //prevent to select past dates
        if(isPastDate(departure_date) === true) {
            $(this).val('');
            $(this).parent().parent().parent().find('span.error').remove();
            $(this).parent().parent().after('<span class="error custom-error">Departure Date cannot be prior to Current Date</span>');
            //$(this).focus();
            return false;
        } else {
            $(this).parent().parent().parent().find('span.error').remove();
        }
        //end.
        
        if (!isValidDate($(this).val())) {
            flag = 0;
            //$(this).parent().parent().after('<span class="error custom-error">Departure Date is invalid </span>');		
        }

        var travel_way = $(".field--name-field-travel-way .form-select").val();
        var return_date = $(this).parents(".field--name-field-departure-date").siblings(".field--name-field-return-date").find(".form-date").val();
        var date2 = new Date(return_date);

        var return_time = Math.abs(date2.getTime());
        if (travel_way == 'Round trip' || travel_way == '_none') {
            if (return_time < dep_time) {
                $(this).after().find('span.error').remove();
                $(this).parent().parent().after('<span class="error custom-error">Date of Return Date cannot be prior to Date of Travel</span>');
                $(this).focus();
                flag = 0;
            }
            else {
                $(this).parent().parent().parent().find('span.error').remove();
            }
        }
        if (flag == 0) {
            $(this).val('');
            $(this).parent().parent().find(".form-time").val('');
            return false;
        }
    });

    $(".reports-page .bef-exposed-form .form-item-field-departure-date-value-min label").html("From Date (<span class='small-char'>Date Of Travel</span>)");
    $(".field-sub-travel-category .section3 .form-type-select").each(function() {
        if ($(this).css("display") != 'none') {
            $(this).addClass("confirm-val-select");
        }
    });
    $(".form-item-travel-category").change(function() {
        $(".field-sub-travel-category .section3 .form-type-select").each(function() {
            if ($(this).css("display") != 'none') {
                $(this).addClass("confirm-val-select");
            } else {
                $(this).removeClass("confirm-val-select");
            }
        });
    });
    $(".to-top").click(function() {
        $("body,html").animate({scrollTop: 0}, 800);
    });

    $(document).on('blur', '.field--name-field-departure-date input.form-date', function(e) {
        var if_custom_error = $('.field--name-field-departure-date').find('span.custom-error');
        if (if_custom_error.length > 0) {
            $(this).next('.error').hide();
        }
    });

    $('.form-item-field-departure-date-value-max label').html("To Date");

    $('.field--name-field-justification-for-advance-').hide();
    $('#edit-field-itinerary-0-top-links-remove-button, #edit-field-itinerary-add-more-add-more-button-multicity').hide();

    $('.field--name-field-travel-way select.form-select').change(function() {
        var selectedTravelWay = $(this).val();
        if (selectedTravelWay != 'Multi-City') {
            jQuery('#edit-field-itinerary-0-top-links-remove-button, #edit-field-itinerary-add-more-add-more-button-multicity').hide();
            jQuery(".field--name-field-itinerary tbody > tr.draggable.paragraph-type--multicity:not(:first-child)").hide();

            var tbl_trs = jQuery(".field--name-field-itinerary").find('tbody').find('tr').not(':first-child');
            jQuery(tbl_trs).each(function(index, tr) {
                jQuery(tr).find('input[value="Remove"]').trigger('mousedown');
                jQuery(tr).find('input[value="Confirm removal"]').trigger('mousedown');
            });
            jQuery("input.field-add-more-submit[name=field_itinerary_multicity_add_more]").hide();
        } else {
            jQuery('#edit-field-itinerary-0-top-links-remove-button, #edit-field-itinerary-add-more-add-more-button-multicity').show();
            jQuery(".field--name-field-itinerary tbody > tr.draggable.paragraph-type--multicity:not(:first-child)").show();
            jQuery("input.field-add-more-submit[name=field_itinerary_multicity_add_more]").show();
        }
        if (selectedTravelWay == 'Multi-City' || selectedTravelWay == 'One way') {
            jQuery('.field--name-field-return-date').hide();
            jQuery('.field--name-field-return-date input.form-date').prop('required', false).removeClass('required applyBorder');
            jQuery('.field--name-field-return-date').find("h4").removeClass('form-required');
            jQuery('.field--name-field-return-date input.form-date').parent().find("span.error").remove();
        } else if (selectedTravelWay == "Round trip") {
            jQuery('.field--name-field-return-date').show();
            jQuery('.field--name-field-return-date input.form-date').prop('required', true).addClass('required');
            jQuery('.field--name-field-return-date').find("h4").addClass('label form-required');
        } else {
            jQuery('.field--name-field-return-date').show();
            jQuery('.field--name-field-return-date input.form-date').prop('required', false).removeClass('required applyBorder');
            jQuery('.field--name-field-return-date').find("h4").removeClass('form-required');
            jQuery('.field--name-field-return-date input.form-date').parent().find("span.error").remove();
        }
    });

    $('#edit-project-name, #edit-client-name, #edit-travel-category, #edit-select-category, #edit-bill-category, #edit-nonbill-category').hide();
    $('#edit-bill-emp, #edit-departure-date, #edit-return-date, #edit-reporting-datetime').hide();
    $(".content-moderation-entity-moderation-form .section3").hide();
    $(".field-project-name div.form-inline-field, .field-client-name div.form-inline-field, .field-travel-category div.form-inline-field, .field-sub-travel-category div.form-inline-field, .field-departure-date div.form-inline-field, .field-return-date div.form-inline-field, .field-reporting-date div.form-inline-field").after('<span class="field-check-review section4"><span style="cursor: pointer" class="editField" >Edit </span><input type="checkbox" value="1" class="editFieldCheckbox input-check-val" /></span>');

    $('.editField').on('click', function() {
        $(this).parent().parent().find(".section2").hide();
        $(this).parent().parent().find(".section3").show();
        // Now the div itself as an object is $(this)
        var prevElement = $(this).parent().siblings(".field__item").text();
        if ($(this).parent().parent().hasClass('showInput')) {
            $(this).parent().parent().removeClass('showInput');
            $(this).parent().siblings(".field__item").show();
            if ($(this).parent().parent().hasClass('field-project-name')) {
                $('#edit-project-name').hide();
            }
            if ($(this).parent().parent().hasClass('field-client-name')) {
                $('#edit-client-name').hide();
            }
            if ($(this).parent().parent().hasClass('field-travel-category')) {
                $('#edit-travel-category').hide();
            }
            if ($(this).parent().parent().hasClass('field-sub-travel-category')) {
                $('#edit-select-category').hide();
                $('#edit-bill-category').hide();
                $('#edit-nonbill-category').hide();
                $('#edit-bill-emp').hide();
            }
            if ($(this).parent().parent().hasClass('field-departure-date')) {
                $('#edit-departure-date').hide();
            }
            if ($(this).parent().parent().hasClass('field-return-date')) {
                $('#edit-return-date').hide();
            }
            if ($(this).parent().parent().hasClass('field-reporting-date')) {
                $('#edit-reporting-datetime').hide();
            }
        } else {
            if ($(this).parent().parent().hasClass('field-project-name')) {
                $(this).parent().parent().addClass('showInput');
                $(this).parent().parent().find("div.section3").addClass("data-field-width");
                $('#edit-project-name').show();
                $(this).css({"opacity": "0.4", "pointer-events": "none", "cursor": "default", "text-decoration": "none", "user-select": "none"});
                $(this).parent().siblings(".field__item").hide();
            }
            if ($(this).parent().parent().hasClass('field-client-name')) {
                $(this).parent().parent().addClass('showInput');
                $(this).parent().parent().find("div.section3").addClass("data-field-width");
                $('#edit-client-name').show();
                $(this).css({"opacity": "0.4", "pointer-events": "none", "cursor": "default", "text-decoration": "none", "user-select": "none"});
                $(this).parent().siblings(".field__item").hide();
            }
            if ($(this).parent().parent().hasClass('field-travel-category')) {
                $(this).parent().parent().addClass('showInput');
                $(this).parent().parent().find("div.section3").addClass("data-field-width");
                $('#edit-travel-category').show();
                $(this).css({"opacity": "0.4", "pointer-events": "none", "cursor": "default", "text-decoration": "none", "user-select": "none"});
                $(this).parent().siblings(".field__item").hide();
            }
            if ($(this).parent().parent().hasClass('field-sub-travel-category')) {
                $(this).parent().parent().addClass('showInput');
                $(this).parent().parent().find("div.section3").addClass("data-field-width");
                $('#edit-select-category').show();
                $('#edit-bill-category').show();
                $('#edit-nonbill-category').show();
                $('#edit-bill-emp').show();
                $(this).css({"opacity": "0.4", "pointer-events": "none", "cursor": "default", "text-decoration": "none", "user-select": "none"});
                $(this).parent().siblings(".field__item").hide();
            }
            if ($(this).parent().parent().hasClass('field-departure-date')) {
                $(this).parent().parent().addClass('showInput');
                $(this).parent().parent().find("div.section3").addClass("data-field-width");
                $('#edit-departure-date').show();
                $(this).css({"opacity": "0.4", "pointer-events": "none", "cursor": "default", "text-decoration": "none", "user-select": "none"});
                $(this).parent().siblings(".field__item").hide();
            }
            if ($(this).parent().parent().hasClass('field-return-date')) {
                $(this).parent().parent().addClass('showInput');
                $(this).parent().parent().find("div.section3").addClass("data-field-width");
                $('#edit-return-date').show();
                $(this).css({"opacity": "0.4", "pointer-events": "none", "cursor": "default", "text-decoration": "none", "user-select": "none"});
                $(this).parent().siblings(".field__item").hide();
            }
            if ($(this).parent().parent().hasClass('field-reporting-date')) {
                $(this).parent().parent().addClass('showInput');
                $(this).parent().parent().find("div.section3").addClass("data-field-width");
                $('#edit-reporting-datetime').show();
                $(this).css({"opacity": "0.4", "pointer-events": "none", "cursor": "default", "text-decoration": "none", "user-select": "none"});
                $(this).parent().siblings(".field__item").hide();
            }
        }
    });
//content moderation form validation
    $(".check-all-confirm").attr("data-type", "check");
    $(".check-all-confirm").click(function() {
        if ($(".check-all-confirm").attr("data-type") === "check") {
            var flag = 0;
            $(this).parent().parent().parent().parent().find(".input-check-val").each(function() {
                if ($(this).parent().parent().find(".required :input").first().val() == "") {
                    flag = 1;
                    $(this).parent().parent().find(".required :input").first().focus();
                }
                if ($(this).parent().parent().find(".form-item-travel-category :input").first().val() == "0") {
                    flag = 1;
                    $(this).parent().parent().find(":input").first().focus();
                }
                if ($(this).parent().parent().find(".confirm-val-select :input").first().val() == "0") {
                    flag = 1;
                    $(this).parent().parent().find(".confirm-val-select :input").first().focus();
                }
            });
            if (flag == 0) {
                $(this).addClass("all-active");
                $(this).parent().parent().parent().parent().find(".input-check-val").prop("checked", true);
                $(".check-all-confirm").attr("data-type", "uncheck");
                $(".check-all-confirm").html("Unselect All");
            } else {
                alert("Please fill all values");
                return false;
            }
        } else {
            $(this).removeClass("all-active");
            $(this).parent().parent().parent().parent().find(".input-check-val").prop("checked", false);
            $(".check-all-confirm").attr("data-type", "check");
            $(".check-all-confirm").html("Select All");
        }
    });

    $(".input-check-val").each(function() {
        $(this).click(function() {
            if ($(this).parent().parent().find(":input[name!='client_name']").first().val() == "") {
                alert("Please enter valid value for field " + $(this).parent().parent().find(".section1").html());
                $(this).parent().parent().find(":input").first().focus();
                return false;
            }
            if ($(this).parent().parent().find(".form-item-travel-category :input").first().val() == "0") {
                alert("Please enter valid value for field " + $(this).parent().parent().find(".section1").html());
                $(this).parent().parent().find(":input").first().focus();
                return false;
            }
            if ($(this).parent().parent().find(".confirm-val-select :input").first().val() == "0") {
                alert("Please enter valid value for field " + $(this).parent().parent().find(".section1").html());
                $(this).parent().parent().find(".confirm-val-select :input").first().focus();
                return false;
            }
        });
    });

    $('#content-moderation-entity-moderation-form .form-submit').on('click', function(e) {
        var checked = true;
        $(".editFieldCheckbox").each(function() {
            if (!$(this).is(':checked')) {
                checked = false;
            }
        });
        if ($('.form-item-project-name :input').val() == "") {
            checked = false;
        }
        if ($('.edit-departure-date :input').val() == "") {
            checked = false;
        }

        if ($('#edit-travel-category').val() === '0') {
            checked = false;
        }
        if ($('#edit-travel-category').val() == 1 && $('#edit-bill-category').val() === '0') {
            checked = false;
        }
        if ($('#edit-travel-category').val() == 2 && $('#edit-nonbill-category').val() === '0') {
            checked = false;
        }
        if ($('#edit-travel-category').val() == 3 && $('#edit-bill-emp').val() === '0') {
            checked = false;
        }
        $('.content-moderation-entity-moderation-form .section2').not('.field-client-name .section2, .field-reporting-date .section2').each(function() {
            if ($(this).is(":visible") && $(this).html() === "- None -") {
                checked = false;
            }
        });
        var auth_status = $('#edit-new-state').val();
        if ((auth_status == "pm_approved") || (auth_status == "closed") || (auth_status == "published")) {
            if ($(".form-item-project-name :input").val() == "") {
                alert("Please enter valid value for field Project Name");
                $(".form-item-project-name :input").focus();
                e.preventDefault();
                return false;
            }
            if ($(".form-item-travel-category :input").val() == "0") {
                alert("Please enter valid value for field Travel Category");
                $(".form-item-travel-category :input").focus();
                e.preventDefault();
                return false;
            }
            if ($(".form-item-departure-date :input").val() == "") {
                alert("Please enter valid value for field Departure Date");
                $(".form-item-departure-date :input").focus();
                e.preventDefault();
                return false;
            }
            if (checked == false) {
                alert('Please verify all Values.');
                e.preventDefault();
                return false;
            }
        }

    });
    //End of content moderation form validation
    $(".ui-accordion-content .field--name-field-itinerary > .field__items > .field__item").each(function(index, value) {
        var index_no = index + 1;
        var name_no = "Itinerary " + index_no;
        $(this).addClass("itinerary-section-wrapper");
        $(this).prepend("<div class='itinerary-title title-background'>" + name_no + "</div>");
    });

    $(".ui-accordion-content .field--name-field-travelers-information > .field__item").each(function(index, value) {
        var index_no = index + 1;
        var name_no = "Traveller " + index_no;
        $(this).addClass("itinerary-section-wrapper");
        $(this).prepend("<div class='itinerary-title title-background'>" + name_no + "</div>");
    });
    $("table .one-list-style ul").each(function(index, value) {
        if ($(this).children("li").length < 2) {
            $(this).children("li").css({"list-style": "none", "margin-left": "0"});
        }
    });
    jQuery('.messages').closest('.container').css({"width": '100%'});
});

function updated_travel_type(selectedTravelType) {
    var curDate = new Date();
    var selectedDate, date2, timeDiff, ind_diffDays;
    jQuery(".field--name-field-itinerary table tr.draggable").each(function() {
        selectedDate = jQuery(this).find('.field--name-field-departure-date input.form-date').val();
        date2 = new Date(selectedDate);
        timeDiff = Math.abs(date2.getTime() - curDate.getTime());
        ind_diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        if (selectedTravelType == 'International') {
            if (ind_diffDays <= 14) {
                jQuery(this).find('.field--name-field-justification-for-advance-').show();
                jQuery(this).find('.field--name-field-justification-for-advance- textarea').prop('required', true).addClass("required");
                jQuery(this).find('.field--name-field-justification-for-advance- label').addClass("label form-required");
            } else {
                jQuery(this).find('.field--name-field-justification-for-advance-').hide();
                jQuery(this).find('.field--name-field-justification-for-advance- textarea').prop('required', false).removeClass("required").val('');
                jQuery(this).find('.field--name-field-justification-for-advance- label').removeClass("label form-required");
                jQuery(this).find('.field--name-field-justification-for-advance-').find("span.error").remove();
            }
            jQuery(".field--name-field-passport-number, .field--name-field-passport-validity, .field--name-field-visa-availability, .field--name-field-visa-validity").show();
        } else {
            if (ind_diffDays <= 7) {
                jQuery(this).find('.field--name-field-justification-for-advance-').show();
                jQuery(this).find('.field--name-field-justification-for-advance- textarea').prop('required', true).addClass("required");
                jQuery(this).find('.field--name-field-justification-for-advance- label').addClass("label form-required");
            } else {
                jQuery(this).find('.field--name-field-justification-for-advance-').hide();
                jQuery(this).find('.field--name-field-justification-for-advance- textarea').prop('required', false).removeClass("required").val('');
                jQuery(this).find('.field--name-field-justification-for-advance- label').removeClass("label form-required");
                jQuery(this).find('.field--name-field-justification-for-advance-').find("span.error").remove();
            }
            jQuery(".field--name-field-passport-number, .field--name-field-passport-validity, .field--name-field-visa-availability, .field--name-field-visa-validity").hide();
            jQuery(".field--name-field-passport-number input, .field--name-field-passport-validity input, .field--name-field-visa-validity input").val("");
            jQuery(".field--name-field-visa-availability select").val("_none");
        }
    });
}

/**
 * Checks the given date is past date or not.
 * @param Date selectedDate
 * @returns {Boolean}
 */
function isPastDate(selectedDate) {

    if(isNaN(selectedDate.getTime())) {
        return true;
    }
    var today_date = new Date();
    today_date.setHours(0,0,0,0);
    var present_time = (today_date.getTime());
    const diffTime = (selectedDate.getTime() - present_time);
    
    if(Math.floor(diffTime / (1000 * 60 * 60 * 24)) < 0) {
        return true;
    }
    return false;
}

function update_travel_request_form_events() {
    var today_date = new Date();

    jQuery(document).on('change focusout', '.field--name-field-date-of-reporting-to-clien input.form-date', function(e) {
        var today_date = new Date();
        var reporting_date = new Date(jQuery(".field--name-field-date-of-reporting-to-clien input.form-date").val());
        
        if (jQuery(this).val() != null && jQuery(this).val() != '') {
            var reporting_time = "09:00:00";
            if (reporting_date.toDateString() === today_date.toDateString()) {
                today_date.setHours(today_date.getHours() + 2);
                var hours = (today_date.getHours() < 10 ? '0' : '') + today_date.getHours();
                var minutes = (today_date.getMinutes() < 10 ? '0' : '') + today_date.getMinutes();
                var seconds = (today_date.getSeconds() < 10 ? '0' : '') + today_date.getSeconds();
                reporting_time = hours + ":" + minutes + ":" + seconds;
            } else if (!jQuery(this).parents(".field--name-field-date-of-reporting-to-clien").find("input.form-time").val()) {
                reporting_time = "09:00:00";
            }
            var travel_way = jQuery(".field--name-field-travel-way .form-select").val();
            var return_date = new Date(jQuery(".field--name-field-return-date input.form-date").val());
            var return_time = (return_date != "") ? Math.floor(return_date.getTime()) : "";
            var reporting_timestamp = (reporting_date != "" ) ? Math.floor(reporting_date.getTime()) : "";
            
            //prevent to select past dates
            if(isPastDate(new Date(jQuery(this).val())) === true) {
                jQuery(this).parent().parent().parent().parent().find('span.error').remove();
                jQuery(this).parent().parent().parent().after('<span class="error custom-error">Date of Reporting to client cannot be prior to Current Date</span>');
                jQuery(this).val('');
                return false;
            } else if ( (travel_way == 'Round trip' || travel_way == '_none') && reporting_timestamp !== "" && return_time !== "" && reporting_timestamp > return_time ) {
                //if reporting date is greater than return date
                jQuery(this).parent().parent().parent().parent().find('span.error').remove();
                jQuery(this).parent().parent().parent().after('<span class="error custom-error">Date of Reporting to client should be in between Departure date and Return date</span>');
                jQuery(this).val('');
                return false;
            } else {
                //reporting date should be between departure and return dates.
                jQuery(this).parent().parent().parent().parent().find('span.error').remove();
            }
            //end.
            jQuery(this).parents(".field--name-field-date-of-reporting-to-clien").find("input.form-time").val(reporting_time);
        }
    });

    jQuery(document).on('change', '.field--name-field-departure-date input.form-date', function(e) {
        var curDate = new Date();
        var selectedDate = jQuery(this).val();
        var date2 = new Date(selectedDate);
        var timeDiff = Math.abs(date2.getTime() - curDate.getTime());
        diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        var selectedTravelType = jQuery(".field--name-field-travel-type select.form-select").val();
        
        var justiForAdvance = jQuery(this).parents(".field--name-field-departure-date").siblings('.field--name-field-justification-for-advance-').find("textarea");
        if (selectedTravelType == 'International') {
            if (diffDays <= 14) {
                //when travel desk admin Edits departure date then remove static 'NA' from 'justification for advance' field
                if (typeof drupalSettings.travel_desk_administrator !== "undefined" 
                    && drupalSettings.travel_desk_administrator === 'true'
                    && justiForAdvance.val() == 'NA'
                    ) 
                {
                    justiForAdvance.html('');
                }
                jQuery(this).parents(".field--name-field-departure-date").siblings('.field--name-field-justification-for-advance-').show();
                jQuery(this).parents(".field--name-field-departure-date").siblings('.field--name-field-justification-for-advance-').find("label").addClass("label form-required");
                jQuery(this).parents(".field--name-field-departure-date").siblings('.field--name-field-justification-for-advance-').find("textarea").prop('required', true).addClass('required');
            } else {
                jQuery(this).parents(".field--name-field-departure-date").siblings('.field--name-field-justification-for-advance-').hide();
                jQuery(this).parents(".field--name-field-departure-date").siblings('.field--name-field-justification-for-advance-').find("label").removeClass("label form-required");
                jQuery(this).parents(".field--name-field-departure-date").siblings('.field--name-field-justification-for-advance-').find("textarea").prop('required', false).removeClass("required").val('');
                jQuery(this).parents(".field--name-field-departure-date").siblings('.field--name-field-justification-for-advance-').find("span.error").remove();
            }
        } else {
            if (diffDays <= 7) {
                //when travel desk admin Edits departure date then remove static 'NA' from 'justification for advance' field
                if (typeof drupalSettings.travel_desk_administrator !== "undefined" 
                    && drupalSettings.travel_desk_administrator === 'true'
                    && justiForAdvance.val() == 'NA'
                    ) 
                {
                    justiForAdvance.val('');
                }
                jQuery(this).parents(".field--name-field-departure-date").siblings('.field--name-field-justification-for-advance-').show();
                jQuery(this).parents(".field--name-field-departure-date").siblings('.field--name-field-justification-for-advance-').find("label").addClass("label form-required");
                jQuery(this).parents(".field--name-field-departure-date").siblings('.field--name-field-justification-for-advance-').find("textarea").prop('required', true).addClass('required');
            } else {
                jQuery(this).parents(".field--name-field-departure-date").siblings('.field--name-field-justification-for-advance-').hide();
                jQuery(this).parents(".field--name-field-departure-date").siblings('.field--name-field-justification-for-advance-').find("label").removeClass("form-required");
                jQuery(this).parents(".field--name-field-departure-date").siblings('.field--name-field-justification-for-advance-').find("textarea").prop('required', false).removeClass('required').val('');
                jQuery(this).parents(".field--name-field-departure-date").siblings('.field--name-field-justification-for-advance-').find("span.error").remove();
            }
        }
    });

}
function isValidDate(txtDate) {
    var currVal = txtDate;
    if (currVal == '')
        return false;
    //Declare Regex 
    var rxDatePattern = /^(\d{4})(\/|-)(\d{1,2})(\/|-)(\d{1,2})$/;
    var dtArray = currVal.match(rxDatePattern); // is format OK?
    if (dtArray == null) {
        console.log("not match");
        return false;
    }
    //Checks for mm/dd/yyyy format.
    dtYear = dtArray[1];
    dtMonth = dtArray[3];
    dtDay = dtArray[5];
    if (dtMonth < 1 || dtMonth > 12)
        return false;
    else if (dtDay < 1 || dtDay > 31)
        return false;
    else if ((dtMonth == 4 || dtMonth == 6 || dtMonth == 9 || dtMonth == 11) && dtDay == 31)
        return false;
    else if (dtMonth == 2)
    {
        var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
        if (dtDay > 29 || (dtDay == 29 && !isleap))
            return false;
    }
    return true;
}
