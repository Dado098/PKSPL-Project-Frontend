const fs = require('fs');
const lucide = require('lucide-react');

const files = [
  'src/valuasi-components/components/ProjectDetail.tsx',
  'src/valuasi-components/components/SelectMethodModal.tsx',
  'src/valuasi-components/components/ValuationForm.tsx',
  'src/valuasi-components/components/RowModals.tsx',
  'src/valuasi-components/components/ui.tsx',
  'src/pages/valuasi/AreaDashboardPage.jsx'
];

let allIcons = new Set();
files.forEach(f => {
  if (!fs.existsSync(f)) return;
  const content = fs.readFileSync(f, 'utf8');
  const match = content.match(/import\s+{([^}]+)}\s+from\s+['"]lucide-react['"]/);
  if (match) {
    match[1].split(',').forEach(i => {
      const icon = i.trim();
      if (icon) allIcons.add(icon);
    });
  }
});

const missing = [];
allIcons.forEach(icon => {
  if (!lucide[icon]) {
    missing.push(icon);
  }
});

if (missing.length > 0) {
  console.log('Missing icons:', missing.join(', '));
} else {
  console.log('All icons found in lucide-react!');
}
