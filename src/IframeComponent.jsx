// src/IframeComponent.jsx
import React from 'react';
import YourComponent from './YourComponent';
import { defaultTheme } from '../theme';

export default function IframeComponent() {
  return (
    <YourComponent theme={defaultTheme} />
  );
}

