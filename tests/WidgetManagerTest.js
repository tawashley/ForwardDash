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

    it("a row is correctly set", function() {
        expect(widgetManager.getRows().length).toEqual(0);

        widgetManager.defineRow({
            name: 'TopRow',
            widgets: [
                Widget({
                    name: 'ClockWidget',
                    size: 'half',
                    config: {
                        clock: {
                            showSeconds: false,
                        },
                        date: {}
                    }
                }),
                Widget({
                    name: 'CurrentWeatherWidget',
                    position: 'right',
                    config: {
                        celsius: true,
                        showMinMaxTemp: false,
                    }
                })
            ]
        });

        expect(widgetManager.getRows().length).toEqual(1);
        expect(widgetManager.getRows()[0].name).toEqual('TopRow');
        expect(widgetManager.getRows()[0].widgets.length).toEqual(2);
    });

});
