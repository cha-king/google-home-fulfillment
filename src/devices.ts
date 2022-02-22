import { SmartHomeV1SyncDevices } from "actions-on-google"


interface Device {
    hostname: string
    metadata: SmartHomeV1SyncDevices
}


const devices: Device[] = [
    {
        hostname: 'smart-home.home.cha-king.com',
        metadata: {
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
    }
]


export default devices
