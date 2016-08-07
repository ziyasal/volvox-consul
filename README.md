# volvox-consul
![](https://avatars3.githubusercontent.com/u/16361502?v=3&s=200)  ![](http://svgporn.com/logos/consul.svg)  

Consul provider for volvox.js Microservice framework  
[![Build Status](https://travis-ci.org/volvoxjs/volvox-consul.svg?branch=master)](https://travis-ci.org/volvoxjs/volvox-consul) [![Coverage Status](https://coveralls.io/repos/github/volvoxjs/volvox-consul/badge.svg?branch=master)](https://coveralls.io/github/volvoxjs/volvox-consul?branch=master)

**Sample code using Consul**
```js
import Volvox from 'volvox-core';
import vconsul from 'volvox-consul';
import vexpress from 'volvox-express';

import express from 'express'

async function main() {
    let server = express();

    server.get('/customers', (req, res) => {
       res.send({
            customerName: "Test customer",
            customerId: 666
        });
    });

    let volvox = new Volvox(vconsul(), vexpress());
    await volvox.bootstrap(server, "customers", "v1");
}

main();
```
