const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    if (fs.statSync(dirPath).isDirectory()) {
      walkDir(dirPath, callback);
    } else {
      callback(dirPath);
    }
  });
}

walkDir('./src/features', function(filePath) {
  if (!filePath.endsWith('-list-page.tsx')) return;

  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Filter bar
  content = content.replace(/<Card className=\"(mb-2|mt-\[20px\]|mt-6|mt-\[24px\])?\s*border-border\/70 shadow-sm\">/g, '<Card className=\"mt-[16px] border-border/70 shadow-sm\">');
  
  // Also for Hostels filter bar
  content = content.replace(/<Card className=\"rounded-\[16px\] border border-border shadow-\[0_2px_10px_rgba\(0,0,0,0\.02\)\] overflow-hidden bg-card\">\s*<CardContent/g, '<Card className=\"mt-[16px] rounded-[16px] border border-border shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden bg-card\">\n        <CardContent');

  // Stats Card inside Hostels List Page
  content = content.replace(/className=\"p-6 flex items-start gap-4\"/g, 'className=\"py-[18px] px-[22px] h-[82px] flex items-start gap-4\"');

  // Stats Card global
  content = content.replace(/className=\"stats-card-global flex items-center w-full mt-\[28px\]\"/g, 'className=\"stats-card-global flex items-center w-full mt-[12px] h-[82px] px-[22px] py-[18px] bg-white rounded-[18px] border border-[#EAECEF] shadow-[0_1px_2px_rgba(15,23,42,0.04)]\"');
  
  // Remove height from inner stats if applied globally
  content = content.replace(/h-\[48px\]/g, 'h-full'); 

  // Table Wrapper
  content = content.replace(/<div className=\"flex flex-col gap-4\">/g, '<div className=\"flex flex-col gap-4 mt-[18px]\">');
  // Or in hostels list page
  content = content.replace(/<div className=\"mb-4 flex justify-between items-center px-1\">/g, '<div className=\"mb-4 mt-[18px] flex justify-between items-center px-1\">');

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log('Updated layout spacing in:', filePath);
  }
});
