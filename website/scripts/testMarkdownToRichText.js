const { richTextFromMarkdown } = require('@contentful/rich-text-from-markdown/dist/lib/index'); // Adjust based on actual file
const { documentToPlainTextString } = require('@contentful/rich-text-types');

// Sample Markdown content
const markdownContent = `
# Sample Title

This is a sample paragraph with **bold text** and *italic text*.

- Item 1
- Item 2
- Item 3

[Link to Contentful](https://www.contentful.com)
`;

// Function to convert Markdown to Rich Text
async function convertMarkdownToRichText(markdown) {
  console.log('Starting conversion...');
  try {
    const richTextDocument = await richTextFromMarkdown(markdown);
    console.log('Rich Text Document:', JSON.stringify(richTextDocument, null, 2));

    // Convert Rich Text back to plain text for verification
    const plainText = documentToPlainTextString(richTextDocument); // Ensure this is correct
    console.log('Plain Text Output:', plainText);
  } catch (error) {
    console.error('Error converting Markdown to Rich Text:', error);
  }
  console.log('Conversion completed.');
}

// Run the conversion
convertMarkdownToRichText(markdownContent);
