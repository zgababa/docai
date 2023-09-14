#!/usr/bin/env node

import('../src/cli/cli.js')
  .then(async (cli) => {
    console.log('Generating your documentation...')
    await cli.run(process.argv.slice(2))
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
