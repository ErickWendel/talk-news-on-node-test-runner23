import { setTimeout } from 'node:timers/promises';
import { deepStrictEqual } from 'node:assert'
import { describe } from '../test-runner.js';

describe('[parallel] - My suite 0', ({ it, before }) => {
    before(async () => {
        await setTimeout(100);
        console.count('Global [before] Hook on [My suite 0]');
    });

    it('test 0', async (ctx) => {
        const expected = { message: 'context for test 0' }
        ctx.setContextData(expected);
        console.log('Test 0:', ctx.getContextData());
        deepStrictEqual(ctx.getContextData(), expected)
    });
})

describe('[parallel] - My suite 1', ({ it, before, beforeEach }) => {

    before(async () => {
        await setTimeout(100);
        console.count('\n[before] Hook on [My suite 1]');
    });

    beforeEach(async () => {
        await setTimeout(50);
        console.count('[beforeEach] Hook on [My suite 1]');
    });

    describe('My sub suite 1', () => {
        let items = []
        before(async () => {
            await setTimeout(100);
            items.push('')
            console.count('[before] hook on sub suite [My sub suite 1]');
        });

        it('test 1', async (ctx) => {
            items.push('')
            const expected = { message: 'context for test 1' }
            ctx.setContextData(expected);
            console.log('Test 1:', ctx.getContextData());
            deepStrictEqual(ctx.getContextData(), expected)
        });

        it('test 2', async (ctx) => {
            items.push('')
            const expected = { message: 'context for test 2' }
            ctx.setContextData(expected);
            console.log('Test 2:', ctx.getContextData());
            deepStrictEqual(ctx.getContextData(), expected)

            before(async () => {
                console.log('[before] hook inside [test 2] on suite [My sub suite]');
            });
        });

        it('test 3 - items', async () => {
            deepStrictEqual(items.length, 3)
        })
    })
});
