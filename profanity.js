const mystem = require('./mystem');
const badWords = require('./badwords');
const chars = '@#$%*';

function arraySample(array) {
    const index = Math.round(Math.random() * array.length);
    return array[index >= array.length ? array.length - 1 : index];
}

function beep(text) {
    const first = text[0];
    const last = text[text.length-1];
    const beepLen = text.length-2;
    let result = first;
    let lastChar = '';
    for (let i = 0; i < beepLen; i++) {
        let char = arraySample(chars);
        while (char === lastChar) char = arraySample(chars);
        result += char;
        lastChar = char;
    }
    result += last;
    return result;
}

module.exports = async function(input) {
    let isDirty = false;
    let analysed;
    try {
        analysed = await mystem(input);
        if (!Array.isArray(analysed)) throw new Error('mystem parse failed');
        const words = analysed.map(({text, analysis}) => {
            let profane = false;
            if (!analysis || !analysis.length) {
                if (badWords.includes(text.toLowerCase())) {
                    profane = true;
                    isDirty = true;
                } else return text;
            } else {
                for (const {lex, qual} of analysis) {
                    if (qual !== 'bastard' && !badWords.includes(lex.toLowerCase())) continue;
                    profane = true;
                    isDirty = true;
                    break;
                }
            }
            return profane ? beep(text) : text;
        });
        return { text: words.join(''), isDirty };
    } catch (err) {
        // console.error(err);
        return { error: err.message, analysed };
    }
};
