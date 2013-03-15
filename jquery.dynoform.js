(function ($) {
    function DynoForm(jquery_obj, options){
        this.$element = jquery_obj;
        this.form_structure = options["form"];
        this.fields = options["fields"];
        this.values = options["values"];
        this.buttons = options["buttons"];
        this.renderForm();
    }

    DynoForm.prototype = {};

    DynoForm.prototype.setFormAttrs = function () {
        for (var key in this.form_structure) {
            this.$form.attr(key, this.form_structure[key]);
        }
    };

    DynoForm.prototype.createField = function (field_map) {
        var el;
        switch(field_map["type"]) {
        case undefined:
            el = jQuery("<input>");
            el.attr("type","text");
            break;

        case "text":
            el = jQuery("<input>");
            el.attr("type","text");
            break;

        case "textarea":
            el = jQuery("<textarea>");
            break;

        case "password":
            el = jQuery("<input>");
            el.attr("type","password");
            break;

        case "select":
            el = jQuery("<select>");
            var option;
            for(var key in field_map["options"]){
                option = jQuery("<option>");
                option.attr("value", field_map["options"][key][1]);
                option.text(field_map["options"][key][0]);
                el.append(option);
            }
            break;

        }
        el.attr("name", field_map["name"]);
        return el;
    };

    DynoForm.prototype.createLabel = function (field_map) {
        var label = $("<label>");
        label.text(field_map["label"]);
        label.attr("for", field_map["name"]);
        return label;
    };

    DynoForm.prototype.createLabeledField = function (field_map) {
        this.$form.append(this.createLabel(field_map));
        this.$form.append(this.createField(field_map));

    };

    DynoForm.prototype.updateFormFields = function () {
        this.$form.empty();
        for (var i=0; i< this.fields.length; i++) {
            var field_map = this.fields[i];
            this.createLabeledField(field_map);
        }
    };

    DynoForm.prototype.updateValues = function () {
        if(this.values) {
            for(var key in this.values){
                this.$form.find("[name='" + key +"']").val(this.values[key]);
            }
        }
    };

    DynoForm.prototype.createActionButtons = function () {
        for (var i in this.buttons){
            var button = jQuery("<input>");
            for (var key in this.buttons[i]){
                button.attr(key,this.buttons[i][key]);
            }
            this.$form.append(button);
        }
    };


    DynoForm.prototype.renderForm = function(){
        this.$form = $("<form>");
        this.setFormAttrs();
        this.updateFormFields();
        this.updateValues();
        this.createActionButtons();
        this.$element.append(this.$form);
    };


    ///////////////////////////////
    /////// jQuery Plugin /////////
    ///////////////////////////////
    
    $.fn.dynoForm = function(options){
        this.each(function(){
            var $this = jQuery(this);
            if (!$this.data("dynoform")) {
                var dynoform = new DynoForm($this, options);
                $this.data("dynoform", dynoform);
            }
        });
        return this;
    };
}(jQuery));