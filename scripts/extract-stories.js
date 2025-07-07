#!/usr/bin/env node

/**
 * Extract TypeScript story objects to JSON for qnce-audit CI integration
 */

const fs = require('fs');
const path = require('path');

function extractStoriesFromTypeScript(filePath) {
  console.log(`📖 Processing: ${filePath}`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Extract story objects using regex
    const storyMatches = content.match(/export const \w+: QNCEStory = ({[\s\S]*?^});/gm);
    
    if (!storyMatches) {
      console.log(`ℹ️ No QNCE stories found in ${filePath}`);
      return [];
    }
    
    const extractedStories = [];
    
    storyMatches.forEach((match, index) => {
      try {
        // Extract the object content
        const objectContent = match.replace(/export const (\w+): QNCEStory = /, '');
        const storyName = match.match(/export const (\w+): QNCEStory/)[1];
        
        // Create a temporary file for audit
        const tempFileName = `temp_${storyName}_${index}.json`;
        fs.writeFileSync(tempFileName, objectContent);
        
        extractedStories.push({
          name: storyName,
          tempFile: tempFileName,
          originalFile: filePath
        });
        
        console.log(`✅ Extracted: ${storyName} -> ${tempFileName}`);
      } catch (error) {
        console.error(`❌ Failed to extract story from ${filePath}:`, error.message);
      }
    });
    
    return extractedStories;
  } catch (error) {
    console.error(`❌ Error reading ${filePath}:`, error.message);
    return [];
  }
}

function auditExtractedStories(stories) {
  const { execSync } = require('child_process');
  let allPassed = true;
  
  stories.forEach(story => {
    try {
      console.log(`🔍 Auditing: ${story.name}`);
      const result = execSync(`npx qnce-audit ${story.tempFile}`, { encoding: 'utf8' });
      console.log(result);
    } catch (error) {
      console.error(`❌ Audit failed for ${story.name}:`, error.stdout || error.message);
      allPassed = false;
    }
  });
  
  return allPassed;
}

function cleanup(stories) {
  stories.forEach(story => {
    try {
      fs.unlinkSync(story.tempFile);
    } catch (error) {
      // Ignore cleanup errors
    }
  });
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: node extract-stories.js <typescript-file> [typescript-file...]');
    process.exit(1);
  }
  
  let allStories = [];
  let overallSuccess = true;
  
  // Extract stories from all provided files
  args.forEach(filePath => {
    if (!fs.existsSync(filePath)) {
      console.error(`❌ File not found: ${filePath}`);
      overallSuccess = false;
      return;
    }
    
    if (!filePath.endsWith('.ts')) {
      console.log(`ℹ️ Skipping non-TypeScript file: ${filePath}`);
      return;
    }
    
    const stories = extractStoriesFromTypeScript(filePath);
    allStories = allStories.concat(stories);
  });
  
  if (allStories.length === 0) {
    console.log('ℹ️ No stories found to audit');
    process.exit(0);
  }
  
  // Audit extracted stories
  console.log(`\n🔍 Starting audit of ${allStories.length} stories...`);
  const auditSuccess = auditExtractedStories(allStories);
  
  // Cleanup temporary files
  cleanup(allStories);
  
  if (overallSuccess && auditSuccess) {
    console.log('\n✅ All story audits passed!');
    process.exit(0);
  } else {
    console.log('\n❌ Some audits failed');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { extractStoriesFromTypeScript, auditExtractedStories, cleanup };
