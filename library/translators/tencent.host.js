import script from '../../dist/rpc/tencent.remote.js';

const LANGUAGES = [
    ["auto", "auto"],
    ["zh-CN", "zh"],
    ["en", "en"],
    ["ja", "jp"],
    ["ko", "kr"],
    ["fr", "fr"],
    ["es", "es"],
    ["it", "it"],
    ["de", "de"],
    ["tr", "tr"],
    ["ru", "ru"],
    ["pt", "pt"],
    ["vi", "vi"],
    ["id", "id"],
    ["th", "th"],
    ["ms", "ms"],
    ["ar", "ar"],
    ["hi", "hi"]
];

class TencentTranslator {
    constructor() {
        /**
         * Base url.
         */
        this.BASE_URL = "https://fanyi.qq.com";
        /**
         * @type {Manager}
         */
        this.rpc = null;

        this. LAN_TO_CODE = new Map(LANGUAGES);
        this. CODE_TO_LAN = new Map(LANGUAGES.map(([lan, code]) => [code, lan]));
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
     *
     * @returns {Promise<String>} detected language Promise
     */
    async detect(text) {
        return this.rpc.ensure(this)
            .then(id => this.rpc.request(id, 'detect', text))
            .then(res=>this.CODE_TO_LAN.get(res))
    }

    /**
     * Translate given text.
     *
     * @param {String} text text to translate
     * @param {String} from source language
     * @param {String} to target language
     *
     * @returns {Promise<Object>} translation Promise
     */
    translate(text, from, to) {
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
    // eslint-disable-next-line no-unused-vars
    pronounce(text, language, speed) {
        return this.rpc.ensure(this)
            .then(id => this.rpc.request(id, 'pronounce', text, this.LAN_TO_CODE.get(language), speed))
    }

    /**
     * Pause pronounce.
     */
    stopPronounce() {
        return this.rpc.ensure(this)
            .then(id => this.rpc.request(id, 'stopPronounce'))
    }
}

/**
 * Create and export default translator object.
 */
const TRANSLATOR = new TencentTranslator();
export default TRANSLATOR;
