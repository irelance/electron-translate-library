const audio = new Audio();

function parseResult(response, originalText) {
    // Parse original text and main meaning.
    let result = {originalText: "", mainMeaning: ""};
    for (let record of response.translate.records) {
        result.originalText += record.sourceText;
        result.mainMeaning += record.targetText.split(/\s*\/\s*/g)[0];
    }

    // Unescape html characters.
    let parser = new DOMParser();
    result.originalText = parser.parseFromString(
        result.originalText,
        "text/html"
    ).documentElement.textContent;
    result.mainMeaning = parser.parseFromString(
        result.mainMeaning,
        "text/html"
    ).documentElement.textContent;

    // In case the original text is not returned by the API.
    if (!result.originalText || result.originalText.length <= 0) {
        result.originalText = originalText;
    }

    if (response.suggest && response.suggest.data && response.suggest.data.length > 0) {
        if (response.suggest.data[0].prx_ph_AmE) {
            result.sPronunciation = response.suggest.data[0].prx_ph_AmE;
        }

        if (response.suggest.data[0].examples_json) {
            result.examples = JSON.parse(response.suggest.data[0].examples_json).basic.map(
                item => {
                    return {source: item.sourceText, target: item.targetText};
                }
            );
        }
    }

    if (response.dict && response.dict.abstract && response.dict.abstract.length > 0) {
        result.detailedMeanings = response.dict.abstract.map(item => {
            return {pos: item.ps, meaning: item.explanation.join(", ")};
        });
    }

    return result;
}
async function ensure(){
    if (!window.qtv||!window.qtk) await new Promise(resolve => {
        let i=setInterval(()=>{
            if (window.qtv&&window.qtk) {
                clearTimeout(i);
                resolve();
            }
        },50)
    });
}
let object = {};
object.detect = (text) => {
    let from = "auto";
    let to = "zh-CN";
    return object.httpRequest(text, from, to)
        .then(body => {
            return body.translate.source
        })
};
object.translate = (text, from, to) => {
    return object.httpRequest(text, from, to)
        .then(body => {
            return parseResult(body, text);
        })
};
object.httpRequest = async (text, from, to) => {
    await ensure();
    let details = {
        source: from,
        target: to,
        sourceText: text,
        qtv: window.qtv,
        qtk: window.qtk,
        sessionUuid: "translate_uuid" + new Date().getTime()
    };
    let formBody = [];
    for (let property in details) {
        let encodedKey = encodeURIComponent(property);
        let encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    return fetch("https://fanyi.qq.com/api/translate", {
        "headers": {
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest"
        },
        "body": formBody.join("&"),
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    })
        .then(response => {
            return response.json();
        })
};
object.stopPronounce = () => {
    if (!audio.paused) audio.pause();
};
object.pronounce = async (text, language, speed) => {
    await ensure();
    object.stopPronounce();
    let find = document.cookie.split(';').filter(i => 0 === i.trim().indexOf('fy_guid='));
    if (find.length <= 0) throw new Error("guid not found");
    let guid = find[0].split("=")[1].trim();
    audio.src = `https://fanyi.qq.com/api/tts?platform=PC_Website&lang=${language}&text=${encodeURIComponent(text)}&guid=${guid}`;
    await audio.play();
};
export default object;
