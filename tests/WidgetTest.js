describe("When testing a Widget", function() {
    var widget;

    beforeEach(function() {
        widget = Widget({
            name: 'testWidgetName',
            size: 'full',
            config: {
                testKey: 'testValue'
            }
        })
    });

    it("the widget element is correctly set", function() {

        var element = document.createElement('section');
        element.id = widget.HTML.getID();
        document.body.appendChild(element);

        widget.setElement();

        expect(widget.getElement()).toEqual(jasmine.any(HTMLElement));
        expect(widget.getElement().id).toEqual(widget.HTML.getID());
    });

    it("the name is correctly set", function() {
        expect(widget.getName()).toEqual('testWidgetName');
    });

    it("the config obj is correctly set", function() {
        var testConfig = {
            testKey: 'testValue'
        };

        expect(widget.getConfig()).toEqual(testConfig);
    });

    it("the config HTML ID is correctly set", function() {
        var widgetID = widget.getWidgetID() + '-';
        expect(widget.getHTMLID()).toEqual('Widget' + widgetID + widget.getName());
    });

    it("the html position class is correctly set", function() {
        expect(widget.HTML.getpositionClass()).toEqual(' widget--left');
    });

    it("the html size class is correctly set", function() {
        expect(widget.HTML.getsizeClass()).toEqual(' widget--full');
    });

});
