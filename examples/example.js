var form = {
    "method":"POST",
    "action":"."
};
var fieldsets_full = [["Personal Details", "personal", {}], ["Contacts", "contacts", {}], ["Survey", "survey", {}]];
var fieldsets_small = [["Personal Details", "personal", {}]];

var fields_full = [
    {
        "name":"full_name",
        "label": "Full Name",
        "required":true,
        "fieldset":"personal",
        "type": "text",
        "extra_attributes": {"placeholder":"Enter Full Name"}
    },
    {
        "name": "nick_name",
        "fieldset":"personal",
        "label":"Nick Name",
        "type":"text"
    },
    {
        "name": "date_of_birth",
        "fieldset":"personal",
        "label":"Date of Birth",
        "type":"text"
    },
    {
        "name": "contact_phone",
        "fieldset":"contacts",
        "label":"Contact Number",
        "type": "text"
    },
    {
        "name": "address",
        "fieldset":"contacts",
        "label":"Address",
        "type": "textarea"
    },
    {
        "name": "city",
        "fieldset":"contacts",
        "label":"City",
        "type": "select",
        "options":[["Chennai","chn"],["Mumbai","mum"],["New Delhi","del"]]
    },
    {
        "name": "vehicles",
        "fieldset":"survey",
        "label":"What are the types of vehicles you own",
        "type": "checkbox",
        "options":[["Car","car"],["Motor Cycle","motor"],["Cycle","cycle"]]
    },
    {
        "name": "food",
        "fieldset":"survey",
        "label":"Do you like Mexican Food ?",
        "type": "radio",
        "options":[["Yes","yes"],["No","no"],["May Be","maybe"]]
    }

];

var fields_small = [
    {
        "name":"full_name",
        "label": "Full Name",
        "fieldset":"personal",
        "type": "text",
        "extra_attributes": {"placeholder":"Enter Full Name"}
    },
    {
        "name": "nick_name",
        "fieldset":"personal",
        "label":"Nick Name",
        "type":"text"
    },
    {
        "name": "gender",
        "fieldset":"personal",
        "label":"Gender",
        "type":"radio",
        "options":[["Male","m"], ["Female","f"]]
    }
];

var buttons = [
    {
        "type":"submit",
        "class":"btn btn-primary",
        "value":"Save"
    },
    {
        "type":"reset",
        "class":"btn",
        "value": "Clear"
    }
];

var values = {"full_name":"John Doe", "nick_name":"JD", "gender":"m"};
var errors = {"full_name":"Please enter less than 30 charecters.", "gender":"Gender should be selected"};
var global_errors = ["This form was not submitted properly."];

jQuery(document).ready(function(){
    jQuery(".form_container").dynoForm({"form":form, "fields":fields_full, "buttons":buttons, "fieldsets":fieldsets_full});
    jQuery(".form_container_2").dynoForm({"form":form, "fields":fields_small, "buttons":buttons, "fieldsets":fieldsets_small, "values":values});
    jQuery(".form_container_3").dynoForm({
        "form":form,
        "fields":fields_small,
        "buttons":buttons,
        "fieldsets":fieldsets_small,
        "values":values,
        "errors":errors,
        "global_errors":global_errors,
        "error_template": function(msg){
            var div = jQuery("<div>");
            div.addClass("alert alert-error");
            div.html(msg);
            return div;
        }
    });
    jQuery(".form_container_4").dynoForm({
        "remote_form_structure":"./structure.json"
    });
});