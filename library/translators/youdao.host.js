import crypto from "crypto";
import querystring from "querystring";
import script from '../../dist/rpc/youdao.remote.js';

const LANGUAGES = [
    ["zh-CN", "zh-CHS"],
    ["en", "en"],
    ["ja", "ja"],
    ["ko", "ko"],
    ["fr", "fr"],
    ["es", "es"],
    ["pt", "pt"],
    ["it", "it"],
    ["ru", "ru"],
    ["vi", "vi"],
    ["de", "de"],
    ["ar", "ar"],
    ["id", "id"],
    ["af", "af"],
    ["bs", "bs"],
    ["bg", "bg"],
    ["ca", "ca"],
    ["hr", "hr"],
    ["cs", "cs"],
    ["da", "da"],
    ["nl", "nl"],
    ["et", "et"],
    ["fi", "fi"],
    ["el", "el"],
    ["ht", "ht"],
    ["he", "he"],
    ["hi", "hi"],
    ["hu", "hu"],
    ["sw", "sw"],
    ["lv", "lv"],
    ["lt", "lt"],
    ["ms", "ms"],
    ["mt", "mt"],
    ["no", "no"],
    ["fa", "fa"],
    ["pl", "pl"],
    ["ro", "ro"],
    ["sk", "sk"],
    ["sl", "sl"],
    ["sv", "sv"],
    ["th", "th"],
    ["tr", "tr"],
    ["uk", "uk"],
    ["ur", "ur"],
    ["cy", "cy"],
    ["sq", "sq"],
    ["am", "am"],
    ["hy", "hy"],
    ["az", "az"],
    ["bn", "bn"],
    ["eu", "eu"],
    ["be", "be"],
    ["ceb", "ceb"],
    ["co", "co"],
    ["eo", "eo"],
    ["fil", "tl"],
    ["fy", "fy"],
    ["gl", "gl"],
    ["ka", "ka"],
    ["gu", "gu"],
    ["ha", "ha"],
    ["haw", "haw"],
    ["is", "is"],
    ["ig", "ig"],
    ["ga", "ga"],
    ["jw", "jw"],
    ["kn", "kn"],
    ["kk", "kk"],
    ["km", "km"],
    ["ku", "ku"],
    ["lo", "lo"],
    ["la", "la"],
    ["lb", "lb"],
    ["mk", "mk"],
    ["mg", "mg"],
    ["ml", "ml"],
    ["mi", "mi"],
    ["mr", "mr"],
    ["mn", "mn"],
    ["my", "my"],
    ["ne", "ne"],
    ["ps", "ps"],
    ["ma", "pa"],
    ["sm", "sm"],
    ["gd", "gd"],
    ["st", "st"],
    ["sd", "sd"],
    ["si", "si"],
    ["so", "so"],
    ["su", "su"],
    ["tg", "tg"],
    ["ta", "ta"],
    ["te", "te"],
    ["uz", "uz"],
    ["xh", "xh"],
    ["yi", "yi"],
    ["yo", "yo"],
    ["zu", "zu"]
];

/**
 * Youdao translator interface.
 */
class YoudaoTranslator {
    constructor() {
        this.BASE_URL = "http://fanyi.youdao.com"; // Youdao translation url
        this. LAN_TO_CODE = new Map(LANGUAGES);
        this. CODE_TO_LAN = new Map(LANGUAGES.map(([lan, code]) => [code, lan]));
        /**
         * @type {Manager}
         */
        this.rpc = null;
    }

    register(rpc) {
        this.rpc = rpc;
        return this.rpc.register(this, this.BASE_URL, this.BASE_URL, script);
    }

    /**
     * Get supported languages of this API.
     *
     * @returns {Set<String>} supported languages
     */
    supportedLanguages() {
        return new Set(this.LAN_TO_CODE.keys());
    }

    /**
     * Detect language of given text.
     *
     * @param {String} text text to detect
     * @returns {Promise} then(result) used to return request result. catch(error) used to catch error
     */
    detect(text) {
        return this.rpc.ensure(this)
            .then(id => this.rpc.request(id, 'detect', text))
            .then(res=>this.CODE_TO_LAN.get(res))
        
    }

    translate(text, from = "AUTO", to = "AUTO") {
        return this.rpc.ensure(this)
            .then(id => this.rpc.request(id, 'translate', text,
                this.LAN_TO_CODE.get(from), this.LAN_TO_CODE.get(to)
            ))
    }

    /**
     * Pronounce given text.
     *
     * @param {String} text text to pronounce
     * @param {String} language language of text
     * @param {String} speed "fast" or "slow"
     *
     * @returns {Promise<void>} pronounce finished
     */
    pronounce(text, language, speed) {
        return Promise.reject("no impl");
    }

    /**
     * Pause pronounce.
     */
    stopPronounce() {
    }

    /* eslint-disable */

    /**
     * get query string that includes necessary data for Youdao API.
     *
     * @param {String} text text to translate
     * @param {String} from source language
     * @param {String} to target language
     * @returns {Promise<String>} uri encoded string
     */
    getQueryStr(text = "", from = "AUTO", to = "AUTO") {
        let sign = this.generateSign(text);
        let QSObj = {
            i: text,
            from: from,
            to: to,
            smartresult: "dict",
            client: "fanyideskweb",
            doctype: "json",
            version: "2.1",
            keyfrom: "fanyi.web",
            action: "FY_BY_REALTlME",
            ...sign
        };
        return Promise.resolve(querystring.stringify(QSObj));
    }

    /**
     * get Youdai sign object
     *
     * @param {String} text text to translate
     * @returns {Object} sign object
     */
    generateSign(text = "") {
        let t = crypto
                .createHash("md5")
                .update(navigator.appVersion)
                .digest("hex"), // n.md5(navigator.appVersion)
            r = "" + new Date().getTime(),
            i = r + parseInt(10 * Math.random(), 10);
        let raw = "fanyideskweb" + text + i + "]BjuETDhU)zqSxf-=B#7m";
        let sign = crypto
            .createHash("md5")
            .update(raw)
            .digest("hex");
        return {
            lts: r, // date getTime ms
            bv: t, // md5 navigator.appVersion string
            salt: i, // radom number
            sign
        };
    }

}

/**
 * Create and export default Translator object.
 */
const TRANSLATOR = new YoudaoTranslator();
export default TRANSLATOR;
