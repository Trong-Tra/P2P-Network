import { keys, randomBytes } from '@libp2p/crypto'

import { PRIVATE_KEY } from './config'
import Swarm from './swarm'

async function main() {
    const privKey = keys.privateKeyFromRaw(Buffer.from(PRIVATE_KEY, 'hex'))
    const { swarm } = await Swarm.new(privKey)
    await swarm.services.dht.setMode('server')
    await swarm.start()

    const topic = 'randao'
    swarm.services.pubsub.subscribe(topic)
    swarm.services.pubsub.addEventListener('message', ({ detail }) => {
        console.log(
            'Message:',
            detail.topic,
            Buffer.from(detail.data).toString('hex'),
        )
    })

    setInterval(async () => {
        const ok = swarm.services.pubsub.getSubscribers(topic).length
        if (ok) swarm.services.pubsub.publish(topic, randomBytes(32))
    }, Math.ceil(10000 * Math.random()))
}

main()