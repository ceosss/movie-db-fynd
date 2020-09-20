import React, { useState } from "react"
import axios from "axios"
import qs from "qs"

const Admin = ({ setJwtToken }) => {
  const storedJwt = localStorage.getItem("token")
  const [jwt, setJwt] = useState(storedJwt || null)
  const [email, setEmail] = useState("")
  const [password, setpassword] = useState("")
  const onChange = e => {
    if (e.target.name === "email") return setEmail(e.target.value)
    setpassword(e.target.value)
  }
  const onSubmit = async () => {
    const login = await axios({
      method: "post",
      url: "http://localhost:3000/login",
      data: qs.stringify({
        email,
        password,
      }),
      headers: {
        "content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    })
    if (login.data.status[0] === "s") {
      console.log("LOGIN S")
      localStorage.setItem("token", login.data.token)
      setJwt(login.data.token)
      setJwtToken(login.data.token)
    } else console.log("LOGIN F")
  }
  const logOut = () => {
    localStorage.removeItem("token")
    setJwt(null)
    setJwtToken(null)
  }
  return (
    <div className="admin-comp">
      <h1>ADMIN ACCESS</h1>
      <h3>LOGIN</h3>
      {jwt ? (
        <div className="sign-out">
          <button onClick={logOut}>SIGN OUT</button>
        </div>
      ) : (
        <div className="admin-input">
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={email}
            onChange={onChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={password}
            onChange={onChange}
          />
          <input type="submit" value="Login" onClick={onSubmit} />
        </div>
      )}
    </div>
  )
}

export default Admin
