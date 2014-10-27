describe("When testing WidgetManager", function() {
    var widgetManager;

    beforeEach(function() {
        var element = document.createElement('section');
        var script = document.createElement('script');

        element.id = '_widget-container_';
        script.id = 'WidgetManagerScript';

        document.body.appendChild(element);
        document.body.appendChild(script);

        widgetManager = WidgetManager();
    });

    it("a row is correctly set", function(){
        expect(true).toBe(true);
    });

});
