import ConsulProvider from './consul-provider';
import ConsulRestClient from './consul-rest-client'

import bunyan from 'bunyan'
import {RandomGenerator} from 'volvox-core'

export default (logger, consulClient, randomGenerator) => {
    //TODO: determine required parameters
    if (typeof consulClient === 'string') { consulClient = new ConsulRestClient(consulClient) }
    return new ConsulProvider(
        consulClient || new ConsulRestClient()
        , logger || bunyan.createLogger({ name: "volvox.js" })
        , randomGenerator || new RandomGenerator())

}