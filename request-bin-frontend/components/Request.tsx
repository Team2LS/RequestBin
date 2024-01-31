import React from 'react';
import { z } from 'zod';

const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
type Literal = z.infer<typeof literalSchema>;
type Json = Literal | { [key: string]: Json } | Json[];

interface IMyProps {
  payloadData: Json
}

const Request: React.FC<IMyProps> = (props: IMyProps) => {
  if (!props.payloadData) {
    return (<></>)
  }

  return (
    <div className="card text-center">
      <div className="card-header">
        <ul className="nav nav-pills card-header-pills">
          <li className="nav-item">
            <a className="nav-link active" href="#">Raw</a>
          </li>
          <li className="nav-item">
            <a className="nav-link link" href="#">Pretty</a>
          </li>
          <li className="nav-item">
            <a className="nav-link link" href="#">Structured</a>
          </li>
        </ul>
      </div>
      <div className="card-body">
        <p className="card-text"><code>{String(props.payloadData)}</code></p>
      </div>
    </div>
  );
}

export default Request;