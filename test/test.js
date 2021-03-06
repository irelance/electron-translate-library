import {remote} from 'electron';
import {Manager} from 'electron-webview-rpc-framework';
import ElectronTranslateLibrary from '../dist'

let {baidu,bing,google,tencent,youdao}=ElectronTranslateLibrary;
let options = {
    webviewPoolMaxLength: 1,
    devTools: true,
    useragent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.190 Safari/537.36',
    preload: 'file://' + remote.app.getAppPath() + '/client.js',
};
let manager = new Manager(options);
tencent.register(manager);
youdao.register(manager);//will register false because no webview enough, you can change webviewPoolMaxLength to 2


let testWord = "寻找";
let testWordLang = "zh-CN";
let translateTo = "en";
[
    {ins: baidu, name: 'baidu',},
    {ins: bing, name: 'bing',},
    {ins: google, name: 'google',},
    {ins: tencent, name: 'tencent',},
    {ins: youdao, name: 'youdao',},
].forEach(translator => {
    console.log(translator.name, 'supportedLanguages', translator.ins.supportedLanguages());
    translator.ins.detect(testWord)
        .then(lang => {
            console.log(translator.name, 'detect', lang);
        })
        .catch(e => console.log(translator.name, 'detect', 'err', e));
    translator.ins.translate(testWord, testWordLang, translateTo)
        .then(object => {
            console.log(translator.name, 'translate', object);
        })
        .catch(e => console.log(translator.name, 'translate', 'err', e));
    translator.ins.pronounce(testWord, testWordLang, "fast")
        .then(object => {
            console.log(translator.name, 'pronounce', object);
        })
        .catch(e => console.log(translator.name, 'pronounce', 'err', e));
});
