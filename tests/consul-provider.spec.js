import chai from 'chai';

import sinon from "sinon";

import {ConsulProvider} from '../src/index';

chai.should();

describe('ConsulRestClient:', ()=> {

    let provider,
        consulClient = {}
        , logger = {
            info: function (msg) {
            }
        },
        randomProvider = {
            next: function (low, high) {

            }
        },
        consulClientMock, loggerMock, randomProviderMock;

    beforeEach(()=> {

        consulClientMock = sinon.mock(consulClient);
        loggerMock = sinon.mock(logger);
        randomProviderMock = sinon.mock(randomProvider);

        provider = new ConsulProvider(consulClient, logger, randomProvider);
    });

    describe('#ctor', ()=> {

        it('should create instance', ()=> {
            (!!provider).should.be.equal(true);
        });
    });

    describe('#bootstrapClientAsync', ()=> {

        it('should start reaper', async ()=> {
            let resp = await provider.bootstrapClientAsync();
            console.log(resp);
            resp.status.should.be.equal("STARTED");
        });
    });

});