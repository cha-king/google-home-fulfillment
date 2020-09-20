const {smarthome} = require('actions-on-google');
const devices = require('./devices.js');
const light = require('./light.js');

const app = smarthome()

app.onSync((body, headers) => {
    return {
        requestId: body.requestId,
        payload: {
            agentUserId: '1',
            devices: devices
        }
    }
});

app.onQuery((body, headers) => {
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

app.onExecute((body, headers) => {
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



module.exports = app;
