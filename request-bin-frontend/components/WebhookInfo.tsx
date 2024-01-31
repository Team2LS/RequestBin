import React from 'react';

interface IMyProps {
  request_method: string,
  http_path: string
}

const WebhookInfo: React.FC<IMyProps> = (props: IMyProps) => {
  return (
    <>
      {props.request_method} | {props.http_path}
    </>
  );
}

export default WebhookInfo;
