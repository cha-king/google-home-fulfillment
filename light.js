const mqtt = require('mqtt');

const TOPIC = 'bedroom/lamp/setState';

const client = mqtt.connect('mqtt://broker');

exports.setLight = (value) => {
    const message = value ? 'off' : 'on';
    client.publish(TOPIC, message);
}
