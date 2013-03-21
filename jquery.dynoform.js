(function ($) {
    function DynoForm(jquery_obj, options){
        this.$element = jquery_obj;
        this.form_structure = options["form"];
        this.fields = options["fields"];
        this.values = options["values"];
        this.buttons = options["buttons"];
        this.fieldsets= options["fieldsets"];
        this.renderForm();
    }

    DynoForm.prototype = {};

    DynoForm.prototype.setFormAttrs = function () {
        for (var key in this.form_structure) {
            this.$form.attr(key, this.form_structure[key]);
        }
    };

    DynoForm.prototype.createFieldsets = function () {
        var fieldset_map, $fieldset, $legend;
        for (var i=0; i<this.fieldsets.length; i++) {
            fieldset_map = this.fieldsets[i];
            $fieldset = $("<fieldset>");
            $fieldset.attr("name",fieldset_map[1]);
            $legend = $("<legend>");
            $legend.text(fieldset_map[0]);
            $fieldset.append($legend);
            this.$form.append($fieldset);
        }
    };

    DynoForm.prototype.createCheckboxAndRadio = function(field_map){
        var el_list = [];
        var el, lb;
        var name = field_map["type"] === "radio" ? field_map["name"] : field_map["name"]+"[]";
        for(var key in field_map["options"]){
            lb = $("<label>");
            el = $("<input>");
            el.attr("value", field_map["options"][key][1]);
            el.attr("type", field_map["type"]);
            el.attr("name", name);
            lb.append(el);
            lb.append(field_map["options"][key][0]);
            el_list.push(lb);
        }
        return el_list;

    };

    DynoForm.prototype.createField = function (field_map) {
        var el;
        switch(field_map["type"]) {
            case undefined:
                el = $("<input>");
                el.attr("type","text");
                break;

            case "text":
                el = $("<input>");
                el.attr("type","text");
                break;

            case "textarea":
                el = $("<textarea>");
                break;

            case "password":
                el = $("<input>");
                el.attr("type","password");
                break;

            case "select":
                el = $("<select>");
                var option;
                for(var key in field_map["options"]){
                    option = $("<option>");
                    option.attr("value", field_map["options"][key][1]);
                    option.text(field_map["options"][key][0]);
                    el.append(option);
                }
                break;

            case "checkbox":
                var data = this.createCheckboxAndRadio(field_map);
                return data;

            case "radio":
                return this.createCheckboxAndRadio(field_map);
        }

        el.attr("name", field_map["name"]);
        if(field_map["extra_attributes"]){
            for (var key in field_map["extra_attributes"]){
                el.attr(key, field_map["extra_attributes"][key]);
            }
        }
        return el;
    };

    DynoForm.prototype.createLabel = function (field_map) {
        var label = $("<label>");
        label.text(field_map["label"]);
        label.attr("for", field_map["name"]);
        return label;
    };

    DynoForm.prototype.createLabeledField = function (field_map) {
        var fieldset = this.$form.find("[name=" + field_map["fieldset"] + "]");
        fieldset.append(this.createLabel(field_map));
        fieldset.append(this.createField(field_map));
    };

    DynoForm.prototype.updateFormFields = function () {
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
            var button = $("<input>");
            for (var key in this.buttons[i]){
                button.attr(key,this.buttons[i][key]);
            }
            this.$form.append(button);
        }
    };


    DynoForm.prototype.renderForm = function(){
        this.$form = $("<form>");
        this.setFormAttrs();
        this.createFieldsets();
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
            var $this = $(this);
            if (!$this.data("dynoform")) {
                var dynoform = new DynoForm($this, options);
                $this.data("dynoform", dynoform);
            }
        });
        return this;
    };
}(jQuery));