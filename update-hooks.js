const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Find all use-*.ts files in src/features/**/hooks
const files = execSync('dir /s /b d:\\github\\hostel-frontend-ui\\src\\features\\*use-*.ts').toString().trim().split('\r\n');

for (const file of files) {
  if (!file.includes('hooks\\use-')) continue;

  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Replace imports
  content = content.replace(/showSuccess,\s*showError/g, 'showDeleteSuccess, showDeleteError');
  // Some might only have showSuccess or showError
  content = content.replace(/import \{.*showDeleteConfirm.*\} from "@\/utils\/swal";/g, (match) => {
    let newMatch = match;
    if (!newMatch.includes('showDeleteSuccess')) {
      newMatch = newMatch.replace('showDeleteConfirm', 'showDeleteConfirm, showDeleteSuccess, showDeleteError');
      // Clean up showSuccess and showError if they are now unused in imports (might be tricky if used elsewhere, but let's assume they are only used for delete in these hooks. Actually, they might be used for create/update. Wait! If they are used for create/update, I shouldn't remove them.
      // So instead of replacing, just add showDeleteSuccess and showDeleteError if missing.
    }
    return newMatch;
  });

  // A safer import replacement:
  if (!content.includes('showDeleteSuccess')) {
      content = content.replace(/import\s+\{([^}]+)\}\s+from\s+"@\/utils\/swal";/, (match, p1) => {
          let parts = p1.split(',').map(s => s.trim());
          if (!parts.includes('showDeleteSuccess')) parts.push('showDeleteSuccess');
          if (!parts.includes('showDeleteError')) parts.push('showDeleteError');
          return `import { ${parts.join(', ')} } from "@/utils/swal";`;
      });
  }

  // Replace showSuccess with showDeleteSuccess in handleDelete
  // Replace showError with showDeleteError in handleDelete
  
  // We need to match the handleDelete function block.
  // It's safer to just replace showSuccess(...) to showDeleteSuccess() inside the try block of handleDelete
  // Since we don't have a full AST parser here, let's use regex for the common pattern in these files.
  
  const handleDeleteRegex = /const handleDelete = async[^{]*{([\s\S]*?)};\s*\n/g;
  content = content.replace(handleDeleteRegex, (match, inner) => {
    let newInner = inner;
    newInner = newInner.replace(/await showSuccess\([^)]*\);/g, 'await showDeleteSuccess();');
    newInner = newInner.replace(/showError\([^)]*\);/g, 'await showDeleteError();');
    return match.replace(inner, newInner);
  });

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated: ${file}`);
  }
}
