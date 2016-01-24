import request from 'request';
import os from 'os';
import {ServiceInformation} from 'microphone-core';

const DEFAULT_PORT = 8500;
const DEFAULT_HOST = 'http://localhost';

export default class ConsulRestClient {
    constructor(address, port) {
        this._address = address || DEFAULT_HOST;
        this._port = port || DEFAULT_PORT;
    }

    async registerServiceAsync(serviceName, serviceId, address) {
        let payload = {
            ID: serviceId,
            Name: serviceName,
            Tags: [`urlprefix-/${serviceName}`],
            Address: os.hostname(),
            Port: address.Port,
            Check: {
                HTTP: `${address}status`,
                Interval: "1s"
            }
        };

        let options = {
            uri: `${this._address}:${this._port}/v1/agent/service/register`,
            type: 'POST',
            json: payload
        };

        await  this.__request(options, "Could not register service");
    }

    async findServiceAsync(serviceName) {
        let options = {
            uri: `${this._address}:${this._port}/v1/health/service/${serviceName}`,
            type: 'GET'
        };

        let serviceArray = JSON.parse(await this.__request(options, "Could not find services"));

        return serviceArray.map(svcItem => new ServiceInformation(svcItem["Service"]["Address"], svcItem["Service"]["Port"]));
    }

    async getCriticalServicesAsync() {
        var options = {
            uri: `${this._address}:${this._port}/v1/health/state/critical`,
            type: 'GET'
        };

        let serviceArray = JSON.parse(await this.__request(options, "Could not get service health"));

        return serviceArray.map(svcItem => svcItem["ServiceID"]);
    }

    async unRegisterServiceAsync(serviceId) {
        var options = {
            uri: `${this._address}:${this._port}/v1/agent/service/deregister/${serviceId}`,
            type: 'GET'
        };

        await this.__request(options, "Could not de register service");
    }

    setPort(port) {
        this._port = port || DEFAULT_PORT;
    }

    __request(options, message) {
        return new Promise((resolve, reject)=> {
            request(options, (error, response, body)=> {
                if (error) return reject(new Error(message));

                resolve(body);
            });
        });
    }
}