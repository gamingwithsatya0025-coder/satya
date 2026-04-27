import fs from 'fs';
import path from 'path';

const walk = dir => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.match(/\.(jsx|js|tsx|css)$/)) results.push(file);
    }
  });
  return results;
}

const files = walk('./src');
const replacements = {
  // Hex Colors
  '#6366f1': '#f59e0b', // Primary Amber
  '#4f46e5': '#ea580c', // Secondary Orange
  '#c7d2fe': '#fde68a', // Gradient light
  '#818cf8': '#f59e0b', // Gradient mid
  '#a5b4fc': '#fbbf24', // Gradient mid 2
  
  // RGB Colors
  'rgba(99, 102, 241': 'rgba(245, 158, 11',
  'rgba(99,102,241': 'rgba(245,158,11',
  
  // Tailwind Utility Classes
  'indigo-500': 'amber-500',
  'indigo-400': 'amber-400',
  'violet-500': 'orange-500',
  'violet-400': 'orange-400',
  'purple-500': 'amber-600',
  'purple-400': 'amber-500',
  'blue-500': 'orange-600',
  
  // Specific CSS var updates for contrast
  '--primary-foreground: #ffffff;': '--primary-foreground: #020617;',
  '--secondary-foreground: #ffffff;': '--secondary-foreground: #020617;'
};

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;
  for (const [key, value] of Object.entries(replacements)) {
    newContent = newContent.split(key).join(value);
  }
  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log('Updated ' + file);
  }
});
