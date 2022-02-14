import * as mqtt from 'mqtt'


const BROKER_URL = 'tcp://broker.home.cha-king.com:1883'


const light = {
    isOnline: false,
    isOn: false,
}


const client = mqtt.connect(BROKER_URL)
console.log(`Connected to broker at ${BROKER_URL}`)

client.subscribe('bedroom/lamp/state')
client.subscribe('bedroom/lamp/online')

client.on('message', (topic, payload) => {
    const message = String(payload)

    switch (topic) {
        case 'bedroom/lamp/state':
            light.isOn = JSON.parse(message)
            break
        case 'bedroom/lamp/online':
            light.isOnline = JSON.parse(message)
            break
    }

    console.log(light);
})
