// import { useState } from 'react'

// import './App.css'
// import axios from 'axios'

// function App() {
//   const [count, setCount] = useState("Initial")
//   const [users, setUsers] = useState<any>([])
//   const [userData, setUserDate] = useState({
//     name:"",
//     email:""
//   })

// const fetchSomething = async() =>{
//   const data = await axios.get("http://localhost:3000/abc")
//   console.log("data",data)
//   setCount(data.data)
//   console.log(data)
// }
// const fetchUsers = async() =>{
  
//   const data = await axios.get("http://localhost:3000/users")
//   console.log("data",data)
//   setUsers(data.data)
//   console.log(data)
// }

// const createUser = async() =>{
//   console.log("USERDATE= ", userData)
//   const data = await axios.post("http://localhost:3000/user",userData)
//   console.log("data",data)
//   setUserDate({
//     name:"",
//     email:""
//   })
//   setUsers([...users,data.data])
// }

//   return (
//     <>
//     <p>{count}</p>
//     <button onClick={fetchSomething}>Test</button>
//     <br />
//     <p>All Users</p>
//     {users.map((user:any) => (
//       <p key={user.id}>{user.name}</p>
//     ))}
//     <button onClick={fetchUsers}>All Users</button>
//     <br/>
//     <br/>
//     <label>Name</label>
//     <input value={userData.name} onChange={(e)=>setUserDate({...userData,name:e.target.value})} type="text" placeholder="Name" />
//     <label>Email</label>
//     <input value={userData.email} onChange={(e)=>setUserDate({...userData,email:e.target.value})} type="text" placeholder="Email" />
//     <button onClick={createUser}>Create User</button>
//     </>
//   )
// }

// export default App


// ==================================================================================================================================================


import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import { Provider } from 'react-redux';
import {store} from './reduxStore/store';
import CheckUser from './pages/CheckUser';
import Room from './components/Room';
import VideoCall from './components/VideoCall';

const App: React.FC = () => {
  return (
    <Provider store={store}>
    <BrowserRouter>
      {/* <AuthProvider> */}
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/checkUser" element={<CheckUser />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/room"
            element={
              <ProtectedRoute>
                <Room />
              </ProtectedRoute>
            }
          />
          <Route
            path="/call/:roomId"
            element={
              <ProtectedRoute>
                <VideoCall />
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      {/* </AuthProvider> */}
    </BrowserRouter>
    </Provider>
  );
};

export default App;

// ==================================================================================================================================================


// import { useState } from "react"
// import Home from "./pages/Home"
// import VideoCall from "./components/VideoCall"

// export default function App() {

//   const [roomId, setRoomId] = useState<string | null>(null)

//   if (!roomId) {
//     return <Home setRoomId={setRoomId} />
//   }

//   return <VideoCall roomId={roomId} />
// }