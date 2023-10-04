import { AsyncResource, executionAsyncResource } from 'node:async_hooks';
const asyncResource = new AsyncResource('TEST');

async function getContext(fn) {
    return asyncResource.runInAsyncScope(async () => {
        const context = {
            getContextData: () => {
                return executionAsyncResource().data ?? {};
            },
            setContextData: (data) => {
                executionAsyncResource().data = data;
            }
        };

        return fn(context);

    });
}


async function describe(name, fn) {
    const tests = [];
    const beforeHooks = [];
    const beforeEachHooks = [];

    const it = (description, fn) => {
        tests.push(async () => getContext(fn));
    }

    const before = (fn) => {
        beforeHooks.push(fn);
    }

    const beforeEach = (fn) => {
        beforeEachHooks.push(fn);
    }

    fn({
        it,
        before,
        beforeEach,
    });

    for (const hook of beforeHooks) {
        await hook();
    }

    for (const test of tests) {
        for (const hook of beforeEachHooks) {
            await hook();
        }
        await test();
    }

}


export { describe };
