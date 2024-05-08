import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment, useState } from 'react';
import beautify from 'json-beautify';
import { JsonView, allExpanded, defaultStyles } from 'react-json-view-lite';
import { Stack } from 'react-bootstrap';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import json from 'react-syntax-highlighter/dist/esm/languages/hljs/json';
import http from 'react-syntax-highlighter/dist/esm/languages/hljs/http';
import docco from 'react-syntax-highlighter/dist/esm/styles/hljs/docco';
import 'react-json-view-lite/dist/index.css';
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('http', http);
const Request = (props) => {
    console.log(props.noWebhooks);
    if (props.noWebhooks) {
        return (_jsx(Stack, { style: { height: '95vh', width: '95vw', position: 'absolute' }, children: _jsx("div", { className: "card text-left", children: "Your bins don't have any requests yet!" }) }));
    }
    else if (!props.reqInfo || !props.reqPayload) {
        return (_jsx(Stack, { style: { padding: 0, height: '85vh', width: '60vw', position: 'relative' }, children: _jsx("div", { className: "card text-left", children: "Click a request to view request details" }) }));
    }
    const navActive = "nav-link active";
    const navInactive = "nav-link link";
    const initialNavTabStatus = { raw: navActive, pretty: navInactive, structured: navInactive };
    const toggleNavTabStatus = (tab) => {
        setNavTabStatus({
            raw: tab === "raw" ? navActive : navInactive,
            pretty: tab === "pretty" ? navActive : navInactive,
            structured: tab === "structured" ? navActive : navInactive,
        });
    };
    const [navTabStatus, setNavTabStatus] = useState(initialNavTabStatus);
    const raw = JSON.stringify(props.reqPayload['payload'], null, 2);
    const pretty = beautify(props.reqPayload['payload'], null, 2);
    return (_jsxs(Stack, { className: "overflow-auto", style: { height: '85vh', width: '60vw', position: 'relative' }, children: [_jsxs("div", { className: "card text-left", children: [_jsx("div", { className: "card-header", children: "Request Details:" }), _jsx("div", { className: "card-body", children: _jsx(SyntaxHighlighter, { language: "html", style: docco, children: props.reqInfo['http_method'] + " " + props.reqInfo['http_path'] }) })] }), _jsxs("div", { className: "card text-left", children: [_jsx("div", { className: "card-header", children: "Request Headers:" }), _jsx("div", { className: "card-body", children: _jsx("p", { className: "card-text", style: { whiteSpace: "pre-wrap", textAlign: "left" }, children: _jsx(SyntaxHighlighter, { language: "json", style: docco, children: beautify(props.reqPayload["headers"], null, 2) }) }) })] }), _jsxs("div", { className: "card text-left", children: [_jsxs("div", { className: "card-header", children: ["Request Body:", _jsxs("ul", { className: "nav nav-pills card-header-pills", children: [_jsx("li", { className: "nav-item", children: _jsx("a", { className: navTabStatus['raw'], onClick: () => toggleNavTabStatus('raw'), children: "Raw" }) }), _jsx("li", { className: "nav-item", children: _jsx("a", { className: navTabStatus['pretty'], onClick: () => toggleNavTabStatus('pretty'), children: "Pretty" }) }), _jsx("li", { className: "nav-item", children: _jsx("a", { className: navTabStatus['structured'], onClick: () => toggleNavTabStatus('structured'), children: "Structured" }) })] })] }), _jsx("div", { className: "card-body", children: navTabStatus['raw'] === navActive
                            ? _jsx("p", { className: "card-text", style: { textAlign: "left" }, children: raw })
                            : navTabStatus['pretty'] === navActive
                                ? _jsx("p", { className: "card-text", style: { whiteSpace: "pre-wrap", textAlign: "left" }, children: _jsx(SyntaxHighlighter, { language: "json", style: docco, children: pretty }) })
                                : _jsx(Fragment, { children: _jsx(JsonView, { data: props.reqPayload['payload'], shouldExpandNode: allExpanded, style: defaultStyles }) }) })] })] }));
};
export default Request;
