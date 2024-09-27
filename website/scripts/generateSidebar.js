// scripts/generateSidebar.js
const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');

async function generateSidebar() {
  const docsDir = path.join(__dirname, '..', 'docs-content');
  const files = glob.sync('**/*.mdx', { cwd: docsDir });

  const items = files.map((file) => path.basename(file, '.mdx'));

  return items;
}

module.exports = {
  docs: generateSidebar().then(items => items),
};
