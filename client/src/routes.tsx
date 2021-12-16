import React from 'react';
import {RouteConfig} from 'react-router-config';

import {CreateWowEventPage} from './pages/CreateWowEventPage';
import {LoginPage} from './pages/LoginPage';

/* eslint-disable react/no-multi-comp */
export const routes: RouteConfig[] = [
  {
    path: '/',
    exact: true,
    render: () => {
      return <CreateWowEventPage />;
    },
  },
  {
    path: '/login',
    exact: true,
    render: () => {
      return <LoginPage />;
    },
  },
];
/* eslint-enable react/no-multi-comp */
