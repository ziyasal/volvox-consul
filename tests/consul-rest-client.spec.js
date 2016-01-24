import chai from 'chai';

import ConsulRestClient from '../lib/consul-rest-client';

chai.should();

describe('ConsulRestClient:', ()=> {

    let client;

    beforeEach(()=> {
        client = new ConsulRestClient("http://172.17.42.1", 8500);
    });

    describe('#ctor', ()=> {

        it('should create instance', ()=> {
            console.log(client);
            (!!client).should.be.equal(true);
        });
    });

});