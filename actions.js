const {smarthome} = require('actions-on-google');
const devices = require('./devices.js');
const light = require('./light.js');


module.exports = createApplication;


function createApplication() {
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
                        status: 'SUCCESS'
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

    const app = {fulfillment};

    return app;
}
