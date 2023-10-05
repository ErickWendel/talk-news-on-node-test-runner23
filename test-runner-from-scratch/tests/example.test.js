import { setTimeout } from 'node:timers/promises';
import { deepStrictEqual } from 'node:assert';
import { Logger, runner } from '../test-runner.js';

runner.on('testStart', (data) => {
    // console.log(`\n🚀 Test ${data.name} started.`);
});

runner.on('testEnd', ({ elapsedTimeMs, name }) => {
    console.log(`\n✅ Hook [${name}] ended. Elapsed time: ${elapsedTimeMs}ms`);
});

describe('My suite 0', () => {
    before(async () => {
        await setTimeout(100);
        Logger.count('[before] Hook on [My suite 0]');
    });

    it('test 0', async (ctx) => {
        const expected = {
            name: 'test 0',
            tree: 'My suite 0',
            type: 'it'
        };
        Logger.log('hey logger!');
        deepStrictEqual(ctx, expected);
    });
});

describe('My suite 1', () => {
    before(async () => {
        await setTimeout(100);
        Logger.count('\n[before] Hook on [My suite 1]');
    });

    beforeEach(async () => {
        await setTimeout(50);
        Logger.count('\n[beforeEach] Hook on [My suite 1]');
    });

    describe('My sub suite 1', () => {
        let items = [];
        beforeEach(async () => {
            await setTimeout(100);
            items.push('');
            Logger.count('\n[beforeEach] hook on sub suite [My sub suite 1]');
        });

        it('test 1', async (ctx) => {
            items.push('');
            const expected = {
                name: 'test 1',
                tree: 'My suite 1\n    My sub suite 1',
                type: 'it'
            };
            Logger.log('hey there!***');
            deepStrictEqual(ctx, expected);
        });

        it('test 2', async (ctx) => {
            items.push('');
            const expected = {
                name: 'test 2',
                tree: 'My suite 1\n    My sub suite 1',
                type: 'it'
            };
            deepStrictEqual(ctx, expected);

            before(async () => {
                Logger.count('\n[before] hook inside [test 2] on suite [My sub suite 1]');
            });
        });

        it('test 3 - items', async () => {
            Logger.log('Items length:', items.length);
            deepStrictEqual(items.length, 5);
        });
    });
});

describe('SuiteName', () => {
    describe('SubSuite', () => {
        describe('SubSuite', () => {
            it('TestName', () => {
                Logger.log('This is a message');
            });
        });
    });
});