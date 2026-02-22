import { useState } from 'react'

import './App.css'
import axios from 'axios'

function App() {
  const [count, setCount] = useState("Initial")
  const [users, setUsers] = useState<any>([])
  const [userData, setUserDate] = useState({
    name:"",
    email:""
  })

const fetchSomething = async() =>{
  const data = await axios.get("http://localhost:3000/abc")
  console.log("data",data)
  setCount(data.data)
  console.log(data)
}
const fetchUsers = async() =>{
  
  const data = await axios.get("http://localhost:3000/users")
  console.log("data",data)
  setUsers(data.data)
  console.log(data)
}

const createUser = async() =>{
  console.log("USERDATE= ", userData)
  const data = await axios.post("http://localhost:3000/user",userData)
  console.log("data",data)
  setUserDate({
    name:"",
    email:""
  })
  setUsers([...users,data.data])
}

  return (
    <>
    <p>{count}</p>
    <button onClick={fetchSomething}>Test</button>
    <br />
    <p>All Users</p>
    {users.map((user:any) => (
      <p key={user.id}>{user.name}</p>
    ))}
    <button onClick={fetchUsers}>All Users</button>
    <br/>
    <br/>
    <label>Name</label>
    <input value={userData.name} onChange={(e)=>setUserDate({...userData,name:e.target.value})} type="text" placeholder="Name" />
    <label>Email</label>
    <input value={userData.email} onChange={(e)=>setUserDate({...userData,email:e.target.value})} type="text" placeholder="Email" />
    <button onClick={createUser}>Create User</button>
    </>
  )
}

export default App
