const ping = require('../commands/Misc/ping')

test('Returns pong', async () => {
    expect(await ping.run()).toEqual({content: 'pong'})
})