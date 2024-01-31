import React from 'react';

interface IMyProps {
  request_method: string,
  http_path: string
}


const WebhookInfo: React.FC<IMyProps> = (props: IMyProps) => {
  // const payload: any = props.data;

  return (
    <li>
      {props.request_method} , {props.http_path}
    </li>
  );
}

export default WebhookInfo;
