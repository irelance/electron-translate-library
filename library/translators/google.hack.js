import axios from "axios";

let empty = () => 0;
let google = {};
let window = {
    google,
    location: {
        href: "https://www.google.translate.element.random=1"
    }
};
let fakeElement = {};
let returnFakeElement = () => fakeElement;
let document = {
    defaultView: window,
    body: fakeElement,
};
window.document = document;
fakeElement.ownerDocument = document;
fakeElement.parentNode = fakeElement;
document.createElement = document.getElementsByTagName = fakeElement.appendChild = returnFakeElement;
fakeElement.getAttribute = fakeElement.setAttribute = empty;

function updateTKK() {
    return axios.get('https://translate.googleapis.com/translate_a/element.js')
        .then(res => {
            eval(res.data);
            return window.google.translate._const._ctkk.split('.').map(i => Number(i));
        });
}

function updateLogld() {
    return (window.google.translate ? new Promise(r => r()) : updateTKK())
        .then(() => axios.get('https://translate.googleapis.com/translate_static/js/element/main.js'))
        .then(res => {
            eval(res.data);
            return window.google.translate.v;
        });
}

export {updateTKK, updateLogld}
