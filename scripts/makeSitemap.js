const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const src = path.join(__dirname, '..', 'src', 'Misc', 'menuConfig.ts');
const tmp = path.join(__dirname, 'menuConfig.tmp.js');
const out = path.join(__dirname, '..', 'public', 'sitemap.txt');

const code = fs.readFileSync(
    src,
    { encoding: 'utf8' }
);

fs.writeFileSync(
    tmp,
    ts
        .transpile(code, {
            compilerOptions: { module: ts.ModuleKind.CommonJS },
        })
        .replace(/require\(".*"\)/g, '{ lazy: () => {} }')
);

const { menu } = require('./menuConfig.tmp');
const drawPath = menu =>
    menu
        .map(item =>
            item.childNode
                ? drawPath(item.childNode)
                : `https://randomdice.gg${item.path.replace(/:.+$/, '*')}`
        )
        .flat().join('\n');
const sitemap = drawPath(menu);
fs.writeFileSync(out, sitemap);
fs.unlinkSync(tmp);