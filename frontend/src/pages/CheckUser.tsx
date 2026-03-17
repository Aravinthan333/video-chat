import { useEffect } from "react";
import { authService } from "../services/auth.service";
import { useDispatch } from "react-redux";
import { setUser } from "../reduxStore/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const CheckUser = () => {
const [loading, setLoading] = useState(true)

  const navigate = useNavigate();

  const dispatch = useDispatch();

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

  if (loading) return <div className="center">Checking session...</div>
  return <></>;
};
export default CheckUser;
