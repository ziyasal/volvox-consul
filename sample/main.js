import ConsulRestClient from '../lib/consul-rest-client';

async function main() {

    let client = new ConsulRestClient("http://demo.consul.io", 80);

    await client.registerServiceAsync("at", "test-id", "http://localhost:6964/")
}

main();
console.log("[STARTED]");