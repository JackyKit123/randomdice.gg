const fs = require('fs');
const path = require('path');
const ts = require('typescript');
const firebase = require('firebase/app');
require('dotenv');
require('firebase/database');
firebase.initializeApp({
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    projectId: 'random-dice-web',
    databaseURL: 'https://random-dice-web.firebaseio.com/',
    authDomain: 'random-dice-web.firebaseapp.com',
});

const src = path.join(__dirname, '..', 'src', 'Misc', 'menuConfig.ts');
const tmp = path.join(__dirname, 'menuConfig.tmp.js');
const out = path.join(__dirname, '..', 'public', 'sitemap.txt');

(async () => {
    const decks_guide_nameList = (
        await firebase
            .database()
            .ref('/decks_guide')
            .once('value')
    )
        .val()
        .map(guide => guide.name);
    const patreon_list = (
        await firebase
            .database()
            .ref('/patreon_list')
            .once('value')
    )
        .val()
        .map(patreon => patreon.name);
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
                    case item.path.match(/\/decks\/guide\/:name/) !== null:
                        return decks_guide_nameList.map(
                            name => `https://randomdice.gg/decks/guide/${encodeURI(name)}`
                        );
                    case item.path.match(/\/about\/patreon\/:name/) !== null:
                        return patreon_list.map(
                            name =>
                                `https://randomdice.gg/about/patreon/${encodeURI(name)}`
                        );
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
