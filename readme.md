# summary

a electron version of Edge Translate library core

thanks for

https://github.com/EdgeTranslate/EdgeTranslate.git

# usage

you can see the example on test/test.js, with a little change with replace import this project

```javascript
import ElectronTranslateLibrary from 'electron-translate-library'
```

# index

|  | todo | detect | translate | pronounce | stopPronounce | supportedLanguages |
| --- | --- | ------ | --------- | --------- |  --- | --- |
| baidu |  | v | v | v | - | v |
| bing |  | v | v | v | - | v |
| google |  | v | v | v | - | v |
| hybrid | v | v | v | v | - | x |
| tencent |  | v | v | v | - | v |
| youdao  |  | v | v | x | - | v |

## api
Promise<string lang> detect(string text);

Promise<object> translate(string  text, string  from, string  to);

Promise<void> pronounce(string text, string  language, string  speed);
speed "fast" | "slow"

## Translate Promise Object
### baidu
```
{
    detailedMeanings: [{
        meaning: "寻找↵寻求↵谋求↵争取↵(向人)请求",
        pos: "v.",
    }],
    examples: [{
        source: "如果她的婚姻对她约束太多，她会挣脱出来寻找新的天地。",
        target: "If her marriage becomes too restrictive, she will break out and seek new horizons.",
    }],
    mainMeaning: "seek",
    originalText: "寻找",
    sPronunciation: undefined,
}
```
### bing
```
{
    detailedMeanings:  [{
        meaning: "find",
        pos: "VERB",
        synonyms: (7) ["找到", "发现", "找", "寻找", "觉得", "查找", "找出"],
    }],
    mainMeaning: "find",
    originalText: "寻找",
    tPronunciation: undefined,
}

```
### google
```
{
    detailedMeanings: [{
        meaning: "search, look for, seek, seek out, hunt for, try to find, rummage",
        pos: "动词"
    }],
    from: "zh-CN",
    mainMeaning: "Look for",
    originalText: "寻找",
    sPronunciation: "Xúnzhǎo",
}
```

### tencent
```
{
    mainMeaning: "Looking for",
    originalText: "寻找",
}
```
