"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const devices = [
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
];
exports.default = devices;
