const fs = require('fs');
const { execSync } = require('child_process');

const files = execSync('dir /s /b d:\\github\\hostel-frontend-ui\\src\\features\\*hooks\\*.ts').toString().trim().split('\r\n');

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Ensure showSuccess and showError are imported if they are used
  const usesShowSuccess = content.includes('showSuccess(');
  const usesShowError = content.includes('showError(');
  const hasSwalImport = content.includes('@/utils/swal');

  if ((usesShowSuccess || usesShowError) && hasSwalImport) {
    // Modify existing import
    if (usesShowSuccess && !content.includes('showSuccess,')) {
      content = content.replace(/import \{([^}]+)\} from ["']@\/utils\/swal["'];/, (match, p1) => {
        if (!p1.includes('showSuccess')) return `import { ${p1.trim()}, showSuccess } from '@/utils/swal';`;
        return match;
      });
    }
    if (usesShowError && !content.includes('showError,')) {
      content = content.replace(/import \{([^}]+)\} from ["']@\/utils\/swal["'];/, (match, p1) => {
        if (!p1.includes('showError')) return `import { ${p1.trim()}, showError } from '@/utils/swal';`;
        return match;
      });
    }
  }

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Fixed imports in: ${file}`);
  }
}
