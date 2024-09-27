// scripts/addSlugToFrontMatter.js

const fs = require('fs-extra');
const path = require('path');
const matter = require('gray-matter');
const slugify = require('slugify');

// Configuration
const DOCS_DIR = path.join(__dirname, '..', 'docs'); // Adjust if your docs are elsewhere

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

async function addSlugToFiles() {
  try {
    const files = getAllMarkdownFiles(DOCS_DIR);
    console.log(`📂 Found ${files.length} Markdown files in ${DOCS_DIR}`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const filePath of files) {
      const relativePath = path.relative(DOCS_DIR, filePath);
      const fileName = path.basename(filePath, path.extname(filePath));
      console.log(`\n🔄 Processing file: ${relativePath}`);

      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContent);

      // Check if 'slug' exists
      if (data.slug) {
        console.log(`✅ 'slug' already exists: "${data.slug}". Skipping.`);
        skippedCount++;
        continue;
      }

      // Generate slug from title or filename
      let slug = '';
      if (data.title) {
        slug = slugify(data.title, { lower: true, strict: true });
      } else {
        // Use filename if title is missing
        slug = slugify(fileName, { lower: true, strict: true });
        console.warn(`⚠️ 'title' missing. Generated slug from filename: "${slug}"`);
      }

      // Add 'slug' to front matter
      data.slug = slug;

      // Convert back to Markdown with updated front matter
      const newContent = matter.stringify(content, data);

      // Write back to file
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`✅ Added 'slug': "${slug}"`);
      updatedCount++;
    }

    console.log(`\n🎉 Slug addition completed.`);
    console.log(`✅ Updated: ${updatedCount}`);
    console.log(`⚠️ Skipped: ${skippedCount}`);
  } catch (error) {
    console.error('❌ Error adding slugs:', error);
  }
}

addSlugToFiles();
