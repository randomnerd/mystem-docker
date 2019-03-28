const fs = require('fs').promises;
const profanity = require('./profanity');

let dirty = 0;
let parsed = 0;
let total = 0;
let startTime = new Date().getTime();
const clean = [];

function showProgress() {
    const seconds = (new Date().getTime() - startTime)/1000;
    console.log(`Parsed ${parsed}/${total}, dirty: ${dirty}, clean: ${parsed - dirty}, time: ${seconds}s`);
    startTime = new Date().getTime();
}

async function checkDirty(post) {
    try {
        const {text, isDirty} = await profanity(post.text);
        if (isDirty) dirty++;
        else clean.push(text);
        parsed++;
        if (parsed % 1000 === 0) showProgress();
    } catch (err) {
        console.error(err);
    }
}

async function main() {
    const json = await fs.readFile('./posts.json');
    const posts = JSON.parse(json.toString());
    total = posts.length;
    while (posts.length) {
        const batch = posts.splice(0, 20);
        await Promise.all(batch.map(checkDirty)).catch(console.error);
    }
}

main().catch(console.error).then(async () => {
    await fs.writeFile('clean.json', JSON.stringify(clean, null, 2));
});
