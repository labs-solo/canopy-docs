# Canopy Documentation

This repository contains the documentation for Canopy, built using Docusaurus. This README will guide you through the process of setting up and editing the documentation using GitHub, Docusaurus, and Cursor.ai.

## Prerequisites

Before you begin, make sure you have the following installed on your computer:

1. [Git](https://git-scm.com/downloads)
2. [Node.js](https://nodejs.org/) (version 18 or higher)
3. [Visual Studio Code](https://code.visualstudio.com/) (recommended editor)

## Getting Started

### 1. Setting up GitHub

1. If you don't have a GitHub account, go to [GitHub](https://github.com/) and sign up for a free account.
2. Once logged in, go to the [Canopy Documentation repository](https://github.com/labs-solo/canopy-docs).
3. Click the "Fork" button in the top-right corner to create your own copy of the repository.

### 2. Cloning the Repository

1. Open Terminal (Mac/Linux) or Command Prompt (Windows).
2. Navigate to the directory where you want to store the project:
   ```
   cd /path/to/your/projects
   ```
3. Clone your forked repository:
   ```
   git clone https://github.com/YOUR_USERNAME/canopy-docs.git
   ```
   Replace `YOUR_USERNAME` with your GitHub username.
4. Navigate into the project directory:
   ```
   cd canopy-docs/website
   ```

### 3. Setting up Docusaurus

1. Install project dependencies:
   ```
   npm install
   ```
2. Start the local development server:
   ```
   npm run start
   ```
3. Open your browser and go to `http://localhost:3000/canopy-docs/` to see the website.

### 4. Setting up Cursor.ai

1. Download and install [Cursor.ai](https://cursor.sh/).
2. Open Cursor.ai.
3. Click on "Open Folder" and select the `canopy-docs` folder you cloned earlier.

## Editing the Documentation

### 1. Understanding the Project Structure

- `docs/`: Contains all the markdown files for the documentation.
- `src/`: Contains React components and pages.
- `static/`: Contains static assets like images.
- `docusaurus.config.js`: Main configuration file for Docusaurus.
- `sidebars.js`: Defines the sidebar structure of the documentation.

### 2. Making Changes

1. In Cursor.ai, navigate to the `docs/` folder.
2. Open the markdown file you want to edit (e.g., `docs/introduction/overview.md`).
3. Make your changes using Markdown syntax.
4. Save the file (Ctrl+S or Cmd+S).
5. The local development server will automatically update with your changes.

### 3. Using Cursor.ai's AI Features

1. To get AI assistance, press Ctrl+K (or Cmd+K on Mac) to open the command palette.
2. Type your question or request, e.g., "How do I add a new section to this document?"
3. Press Enter to get AI-generated suggestions.
4. Use the suggestions to guide your edits.

### 4. Adding New Pages

1. Create a new markdown file in the appropriate subdirectory of `docs/`.
2. Add the new page to `sidebars.js` to make it appear in the navigation.

### 5. Adding Images

1. Place your image files in the `static/img/` directory.
2. Reference images in your markdown files like this:
   ```markdown
   ![Alt text](/canopy-docs/img/your-image.png)
   ```

## Committing and Pushing Changes

1. In Cursor.ai, open the Source Control view (Ctrl+Shift+G or Cmd+Shift+G on Mac).
2. Review your changes.
3. Enter a commit message describing your changes.
4. Click the checkmark icon to commit your changes.
5. Click the "..." menu and select "Push" to send your changes to GitHub.

## Creating a Pull Request

1. Go to your forked repository on GitHub.
2. Click on "Pull requests" and then "New pull request".
3. Ensure the base repository is set to `labs-solo/canopy-docs` and the base branch is `main`.
4. Click "Create pull request".
5. Add a title and description for your changes.
6. Click "Create pull request" to submit.

## Deploying to GitHub Pages

1. In your terminal, ensure you're in the `website` directory.
2. Run the deploy command:
   ```
   npm run deploy
   ```
3. Enter your GitHub credentials if prompted.
4. Wait for the deployment to complete.
5. Your changes will be live at `https://labs-solo.github.io/canopy-docs/`.

## Getting Help

If you encounter any issues or have questions:

1. Use Cursor.ai's AI assistant (Ctrl+K or Cmd+K) for coding-related questions.
2. Check the [Docusaurus documentation](https://docusaurus.io/docs) for Docusaurus-specific questions.
3. Visit [GitHub's help pages](https://docs.github.com/) for GitHub-related issues.
4. Reach out to the project maintainers by creating an issue in the GitHub repository.

Remember to always pull the latest changes from the main repository before starting new work to ensure you're working with the most up-to-date version of the documentation.
