var form = {
    "method":"POST",
    "action":"."
};

var fields_full = [
    {
        "name":"first_name",
        "label": "First Name",
        "required":true,
        "type": "text",
        "extra_attributes": {"placeholder":"Enter Full Name"}
    },
    {
        "name":"middle_name",
        "label": "Middle Name",
        "required":true,
        "type": "text",
        "extra_attributes": {"placeholder":"Enter Full Name"}
    },
    {
        "name":"last_name",
        "label": "Last Name",
        "required":true,
        "type": "text",
        "extra_attributes": {"placeholder":"Enter Full Name"}
    },
    {
        "name": "nick_name",
        "label":"Nick Name",
        "type":"text"
    },
    {
        "name": "date_of_birth",
        "label":"Date of Birth",
        "type":"text"
    },
    {
        "name": "age",
        "label":"Age",
        "type":"text"
    },
    {
        "name": "contact_phone",
        "label":"Contact Number",
        "type": "text"
    },
    {
        "name": "address",
        "label":"Address",
        "type": "textarea"
    },
    {
        "name": "city",
        "label":"City",
        "type": "select",
        "options":[["Chennai","chn"],["Mumbai","mum"],["New Delhi","del"]]
    },
    {
        "name": "vehicles",
        "label":"What are the types of vehicles you own",
        "type": "checkbox",
        "options":[["Car","car"],["Motor Cycle","motor"],["Cycle","cycle"]]
    },
    {
        "name": "food",
        "label":"Do you like Mexican Food ?",
        "type": "radio",
        "options":[["Yes","yes"],["No","no"],["May Be","maybe"]]
    }

];

var fields_small = [
    {
        "name":"full_name",
        "label": "Full Name",
        "type": "text",
        "extra_attributes": {"placeholder":"Enter Full Name"}
    },
    {
        "name": "nick_name",
        "label":"Nick Name",
        "type":"text"
    },
    {
        "name": "vehicles",
        "label":"What are the types of vehicles you own",
        "type": "checkbox",
        "options":[["Car","car"],["Motor Cycle","motor"],["Cycle","cycle"]]
    },
    {
        "name": "gender",
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

var values = {"full_name":"John Doe", "nick_name":"JD", "gender":"m", "vehicles":["car","cycle"]};
var errors = {"full_name":"Please enter less than 30 charecters.", "gender":"Gender should be selected"};
var global_errors = ["This form was not submitted properly."];

var custom_layout = [
    ["first_name", "middle_name", "last_name"],
    ["nick_name"],
    ["date_of_birth", "age"],
    ["contact_phone"],
    ["address"],
    ["city"]
];