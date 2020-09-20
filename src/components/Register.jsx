import React, { useState } from "react"
import axios from "axios"
import qs from "qs"

const Admin = ({ setJwtToken }) => {
  let storedJwt
  if (typeof window !== "undefined") {
    storedJwt = localStorage.getItem("token")
  }

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
      url: "https://movie-db-backend-fynd.herokuapp.com/register",
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
      if (typeof window !== "undefined") {
        localStorage.setItem("token", login.data.token)
      }
      setJwt(login.data.token)
      setJwtToken(login.data.token)
      setEmail("")
      setpassword("")
      window.location.reload()
    } else console.log("LOGIN F")
  }

  return (
    <div className="admin-comp">
      <h3>Register</h3>

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
        <input type="submit" value="Register" onClick={onSubmit} />
      </div>
    </div>
  )
}

export default Admin
