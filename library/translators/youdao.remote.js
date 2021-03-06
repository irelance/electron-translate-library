let object = {};
object.detect = (text) => {
    return object.httpRequest(text, "AUTO", "zh-CN")
        .then(result => {
            return result.type.split('2')[0];
        });
};
object.translate = (text, from = "AUTO", to = "AUTO") => {
    return object.httpRequest(text, from, to)
        .then(result => {
            let tmp = result.data || {};
            tmp = tmp.translateResult || [];
            tmp = tmp[0] || [];
            tmp = tmp[0] || {tgt: ''};
            let resText = tmp.tgt || "";
            let parsed = {};
            parsed.originalText = text;
            parsed.mainMeaning = resText;
            return parsed;
        });
};
object.httpRequest = (text, from, to) => {
    return object.request('getQueryStr',text, from, to)
        .then(body => {
            return fetch("http://fanyi.youdao.com/translate_o?smartresult=dict&smartresult=rule", {
                "headers": {
                    "accept": "application/json, text/javascript, */*; q=0.01",
                    "accept-language": "zh-CN,zh;q=0.9",
                    "cache-control": "no-cache",
                    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "pragma": "no-cache",
                    "x-requested-with": "XMLHttpRequest"
                },
                "referrer": "http://fanyi.youdao.com/",
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": body,
                "method": "POST",
                "mode": "cors",
                "credentials": "include"
            })
        })
        .then(response => {
            return response.json();
        })
};
export default object;
