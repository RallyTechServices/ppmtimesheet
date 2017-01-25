
Ext.define('Rally.apps.ppmtimesheet.PPMTimesheetApp', {
    extend: 'Rally.app.App',

    logger: new Rally.technicalservices.Logger(),

    mixins: ['Rally.clientmetrics.ClientMetricsRecordable'],

    appName: 'PPM Timesheet Frame',

    config: {
        defaultSettings: {
            ppmHost: null,
            ppmPort: 443
        }
    },
    autoScroll: false,
    timesheetSuffix:  '/pm/integration.html#',

    launch: function() {

        var server = this.getPPMHost(),
            port = this.getPPMPort();

         this.validateConfig(server, port).then({
                success: this.addFrame,
                failure: this.showAppMessage,
                scope: this
        });
    },
    addFrame: function(){
        this.logger.log('addFrame');
        var server = this.getPPMHost(),
            port = this.getPPMPort(),
            url = this.buildPPMTimesheetURL(server, port);

        try {
            var iframe = this.add({
                xtype: 'component',
                itemId: 'ppmIframe',
                autoEl: {
                    tag: 'iframe',
                    style: 'height: 100%; width: 100%; border: none;',
                    src: url
                }
            });


            var me = this;
            iframe.getEl().dom.onload = function(e){
                me.logger.log('iframe loaded', e, iframe.getEl().dom);
            };
        }
        catch(e){
            Rally.ui.notify.Notifier.showError({message: Ext.String.format("Error loading {0} into iFrame.",url)});
        }

    },
    validateConfig: function(server, port){
        var deferred = Ext.create('Deft.Deferred');

        if (!server){
            deferred.reject("No PPM Server and Port is configured.  Please work with an administrator to configure your PPM https server.");
        } else {
            //Commented this out due to the chrome issue, as this fails on it.
            //var httpRequest = new XMLHttpRequest(),
            //    suffix = '/ppm/rest/v1/private/userContext',
            //url = this.buildPPMTimesheetURL(server, port);
            //
            //url = url.replace(this.timesheetSuffix, suffix);
            //
            //httpRequest.withCredentials = true;
            //httpRequest.cors = true;
            //httpRequest.onreadystatechange = function() {
            //    console.log('ready', httpRequest.readyState, httpRequest.status);
            //    if (httpRequest.readyState === 4) {
            //        console.log('readystate', httpRequest);
            //        if (httpRequest.status !== 200) {
            //            console.log('Failed', httpRequest.status);
            //            var msg = Ext.String.format('The PPM Server and Port provided is not responding as expected.  Please verify the configuration in the App Settings.');
            //            deferred.reject(msg);
            //        } else {
                        deferred.resolve();
            //        }
            //    }
            //};
            //httpRequest.open('GET', url);
            //httpRequest.send();
        }

        return deferred;
    },
    buildPPMTimesheetURL: function(server, port){
        var url = Ext.String.format("https://{0}",server);
        if (port){
            url = Ext.String.format("{0}:{1}", url, port);
        }
        return url + this.timesheetSuffix;
    },
    getPPMHost: function(){
        return this.getSetting('ppmHost') || null;
    },
    getPPMPort: function(){
        return this.getSetting('ppmPort') || null;
    },
    showAppMessage: function(msg){
        this.removeAll();
        this.add({
            xtype: 'container',
            html: Ext.String.format('<div class="no-data-container"><div class="secondary-message">{0}</div></div>',msg)
        });
    },
    getSettingsFields: function () {

        return [{
            xtype: 'container',
            html: '<div class="secondary-message" style="font-family: ProximaNovaBold,Helvetica,Arial;text-align:left;color:#B81B10;font-size:12pt;">NOTE:  The PPM server must be version 15.2 or above.</div>'
        },{
            name: 'ppmHost',
            xtype: 'rallytextfield',
            width: 400,
            labelWidth: 100,
            labelAlign: 'right',
            fieldLabel: 'PPM Host name',
            margin: '10 0 10 0',
            maskRe:  /[a-zA-Z0-9\.\-]/,
            emptyText: 'Please enter a Host name or IP Address...',
            maxLength: 255
        },{
            name: 'ppmPort',
            xtype:'rallynumberfield',
            labelAlign: 'right',
            fieldLabel: 'Port (HTTPS)',
            labelWidth: 100,
            emptyText: 443,
            minValue: 0,
            maxValue: 65535,
            allowBlank: true,
            allowDecimals: false,
            allowExponential: false
        }];
    }
});