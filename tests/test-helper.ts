const { SpecReporter } = require('jasmine-spec-reporter');
const { JUnitXmlReporter } = require('jasmine-reporters');

/**
 * Generates test-results.xml for test-coverage
 */
const junitReporter = new JUnitXmlReporter({
  savePath: './test-results',
  filePrefix: 'test-results.xml',
  consolidateAll: true
});

/**
 * Spec reporter with pretty colors and stack trace
 */
const specReporter = new SpecReporter({
  spec: {
    displayPending: true,
    displayNumber: true,
    displayStacktrace: 'pretty'
  }
});

jasmine.getEnv().clearReporters();
jasmine.getEnv().addReporter(junitReporter);
jasmine.getEnv().addReporter(specReporter);