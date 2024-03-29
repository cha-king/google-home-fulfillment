import { smarthome } from 'actions-on-google'
import axios from 'axios'

import devices from './devices'


const LIGHT_CONTROLLER_URL = 'http://smart-lamp.home.cha-king.com/lightState'


const app = smarthome()


app.onSync((body, headers) => {
    console.log("SYNC")

    return {
        requestId: body.requestId,
        payload: {
            agentUserId: "FAKE USER ID",
            devices: devices.map(device => device.metadata),
        }
    }
})

app.onQuery(async (body, headers) => {
    console.log("QUERY")

    // TODO: Actually reference devices here
    const id = body.inputs[0].payload.devices[0].id
    if (id === '12345') {
        const response = await axios.get(LIGHT_CONTROLLER_URL)
        return {
            requestId: body.requestId,
            payload: {
                devices: {
                    '12345': {
                        on: response.data,
                        online: true,
                        status: 'SUCCESS',
                    }
                }
            }
        }
    }
    
    return {
        requestId: body.requestId,
        payload: {
            devices: []
        }
    }
})

app.onExecute(async (body, headers) => {
    console.log("EXECUTE")

    // TODO: Actually parse this sensibly
    const val = body.inputs[0].payload.commands[0].execution[0].params?.on
    if (val === true) {
        await axios.post(LIGHT_CONTROLLER_URL, 'true')
    } else if (val === false) {
        await axios.post(LIGHT_CONTROLLER_URL, 'false')
    }

    return {
        requestId: body.requestId,
        payload: {
            commands: [
                {
                    ids: ['12345'],
                    status: 'SUCCESS',
                    states: {
                        online: true,
                        on: val,
                    }
                }
            ]
        }
    }
})


export default app
