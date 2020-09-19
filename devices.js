const devices = [
    {
        id: 1,
        type: 'action.devices.types.LIGHT',
        traits: [
            'action.devices.traits.OnOff'
        ],
        name: {
            name: 'Christmas lights'
        },
        willReportState: false,
        roomHint: 'bedroom'
    }
]

module.exports = devices
