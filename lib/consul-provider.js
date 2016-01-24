import {ServiceInformation, ClusterProvider} from 'microphone-core';
import {CronJob} from 'cron';

export default class ConsulProvider extends ClusterProvider {

    constructor(client, logger) {
        this._client = client;
        this._logger = logger;

        this._serviceName = "";
        this._serviceId = "";
        this._version = "";
        this._uri = "";
        this._useEbayFabio = false;
    }

    async findServiceInstancesAsync(name) {
        if (this._useEbayFabio === true) {
            return [
                new ServiceInformation("http://localhost", 9999)
            ];
        }

        return this._client.findServiceAsync(name);
    }

    async registerServiceAsync(serviceName, serviceId, version, uri) {
        this._serviceName = serviceName;
        this._serviceId = serviceId;
        this._version = version;
        this._uri = uri;
        await this._client.registerServiceAsync(serviceName, serviceId, uri);

        this.__startReaper();
    }

    async bootstrapClientAsync() {
        this.__startReaper();

        //Task.FromResult(0);
        return new Promise((resolve, reject)=> {
            return resolve({});
        });
    }

    __startReaper() {
        function actionCompleteHandler(err, httpResponse, body) {
            //noop
        }

        var lookup = [];

        async function onTick() {
            if (this._port > 0) this._client.setPort(this._port);


            try {
                var res = await this._client.getCriticalServicesAsync();

                for (let criticalServiceId in res) {
                    if (lookup.indexOf(criticalServiceId) !== -1) {
                        await c.unRegisterServiceAsync(criticalServiceId);
                        this._logger.info(`Reaper: Removing ${criticalServiceId}`);
                    }
                    else {
                        lookup.push(criticalServiceId);
                        this._logger.info(`Reaper: Marking ${criticalServiceId}`);
                    }
                }

                //remove entries that are no longer critical
                lookup.filter(serviceId => !(lookup.indexOf(serviceId) !== -1));

            }
            catch (ex) {
                this._logger.error(ex, "Crashed");
            }
        }

        try {
            let job = new CronJob({
                    cronTime: "*/5 * * * * *" /*every 5 seconds*/,
                    onTick: onTick.bind(this),
                    start: false
                }
            );

            job.start();
            this._logger.info("Reaper: started..");
        }
        catch (ex) {
            this._logger.error(ex);
        }
    }
}