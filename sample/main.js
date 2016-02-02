import ConsulRestClient from '../src/consul-rest-client';

async function main() {

    let client = new ConsulRestClient("http://localhost", 8500);

    //await client.registerServiceAsync("test-svc", "test-id", "http://localhost:6964/");
    //let response = await client.findServiceAsync("test-svc");
    //let response = await client.unRegisterServiceAsync("test-svc");
    let response = await client.getCriticalServicesAsync();

    response.forEach(async (criticalServiceId)=> {
        await client.unRegisterServiceAsync(criticalServiceId);
    });
}

main();
console.log("[MAIN] STARTED");