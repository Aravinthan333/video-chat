import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authService } from '../services/auth.service';
import { setUser } from '../reduxStore/slices/userSlice';

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {

  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
console.log("111111111111111111111111111")
const dispatch= useDispatch()

useEffect(() => {
  const getUser = async () => {
    const user = await authService.getMe();
    console.log("user", user);
    if (!user) {
      navigate("login");
    }
    setLoading(false)
    dispatch(
      setUser({
        id: user?.id,
        googleId: user?.googleId,
        name: user?.name,
        email: user?.email,
        diaplayName: user?.displayName,
      }),
    );
    navigate("/dashboard");
  };
  getUser();
}, []);

const user = useSelector((state:any)=> state.user)
console.log("user1234: ==>",user)

  if (loading) {
    console.log("3333333333333333333333333333")
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (user.id==0) {
console.log("2222222222222222222222222222")
    return <Navigate to="/login" replace />;
  }
console.log("44444444444444444444444444")
  return <>{children}</>;
};

export default ProtectedRoute;