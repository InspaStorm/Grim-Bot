import ping from '../commands/Misc/ping.js'

test('Returns pong', async () => {
    expect(await ping.run()).toEqual({content: 'pong'})
})
