// scripts/importToContentful.js

const contentful = require('contentful-management');
const fs = require('fs-extra');
const path = require('path');
const matter = require('gray-matter');
const slugify = require('slugify');
const { richTextFromMarkdown } = require('@contentful/rich-text-from-markdown'); // Updated import
require('dotenv').config();

// Configuration
const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const ACCESS_TOKEN = process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN; // Use Management API token
const ENVIRONMENT_ID = process.env.CONTENTFUL_ENVIRONMENT_ID || 'master'; // Default to 'master' if not set
const CONTENT_TYPE_ID = process.env.CONTENTFUL_CONTENT_TYPE_ID || 'article'; // Corrected to 'article'
const CATEGORY_CONTENT_TYPE_ID = process.env.CONTENTFUL_CATEGORY_CONTENT_TYPE_ID || 'category'; // Ensure it's 'category'
const DOCS_DIR = path.join(__dirname, '..', 'docs'); // Adjust if your docs are elsewhere

if (!SPACE_ID || !ACCESS_TOKEN) {
  console.error('❌ Missing Contentful credentials in environment variables.');
  console.error('Please ensure CONTENTFUL_SPACE_ID and CONTENTFUL_MANAGEMENT_ACCESS_TOKEN are set in your .env file.');
  process.exit(1);
}

const client = contentful.createClient({
  accessToken: ACCESS_TOKEN,
});

// Helper function to pause execution for a given time (ms)
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Function to recursively find all Markdown files
function getAllMarkdownFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllMarkdownFiles(fullPath, arrayOfFiles);
    } else {
      if (file.endsWith('.md') || file.endsWith('.mdx')) {
        arrayOfFiles.push(fullPath);
      }
    }
  });

  return arrayOfFiles;
}

// Function to get or create a category
async function getOrCreateCategory(environment, categoryName) {
  const categories = await environment.getEntries({
    content_type: CATEGORY_CONTENT_TYPE_ID, // Ensure this is correct
    'fields.name': categoryName,
    limit: 1,
  });

  if (categories.items.length > 0) {
    return categories.items[0];
  } else {
    const newCategory = await environment.createEntry(CATEGORY_CONTENT_TYPE_ID, {
      fields: {
        name: {
          'en-US': categoryName,
        },
      },
    });
    await newCategory.publish();
    console.log(`➕ Created new category: "${categoryName}" with ID: ${newCategory.sys.id}`);
    return newCategory;
  }
}

// Function to convert Markdown to Rich Text JSON
async function convertMarkdownToRichText(markdownContent) {
  try {
    const richText = await richTextFromMarkdown(markdownContent); // Updated function call
    return richText;
  } catch (error) {
    console.error('❌ Error converting Markdown to Rich Text:', error);
    throw error;
  }
}

async function importMarkdownFiles() {
  try {
    const space = await client.getSpace(SPACE_ID);
    const environment = await space.getEnvironment(ENVIRONMENT_ID);
    console.log(`✅ Connected to Contentful Space: ${SPACE_ID}, Environment: ${ENVIRONMENT_ID}`);

    const files = getAllMarkdownFiles(DOCS_DIR);
    console.log(`📂 Found ${files.length} Markdown files in ${DOCS_DIR}`);

    if (files.length === 0) {
      console.warn('⚠️ No Markdown files found. Please ensure your docs directory contains .md or .mdx files.');
      return;
    }

    let processedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const filePath of files) {
      const relativePath = path.relative(DOCS_DIR, filePath);
      const fileName = path.basename(filePath);
      console.log(`\n🔄 Processing file: ${relativePath}`);

      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContent);

      // Check for required front matter fields
      const requiredFields = ['title', 'slug'];
      const missingFields = requiredFields.filter(field => !data[field]);

      if (missingFields.length > 0) {
        console.warn(`⚠️ Skipping ${relativePath}: Missing required front matter fields: ${missingFields.join(', ')}`);
        skippedCount++;
        continue;
      }

      const { title, slug, category, tags, publishedAt } = data;

      // Generate slug if not provided
      const generatedSlug = slugify(title, { lower: true, strict: true });
      const finalSlug = slug || generatedSlug;

      // Validate slug format
      if (!/^[a-z0-9-]+$/.test(finalSlug)) {
        console.warn(`⚠️ Skipping ${relativePath}: Invalid slug format "${finalSlug}". Must match /^[a-z0-9-]+$/`);
        skippedCount++;
        continue;
      }

      // Check if entry with the same slug already exists
      console.log(`🔍 Checking for existing entry with slug: "${finalSlug}"`);
      const existingEntries = await environment.getEntries({
        content_type: CONTENT_TYPE_ID,
        'fields.slug': finalSlug,
        limit: 1,
      });

      let entry;
      try {
        if (existingEntries.items.length > 0) {
          entry = existingEntries.items[0];
          console.log(`🔄 Updating existing entry: ${entry.sys.id} with slug "${finalSlug}"`);
          // Update fields
          entry.fields.title['en-US'] = title;
          entry.fields.slug['en-US'] = finalSlug;

          // Convert Markdown to Rich Text
          const richTextContent = await convertMarkdownToRichText(content);
          entry.fields.content['en-US'] = richTextContent;

          // Handle category as a linked entry
          if (category) {
            const categoryEntry = await getOrCreateCategory(environment, category);
            entry.fields.category['en-US'] = {
              sys: {
                type: 'Link',
                linkType: 'Entry',
                id: categoryEntry.sys.id,
              },
            };
          }

          // Handle tags
          if (tags && Array.isArray(tags)) {
            entry.fields.tags['en-US'] = tags;
          }

          if (publishedAt) {
            entry.fields.publishedAt['en-US'] = publishedAt;
          }

          await entry.update();
          await entry.publish();
          console.log(`✅ Updated and published entry: ${entry.sys.id}`);
        } else {
          console.log(`➕ Creating new entry with slug: "${finalSlug}"`);

          // Handle category as a linked entry
          let categoryLink = undefined;
          if (category) {
            const categoryEntry = await getOrCreateCategory(environment, category);
            categoryLink = {
              sys: {
                type: 'Link',
                linkType: 'Entry',
                id: categoryEntry.sys.id,
              },
            };
          }

          // Convert Markdown to Rich Text
          const richTextContent = await convertMarkdownToRichText(content);

          // Create new entry
          entry = await environment.createEntry(CONTENT_TYPE_ID, {
            fields: {
              title: {
                'en-US': title,
              },
              slug: {
                'en-US': finalSlug,
              },
              content: {
                'en-US': richTextContent,
              },
              ...(categoryLink && { category: categoryLink }),
              ...(tags && Array.isArray(tags) && { tags: tags }),
              ...(publishedAt && { publishedAt: { 'en-US': publishedAt } }),
            },
          });

          await entry.publish();
          console.log(`✅ Created and published new entry: ${entry.sys.id}`);
        }

        processedCount++;
        await sleep(100); // Pause for 100ms
      } catch (entryError) {
        console.error(`❌ Error processing file ${relativePath}:`, entryError);
        errorCount++;
        continue; // Proceed to next file
      }
    }

    console.log(`\n🎉 Import completed.`);
    console.log(`✅ Processed: ${processedCount}`);
    console.log(`⚠️ Skipped: ${skippedCount}`);
    console.log(`❌ Errors: ${errorCount}`);
  } catch (error) {
    console.error('❌ Error during import:', error);
    process.exit(1);
  }
}

importMarkdownFiles();
