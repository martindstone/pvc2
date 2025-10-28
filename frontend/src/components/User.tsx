import type React from 'react';

import { useQuery } from '@tanstack/react-query';
const User: React.FC = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const r = await fetch('/auth/me');
      return r.json();
    }
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  if ( data?.authorized === false ) {
    return (
      <div>
        <h2>User not authorized</h2>
        <a href="/auth/google">Login with Google</a>
      </div>
    );
  }

  if ( data?.authorized === true ) {
    return (
      <div>
        <h2>Welcome, {data.user.name}</h2>
        <p>Email: {data.user.email}</p>
        <a href="/auth/logout">Logout</a>
      </div>
    );
  }
  return <div>User Component: {JSON.stringify(data)}</div>;
};

export default User;
