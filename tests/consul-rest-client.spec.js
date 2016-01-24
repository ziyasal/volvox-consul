import chai from 'chai';

import ConsulRestClient from '../lib/consul-rest-client';

chai.should();

describe('ConsulRestClient', ()=> {
    let client;
    beforeEach(()=> {
        client = new ConsulRestClient();
    });

    describe('#ctor', ()=> {

        (!!client).should.be.equal(true);
    });

});