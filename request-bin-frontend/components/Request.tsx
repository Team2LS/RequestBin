import { FC, Fragment, useState } from 'react';
import beautify from 'json-beautify';
import { JsonView, allExpanded, defaultStyles } from 'react-json-view-lite';
import { Stack } from 'react-bootstrap';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import json from 'react-syntax-highlighter/dist/esm/languages/hljs/json';
import http from 'react-syntax-highlighter/dist/esm/languages/hljs/http';
import docco from 'react-syntax-highlighter/dist/esm/styles/hljs/docco';
import 'react-json-view-lite/dist/index.css';

type JSONPrimitive = string | number | boolean | JSONObject | null | undefined;
type JSONObject = { [key: string]: JSONPrimitive } | JSONObject[];

interface IMyProps {
  reqInfo: JSONObject,
  reqPayload: JSONObject
}

SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('http', http);

const Request: FC<IMyProps> = (props: IMyProps) => {
  if (!props.reqInfo || !props.reqPayload) {
    return (
      <Stack style={{padding: 0, height: '85vh', width: '60vw', position: 'relative'}}>
        <div className="card text-left">
          Click a request to view request details
        </div>
      </Stack>
    );
  }

  const navActive = "nav-link active";
  const navInactive = "nav-link link";
  const initialNavTabStatus = { raw: navActive, pretty: navInactive, structured: navInactive };

  const toggleNavTabStatus = (tab: string) => {
    setNavTabStatus({
      raw: tab === "raw" ? navActive : navInactive,
      pretty: tab === "pretty" ? navActive : navInactive,
      structured: tab === "structured" ? navActive : navInactive,
    });
  };

  const [navTabStatus, setNavTabStatus] = useState(initialNavTabStatus);

  const raw = JSON.stringify(props.reqPayload['payload'], null, 2);
  const pretty = beautify(props.reqPayload['payload'], null, 2);

  return (
    <Stack className="overflow-auto" style={{height: '85vh', width: '60vw', position: 'relative'}}>
      <div className="card text-left">
        <div className="card-header">
            Request Details:
        </div>
        <div className="card-body">
          <SyntaxHighlighter language="html" style={docco}>
            {props.reqInfo['http_method'] + " " + props.reqInfo['http_path']}
          </SyntaxHighlighter>
        </div>
      </div>
      <div className="card text-left">
        <div className="card-header">
          Request Headers:
        </div>
        <div className="card-body">
          <p className="card-text" style={{whiteSpace: "pre-wrap", textAlign: "left"}}>
            <SyntaxHighlighter language="json" style={docco}>
              {beautify(props.reqPayload["headers"], null, 2)}
            </SyntaxHighlighter>
          </p>
        </div>
      </div>
      <div className="card text-left" >
        <div className="card-header">
          Request Body:
          <ul className="nav nav-pills card-header-pills">
            <li className="nav-item">
              <a className={navTabStatus['raw']} onClick={() => toggleNavTabStatus('raw')}>Raw</a>
            </li>
            <li className="nav-item">
              <a className={navTabStatus['pretty']} onClick={() => toggleNavTabStatus('pretty')}>Pretty</a>
            </li>
            <li className="nav-item">
              <a className={navTabStatus['structured']} onClick={() => toggleNavTabStatus('structured')}>Structured</a>
            </li>
          </ul>
        </div>
        <div className="card-body">
          { navTabStatus['raw'] === navActive
              ? <p className="card-text" style={{textAlign: "left"}}>{raw}</p>
              : navTabStatus['pretty'] === navActive
                ? <p className="card-text" style={{whiteSpace: "pre-wrap", textAlign: "left"}}>
                    <SyntaxHighlighter language="json" style={docco}>
                      {pretty}
                    </SyntaxHighlighter>
                  </p>
                : <Fragment>
                    <JsonView data={props.reqPayload['payload']} shouldExpandNode={allExpanded} style={defaultStyles} />
                  </Fragment>
          }
        </div>
      </div>
    </Stack>
  );
}

export default Request;