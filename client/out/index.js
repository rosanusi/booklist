System.register(["react", "react-dom", "./utils.js"], function (exports_1, context_1) {
    "use strict";
    var react_1, react_dom_1, utils_js_1, Greetings;
    var __moduleName = context_1 && context_1.id;
    function main() {
        react_dom_1.default.render(react_1.default.createElement(Greetings, { name: 'world' }), document.querySelector('#root'));
    }
    exports_1("main", main);
    async function goodreads(action, prms) {
        if (prms != null && typeof (prms) != "object") {
            prms = { p: prms };
        }
        let sb = [];
        Object.keys(prms).forEach(key => sb.push(encodeURIComponent(key) + "=" + encodeURIComponent(prms[key])));
        let prms2 = sb.join("&");
        let res = await ajax(`/goodreads/${action}?${prms2}`);
        let res3 = JSON.parse(res);
        if (res3 && res3.html) {
            let url = res3.html.body[0].a[0].$.href;
            //console.log(url);
            let url2 = url.replace('https://www.goodreads.com/', '/proxy/');
            //console.log(url2);
            let xml = await ajax(url2);
            //console.log(xml);
            let json = utils_js_1.xmlToJson(xml);
            //console.log(json);
            return json;
        }
        return res3;
    }
    function ajax(url) {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open("GET", url);
            xhr.onreadystatechange = e => {
                if (xhr.readyState == 4) {
                    resolve(xhr.response);
                }
            };
            xhr.send();
        });
    }
    return {
        setters: [
            function (react_1_1) {
                react_1 = react_1_1;
            },
            function (react_dom_1_1) {
                react_dom_1 = react_dom_1_1;
            },
            function (utils_js_1_1) {
                utils_js_1 = utils_js_1_1;
            }
        ],
        execute: function () {
            Greetings = class Greetings extends react_1.default.Component {
                render() {
                    return react_1.default.createElement("h1", null,
                        "Hello ",
                        this.props.name,
                        "!");
                }
                componentDidMount() {
                    this.getData();
                }
                async getData() {
                    //TODO: use any function listed in: https://github.com/bdickason/node-goodreads
                    console.log(await goodreads("getShelves", "4085451"));
                    console.log(await goodreads("getSingleShelf", { 'userID': '4085451', 'shelf': 'web', 'page': 1, 'per_page': 200 }));
                }
            };
        }
    };
});
