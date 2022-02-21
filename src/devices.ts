import { SmartHomeV1SyncDevices } from "actions-on-google"


const devices: SmartHomeV1SyncDevices[] = [
    {
        id: '12345',
        type: 'action.devices.types.LIGHT',
        name: {
            name: 'Bedroom Lights',
            defaultNames: [],
            nicknames: [],
        },
        traits: [
            'action.devices.traits.OnOff'
        ],
        willReportState: false,
    }
]


export default devices
