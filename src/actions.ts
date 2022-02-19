import { smarthome } from 'actions-on-google'
import axios from 'axios'

import devices from './devices'


const app = smarthome()


app.onSync((body, headers) => {
    console.log("SYNC")

    return {
        requestId: body.requestId,
        payload: {
            agentUserId: "FAKE USER ID",
            devices: devices,
        }
    }
})

app.onQuery((body, headers) => {
    console.log("QUERY")

    return {
        requestId: body.requestId,
        payload: {
            devices: []
        }
    }
})

app.onExecute((body, headers) => {
    console.log("EXECUTE")

    // TODO: Actually parse this sensibly
    const val = body.inputs[0].payload.commands[0].execution[0].params?.on
    if (val === true) {
        axios.post('http://smart-lamp.local/lightState', 'true')
    } else if (val === false) {
        axios.post('http://smart-lamp.local/lightState', 'false')
    }

    return {
        requestId: body.requestId,
        payload: {
            commands: []
        }
    }
})


export default app
