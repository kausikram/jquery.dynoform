describe("Canary",function(){
    it("should pass", function(){
        expect(true).toBeTruthy();
    });
});

describe("DynoForm jQuery Actions",function(){
    var test_configs;
    beforeEach(function(){
        test_configs = {
            "form":{},
            "fields":[],
            "buttons":[],
            "fieldsets":[]
        }
    });
    it("should init the dynoform object and save it to the data on data-dynoform", function(){
        var d = jQuery("<div>");
        expect(d.data("dynoform")).toEqual(undefined);
        d.dynoForm(test_configs);
        expect(d.data("dynoform")).not.toEqual(null);
    });
    it("should add the dynoForm dict to jQuery object", function(){
        expect(jQuery.dynoForm).toBeDefined();
    });
    it("should expose the dynoform internals for testing", function(){
        expect(jQuery.dynoForm.internals).toBeDefined();
    });
});

describe("DynoForm",function(){
    var test_configs;
    beforeEach(function(){
        test_configs = {
            "form":{},
            "fields":[],
            "buttons":[],
            "fieldsets":[["Default","default",{"fieldset_foo":"fieldset_bar"}]]
        }
    });

    describe("constructor", function(){
        it("should call updateConfig and update its configs", function(){
            var DynoForm = jQuery.dynoForm.internals.DynoForm;
            spyOn(DynoForm.prototype, "updateConfig").andCallThrough();
            new DynoForm(jQuery("<div>"), test_configs);
            expect(DynoForm.prototype.updateConfig).toHaveBeenCalledWith(test_configs);
        });
        it("should call loadRemoteStructure if the remote_form_structure param is set on the configs", function(){
            var DynoForm = jQuery.dynoForm.internals.DynoForm;
            spyOn(DynoForm.prototype, "loadRemoteStructure");
            new DynoForm(jQuery("<div>"), {"remote_form_structure":"blah"});
            expect(DynoForm.prototype.loadRemoteStructure).toHaveBeenCalled();
        });
        it("should call renderForm if the remote_form_structure param is not set", function(){
            var DynoForm = jQuery.dynoForm.internals.DynoForm;
            spyOn(DynoForm.prototype, "renderForm");
            new DynoForm(jQuery("<div>"), test_configs);
            expect(DynoForm.prototype.renderForm).toHaveBeenCalled();
        });
    });

    describe("updateConfig", function(){
        it("should copy configuration set and override default values with it", function(){
            var DynoForm = jQuery.dynoForm.internals.DynoForm;
            var dynoForm = new DynoForm(jQuery("<div>"), test_configs);
            expect(dynoForm.config.form).toEqual({});
            test_configs["form"]["foo"] = "bar";
            dynoForm.updateConfig(test_configs);
            expect(dynoForm.config.form).toEqual({"foo":"bar"});
        });
    });

    describe("renderForm", function(){
        it("should Create the form by delegating to the various methods", function(){
            var DynoForm = jQuery.dynoForm.internals.DynoForm;
            var dynoForm = new DynoForm(jQuery("<div>"), test_configs);
            spyOn(dynoForm,"createFormElement");
            spyOn(dynoForm,"createFieldsets");
            spyOn(dynoForm, "updateFormFields");
            spyOn(dynoForm,"updateValues");
            spyOn(dynoForm,"displayErrors");
            spyOn(dynoForm,"displayGlobalError");
            spyOn(dynoForm,"createActionButtons");
            dynoForm.renderForm();
            expect(dynoForm.createFormElement).toHaveBeenCalled();
            expect(dynoForm.createFieldsets).toHaveBeenCalled();
            expect(dynoForm.updateFormFields).toHaveBeenCalled();
            expect(dynoForm.updateValues).toHaveBeenCalled();
            expect(dynoForm.displayErrors).toHaveBeenCalled();
            expect(dynoForm.displayGlobalError).toHaveBeenCalled();
            expect(dynoForm.createActionButtons).toHaveBeenCalled();
        });

        it("should send the render_complete signal on the div once all the methods are called", function(){
            var dom = jQuery("<div>");
            var DynoForm = jQuery.dynoForm.internals.DynoForm;
            var dynoForm = new DynoForm(dom, test_configs);
            var mock_callback = jasmine.createSpy("mock object");
            dom.on("dynoform:render_complete", mock_callback);
            spyOn(dynoForm,"createFormElement");
            spyOn(dynoForm,"createFieldsets");
            spyOn(dynoForm, "updateFormFields");
            spyOn(dynoForm,"updateValues");
            spyOn(dynoForm,"displayErrors");
            spyOn(dynoForm,"displayGlobalError");
            spyOn(dynoForm,"createActionButtons");
            expect(mock_callback).not.toHaveBeenCalled();
            dynoForm.renderForm();
            expect(mock_callback).toHaveBeenCalled();
        });
    });

    describe("createFormElement", function(){
        it("should create the form element and then should add the properties passed to it", function(){
            var dom = jQuery("<div>");
            var DynoForm = jQuery.dynoForm.internals.DynoForm;
            spyOn(DynoForm.prototype, "renderForm");
            //we dont want to render form directly we want to trigger it manually
            test_configs["form"] = {"name":"kaboom", "foo":"bar"};
            var dynoForm = new DynoForm(dom, test_configs);
            dynoForm.createFormElement();
            expect(dynoForm.$form).toBeDefined();
            expect(dynoForm.$form.attr("name")).toEqual("kaboom");
            expect(dynoForm.$form.attr("foo")).toEqual("bar");
        });
    });

    describe("createFieldsets", function(){
        it("should create the appropriate fieldset elements", function(){
            var dom = jQuery("<div>");
            var DynoForm = jQuery.dynoForm.internals.DynoForm;
            spyOn(DynoForm.prototype, "renderForm");
            var dynoForm = new DynoForm(dom, test_configs);
            dynoForm.$form = jQuery("<form>");
            expect(dynoForm.$form.find("fieldset").length).toEqual(0);
            dynoForm.createFieldsets();
            expect(dynoForm.$form.find("fieldset").length).toEqual(1);
            expect(dynoForm.$form.find("fieldset").attr("name")).toEqual("default");
            expect(dynoForm.$form.find("fieldset").attr("fieldset_foo")).toEqual("fieldset_bar");
        });

        it("should handle the case when no fieldsets are passed to the constructor", function(){
            var dom = jQuery("<div>");
            var DynoForm = jQuery.dynoForm.internals.DynoForm;
            spyOn(DynoForm.prototype, "renderForm");
            delete test_configs["fieldsets"];
            var dynoForm = new DynoForm(dom, test_configs);
            dynoForm.createFieldsets();
        });
    });

    describe("createField", function(){
        it("should create the field dom by calling the the fieldHandler", function(){
            var dom = jQuery("<div>");
            var DynoForm = jQuery.dynoForm.internals.DynoForm;
            spyOn(DynoForm.prototype, "renderForm");
            var dynoForm = new DynoForm(dom, test_configs);
            var mock_field_type_handler = jasmine.createSpyObj("handler",["render"]);
            var mock_el_dom = jQuery("<div>");
            mock_field_type_handler.render.andReturn(mock_el_dom);
            spyOn(dynoForm,"getFieldHandler").andReturn(mock_field_type_handler);
            dynoForm.createField({"type":"footype"});
            expect(mock_field_type_handler.render).toHaveBeenCalled();
        });

        it("should add a data reference on the field that has been created", function(){
            var dom = jQuery("<div>");
            var DynoForm = jQuery.dynoForm.internals.DynoForm;
            spyOn(DynoForm.prototype, "renderForm");
            var dynoForm = new DynoForm(dom, test_configs);
            var mock_field_type_handler = jasmine.createSpyObj("handler",["render"]);
            var mock_el_dom = jQuery("<div>");
            mock_field_type_handler.render.andReturn(mock_el_dom);
            spyOn(dynoForm,"getFieldHandler").andReturn(mock_field_type_handler);
            dynoForm.createField({"type":"footype"});
            expect(mock_el_dom.data("dynoform-field")).toEqual(mock_field_type_handler);
        });

        it("should throw an error when the field type is not defined", function(){
            var dom = jQuery("<div>");
            var DynoForm = jQuery.dynoForm.internals.DynoForm;
            spyOn(DynoForm.prototype, "renderForm");
            var dynoForm = new DynoForm(dom, test_configs);
            expect(function() { dynoForm.createField({"type":"footype"}) }).toThrow("Error: field type not defined");
        });
    });

    describe("createLabel", function(){
        it("should create and return a label also setting the for attr", function(){
            var dom = jQuery("<div>");
            var DynoForm = jQuery.dynoForm.internals.DynoForm;
            spyOn(DynoForm.prototype, "renderForm");
            var dynoForm = new DynoForm(dom, test_configs);
            var label = dynoForm.createLabel({"label":"Name", name:"name"});
            expect(label.attr("for")).toEqual("name");
            expect(label.text()).toEqual("Name");
        });
        it("should add a * when the field is redquired", function(){
            var dom = jQuery("<div>");
            var DynoForm = jQuery.dynoForm.internals.DynoForm;
            spyOn(DynoForm.prototype, "renderForm");
            var dynoForm = new DynoForm(dom, test_configs);
            var label = dynoForm.createLabel({"label":"Name", name:"name", "required":true});
            expect(label.attr("for")).toEqual("name");
            expect(label.text()).toContain("Name");
            expect(label.find("b").length).toEqual(1);
            expect(label.find("b").text()).toContain("*");
        })
    });

    describe("createLabeledField", function(){
        it("should delegate the call to createLabel and create Field", function(){
            var dom = jQuery("<div>");
            var DynoForm = jQuery.dynoForm.internals.DynoForm;
            spyOn(DynoForm.prototype, "renderForm");
            var dynoForm = new DynoForm(dom, test_configs);
            var mock_form = jasmine.createSpyObj("mock form jquery obj", ["find"]);
            var mock_field_set = jasmine.createSpyObj("mock fieldset jquery obj", ["append"]);
            dynoForm.$form = mock_form;
            mock_form.find.andReturn(mock_field_set);
            spyOn(dynoForm,"createLabel");
            spyOn(dynoForm,"createField");
            dynoForm.createLabeledField({});
            expect(dynoForm.createLabel).toHaveBeenCalled();
            expect(dynoForm.createField).toHaveBeenCalled();
            expect(mock_field_set.append).toHaveBeenCalled();
            expect(mock_field_set.append.callCount).toEqual(2);
        });
    });

    describe("updateValues", function(){
        it("should call the set on the various field handlers", function(){
            var dom = jQuery("<div>");
            var DynoForm = jQuery.dynoForm.internals.DynoForm;
            spyOn(DynoForm.prototype, "renderForm");
            var dynoForm = new DynoForm(dom, test_configs);
            var mock_form = jasmine.createSpyObj("mock form jquery obj", ["find"]);
            var mock_field_handler = jasmine.createSpyObj("mock field handler", ["render","set"]);
            var mock_field = jasmine.createSpyObj("mock field jquery obj", ["data"]);
            dynoForm.$form = mock_form;
            mock_form.find.andReturn(mock_field);
            mock_field.data.andReturn(mock_field_handler);
            dynoForm.updateValues({"name":"jdoe"});
            expect(mock_field_handler.set).toHaveBeenCalledWith(mock_field, "jdoe");
        });

        it("should not call when values for unknown field are passed", function(){
            var dom = jQuery("<div>");
            var DynoForm = jQuery.dynoForm.internals.DynoForm;
            spyOn(DynoForm.prototype, "renderForm");
            var dynoForm = new DynoForm(dom, test_configs);
            var mock_form = jasmine.createSpyObj("mock form jquery obj", ["find"]);
            var mock_field_handler = jasmine.createSpyObj("mock field handler", ["render","set"]);
            var mock_field = jasmine.createSpyObj("mock field jquery obj", ["data"]);
            dynoForm.$form = mock_form;
            //find returned null instead of the field dom
            mock_form.find.andReturn(null);
            mock_field.data.andReturn(mock_field_handler);
            dynoForm.updateValues({"name":"jdoe"});
            expect(mock_field_handler.set).not.toHaveBeenCalled();
        });
    });

    describe("getValuesSetInConfig", function(){
        it("should return the values set in config", function(){
            var dom = jQuery("<div>");
            var DynoForm = jQuery.dynoForm.internals.DynoForm;
            spyOn(DynoForm.prototype, "renderForm");
            var values_dict = {"name":"jdoe","foo":"bar"};
            test_configs["values"] = values_dict;
            var dynoForm = new DynoForm(dom, test_configs);
            expect(dynoForm.getValuesSetInConfig()).toEqual(values_dict);
        });
    });

    describe("getErrorMessage", function(){
        var dynoForm;
        beforeEach(function(){
            var dom = jQuery("<div>");
            var DynoForm = jQuery.dynoForm.internals.DynoForm;
            spyOn(DynoForm.prototype, "renderForm");
            dynoForm = new DynoForm(dom, test_configs);
        });

        it("should create an error message with the default class", function(){
            var error_div = dynoForm.getErrorMessage("there was an error");
            expect(error_div.hasClass("error")).toBeTruthy();
            expect(error_div.text()).toEqual("there was an error");
        });

        it("should create a list of messages and render it within the default class container", function(){
            var error_div = dynoForm.getErrorMessage(["there was an error", "there was another as well"]);
            expect(error_div.hasClass("error")).toBeTruthy();
            expect(error_div.find("ul").length).toEqual(1);
            expect(error_div.find("ul").find("li").length).toEqual(2);
            expect(jQuery(error_div.find("ul").find("li").get(0)).text()).toEqual("there was an error");
            expect(jQuery(error_div.find("ul").find("li").get(1)).text()).toEqual("there was another as well");
        });

        it("should use the error message template when provided to it", function(){
            var erro_message_creater = jasmine.createSpy("mock error creater");
            dynoForm.config["errors_template"] = erro_message_creater;
                erro_message_creater.andReturn("boo");
            var error_div = dynoForm.getErrorMessage("there was an error");
            expect(error_div).toEqual("boo");
            expect(erro_message_creater).toHaveBeenCalledWith("there was an error");
        });
    });

    describe("displayErrors", function(){
        var dynoForm;
        beforeEach(function(){
            var dom = jQuery("<div>");
            var DynoForm = jQuery.dynoForm.internals.DynoForm;
            spyOn(DynoForm.prototype, "renderForm");
            dynoForm = new DynoForm(dom, test_configs);
        });
        it("should display errors based on the config:errors passed", function(){
            dynoForm.config["errors"] = {"foo":"bar"};
            spyOn(dynoForm,"getErrorMessage");
            spyOn(dynoForm,"getFieldSchemaFromConfig");
            spyOn(dynoForm, "getErrorRenderLocation");
            var error_render_location = jasmine.createSpyObj("error render location", ["after"]);
            dynoForm.getErrorRenderLocation.andReturn(error_render_location);
            dynoForm.getFieldSchemaFromConfig.andReturn({"name":"foo", "type":"input"});
            dynoForm.displayErrors();
            expect(dynoForm.getErrorMessage).toHaveBeenCalledWith("bar");
            expect(dynoForm.getFieldSchemaFromConfig).toHaveBeenCalledWith("foo");
            expect(dynoForm.getErrorRenderLocation).toHaveBeenCalledWith("foo", {"name":"foo", "type":"input"});
            expect(error_render_location.after).toHaveBeenCalled();
        });
        it("should fail sillenly if a key that is not a defined field is passed", function(){
            dynoForm.config["errors"] = {"foo":"bar"};
            spyOn(dynoForm,"getErrorMessage");
            spyOn(dynoForm,"getFieldSchemaFromConfig");
            spyOn(dynoForm, "getErrorRenderLocation");
            dynoForm.getErrorRenderLocation.andReturn(null);
            dynoForm.getFieldSchemaFromConfig.andReturn(null);
            dynoForm.displayErrors();
            expect(dynoForm.getErrorMessage).toHaveBeenCalledWith("bar");
            expect(dynoForm.getFieldSchemaFromConfig).toHaveBeenCalledWith("foo");
            expect(dynoForm.getErrorRenderLocation).not.toHaveBeenCalled();
        });
    });

    describe("getFieldSchemaFromConfig", function(){
        var dynoForm;
        beforeEach(function(){
            var dom = jQuery("<div>");
            var DynoForm = jQuery.dynoForm.internals.DynoForm;
            spyOn(DynoForm.prototype, "renderForm");
            dynoForm = new DynoForm(dom, test_configs);
        });

        it("should return the field dict from config for the given field name", function(){
            var field = {"name":"foo", "type":"text"};
            dynoForm.config["fields"] = [field];
            expect(dynoForm.getFieldSchemaFromConfig("foo")).toEqual(field);
        });

        it("should return null when a field with the given name is not found", function(){
            dynoForm.config["fields"] = [];
            expect(dynoForm.getFieldSchemaFromConfig("foo")).toBe(null);
        });
    });
});