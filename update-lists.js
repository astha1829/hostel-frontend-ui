const fs = require('fs');
const { execSync } = require('child_process');

const files = execSync('dir /s /b d:\\github\\hostel-frontend-ui\\src\\features\\*-list-page.tsx').toString().trim().split('\r\n');

for (const file of files) {
  if (!file.endsWith('-list-page.tsx')) continue;

  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // 1. Update element heights in filter bars and buttons
  content = content.replace(/h-\[42px\]/g, 'h-[48px]');
  content = content.replace(/h-\[44px\]/g, 'h-[48px]');

  // 2. Adjust padding for search inputs with leading icons
  content = content.replace(/pl-\[36px\]/g, 'pl-[44px]');
  content = content.replace(/pl-\[40px\]/g, 'pl-[44px]');

  // 3. Improve stat cards hover effects
  // Find standard stat card containers (usually flex items-center gap-[16px] inside a grid or flex)
  // Or find "bg-[#FFFFFF] rounded-[16px] border border-[#E5E7EB] p-[20px]"
  content = content.replace(/bg-\[#FFFFFF\] border border-\[#E5E7EB\] p-\[20px\] flex items-center gap-\[16px\]/g, 
    'bg-[#FFFFFF] border border-[#E5E7EB] p-[20px] flex items-center gap-[16px] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ease-in-out');

  content = content.replace(/stats-card-global flex items-center/g, 
    'stats-card-global flex items-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ease-in-out');

  // 4. Update primary action buttons
  // Find "btn-top-action" if not already styled, but it is in globals.css! So it's fine.
  
  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated lists: ${file}`);
  }
}
