
window.onerror = function (message, url, lineNo) {
    alert('Error: ' + message +
        '\nUrl: ' + url +
        '\nLine Number: ' + lineNo);
    return true;
};

Ext.define('Rally.apps.ppmtimesheet.PPMTimesheetApp', {
    extend: 'Rally.app.App',

    mixins: ['Rally.clientmetrics.ClientMetricsRecordable'],

    appName: 'PPM Timesheet Frame',

    config: {
        defaultSettings: {
            ppmHost: null,
            ppmPort: 443
            //ppmRootUrl: 'https://misna03-232417:8043/'
        }
    },

    timesheetSuffix:  '/pm/#/timesheets',

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

        var server = this.getPPMHost(),
            port = this.getPPMPort();

        try {
            this.add({
                xtype: 'component',
                autoEl: {
                    tag: 'iframe',
                    style: 'height: 100%; width: 100%; border: none;overflow:hidden;',
                    src: this.buildPPMTimesheetURL(server, port),
                    scrolling: 'no'
                },
                listeners: {
                    added: function(){
                        console.log('added');
                    },
                    afterrender: function(){
                        console.log('afterrender');
                    },
                    onreadystatechange: function(){
                        console.log('onreadystatechange');
                    },
                    onerrorupdate: function(x){
                        console.log('onerror', x)
                    },
                    scope: this
                }
            });
        }
        catch(e){
            console.log('error', e);
        }
        console.log('done');

    },
    validateConfig: function(server, port){
        var deferred = Ext.create('Deft.Deferred');

        if (!server || !port){
            deferred.reject("No PPM Server and Port is configured.  Please work with an administrator to configure your PPM https server.");
        } else {
            //var httpRequest = new XMLHttpRequest(),
            //    url = this.buildPPMTimesheetURL(server, port);
            //httpRequest.withCredentials = true;
            //httpRequest.onreadystatechange = function() {
            //    console.log('ready', httpRequest.readyState, httpRequest.status);
            //    if (httpRequest.readyState === 4) {
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
            name: 'ppmHost',
            xtype: 'rallytextfield',
            width: 400,
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
            minValue: 0,
            maxValue: 65535,
            allowBlank: true,
            allowDecimals: false,
            allowExponential: false
        }];
    }
});