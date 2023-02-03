(function($) {

    'use strict';

    /**
     * Drupal FieldGroup object.
     */
    Drupal.FieldGroup = Drupal.FieldGroup || {};
    Drupal.FieldGroup.Effects = Drupal.FieldGroup.Effects || {};
    Drupal.FieldGroup.groupWithfocus = null;

    Drupal.FieldGroup.setGroupWithfocus = function(element) {
        element.css({display: 'block'});
        Drupal.FieldGroup.groupWithfocus = element;
    };

    var roles = drupalSettings.roles;
    var current_path = drupalSettings.current_path;
    var moderation_state = drupalSettings.moderation_state;

    if ($.inArray("travel_desk_administrator", roles) !== -1 && current_path == "reports") {
        $('.content-moderation-entity-moderation-form').hide();
    }
    if ($.inArray("travel_desk_administrator", roles) !== -1 && moderation_state == "closed" && current_path !== "reports") {
        $('.content-moderation-entity-moderation-form').show();
    }

    /**
     * Behaviors.
     */
    Drupal.behaviors.fieldGroup = {
        attach: function(context, settings) {

            settings.field_group = settings.field_group || drupalSettings.field_group;
            if (typeof settings.field_group === 'undefined') {
                return;
            }

            // Execute all of them.
            $.each(Drupal.FieldGroup.Effects, function(func) {
                // We check for a wrapper function in Drupal.field_group as
                // alternative for dynamic string function calls.
                var type = func.toLowerCase().replace('process', '');
                if (typeof settings.field_group[type] !== 'undefined' && $.isFunction(this.execute)) {
                    this.execute(context, settings, settings.field_group[type]);
                }
            });

            // Add a new ID to each fieldset.
            $('.group-wrapper fieldset').each(function() {
                // Tats bad, but we have to keep the actual id to prevent layouts to break.
                var fieldgroupID = 'field_group-' + $(this).attr('id') + ' ' + $(this).attr('id');
                $(this).attr('id', fieldgroupID);
            });

            // Set the hash in url to remember last userselection.
            $('.group-wrapper ul li').each(function() {
                var fieldGroupNavigationListIndex = $(this).index();
                $(this).children('a').click(function() {
                    var fieldset = $('.group-wrapper fieldset').get(fieldGroupNavigationListIndex);
                    // Grab the first id, holding the wanted hashurl.
                    var hashUrl = $(fieldset).attr('id').replace(/^field_group-/, '').split(' ')[0];
                    window.location.hash = hashUrl;
                });
            });


            // Accordion for travel request.
            jQuery('.field-group-accordion-wrapper').accordion();
            jQuery('.field--name-field-relationship-with-employee').hide();
            var login_user = (drupalSettings.travel_portal && drupalSettings.travel_portal.login_user) ? drupalSettings.travel_portal.login_user : [];
            jQuery('.field--name-field-traveler-type select').change(function(e) {
                if (jQuery(this).val().toLowerCase() == 'others') {
                    jQuery(this).parents(".field--name-field-traveler-type").siblings(".field--name-field-relationship-with-employee").show();
                    jQuery(this).parents(".field--name-field-traveler-type").siblings(".field--name-field-traveler-employee-id").show();
                    jQuery(this).parents(".field--name-field-traveler-type").siblings(".field--name-field-traveler-employee-id").find("input").addClass('required').prop('required', true);
                    //jQuery(".field--name-field-traveler-employee-id label").attr('class','js-form-required form-required');
                    jQuery(this).parents(".field--name-field-traveler-type").siblings(".field--name-field-traveler-employee-id").find("label").addClass("js-form-required form-required");
                }
                else {
                    jQuery(this).parents(".field--name-field-traveler-type").siblings(".field--name-field-relationship-with-employee").hide();
                    jQuery(this).parents(".field--name-field-traveler-type").siblings(".field--name-field-traveler-employee-id").hide();
                    jQuery(this).parents(".field--name-field-traveler-type").siblings(".field--name-field-traveler-employee-id").find("input").removeClass('required').prop('required', false);
                    jQuery(this).parents(".field--name-field-traveler-type").siblings(".field--name-field-traveler-employee-id").find("span.error").remove();
                    jQuery(this).parents(".field--name-field-traveler-type").siblings(".field--name-field-traveler-employee-id").find("label").removeClass("js-form-required form-required");
                }

                var type_obj = jQuery(this).parents(".field--name-field-traveler-type");
                if (jQuery(this).val().toLowerCase() == 'self') {
                    if (login_user.empid && jQuery(type_obj).siblings(".field--name-field-traveler-employee-id").find("input.form-text").val() == '') {
                        jQuery(type_obj).siblings(".field--name-field-traveler-employee-id").find("input.form-text").val(login_user.empid);
                    }
					var firstName = login_user.fnameAsPerPassport ? login_user.fnameAsPerPassport : (login_user.fname) ? login_user.fname : '';
                    if (firstName) {
                        jQuery(type_obj).siblings(".field--name-field-first-name").find("input.form-text").val(firstName);
                    }
                    var middleName = login_user.mnameAsPerPassport ? login_user.mnameAsPerPassport : login_user.mname ? login_user.mname : '';
                    if (middleName) {
                        jQuery(type_obj).siblings(".field--name-field-second-name").find("input.form-text").val(middleName);
                    }
                    var lastName = login_user.lnameAsPerPassport ? login_user.lnameAsPerPassport : login_user.lname ? login_user.lname : '';
                    if (lastName) {
                        jQuery(type_obj).siblings(".field--name-field-surname").find("input.form-text").val(lastName);
                    }
                    var passportNumber = login_user.passport_number ? login_user.passport_number : login_user.pnumber ? login_user.pnumber : '';
                    if (passportNumber) {
                        jQuery(type_obj).siblings(".field--name-field-passport-number").find("input.form-text").val(passportNumber);
                    }
                    var passportValidity = login_user.passport_validity ? login_user.passport_validity : login_user.pvalidity ? login_user.pvalidity : '';
                    if (passportValidity) {
                        jQuery(type_obj).siblings(".field--name-field-passport-validity").find("input.form-date").val(passportValidity);
                    }
                    if (login_user.gender) {
                        jQuery(type_obj).siblings(".field--name-field-gender").find("select.form-select").val(login_user.gender);
                    }
                    jQuery(type_obj).siblings(".field--name-field-employee-band, .field--name-field-traveler-employee-id").show();
                    if (login_user.band) {
                        jQuery(type_obj).siblings(".field--name-field-employee-band").find("input.form-text").val(login_user.band);
                    }
                }
                else {
                    if (login_user.empid && jQuery(type_obj).siblings(".field--name-field-traveler-employee-id").find("input.form-text").val() == login_user.empid) {
                        jQuery(type_obj).siblings(".field--name-field-traveler-employee-id").find("input.form-text").val('');
                    }
                    var fName = jQuery(type_obj).siblings(".field--name-field-first-name").find("input.form-text").val();
                    if (login_user.length == 0 || (login_user.fname &&  fName == login_user.fname) || (login_user.fnameAsPerPassport && fName == login_user.fnameAsPerPassport)){
                        jQuery(type_obj).siblings(".field--name-field-first-name").find("input.form-text").val('');
                    }
                    var mName = jQuery(type_obj).siblings(".field--name-field-second-name").find("input.form-text").val();
                    if (login_user.length == 0 || (login_user.mname && mName == login_user.mname) || (login_user.mnameAsPerPassport && mName == login_user.mnameAsPerPassport)) {
                        jQuery(type_obj).siblings(".field--name-field-second-name").find("input.form-text").val('');
                    }
                    var lName = jQuery(type_obj).siblings(".field--name-field-surname").find("input.form-text").val();
                    if (login_user.length == 0 || (login_user.lname && lName == login_user.lname) || (login_user.lnameAsPerPassport && lName == login_user.lnameAsPerPassport)) {
                        jQuery(type_obj).siblings(".field--name-field-surname").find("input.form-text").val('');
                    }
                    var pNumber = jQuery(type_obj).siblings(".field--name-field-passport-number").find("input.form-text").val();
                    if ((login_user.pnumber && pNumber == login_user.pnumber) || (login_user.passport_number && pNumber == login_user.passport_number)) {
                        jQuery(type_obj).siblings(".field--name-field-passport-number").find("input.form-text").val('');
                    }
                    var pValidity = jQuery(type_obj).siblings(".field--name-field-passport-validity").find("input.form-text").val();
                    if (login_user.pvalidity && pValidity == login_user.pvalidity) {
                        jQuery(type_obj).siblings(".field--name-field-passport-validity").find("input.form-date").val('');
                    }
                    /* if (login_user.gender && jQuery(type_obj).siblings(".field--name-field-gender").find("select.form-select").val() != "_none") {
                     jQuery(type_obj).siblings(".field--name-field-gender").find("select.form-select").val('_none'); // TODO
                     } */
                    jQuery(type_obj).siblings(".field--name-field-employee-band").hide();
                }
            });
            jQuery('.field--name-field-traveler-type select').each(function() {
                if (jQuery(this).val().toLowerCase() == 'self') {
                    jQuery(this).parents(".field--name-field-traveler-type").siblings(".field--name-field-employee-band, .field--name-field-traveler-employee-id").show();
                }
                else {
                    jQuery(this).parents(".field--name-field-traveler-type").siblings(".field--name-field-employee-band, .field--name-field-traveler-employee-id").hide();
                }
            });
            if (jQuery(".content-moderation-entity-moderation-form .js-form-item-current label").text().toLowerCase() == 'moderation state') {
                jQuery(".node .content-moderation-entity-moderation-form .js-form-item-current label").html('Approval Status');
            }
            if (jQuery(".content-moderation-entity-moderation-form .js-form-item-new-state label").text().toLowerCase() == 'change to') {
                jQuery(".node .content-moderation-entity-moderation-form .js-form-item-new-state label").html('Authorize');
            }
            if (jQuery(".content-moderation-entity-moderation-form .js-form-item-revision-log label").text().toLowerCase() == 'log message') {
                jQuery(".node .content-moderation-entity-moderation-form .js-form-item-revision-log label").html('Remarks');
            }

            var selectedTravelType = jQuery('#edit-field-travel-type').val();
            updated_travel_type(selectedTravelType);

            var travelers_no = jQuery('.field--name-field-travelers-information table tbody tr.paragraph-type--travellers').length;
            if (travelers_no && travelers_no > 0) {
                jQuery('.field-group-accordion-item .field--name-field-number-of-travelers input.form-number').val(travelers_no);
            }

            if (jQuery(".content-moderation-entity-moderation-form").length && !jQuery(".field--name-field-departure-date div.field__item .field-check-review").length) {
                //jQuery(".field--name-field-departure-date div.field__item, .field--name-field-travel-categories div.field__item, .field--name-field-travel-sub-category div.field__item").append('<span class="field-check-review"><input type="checkbox" value="1" /> <span>Verified</span></span>');
            }

            jQuery('.field--name-field-travel-type select.form-select').change();
            jQuery('.field--name-field-travel-way select.form-select').change();
            jQuery('.field--name-field-traveler-type select').change();
            update_travel_request_form_events();
            jQuery('.field--name-field-visa-availability select.form-select').each(function() {
                checkVisaValidity(jQuery(this));

            });
            jQuery(".field--name-field-date-of-reporting-to-clien input.form-date").keydown(false);
            jQuery(".field--name-field-return-date input.form-date").keydown(false);
            jQuery(".field--name-field-departure-date input.form-date").keydown(false);
            jQuery(".field--name-field-passport-validity input.form-date").keydown(false);
            jQuery(".field--name-field-visa-validity input.form-date").keydown(false);

            jQuery("div.field--name-field-from-country input.form-autocomplete").each(function() {
               $(this).autocomplete({
                   change: function (event, ui) {
                       if (ui.item == null) {
                           //here is null if entered value is not match in suggestion list
                           $(this).val((ui.item ? ui.item.id : ""));
                       }
                   }
               });
            });

            jQuery("div.field--name-field-to-country input.form-autocomplete").each(function() {
                $(this).autocomplete({
                    change: function (event, ui) {
                        if (ui.item == null) {
                            //here is null if entered value is not match in suggestion list
                            $(this).val((ui.item ? ui.item.id : ""));
                        }
                    }
                });
            });

            jQuery("body").find('.form-autocomplete').on('autocompleteclose', function(event, node) {
                var val = jQuery(this).val();
                var match = val.match(/\((.*?)\)$/);
                if (match) {
                    jQuery(this).data('real-value', val);
                    jQuery(this).val(val.replace(' ' + match[0], ''));
                }
                var travel_type = $('div.field--name-field-travel-type select.form-select').val();
                if (travel_type == 'Domestic') {
                    jQuery("div.field--name-field-from-country input.form-autocomplete").each(function() {
                        var from_country = jQuery(".field--name-field-itinerary tbody > tr.draggable.paragraph-type--multicity:first-child").find("div.field--name-field-from-country input.form-autocomplete").val();
                        if (from_country != '') {
                            $(this).val(from_country);
                            jQuery(this).parent().parent().siblings('div.field--name-field-to-country').find('input.form-autocomplete').val(from_country);
                        }
                    });
                }
            });

            //
            var travel_type = $('div.field--name-field-travel-type select.form-select').val();
            var travel_way = $(".field--name-field-travel-way .form-select").val();
            if (travel_type == 'Domestic' && travel_way == "Multi-City") {
                var from_country = jQuery(".field--name-field-itinerary tbody > tr.draggable.paragraph-type--multicity:first-child").find("div.field--name-field-from-country input.form-autocomplete").val();
                console.log(from_country);
                jQuery("div.field--name-field-from-country input.form-autocomplete").each(function() {
                    //var from_country = $(this).val();
                    if (from_country != '') {
                        $(this).val(from_country);
                        jQuery(this).parent().parent().siblings('div.field--name-field-to-country').find('input.form-autocomplete').val(from_country);
                    }
                });
            }
        }
    };

})(jQuery);
