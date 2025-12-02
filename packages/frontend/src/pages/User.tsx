import { type FC, useEffect, useState } from 'react';
import { useRouteContext } from '@tupynamba/fastifyreact-ts/client'
import { AuthForm } from '@reactComponents/base-components/containers/AuthForm'
import UserDashboard from '@reactComponents/user-panel/user-interface/containers/UserDashboard'
import { useNavigate } from 'react-router-dom';

interface IndexProps {}

const Index: FC<IndexProps> = () => {
  const { state, actions } = useRouteContext();
  const navigate = useNavigate();
  console.log(state.cycle)
  useEffect(() => {
    if (state.user.authenticated && state.user.role === 'admin') {
      navigate('/admin');
    }
  }, [state.user.authenticated, state.user.role, navigate]);

  if (state.user.authenticated && state.user.role === 'admin') {
    return null;
  }

  return (
    <>
      {state.user.authenticated ? <UserDashboard /> : <AuthForm />}
    </>
  );
}

export default Index;