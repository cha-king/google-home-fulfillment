const mqtt = require('mqtt');

const TOPIC = 'bedroom/lamp/setState';

const client = mqtt.connect('mqtt://broker');

exports.setLight = (value) => {
    const message = value ? 'on' : 'off';
    client.publish(TOPIC, message);
}
