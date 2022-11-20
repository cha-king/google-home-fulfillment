import { smarthome, SmartHomeV1QueryPayload } from 'actions-on-google'
import { ApiClientObjectMap } from 'actions-on-google/dist/common'
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
            devices: Array.from(devices.values()).map(device => device.metadata),
        }
    }
})

app.onQuery(async (body, headers) => {
    console.log("QUERY")

    let output: ApiClientObjectMap<any> = {}

    for (const input of body.inputs) {
        await Promise.all(input.payload.devices.map(async deviceRequest => {
            const deviceId = deviceRequest.id
            const device = devices.get(deviceId)
            if (!device) {
                console.error(`No device present with ID: ${deviceId}`)
                output[deviceId] = {
                    on: false,
                    online: false,
                    status: 'ERROR',
                }
                return
            }
 
            let response
            try {
                response = await axios.get(device.hostname)
            } catch (error) {
                console.error(error)
                output[deviceId] = {
                    on: false,
                    online: false,
                    status: 'OFFLINE',
                }
                return
            }

            output[deviceId] = {
                on: response.data,
                online: true,
                status: 'SUCCESS'
            }
        }))
    }

    return {
        requestId: body.requestId,
        payload: {
            devices: output
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
