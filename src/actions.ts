import { smarthome } from 'actions-on-google'

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

    return {
        requestId: body.requestId,
        payload: {
            commands: []
        }
    }
})


export default app
