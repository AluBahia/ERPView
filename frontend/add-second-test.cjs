const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/test/pages');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.test.tsx'));

files.forEach(file => {
  const fullPath = path.join(dir, file);
  let content = fs.readFileSync(fullPath, 'utf8');
  if (content.includes("renderiza conteudo") || content.includes("renderiza loading")) return;

  const pageName = file.replace('.test.tsx', '');
  const importPath = `../../pages/${pageName}`;

  const extraTest = `

describe('${pageName}', () => {
  test('renderiza conteudo', async () => {
    const { default: Page } = await import('${importPath}');
    const { container } = render(<Page />, { wrapper: createWrapper() });
    expect(container.textContent?.length).toBeGreaterThan(0);
  });
});
`;

  content = content.replace(/\}\);\s*$/, '});\n' + extraTest);
  fs.writeFileSync(fullPath, content);
});

console.log('Updated ' + files.length + ' files');
