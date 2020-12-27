const {smarthome} = require('actions-on-google');
const devices = require('./devices.js');
const Light = require('./light.js');
const mqtt = require('mqtt');


module.exports = createApplication;


const TOPIC = 'bedroom/lamp/setState';
const UPDATE_TOPIC = 'bedroom/lamp/state';
const BROKER_HOST = 'mqtt://broker';


function createApplication() {
    const client = mqtt.connect(BROKER_HOST);
    client.on('connect', () => {
        client.subscribe(UPDATE_TOPIC);
    });
    const light = new Light(client);

    const fulfillment = createFulfillment(light);
    const app = {fulfillment};

    return app;
}

function createFulfillment(light) {
    const fulfillment = smarthome()

    fulfillment.onSync((body, headers) => {
        return {
            requestId: body.requestId,
            payload: {
                agentUserId: '1',
                devices: devices
            }
        }
    });

    fulfillment.onQuery((body, headers) => {
        return {
            requestId: body.requestId,
            payload: {
                devices: {
                    '1': {
                        online: true,
                        status: 'SUCCESS',
                        on: light.state
                    }
                }
            }
        }
    });

    fulfillment.onExecute((body, headers) => {
        const value = body.inputs[0].payload.commands[0].execution[0].params.on;
        
        light.setLight(value);

        return {
            requestId: body.requestId,
            payload: {
                commands: [
                    {
                        ids: ['1'],
                        status: 'SUCCESS'
                    }
                ]
            }
        }
    });
    return fulfillment;
}
