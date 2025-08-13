#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧹 Cleaning up unused font files...');

const fontsDir = path.join(__dirname, '../public/fonts');

// Fonts we actually use (from globals.css)
const usedFonts = [
  // Text fonts
  'WFVisualSans-RegularText.woff2',
  'WFVisualSans-RegularText.woff',
  'WFVisualSans-MediumText.woff2',
  'WFVisualSans-MediumText.woff',
  'WFVisualSans-SemiBoldText.woff2',
  'WFVisualSans-SemiBoldText.woff',
  'WFVisualSans-BoldText.woff2',
  'WFVisualSans-BoldText.woff',
  
  // Display fonts  
  'WFVisualSans-RegularDeck.woff2',
  'WFVisualSans-RegularDeck.woff',
  'WFVisualSans-MediumDeck.woff2',
  'WFVisualSans-MediumDeck.woff',
  'WFVisualSans-SemiBoldDeck.woff2',
  'WFVisualSans-SemiBoldDeck.woff',
  'WFVisualSans-BoldDeck.woff2',
  'WFVisualSans-BoldDeck.woff',
  
  // Keep README
  'README.md'
];

let deletedCount = 0;
let keptCount = 0;
let totalSizeBefore = 0;
let totalSizeAfter = 0;

try {
  const files = fs.readdirSync(fontsDir);
  
  files.forEach(file => {
    if (file === '.DS_Store') return; // Skip .DS_Store
    
    const filePath = path.join(fontsDir, file);
    const stats = fs.statSync(filePath);
    totalSizeBefore += stats.size;
    
    if (usedFonts.includes(file)) {
      console.log(`✅ Keeping: ${file}`);
      keptCount++;
      totalSizeAfter += stats.size;
    } else {
      console.log(`🗑️  Deleting: ${file}`);
      fs.unlinkSync(filePath);
      deletedCount++;
    }
  });
  
  const savedMB = ((totalSizeBefore - totalSizeAfter) / 1024 / 1024).toFixed(2);
  const finalMB = (totalSizeAfter / 1024 / 1024).toFixed(2);
  
  console.log('\n📊 Cleanup Summary:');
  console.log(`   Deleted: ${deletedCount} files`);
  console.log(`   Kept: ${keptCount} files`);
  console.log(`   Saved: ${savedMB} MB`);
  console.log(`   Final size: ${finalMB} MB`);
  console.log('\n✅ Font cleanup complete!');
  
} catch (error) {
  console.error('❌ Error during cleanup:', error.message);
  process.exit(1);
} 