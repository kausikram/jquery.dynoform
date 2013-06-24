(function ($) {
    function DynoForm(jquery_obj, options){
        this.$element = jquery_obj;
        this.$form = null;
        this.config = {};
        this.updateConfig(this.getDefaultConfigs());
        this.updateConfig(options);
        if(this.config["remote_form_structure"]){
            this.loadRemoteStructure();
        } else {
            this.renderForm();
        }
    }

    DynoForm.available_fields = {};

    DynoForm.add_field = function(field_name, field_class) {
        DynoForm.available_fields[field_name] = field_class;
    };

    DynoForm.prototype.getFieldHandler = function(type) {
        return this.constructor.available_fields[type];
    };

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

    DynoForm.prototype.getDefaultConfigs = function() {
        return {
            "error_template" : null,
            "global_errors" : [],
            "errors" : [],
            "buttons" : [],
            "fields" : [],
            "form" : {},
            "values" : {}
        }
    };

    DynoForm.prototype.updateConfig = function(map){
        $.extend(true, this.config, map);
    };

    DynoForm.prototype.createFormElement = function () {
        this.$form = $("<form>");
        for (var key in this.config["form"]) {
            this.$form.attr(key, this.config["form"][key]);
        }
        this.$form.addClass("dynoform_form");
        if(this.config["layout"]){
            if (this.config["layout"] == "inline"){
                this.$form.addClass("form-inline");
            }
            if(this.config["layout"]=="2-column"){
                this.$form.addClass("form-multi-column");
            }
            if($.isArray(this.config["layout"])){
                this.$form.addClass("form-multi-column");
            }
        }
    };

    DynoForm.prototype.createField = function (field_map) {
        var el;
        var field_obj = this.getFieldHandler(field_map["type"]);
        if(field_obj){
            el = field_obj.render(field_map, this);
            el.data("dynoform-field", field_obj);
            return el;
        }
        throw "Error: field type not defined";
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

    DynoForm.prototype.processLabelForLayout = function(el){
        if (this.config["layout"] == "2-column"){
            el.addClass("span2");
        }
        if ($.isArray(this.config["layout"])){
            el.addClass("span2");
        }
        return el;
    };

    DynoForm.prototype.processFieldForLayout = function(el){
        if (this.config["layout"] == "2-column"){
            el.addClass("span2");
        }
        if ($.isArray(this.config["layout"])){
            el.addClass("span2");
        }
        return el;
    };

    DynoForm.prototype.createLabeledField = function (field_map, location) {
        var label = this.createLabel(field_map);
        var field_el = this.createField(field_map);
        this.processLabelForLayout(label);
        this.processFieldForLayout(field_el);
        location.append(label);
        location.append(field_el);
    };

    DynoForm.prototype.findRowOfFieldFromLayout = function(field_map){
        if (this.config["layout"]=="2-column"){
            var field_array = $.map(this.config["fields"], function(field){
                return field["name"];
            });
            return (Math.floor($.inArray(field_map["name"], field_array) / 2));
        }
    };

    DynoForm.prototype.getRowRenderLocationForField = function(row_number, form){
        var row_class = "row-"+row_number;
        if(form.find("." + row_class).length){
            return form.find("." + row_class);
        } else {
            var row_div = $("<div>");
            row_div.addClass(row_class);
            row_div.addClass("row row-fluid");
            form.append(row_div);
            return row_div;
        }
    };

    DynoForm.prototype.getFieldRenderLocation = function (field_map, optional_row_number_for_custom_layout) {
        var form = this.$form ;
        if(this.config["layout"]=="inline"){
            return form;
        }
        if(this.config["layout"]=="2-column") {
            var row_number = this.findRowOfFieldFromLayout(field_map);
            return this.getRowRenderLocationForField(row_number, form);
        }
        if($.isArray(this.config["layout"])) {
            return this.getRowRenderLocationForField(optional_row_number_for_custom_layout, form);
        }
        return form;
    };

    DynoForm.prototype.getFieldConfigMap = function(field_name){
        var field_map = {};
        $.each(this.config["fields"], function(row_index, field_item) {
            if(field_item["name"]==field_name){
                console.log("bingo", field_item);
                field_map = field_item;
            }
        });
        return field_map;
    };

    DynoForm.prototype.createFormFields = function () {
        var me = this;
        if($.isArray(this.config["layout"])){
            $.each(this.config["layout"], function(row_index, row_list) {
                $.each(row_list, function(index, field_name){
                    var field_map = me.getFieldConfigMap(field_name);
                    me.createLabeledField(field_map, me.getFieldRenderLocation(field_map, row_index));
                });
            });
        } else {
            for (var i=0; i< this.config["fields"].length; i++) {
                var field_map = this.config["fields"][i];
                this.createLabeledField(field_map, this.getFieldRenderLocation(field_map));
            }
        }
    };

    DynoForm.prototype.updateValues = function (values) {
        var vals = {};
        if(values){
            jQuery.extend(vals,values);
        }
        for(var key in vals){
            var $field = this.$form.find("[name="+ key + "]");
            if($field){
                $field.data("dynoform-field").set($field, vals[key]);
            }
        }
        this.$element.trigger("dynoform:value_loaded", [this.config]);
    };

    DynoForm.prototype.getValuesSetInConfig = function(){
        return this.config.values;
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
            for(var key in this.config["errors"]){
                var error_message = this.getErrorMessage(this.config["errors"][key]);
                var field_map = this.getFieldSchemaFromConfig(key);
                if(field_map){
                    var dom_to_atttach_to = this.getErrorRenderLocation(key, field_map);
                    dom_to_atttach_to.after(error_message);
                }
            }
        }
    };

    DynoForm.prototype.getFieldSchemaFromConfig = function(field_name){
        for(var i=0; i<this.config["fields"].length; i++){
            var field = this.config["fields"][i];
            if( field["name"]==field_name){
                return field;
            }
        }
        return null;
    };

    DynoForm.prototype.getErrorRenderLocation = function (field_name, field_map) {
        var dom_to_atttach_to = this.$form.find("[name='" + field_name + "']:last");
        if (field_map["type"] == "checkbox") {
            //name of checkbox altered to
            dom_to_atttach_to = this.$form.find("[name='" + field_name + "[]']:last").parent();

        }
        if (field_map["type"] == "radio") {
            //name of checkbox altered to
            dom_to_atttach_to = this.$form.find("[name='" + field_name + "']:last").parent();
        }
        return dom_to_atttach_to;
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
        this.createFormElement();
        this.createFormFields();
        this.updateValues(this.getValuesSetInConfig());
        this.displayErrors();
        this.displayGlobalError();
        this.createActionButtons();
        this.$element.append(this.$form);
        this.$element.trigger("dynoform:render_complete", [this.config]);
    };


    /* Exposed Methods */
    DynoForm.prototype.getValues = function () {
        var values = {};
        for (var i=0; i< this.config["fields"].length; i++) {
            var field_map = this.config["fields"][i];
            var field_name = field_map["name"];
            var $field = this.$form.find("[name="+ field_name+ "]");
            values[field_name] = $field.data("dynoform-field").val($field);
        }
        return values;
    };
    ////////////////////////////////////////////////////
    ///////////////// TextField ///////////////////////
    ///////////////////////////////////////////////////
    var Text = {
        base_render : function(field_map, dynoform){
            var el = $("<input>").attr("name", field_map["name"]).attr("type","text");
            if(field_map["extra_attributes"]){
                for (var key in field_map["extra_attributes"]){
                    el.attr(key, field_map["extra_attributes"][key]);
                }
            }
            return el;
        },
        render: function(field_map, dynoform){
            return this.base_render(field_map, dynoform);
        },
        set : function(el, value){
            el.val(value);
        },
        val : function(el){
            return el.val();
        }
    };
    var Password = {};

    $.extend(Password, Text, {
        "render": function(field_map, dynoform){
            var el = this.base_render(field_map, dynoform);
            el.attr("type","password");
            return el;
        }
    });

    var TextArea = {};
    $.extend(TextArea, Text, {
        render : function(field_map, dynoform){
            var el = $("<textarea>").attr("name", field_map["name"]);
            if(field_map["extra_attributes"]){
                for (var key in field_map["extra_attributes"]){
                    el.attr(key, field_map["extra_attributes"][key]);
                }
            }
            return el;
        }
    });

    var Select = {
        render: function(field_map, dynoform){
            el = $("<select>").attr("name", field_map["name"]);
            var option;
            for(var key in field_map["options"]){
                option = $("<option>");
                option.attr("value", field_map["options"][key][1]);
                option.text(field_map["options"][key][0]);
                el.append(option);
            }
            if(field_map["extra_attributes"]){
                for (var key in field_map["extra_attributes"]){
                    el.attr(key, field_map["extra_attributes"][key]);
                }
            }
            return el;
        },
        set : function(el, value){
            el.val(value);
        },
        val : function(el){
            return el.val();
        }
    };


    var Checkbox = {
        render : function(field_map, dynoform){
            var el_list = $("<div>");
            el_list.attr("name", field_map["name"]);
            var el, lb, key;
            for(key in field_map["options"]){
                lb = $("<label>");
                el = $("<input>");
                el.attr("value", field_map["options"][key][1]);
                el.attr("type", field_map["type"]);
                lb.append(el);
                lb.append(field_map["options"][key][0]);
                el_list.append(lb);
            }
            if(field_map["extra_attributes"]){
                for (key in field_map["extra_attributes"]){
                    el.attr(key, field_map["extra_attributes"][key]);
                }
            }
            return el_list;
        },
        set : function(el, value_list){
            for( var value_index in value_list){
                el.find("[value='" + value_list[value_index] + "']").attr("checked","checked");
            }
        },
        val : function(el){
            var values = [];
            el.find(":checked").each(function(){
                var ck = $(this);
                values.push(ck.attr("value"));
            });
            return values;
        }
    };

    var Radio = {};
    $.extend(Radio,Checkbox, {
        "set" : function(el, value){
            el.find("[value='" +  value+ "']").attr("checked","checked");
        },
        "val" : function(el){
            var values = [];
            el.find(":checked").each(function(){
                var ck = $(this);
                values.push(ck.attr("value"));
            });
            return values;
        }
    });

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

    $.fn.dynoFormValues = function(value_map){
        if (this.data("dynoform")) {
            if(value_map) {
                this.data("dynoform")["updateValues"](value_map);
            } else {
                return this.data("dynoform")["getValues"]();
            }
        }
    };

    $.dynoForm = {};

    $.dynoForm.internals = {
        "DynoForm" : DynoForm
    };

    $.dynoForm.register = function(key, field){
        DynoForm.add_field(key, field);
    };

    $.dynoForm.register("text",Text);
    $.dynoForm.register("passwrod",Password);
    $.dynoForm.register("textarea",TextArea);
    $.dynoForm.register("select",Select);
    $.dynoForm.register("checkbox",Checkbox);
    $.dynoForm.register("radio",Radio);

}(jQuery));