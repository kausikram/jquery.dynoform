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
            "fieldsets":[]
        }
    });

    describe("constructor", function(){
        it("should call updateConfig and update its configs", function(){
            var DynoForm = jQuery.dynoForm.internals.DynoForm;
            spyOn(DynoForm.prototype, "updateConfig").andCallThrough();
            var dynoForm = new DynoForm(jQuery("<div>"), test_configs);
            expect(DynoForm.prototype.updateConfig).toHaveBeenCalledWith(test_configs);
        });
        it("should call loadRemoteStructure if the remote_form_structure param is set on the configs", function(){
            var DynoForm = jQuery.dynoForm.internals.DynoForm;
            spyOn(DynoForm.prototype, "loadRemoteStructure");
            var dynoForm = new DynoForm(jQuery("<div>"), {"remote_form_structure":"blah"});
            expect(DynoForm.prototype.loadRemoteStructure).toHaveBeenCalled();
        });
        it("should call renderForm if the remote_form_structure param is not set", function(){
            var DynoForm = jQuery.dynoForm.internals.DynoForm;
            spyOn(DynoForm.prototype, "renderForm");
            var dynoForm = new DynoForm(jQuery("<div>"), test_configs);
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
        it("should copy configuration set and override default values with it", function(){
            var DynoForm = jQuery.dynoForm.internals.DynoForm;
            var dynoForm = new DynoForm(jQuery("<div>"), test_configs);
            expect(dynoForm.config.form).toEqual({});
            test_configs["form"]["foo"] = "bar";
            dynoForm.updateConfig(test_configs);
            expect(dynoForm.config.form).toEqual({"foo":"bar"});
        });
    });
});