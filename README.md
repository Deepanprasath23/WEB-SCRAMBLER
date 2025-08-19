# Web Scrambler 🔀

A modern, full-stack Next.js application that fetches content from any website and scrambles it using various algorithms. Features AI-powered content summarization and multiple visual themes.

## ✨ Features

### Core Functionality
- **URL Content Fetching**: Extract text content from any website
- **5 Scrambling Methods**:
  - **Letters**: Shuffle individual characters within words
  - **Words**: Randomize word order within sentences
  - **Sentences**: Rearrange sentence order within paragraphs
  - **Links**: Scramble all URLs found on the page
  - **Images**: Shuffle image sources and alt text

### Enhanced Features
- **AI-Powered Summarization**: Get intelligent content summaries using Groq's Llama model
- **5 Beautiful Themes**: Light, Dark, Ocean, Sunset, and Forest color schemes
- **Export Functionality**: Download results as JSON files
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Modern UI**: Gradient backgrounds, smooth animations, and polished interface

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Groq API key (free at [console.groq.com](https://console.groq.com))

### Installation

1. **Clone or download the project**
   \`\`\`bash
   # If downloaded as ZIP, extract and navigate to folder
   cd web-scrambler
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   # Create .env.local file
   echo "GROQ_API_KEY=your_groq_api_key_here" > .env.local
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open your browser**
   \`\`\`
   http://localhost:3000
   \`\`\`

## 🎯 How to Use

1. **Enter a URL** in the input field (any website)
2. **Select scrambling method** from the dropdown
3. **Click "Scramble Content"** to process
4. **View results** in the side-by-side comparison
5. **Get AI summary** of the original content
6. **Switch themes** using the palette icon in the header
7. **Export results** as JSON files

## 🛠 Technologies Used

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4, Custom CSS Variables
- **UI Components**: Radix UI primitives
- **Content Parsing**: Cheerio for HTML parsing
- **AI Integration**: Groq API with Llama models
- **Fonts**: Space Grotesk, DM Sans

