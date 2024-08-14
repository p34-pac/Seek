/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import { ErrorBoundary, useErrorBoundary } from 'react-error-boundary';

function MyErrorBoundary({ children }) {
  const { ErrorBoundary, didCatch, error } = useErrorBoundary();

  if (didCatch) {
    // You can render any custom fallback UI
    return <h1>Something went wrong: {error.message}</h1>;
  }

  return <ErrorBoundary>{children}</ErrorBoundary>;
}

export default MyErrorBoundary