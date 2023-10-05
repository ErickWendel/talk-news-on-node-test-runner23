import { EventEmitter } from 'events';
import { AsyncLocalStorage } from 'async_hooks';
const asyncLocalStorage = new AsyncLocalStorage();
const buildDependencyTree = (suiteStack, message) => {
    let formattedPath = '';
    for (let i = 0; i < suiteStack.length; i++) {
        if (['before', 'beforeEach', 'it'].find(item => item === suiteStack[i].type)) {
            formattedPath += ' '.repeat(i * 4) + `${suiteStack[i].name}:\n`;
        } else {
            formattedPath += ' '.repeat(i * 4) + suiteStack[i].name + '\n';
        }
    }

    let indentedMessage = ' '.repeat(suiteStack.length * 4)
    if (message)
        indentedMessage = indentedMessage.concat(`Log: ${message.trimStart()}\n`);

    return formattedPath.concat(indentedMessage).trimEnd()
}

class Logger {
    static log(message) {
        const context = asyncLocalStorage.getStore() || {};
        const suiteStack = context.suiteStack || [];
        console.log(
            '\n',
            buildDependencyTree(suiteStack, message),
            '\n'
        );
    }
    static count(message) {
        const context = asyncLocalStorage.getStore() || {};
        const suiteStack = context.suiteStack || [];
        console.count(
            buildDependencyTree(suiteStack, message),
        );
    }
}

class TestSuite {
    constructor(name) {
        this.name = name;
        this.tests = [];
        this.beforeHooks = [];
        this.beforeEachHooks = [];
    }
}

class TestRunner extends EventEmitter {
    constructor() {
        super();

        this.suitesStack = [];
    }


    describe(name, fn) {
        const suite = new TestSuite(name);
        this.suitesStack.push(suite);

        asyncLocalStorage.run({
            suiteStack: this.suitesStack.slice()
        }, async () => {
            await fn();
            await this.runSuite(suite);
            this.emit('suiteEnd', suite);
            this.suitesStack.pop();
        });
    }

    getCurrentSuite() {
        return this.suitesStack[this.suitesStack.length - 1];  // This will now return the TestSuite instance
    }

    async runSuite(suite) {
        for (const hook of suite.beforeHooks) {
            await hook();
        }

        for (const test of suite.tests) {
            for (const hook of suite.beforeEachHooks) {
                await hook();
            }
            await test();
        }
    }

    wrapTest(data, testFn) {
        return async () => {
            const startedAt = process.hrtime.bigint();

            // Preserve current suite context and merge with test data
            const currentContext = asyncLocalStorage.getStore() || {};
            const info = {
                ...data,
                tree: buildDependencyTree(currentContext.suiteStack)
            }
            this.emit('testStart', info);

            const mergedContext = {
                suiteStack: [...currentContext.suiteStack, info]
            };

            await asyncLocalStorage.run(mergedContext, async () => {
                await testFn(info);
                const endedAt = process.hrtime.bigint();
                const elapsedTimeMs = (Number(endedAt - startedAt) / 1_000_000).toFixed(2);
                this.emit('testEnd', { ...info, elapsedTimeMs });
            });
        }

    }
    it(description, testFn) {
        const suite = this.getCurrentSuite();
        suite.tests.push(this.wrapTest({ name: description, type: 'it' }, testFn));
    }

    before(hookFn) {
        const suite = this.getCurrentSuite();
        suite.beforeHooks.push(this.wrapTest({ name: 'before', type: 'before' }, hookFn));
    }

    beforeEach(hookFn) {
        const suite = this.getCurrentSuite();
        suite.beforeEachHooks.push(this.wrapTest({ name: 'beforeEach', type: 'beforeEach' }, hookFn));
    }
}

const runner = new TestRunner();

global.describe = runner.describe.bind(runner);
global.it = runner.it.bind(runner);
global.before = runner.before.bind(runner);
global.beforeEach = runner.beforeEach.bind(runner);

export { runner, Logger };
