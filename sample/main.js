import ConsulRestClient from '../lib/consul-rest-client';

async function main() {

    let client = new ConsulRestClient("http://172.17.42.1", 8500);

    await client.registerServiceAsync("test-svc", "test-id", "http://localhost:6964/");

    let response = await client.findServiceAsync("test-svc");
    console.log(response);
}

main();
console.log("[STARTED]");