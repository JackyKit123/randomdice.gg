const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const src = path.join(__dirname, '..', 'src', 'Misc', 'menuConfig.ts');
const tmp = path.join(__dirname, 'menuConfig.tmp.js');
const out = path.join(__dirname, '..', 'public', 'sitemap.txt');

(async () => {
    const code = fs.readFileSync(src, { encoding: 'utf8' });

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
            .map(item => {
                switch (true) {
                    case item.hasOwnProperty('childNode'):
                        return drawPath(item.childNode);
                    case item.path.match(/\/:\w+$/) !== null:
                        return `https://randomdice.gg${item.path.replace(
                            /\/:\w+$/,
                            '/*'
                        )}`;

                    case item.privateRoute:
                        return '';
                    default:
                        return `https://randomdice.gg${item.path}`;
                }
            })
            .filter(url => !!url)
            .flat()
            .join('\n');
    const sitemap = drawPath(menu);
    fs.writeFileSync(out, sitemap);
    fs.unlinkSync(tmp);
    process.exit(0);
})();
