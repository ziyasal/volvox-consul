import chai from 'chai';

import sinon from "sinon";

import ConsulProvider from '../src/index';

chai.should();

describe('ConsulRestClient:', ()=> {

    let provider,
        consulClient = {}
        , logger = {
            info: function (msg) {
            }
        },
        consulClientMock, loggerMock;

    beforeEach(()=> {

        consulClientMock = sinon.mock(consulClient);
        loggerMock = sinon.mock(logger);

        provider = new ConsulProvider(consulClient, logger);
    });

    describe('#ctor', ()=> {

        it('should create instance', ()=> {
            (!!provider).should.be.equal(true);
        });
    });

});