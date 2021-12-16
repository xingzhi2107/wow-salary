import React from 'react';
import {Button, Input} from 'antd';
import {Link} from 'react-router-dom';

export function LoginPage() {
  return (
    <div>
      <Link to="/">{'首页'}</Link>
      <Input placeholder="账号" />
      <Input placeholder="密码" />
      <Button type="primary">{'登录'}</Button>
    </div>
  );
}
