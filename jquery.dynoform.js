(function ($) {
    function DynoForm(jquery_obj, options){
        this.$element = jquery_obj;
        this.config = {};
        this.updateConfig(options);
        if(this.config["remote_form_structure"]){
            this.loadRemoteStructure();
        } else {
            this.renderForm();
        }
    }

    DynoForm.prototype = {};

    DynoForm.prototype.loadRemoteStructure = function(){
        var me= this;
        $.ajax({
            type:"GET",
            "url":me.config["remote_form_structure"],
            "dataType":"json",
            "success":function(data){
                me.updateConfig(data);
                me.renderForm();
            }
        });
    };

    DynoForm.prototype.default_configs = {
        "error_template" : null,
        "global_errors" : [],
        "errors" : [],
        "buttons" : [],
        "fieldsets" : [],
        "fields" : [],
        "form" : [],
        "values" : {}
    };

    DynoForm.prototype.updateConfig = function(map){
        $.extend(true, this.config, map);
    };

    DynoForm.prototype.setFormAttrs = function () {
        for (var key in this.config["form"]) {
            this.$form.attr(key, this.config["form"][key]);
        }
    };

    DynoForm.prototype.createFieldsets = function () {
        var fieldset_map, $fieldset, $legend;
        for (var i=0; i<this.config["fieldsets"].length; i++) {
            fieldset_map = this.config["fieldsets"][i];
            $fieldset = $("<fieldset>");
            $fieldset.attr("name",fieldset_map[1]);
            $legend = $("<legend>");
            $legend.text(fieldset_map[0]);
            if(fieldset_map[2]){
                for(var key in fieldset_map[2]){
                    $fieldset.attr(key, fieldset_map[2][key]);
                }
            }
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
        label.html(field_map["label"]);
        if (field_map["required"]){
            label.append("<b> * </b>");
        }
        label.attr("for", field_map["name"]);
        return label;
    };

    DynoForm.prototype.createLabeledField = function (field_map) {
        var fieldset = this.$form.find("[name=" + field_map["fieldset"] + "]");
        fieldset.append(this.createLabel(field_map));
        fieldset.append(this.createField(field_map));
    };

    DynoForm.prototype.updateFormFields = function () {
        for (var i=0; i< this.config["fields"].length; i++) {
            var field_map = this.config["fields"][i];
            this.createLabeledField(field_map);
        }
    };

    DynoForm.prototype.updateValues = function () {
        if(this.config["values"]) {
            for (var i=0; i< this.config["fields"].length; i++) {
                var field_map = this.config["fields"][i];
                var field_name = field_map["name"];
                if (!this.config["values"][field_name]) {
                    continue;
                }
                if (field_map["type"] == "checkbox") {
                    for( var value_index in this.config["values"][field_name]){
                        this.$form.find("[name='" + field_name +"[]'][value='" + this.config["values"][field_name][value_index] + "']").attr("checked","checked");
                    }
                    continue;
                }
                if (field_map["type"] == "radio") {
                    this.$form.find("[name='" + field_name +"'][value='" + this.config["values"][field_name]+ "']").attr("checked","checked");
                    continue;
                }
                this.$form.find("[name='" + field_name +"']").val(this.config["values"][field_name]);
            }
        }
    };

    DynoForm.prototype.getErrorMessage = function(message){
        function _compose_message(msgs){
            var $list = $("<ul>");
            for(var index in msgs){
                var $li = $("<li>");
                $li.html(msgs[index]);
                $list.append($li);
            }
            return $list;
        }
        var composed_message = $.isArray(message) ? _compose_message(message) : message;
        if(this.config["errors_template"]){
            return this.config["errors_template"](composed_message);
        }
        var div = $("<div>");
        div.addClass("error");
        div.html(composed_message);
        return div;
    };

    DynoForm.prototype.displayErrors = function () {
        if(this.config["errors"]) {
            for (var i=0; i< this.config["fields"].length; i++) {
                var field_map = this.config["fields"][i];
                var field_name = field_map["name"];
                if (!this.config["errors"][field_name]) {
                    continue;
                }
                var error_message = this.getErrorMessage(this.config["errors"][field_name]);
                var dom_to_atttach_to = this.$form.find("[name='" + field_name +"']:last");
                if (field_map["type"] == "checkbox") {
                    //name of checkbox altered to
                    dom_to_atttach_to = this.$form.find("[name='" + field_name +"[]']:last").parent();

                }
                if (field_map["type"] == "radio") {
                    //name of checkbox altered to
                    dom_to_atttach_to = this.$form.find("[name='" + field_name +"']:last").parent();

                }

                dom_to_atttach_to.after(error_message);
            }
        }
    };

    DynoForm.prototype.displayGlobalError = function(){
        if(this.config["global_errors"]){
            var error_message = this.getErrorMessage(this.config["global_errors"]);
        }
        this.$form.prepend(error_message);
    };

    DynoForm.prototype.createActionButtons = function () {
        for (var i in this.config["buttons"]){
            var button = $("<input>");
            for (var key in this.config["buttons"][i]){
                button.attr(key,this.config["buttons"][i][key]);
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
        this.$element.trigger("dynoform:value_loaded", [this.config]);
        this.displayErrors();
        this.displayGlobalError();
        this.createActionButtons();
        this.$element.append(this.$form);
        this.$element.trigger("dynoform:render_complete", [this.config]);
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