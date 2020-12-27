const TOPIC = 'bedroom/lamp/setState';

module.exports = Light;

function Light(client) {
    this.client = client;
    this.state = null;

    this.client.publish('bedroom/lamp/getState', '');

    this.client.on('message', (topic, message, packet) => {
        this.state = message.toString();
        const value = message.toString();
        if (value === 'on') {
            this.state = true;
        } else if (value === 'off') {
            this.state = false;
        }
    });
    this.setLight = function(value) {
        const message = value ? 'on' : 'off';
        this.client.publish(TOPIC, message);
    };
    
}
