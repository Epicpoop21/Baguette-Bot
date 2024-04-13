module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`${client.user.tag} is up and running`)

        setInterval(client.checkUpdates, 10000);
    }
}