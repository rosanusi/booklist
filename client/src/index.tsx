import React from "react"
import ReactDOM from "react-dom"
import { xmlToJson } from "./utils.js"

class Greetings extends React.Component<{ name: string }, {}> {
    render() {
        return <h1>Hello {this.props.name}!</h1>;
    }


    componentDidMount() {
        this.getData();
    }

    async getData() {
        //TODO: use any function listed in: https://github.com/bdickason/node-goodreads
        console.log(await goodreads("getShelves", "4085451"));
        console.log(await goodreads("getSingleShelf", { 'userID': '4085451', 'shelf': 'web', 'page': 1, 'per_page': 200 }))
    }

}

export function main() {
    ReactDOM.render(<Greetings name='world' />, document.querySelector('#root'));

}


async function goodreads(action: string, prms: any): Promise<any> {
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
        let json = xmlToJson(xml);
        //console.log(json);
        return json;
    }
    return res3;
}

function ajax(url: string): Promise<any> {
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





