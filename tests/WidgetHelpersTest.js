describe("When testing WidgetHelpers", function() {
    var helpers = WidgetHelpers();

    describe("and testing config functions", function() {

        it("correctly sets a config value if provided", function() {
            var value = helpers.config.setValue("foobar", "defaultValue");
            expect(value).toEqual("foobar");
        });

        it("correctly sets a config default value if value is undefined", function() {
            var value = helpers.config.setValue(undefined, "defaultValue");
            expect(value).toEqual("defaultValue");
        });

        it("correctly check if a given value is undefined", function() {
            var isUndefined = undefined;
            var notUndefined = "foobar";

            expect(helpers.config.isUndefined(isUndefined)).toBe(true);
            expect(helpers.config.isUndefined(notUndefined)).toBe(false);
        });

    });

    describe("and testing date functions", function() {

        it("returns a day string correctly", function() {
            expect(helpers.date.getDayString(1)).toEqual("Monday");
        });

        it("returns a short day string correctly", function() {
            expect(helpers.date.getDayString(1, true)).toEqual("Mon");
        });

        it("returns a month string correctly", function() {
            expect(helpers.date.getMonthString(1)).toEqual("February");
        });

        it("returns a short month string correctly", function() {
            expect(helpers.date.getMonthString(1, true)).toEqual("Feb");
        });

    })

    it("correctly check if object is empty", function() {
        var emptyObj = {};
        var notEmptyObj = {
            foo: "bar"
        };

        expect(helpers.isEmptyObject({})).toBe(true);
        expect(helpers.isEmptyObject({
            foo: "bar"
        })).toBe(false);

    })
});
