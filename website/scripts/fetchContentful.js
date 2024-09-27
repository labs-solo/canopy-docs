// scripts/fetchContentful.js

const contentful = require('../src/utils/contentfulClient');
const fs = require('fs-extra');
const path = require('path');
const { documentToReactComponents } = require('@contentful/rich-text-react-renderer');

// Utility to convert rich text to string (or you can render it using React components)
const richTextToMarkdown = (richTextDocument) => {
  return richTextDocument ? documentToReactComponents(richTextDocument).toString() : '';
};

async function fetchContent() {
  try {
    // Fetch entries of type 'article' (or your content type ID)
    const entries = await contentful.getEntries({
      content_type: 'article', // Change to your content type ID
      order: 'fields.title', // Optional: Order by title
    });

    const docsDir = path.join(__dirname, '..', 'docs-content'); // Directory to store contentful MDX docs
    await fs.ensureDir(docsDir);

    // Process each content entry from Contentful
    entries.items.forEach((item) => {
      const { title, slug, content, category } = item.fields;

      // Convert the rich text content into markdown (or keep it as string)
      const markdownContent = content ? richTextToMarkdown(content) : 'Content goes here...';

      // Generate the front matter and content for MDX
      const mdxContent = `---
id: ${slug}
title: "${title}"
slug: "${slug}"
category: "${category ? category.fields.title : 'Uncategorized'}"
---

${markdownContent}
`;

      const filePath = path.join(docsDir, `${slug}.mdx`);
      fs.writeFileSync(filePath, mdxContent);
      console.log(`✅ Created file: ${filePath}`);
    });

    console.log('🎉 Content fetched from Contentful and MDX files created successfully.');
  } catch (error) {
    console.error('❌ Error fetching content from Contentful:', error);
  }
}

fetchContent();
