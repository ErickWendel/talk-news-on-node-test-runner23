## Newest feat

Intro
    - POV of a Node.js contributor

- History -> Node test runner colin -> first PR

- Never seen that? Since v17 - stable on v20
    -> expect, it
    -> we need your feedback

- TAP -> Test All Things
    -> show isaac experiment
- SnapShots
    assert.snapshot
        await snapshot(data, 'dbData')

- Reporters
    -> custom reporters - Java reporters, GitHub Reporters
        The node:test module supports passing --test-reporter flags for the test runner to use a specific reporter.

        The following built-reporters are supported:

        - tap The tap reporter outputs the test results in the TAP format.
        - spec The spec reporter outputs the test results in a human-readable format.
        - dot The dot reporter outputs the test results in a compact format, where each passing test is represented by a ., and each - failing test is represented by a X.
        - junit The junit reporter outputs test results in a jUnit XML format

    -> default reporters on version X

- Mocking
    -> Old CallTracker deprecated
    -> benefits of context
        -> clean state on each test
        -> no need to .clearAllMocks
    -> everything is lazy loaded
    ->
        show how to mock from global, timers, timers.promises
- Code Coverage
    -> I've made a code coverage tool from scratch (show video)
- Test runner uses AsyncHooks
    - some story of the behind the scenes
- Mock Timers
    -> way faster because of the priority queue data structure
    -> how I implemented it
        => first version
        => why is hard
        https://github.com/nodejs/node/pull/47775

- Next Steps for Mock Timers
- clever watch mode
    - only for affected files
        -> how it works briefly

How're other package contributors feeling about implementing this on core?
    - benjamin is a sinon contributor and also a Node.js
        - helped me a lot since the beginning
    - parseArgs => will help package maintainers
    - node.js will have a bridge to help libraries go further

how fast is it?
    - Jest vs Node.js
    - Vite vs Node.js
    - Mocha vs Node.js

what is still missing comparing to other competitors?
    - show table
    -

Support for Symbol.dispose
    - soon js will have a using keyword
    - show proposal

Support for aborting tests
    context.signal#
    Added in: v18.7.0, v16.17.0
    <AbortSignal> Can be used to abort test subtasks when the test has been aborted.
    test('top level test', async (t) => {
        await fetch('some/uri', { signal: t.signal });
    });

Concurrency support
test options
    concurrency <number> | <boolean>
        If a number is provided, then that many tests would run in parallel within the application thread. If true, all scheduled asynchronous tests run concurrently within the thread. If false, only one test runs at a time. If unspecified, subtests inherit this value from their parent. Default: false.

Support to multireporters
    #multiple-reporters
        node --test-reporter=spec --test-reporter=dot --test-reporter-destination=stdout --test-reporter-destination=file.txt
    Custom reporters

Plus = E2E tests
    - you don't need any library
        - fetch to make a request
        - server.listen() => arbitrary port
    - assert
        - even though is a e2e tests it shows coverage report

Experiment
    - debug a test remotely via inspector
    - publish on GitHub Actions and show output
    - show how to test frontend apps

    - once connected, restart tests with brk enabled
        - show lines and files via IPC/Repl
        - enable breakpoint
        - run tests
        - show results
Compare syntax with jest


diagnostic
    context.beforeEach([fn][, options])
    test('top level test', async (t) => {
    t.beforeEach((t) => t.diagnostic(`about to run ${t.name}`));
    await t.test(
        'This is a subtest',
        (t) => {
        assert.ok('some relevant assertion here');
        },
    );
    });


04/10/2023
Init
    test_runner: add initial CLI runner #42658 - https://github.com/nodejs/node/pull/42658
        > Who will extend the @types/node package with a new node:test module?
            As always, the maintainers of https://github.com/DefinitelyTyped/DefinitelyTyped/tree/HEAD/types/node.

    Add Mocha/Jest like APIs to node:test #43415 - https://github.com/nodejs/node/issues/43415
    test_runner: add Subtest to tap protocol output #43417 - https://github.com/nodejs/node/pull/43417
    Request: mark test runner stable in Node 20.0.0 #46642 - https://github.com/nodejs/node/issues/46642

Reporters
    Feature request: test runner reporters #45648 - https://github.com/nodejs/node/issues/45648
        test_runner: add reporters #45712 - https://github.com/nodejs/node/pull/45712
        test_runner: adds built in lcov test reporter #50018 - https://github.com/nodejs/node/pull/50018
        test_runner: add junit reporter #49614 - https://github.com/nodejs/node/pull/49614
Sharding
    test_runner: add shards support #48639 - https://github.com/nodejs/node/pull/48639

Coverage
    test_runner: add initial code coverage support #46017 - https://github.com/nodejs/node/pull/46017
    - https://www.youtube.com/watch?v=tDySiZck3jk

New JS Keyword
    test: add Symbol.dispose support to mocktimers #48549 - https://github.com/nodejs/node/pull/48549
        https://github.com/tc39/proposal-explicit-resource-management

Mocktimers
    test_runner: add support for mocking setImmediate timer #49397 - https://github.com/nodejs/node/pull/49397
    test_runner: Add Date to the supported mock APIs #48638 - https://github.com/nodejs/node/pull/48638
    test_runner: introduces a new MockTimers API #47775 - https://github.com/nodejs/node/pull/47775
Watch mode
    test_runner: support watch mode #45214 - https://github.com/nodejs/node/pull/45214#issuecomment-1311673737

On going discussions:
    Discussion: New “ESM by default” mode #49432 - https://github.com/nodejs/node/issues/49432
    Test Runner add support for retries #48754 - https://github.com/nodejs/node/issues/48754

--
What's new in the native Node.js Test Runner 2022 - https://youtu.be/xU1EmrhQCfw?si=8jleUWgI9Isz2WNu
Step-by-Step Guide: Migrating from Jest to Node.js Native Test Runner - https://blog.erickwendel.com.br/step-by-step-guide-migrating-from-jest-to-nodejs-native-test-runner
No one should need Postman/Insomnia to test an endpoint - https://blog.erickwendel.com.br/no-one-should-need-postmaninsomnia-to-test-an-endpoint

how do you know if the version you're using supports it - look at backports

trick for checking flaky tests
    - _activeHandles

trick for checking flaky tests
    - loop with python


