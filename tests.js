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
    })
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

});