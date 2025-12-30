// Simple validation script for the YouTube Ad Blocker extension
const fs = require('fs');
const path = require('path');

console.log('🔍 Testing YouTube Ad Blocker Extension...\n');

// Required files for a working extension
const requiredFiles = [
  'manifest.json',
  'background.js',
  'content.js',
  'styles.css',
  'popup.html',
  'popup.css',
  'popup.js',
  'video-ad-blocker.js',
  'icons/icon.svg',
  'rules.json'
];

// Check if all required files exist
let allFilesExist = true;
console.log('📁 Checking required files:');
requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  const exists = fs.existsSync(filePath);
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allFilesExist = false;
});

if (!allFilesExist) {
  console.log('\n❌ Some required files are missing!');
  process.exit(1);
}

// Validate manifest.json
console.log('\n📋 Validating manifest.json:');
try {
  const manifestPath = path.join(__dirname, 'manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  
  // Check required manifest fields
  const requiredFields = ['manifest_version', 'name', 'version', 'description'];
  requiredFields.forEach(field => {
    const exists = manifest[field] !== undefined;
    console.log(`  ${exists ? '✅' : '❌'} ${field}: ${manifest[field] || 'missing'}`);
  });
  
  // Check permissions
  if (manifest.permissions && Array.isArray(manifest.permissions)) {
    console.log(`  ✅ Permissions: ${manifest.permissions.join(', ')}`);
  } else {
    console.log('  ❌ Permissions field missing or invalid');
  }
  
  // Check host_permissions
  if (manifest.host_permissions && Array.isArray(manifest.host_permissions)) {
    console.log(`  ✅ Host Permissions: ${manifest.host_permissions.length} domains`);
  } else {
    console.log('  ❌ Host permissions missing');
  }
  
  // Check background script
  if (manifest.background && manifest.background.service_worker) {
    console.log(`  ✅ Background script: ${manifest.background.service_worker}`);
  } else {
    console.log('  ❌ Background script not configured');
  }
  
  // Check content scripts
  if (manifest.content_scripts && Array.isArray(manifest.content_scripts)) {
    console.log(`  ✅ Content scripts: ${manifest.content_scripts.length} entries`);
  } else {
    console.log('  ❌ Content scripts not configured');
  }
  
  // Check popup
  if (manifest.action && manifest.action.default_popup) {
    console.log(`  ✅ Popup: ${manifest.action.default_popup}`);
  } else {
    console.log('  ❌ Popup not configured');
  }
  
} catch (error) {
  console.log(`  ❌ Error parsing manifest.json: ${error.message}`);
  process.exit(1);
}

// Validate popup files
console.log('\n🖼️  Validating popup files:');
try {
  const popupPath = path.join(__dirname, 'popup.html');
  const popupContent = fs.readFileSync(popupPath, 'utf8');
  
  // Check if HTML includes required elements
  const hasTitle = popupContent.includes('<title>');
  const hasPopupCss = popupContent.includes('popup.css');
  const hasPopupJs = popupContent.includes('popup.js');
  
  console.log(`  ${hasTitle ? '✅' : '❌'} Has title tag`);
  console.log(`  ${hasPopupCss ? '✅' : '❌'} Includes popup.css`);
  console.log(`  ${hasPopupJs ? '✅' : '❌'} Includes popup.js`);
  
} catch (error) {
  console.log(`  ❌ Error reading popup.html: ${error.message}`);
}

// Validate content script
console.log('\n🎯 Validating content script:');
try {
  const contentPath = path.join(__dirname, 'content.js');
  const content = fs.readFileSync(contentPath, 'utf8');
  
  const hasAdSelectors = content.includes('adSelectors');
  const hasDomManipulation = content.includes('querySelectorAll');
  const hasMessageListener = content.includes('chrome.runtime.onMessage');
  
  console.log(`  ${hasAdSelectors ? '✅' : '❌'} Has ad selectors`);
  console.log(`  ${hasDomManipulation ? '✅' : '❌'} Has DOM manipulation`);
  console.log(`  ${hasMessageListener ? '✅' : '❌'} Has message listener`);
  
} catch (error) {
  console.log(`  ❌ Error reading content.js: ${error.message}`);
}

// Validate background script
console.log('\n⚙️  Validating background script:');
try {
  const bgPath = path.join(__dirname, 'background.js');
  const bgContent = fs.readFileSync(bgPath, 'utf8');
  
  const hasWebRequest = bgContent.includes('webRequest.onBeforeRequest');
  const hasAdPatterns = bgContent.includes('adPatterns');
  const hasMessageHandler = bgContent.includes('chrome.runtime.onMessage');
  
  console.log(`  ${hasWebRequest ? '✅' : '❌'} Has web request handler`);
  console.log(`  ${hasAdPatterns ? '✅' : '❌'} Has ad patterns`);
  console.log(`  ${hasMessageHandler ? '✅' : '❌'} Has message handler`);
  
} catch (error) {
  console.log(`  ❌ Error reading background.js: ${error.message}`);
}

// Check file sizes
console.log('\n📊 File sizes:');
requiredFiles.forEach(file => {
  try {
    const filePath = path.join(__dirname, file);
    const stats = fs.statSync(filePath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    console.log(`  📄 ${file}: ${sizeKB} KB`);
  } catch (error) {
    console.log(`  ❌ ${file}: Error reading size`);
  }
});

console.log('\n✅ Extension validation complete!');
console.log('\n🚀 Ready to install:');
console.log('   1. Open chrome://extensions/');
console.log('   2. Enable Developer mode');
console.log('   3. Click "Load unpacked"');
console.log('   4. Select this folder');
console.log('\n📖 See README.md for detailed instructions');
