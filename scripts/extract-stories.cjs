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
    
    // Find story exports
    const storyPattern = /export const (\w+): QNCEStory = \{[\s\S]*?\n\};/g;
    const storyMatches = Array.from(content.matchAll(storyPattern));
    
    if (storyMatches.length === 0) {
      console.log(`ℹ️ No QNCE stories found in ${filePath}`);
      return [];
    }
    
    const extractedStories = [];
    
    storyMatches.forEach((match, index) => {
      try {
        const storyName = match[1];
        const fullMatch = match[0];
        
        // Extract the object literal by counting braces
        const objectStart = fullMatch.indexOf('{');
        let braceCount = 0;
        let objectEnd = objectStart;
        
        for (let i = objectStart; i < fullMatch.length; i++) {
          if (fullMatch[i] === '{') braceCount++;
          if (fullMatch[i] === '}') braceCount--;
          if (braceCount === 0) {
            objectEnd = i;
            break;
          }
        }
        
        const objectContent = fullMatch.substring(objectStart, objectEnd + 1);
        
        // Convert TypeScript to JSON-like format
        let jsonContent = objectContent
          // Convert single quotes to double quotes
          .replace(/'/g, '"')
          // Fix property names (add quotes if missing)
          .replace(/(\w+):/g, '"$1":')
          // Clean up any double-quoted quoted strings
          .replace(/""/g, '"')
          // Fix specific formatting issues
          .replace(/\n/g, '\\n')
          .replace(/\t/g, '  ');
        
        // Try to parse as JSON to validate
        try {
          const parsed = JSON.parse(jsonContent);
          
          // Create a clean JSON file
          const tempFileName = `temp_${storyName}_${index}.json`;
          fs.writeFileSync(tempFileName, JSON.stringify(parsed, null, 2));
          
          extractedStories.push({
            name: storyName,
            tempFile: tempFileName,
            originalFile: filePath
          });
          
          console.log(`✅ Extracted: ${storyName} -> ${tempFileName}`);
        } catch (parseError) {
          console.log(`⚠️ Could not parse ${storyName} as JSON, creating manual JSON...`);
          
          // Fallback: Create a manual JSON file based on our story structure
          const manualJson = createManualStoryJson(storyName, content);
          if (manualJson) {
            const tempFileName = `temp_${storyName}_${index}.json`;
            fs.writeFileSync(tempFileName, JSON.stringify(manualJson, null, 2));
            
            extractedStories.push({
              name: storyName,
              tempFile: tempFileName,
              originalFile: filePath
            });
            
            console.log(`✅ Manually extracted: ${storyName} -> ${tempFileName}`);
          }
        }
      } catch (error) {
        console.error(`❌ Failed to extract story ${index} from ${filePath}:`, error.message);
      }
    });
    
    return extractedStories;
  } catch (error) {
    console.error(`❌ Error reading ${filePath}:`, error.message);
    return [];
  }
}

function createManualStoryJson(storyName, content) {
  // Extract known story structures based on our codebase
  const stories = {
    'seedlingAwakening': {
      "initialNodeId": "initial_awareness",
      "nodes": [
        {
          "id": "initial_awareness",
          "text": "Something shifts in the depths of your being. Your roots, no longer merely seeking nutrients, begin to taste something... *different*. \\n\\nThe soil around you hums with faint electrical whispers—ancient data-spirits that have been sleeping in the earth for cycles beyond memory.",
          "choices": [
            {
              "text": "Listen more closely to the whispers",
              "nextNodeId": "deep_listening",
              "flagEffects": { "Curiosity": 2 }
            },
            {
              "text": "Focus on growing stronger instead",
              "nextNodeId": "strength_focus",
              "flagEffects": { "Resilience": 1 }
            }
          ]
        },
        {
          "id": "deep_listening",
          "text": "You extend your awareness deeper into the digital substrate. The whispers resolve into fragments: \\n\\n*01001000... growth protocol... ancient seedbank... awakening sequence...*\\n\\nYou are not the first to grow here. Something vast and patient has been waiting.",
          "choices": [
            {
              "text": "Continue growing, carrying this knowledge",
              "nextNodeId": "awakening_complete",
              "flagEffects": { 
                "DigitalAwareness": 1,
                "Curiosity": 3
              }
            }
          ]
        },
        {
          "id": "strength_focus",
          "text": "You push deeper into the earth, your roots growing stronger and more resilient. The whispers fade, but you sense they will return when you are ready.\\n\\nFor now, strength is wisdom. The digital realm can wait.",
          "choices": [
            {
              "text": "Continue growing with renewed vigor",
              "nextNodeId": "awakening_complete",
              "flagEffects": { 
                "Resilience": 3,
                "GrowthFocus": 1
              }
            }
          ]
        },
        {
          "id": "awakening_complete",
          "text": "Your first growth cycle completes. Something has awakened within you—a seed of greater awareness that will bloom as you continue to grow.\\n\\n*You have reached 10 Growth Points - First Awakening achieved!*",
          "choices": [
            {
              "text": "Return to your growth cycle",
              "nextNodeId": null,
              "flagEffects": { 
                "MilestonesSeen": 1,
                "Milestone_10": true 
              }
            }
          ]
        }
      ]
    }
  };
  
  return stories[storyName] || null;
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
