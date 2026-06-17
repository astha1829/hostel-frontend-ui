const fs = require('fs');
const { execSync } = require('child_process');

const dirs = execSync('dir /s /b d:\\github\\hostel-frontend-ui\\src\\features\\*.tsx').toString().trim().split('\r\n');

for (const file of dirs) {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // 1. Remove inline Input/Select className that overrides globals
  content = content.replace(/className="h-\[40px\] text-\[14px\] font-\[500\] border-\[#[A-Za-z0-9]+\] rounded-\[8px\]"/g, '');
  content = content.replace(/className="h-\[42px\] text-\[14px\] font-\[500\] border-\[#[A-Za-z0-9]+\] rounded-\[8px\]"/g, '');
  content = content.replace(/className="h-\[44px\] text-\[14px\] font-\[500\] border-\[#[A-Za-z0-9]+\] rounded-\[8px\]"/g, '');

  // 2. Replace hardcoded inline label styles with global form-label
  content = content.replace(/className="text-\[13px\] font-\[600\] text-\[#[A-Za-z0-9]+\]"/g, 'className="form-label"');
  content = content.replace(/className="text-\[14px\] font-\[500\] text-\[#[A-Za-z0-9]+\] mb-\[6px\]"/g, 'className="form-label"');

  // 3. Make buttons 48px
  content = content.replace(/className="h-\[40px\] px-5/g, 'className="h-[48px] px-5');
  content = content.replace(/className="h-\[42px\] px-5/g, 'className="h-[48px] px-5');
  content = content.replace(/className="h-\[40px\] px-\[20px\]/g, 'className="h-[48px] px-[20px]');
  
  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated forms: ${file}`);
  }
}
