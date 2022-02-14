import * as mqtt from 'mqtt'


const BROKER_URL = 'tcp://broker.home.cha-king.com:1883'
const QOS = 0


const client = mqtt.connect(BROKER_URL, {
    will: {
        topic: 'test/online',
        payload: 'false',
        qos: QOS,
        retain: true,
    }
})

client.publish('test/online', 'true', {
    qos: QOS,
    retain: true,
})
