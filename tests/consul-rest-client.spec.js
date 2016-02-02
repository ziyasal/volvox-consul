import chai from 'chai';

import {ConsulRestClient} from '../src/index';

chai.should();

describe('ConsulRestClient:', ()=> {

    let client;

    beforeEach(()=> {
        client = new ConsulRestClient("http://172.17.42.1", 8500);
    });

    describe('#ctor', ()=> {

        it('should create instance', ()=> {
            (!!client).should.be.equal(true);
        });
    });

});