/* eslint-disable */
const { RuleTester } = require('eslint');
const rule = require('./eslint-plugin-importsort.js');

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2015,
    sourceType: 'module',
  },
});

ruleTester.run('sort-imports', rule, {
  valid: [
    {
      code: "import { connect } from 'react-redux';\nimport { compose } from 'recompose';\nimport { createSelector } from 'reselect';\nimport type { ExperimentFlag } from '.';\nimport { selectDeliveryDate } from '../../selectors';",
    },
  ],
  invalid: [
    {
      code: "import { createSelector } from 'reselect';\nimport type { ExperimentFlag } from '.';\nimport { compose } from 'recompose';\nimport { selectDeliveryDate } from '../../selectors';\nimport { connect } from 'react-redux';",
      output: "import { connect } from 'react-redux';\nimport { compose } from 'recompose';\nimport { createSelector } from 'reselect';\n\nimport { selectDeliveryDate } from '../../selectors';\n\nimport type { ExperimentFlag } from '.';",
      errors: [
        {
          message: 'Imports should be sorted',
        },
      ],
    },
  ],
});
