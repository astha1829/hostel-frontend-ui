const fs = require('fs');
const { execSync } = require('child_process');

// Find all *-table.tsx files in src/features/*/components/
const files = execSync('dir /s /b d:\\github\\hostel-frontend-ui\\src\\features\\*-table.tsx').toString().trim().split('\r\n');

for (const file of files) {
  if (!file.endsWith('-table.tsx')) continue;

  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // 1. Update row height & hover
  // Replace h-[XXpx] min-h-[XXpx] hover:bg-[#XXXXXX] transition-colors
  // We'll just replace the entire row className pattern if possible.
  content = content.replace(/className="h-\[\d+px\] min-h-\[\d+px\] hover:bg-\[#[a-zA-Z0-9]+\] transition-colors cursor-pointer group"/g, 
    'className="h-[72px] min-h-[72px] hover:bg-slate-50 transition-all duration-200 ease-in-out cursor-pointer group"');
    
  // Some tables might not have the "group" class or exactly this string
  content = content.replace(/h-\[\d+px\] min-h-\[\d+px\]/g, 'h-[72px] min-h-[72px]');
  content = content.replace(/hover:bg-\[#[A-Fa-f0-9]+\] transition-colors/g, 'hover:bg-slate-50 transition-all duration-200 ease-in-out');

  // 2. Update Table Headers
  // We look for text-[13px] font-[700] tracking-[0.08em] uppercase text-[#64748B]
  content = content.replace(/text-\[13px\] font-\[700\] tracking-\[0\.08em\] uppercase text-\[#64748B\]/g, 'table-header');
  // Just in case some have slightly different formatting:
  content = content.replace(/text-\[13px\] font-\[600\] tracking-\[0\.08em\] uppercase text-\[#64748B\]/g, 'table-header');

  // 3. Update Table Cells primary text (usually 15px or 16px, 600 or 700)
  content = content.replace(/text-\[16px\] font-\[700\] text-\[#0F172A\]/g, 'text-[15px] font-[500] text-[#0F172A]');
  content = content.replace(/text-\[15px\] font-\[600\] text-\[#0F172A\]/g, 'text-[15px] font-[500] text-[#0F172A]');
  content = content.replace(/text-\[15px\] font-\[700\] text-\[#0F172A\]/g, 'text-[15px] font-[500] text-[#0F172A]');

  // 4. Update Table Cells secondary text (usually 13px or 14px, 500)
  content = content.replace(/text-\[13px\] font-\[500\] text-\[#64748B\]/g, 'text-[14px] font-[400] text-[#64748B]');

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated table: ${file}`);
  }
}
