import * as mqtt from 'mqtt'


const BROKER_URL = 'tcp://broker.home.cha-king.com:1883'


/*
We need:
    1. MQTT broker connection
    2. Express app object
    3. actions-on-google object
    4. Device in-memory state
*/

const topics = {
    lampState: 'bedroom/lamp/state',
    lampOnline: 'bedroom/lamp/online',
}

const lampState = {
    online: false,
    state: false,
}


const client = mqtt.connect(BROKER_URL)
console.log(`Connected to broker at ${BROKER_URL}`)

// client.subscribe('bedroom/lamp/state')
// client.subscribe('bedroom/lamp/getState')
// client.subscribe('bedroom/lamp/setState')

// client.subscribe(Object.values(topics))

client.subscribe('test/online')

client.on('message', (topic, payload) => {
    console.log(topic)
    console.log(String(payload))
})
