export const regexList = {
    // name can contain only letters and spaces
    // first letters must be capital
    // each word must contain at least 2 letters
    // name should be at least 2 words long and at most 4 words long
    name: /^[A-Z][a-z]{1,} [A-Z][a-z]{1,}([ ][A-Z][a-z]{1,}){0,2}$/,
    // nickname can contain only letters, numbers, dots, dashes and underscores
    nickname: /^\S[a-zA-Z0-9]{3,32}$/,
    // password must contain at least 6 characters, at least one uppercase letter and at least one number
    password: /^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,32}$/,
    // should accept only ssps.cz emails
    email: /^[\w\._-]+@(skola\.)?ssps\.cz$/,
}

export function verifyRomanCzech(word, regex) {
    // dictionary that translates czech letters to roman letters, so regex can be used for czech words
    const czechToRoman = {
        "á": "a",
        "č": "c",
        "ď": "d",
        "é": "e",
        "ě": "e",
        "í": "i",
        "ň": "n",
        "ó": "o",
        "ř": "r",
        "š": "s",
        "ť": "t",
        "ú": "u",
        "ů": "u",
        "ý": "y",
        "ž": "z",
    };

    // translate czech letters to roman letters
    let romanName = "";

    for (let letter of word) {
        if (czechToRoman[letter]) {
            romanName += czechToRoman[letter];
        }
        else {
            romanName += letter;
        }
    }

    // test if regex matches
    return regex.test(romanName);
}