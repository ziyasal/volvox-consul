import ConsulProvider from './consul-provider';
import ConsulRestClient from './consul-rest-client'

import bunyan from 'bunyan'
import {RandomProvider} from 'volvox-core'

export default (logger, consulClient, randomProvider)=> {

    return new ConsulProvider(
        logger || bunyan.createLogger({ name: "volvox.js" })
        , consulClient || new ConsulRestClient()
        , randomProvider || new RandomProvider())

}