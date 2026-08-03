import fs from 'fs';
import path from 'path';
import { TRANSLATIONS } from '../../src/data/translations.ts';

const esKeys = TRANSLATIONS.es;
const enKeys = TRANSLATIONS.en;

console.log('=== Checking TRANSLATIONS object structure ===');

// Check missing keys between es and en
function getDeepKeys(obj, prefix = '') {
  let keys = [];
  for (const k in obj) {
    if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
      keys = keys.concat(getDeepKeys(obj[k], prefix ? `${prefix}.${k}` : k));
    } else {
      keys.push(prefix ? `${prefix}.${k}` : k);
    }
  }
  return keys;
}

const esKeyList = getDeepKeys(esKeys);
const enKeyList = getDeepKeys(enKeys);

const missingInEn = esKeyList.filter(k => !enKeyList.includes(k));
const missingInEs = enKeyList.filter(k => !esKeyList.includes(k));

console.log(`Total ES keys: ${esKeyList.length}`);
console.log(`Total EN keys: ${enKeyList.length}`);
console.log(`Keys in ES but missing in EN: ${missingInEn.length}`, missingInEn);
console.log(`Keys in EN but missing in ES: ${missingInEs.length}`, missingInEs);

// Scan .tsx files for key accesses and raw strings
const viewsDir = path.resolve('src/views');
const compsDir = path.resolve('src/components');

function getTsxFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getTsxFiles(filePath));
    } else if (file.endsWith('.tsx')) {
      results.push(filePath);
    }
  });
  return results;
}

const files = [...getTsxFiles(compsDir), ...getTsxFiles(viewsDir), path.resolve('src/App.tsx')];
console.log(`\nScanning ${files.length} TSX files...`);

// Mapping of file to translation scope
const categoryMap = {
  'Navbar.tsx': 'nav',
  'BottomNav.tsx': 'nav',
  'Footer.tsx': 'footer',
  'WhatsAppWidget.tsx': 'whatsappWidget',
  'CookieBanner.tsx': 'cookieBanner',
  'AuthModal.tsx': 'authModal',
  'ProductDetailModal.tsx': 'productModal',
  'ReCaptchaWidget.tsx': 'common',
  'HomeView.tsx': 'homePage',
  'AboutView.tsx': 'aboutPage',
  'ProductsView.tsx': 'productsPage',
  'IndustrialView.tsx': 'industrialPage',
  'RecipesView.tsx': 'recipesPage',
  'ContactView.tsx': 'contactPage',
  'RestrictedZoneView.tsx': 'downloadsPage'
};

let missingKeyAccesses = [];

files.forEach(filePath => {
  const relPath = path.relative(process.cwd(), filePath);
  const content = fs.readFileSync(filePath, 'utf-8');
  const filename = path.basename(filePath);
  const mainCategory = categoryMap[filename];

  // Look for t.<key> accesses
  // If mainCategory is defined, t.<key> means TRANSLATIONS[lang][mainCategory][<key>]
  // In HomeView: const t = TRANSLATIONS[lang]; hp = t.homePage; so hp.key or t.hero.key
  const tKeyMatches = content.matchAll(/\bt\.([a-zA-Z0-9_]+)\b/g);
  for (const match of tKeyMatches) {
    const key = match[1];
    // Ignore js methods like t.trim(), t.includes(), etc if any, or React stuff
    if (['trim', 'toLowerCase', 'includes', 'map', 'filter', 'slice'].includes(key)) continue;

    if (mainCategory) {
      if (!esKeys[mainCategory] || esKeys[mainCategory][key] === undefined) {
        missingKeyAccesses.push({ file: relPath, category: mainCategory, key, raw: match[0] });
      }
    }
  }

  // Look for TRANSLATIONS[lang].category.key
  const fullAccessMatches = content.matchAll(/TRANSLATIONS\[[a-zA-Z0-9_]+\]\.([a-zA-Z0-9_]+)\.([a-zA-Z0-9_]+)/g);
  for (const match of fullAccessMatches) {
    const cat = match[1];
    const key = match[2];
    if (!esKeys[cat] || esKeys[cat][key] === undefined) {
      missingKeyAccesses.push({ file: relPath, category: cat, key, raw: match[0] });
    }
  }

  // Look for hp.<key> in HomeView
  if (filename === 'HomeView.tsx') {
    const hpMatches = content.matchAll(/\bhp\.([a-zA-Z0-9_]+)\b/g);
    for (const match of hpMatches) {
      const key = match[1];
      if (!esKeys.homePage || esKeys.homePage[key] === undefined) {
        missingKeyAccesses.push({ file: relPath, category: 'homePage', key, raw: match[0] });
      }
    }
  }
});

console.log(`\nMissing Translation Key Accesses found: ${missingKeyAccesses.length}`);
if (missingKeyAccesses.length > 0) {
  console.log(missingKeyAccesses);
} else {
  console.log('✓ 100% Valid Translation Key Accesses across all views and components!');
}
