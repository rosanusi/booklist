function _Unwrap(obj: Object): Object {
    var keys = Object.keys(obj);
    if (keys.length == 2 && keys.indexOf("_value") >= 0 && keys.indexOf("_name") >= 0) {
        return (<any>obj)._value;
    }
    return obj;
}

function _xmlToJson(el: Element): Object {
    if (el.nodeType == 3)
        return (<Text><Node>el).data;
    if (el.nodeType != 1)
        return undefined;
    //if (el.attributes.length == 0 && el.childNodes.length == 0)
    //    return el.textContent;

    var obj = {};
    obj["_name"] = el.nodeName;
    for (var i = 0; i < el.attributes.length; i++) {
        var att = el.attributes[i];
        obj[att.name] = att.value;
    }
    for (var i = 0; i < el.childNodes.length; i++) {
        var node2 = <Element>el.childNodes[i];
        //var value = _xmlToJson(node2);
        if (node2.nodeType == 1) {
            var el2 = node2;
            var prop = el2.nodeName;
            var objValue = obj[prop];
            if (objValue != null) {
                var list: Object[];
                if (objValue instanceof Array) {
                    list = objValue;
                }
                else {
                    list = [objValue];
                    obj[el2.nodeName] = list;
                }
                list.push(_Unwrap(_xmlToJson(el2)));
                continue;
            }
            obj[el2.nodeName] = _Unwrap(_xmlToJson(el2));
        }
        else {
            var value = _xmlToJson(node2);
            (<any>obj)._value = value;
        }
    }
    return obj;
}

export function xmlToJson<T>(xml2: Document | string): T {
    let xml: Document = <Document>xml2;
    if (typeof (xml2) == "string") {
        var oParser = new DOMParser();
        xml = oParser.parseFromString(xml2, "application/xml");
    }

    var el = xml.documentElement;
    var obj = <T>_xmlToJson(el);
    return obj;
}
