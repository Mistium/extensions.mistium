#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const FEATURED_DIR = path.join(__dirname, 'featured');
const OUTPUT_FILE = path.join(__dirname, 'generated-metadata', 'extensions-v0.json');

function extractDescription(content) {
  const match = content.match(/^[ \t]*\/\/\s*Description\s*:\s*(.+)$/im);
  return match ? match[1].trim() : '';
}

function createSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().replace(/\s+/g, ' ');
}

function processExtensions(dir, isFeatured = false) {
  const extensions = [];
  
  if (!fs.existsSync(dir)) {
    console.error(`Directory not found: ${dir}`);
    return extensions;
  }

  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    if (!file.endsWith('.js')) continue;
    
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    
    if (!stats.isFile()) continue;
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const description = extractDescription(content);
      const name = file.replace('.js', '');
      const slug = createSlug(name);
      
      extensions.push({
        slug,
        id: name,
        name,
        description,
        image: `images/${name}.png`,
        by: [
          {
            name: "Mistium",
            link: "https://github.com/Mistium"
          }
        ],
        featured: isFeatured,
        filename: file
      });
      
      console.log(`✓ Processed: ${file}${description ? '' : ' (no description)'}`);
    } catch (error) {
      console.error(`✗ Error processing ${file}:`, error.message);
    }
  }
  
  return extensions;
}

function generateMetadata() {
  console.log('Generating extension metadata...\n');
  
  console.log('Processing featured extensions:');
  const featuredExtensions = processExtensions(FEATURED_DIR, true);

  
  featuredExtensions.sort((a, b) => a.name.localeCompare(b.name));
  
  const allExtensions = featuredExtensions;
  
  const metadata = {
    extensions: allExtensions.map(ext => ({
      slug: ext.slug,
      id: ext.id,
      name: ext.name,
      description: ext.description,
      image: ext.image,
      by: ext.by,
      featured: ext.featured,
      filename: ext.filename
    }))
  };
  
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(metadata, null, 2));
  
  console.log(`\n✓ Metadata generated successfully!`);
  console.log(`  Total extensions: ${allExtensions.length}`);
  console.log(`  Featured: ${featuredExtensions.length}`);
  console.log(`  Output: ${OUTPUT_FILE}`);
}

try {
  generateMetadata();
} catch (error) {
  console.error('Error generating metadata:', error);
  process.exit(1);
}
