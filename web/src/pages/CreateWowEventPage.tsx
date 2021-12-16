import React from 'react';
import {Button} from 'antd';
import {Link} from 'react-router-dom';

export function CreateWowEventPage() {
  return (
    <div>
      <Link to="/login">{'登录'}</Link>
      <Button type="primary">{'提交'}</Button>
    </div>
  );
}
