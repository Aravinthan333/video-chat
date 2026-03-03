import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const { user, loading } = useAuth();
console.log("111111111111111111111111111")

  // if (loading) {
  //   console.log("3333333333333333333333333333")
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
  //     </div>
  //   );
  // }

  if (!user) {
console.log("2222222222222222222222222222")
    return <Navigate to="/login" replace />;
  }
console.log("44444444444444444444444444")
  return <>{children}</>;
};

export default ProtectedRoute;