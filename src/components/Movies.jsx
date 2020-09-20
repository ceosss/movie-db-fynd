import React from "react"
import axios from "axios"
import decode from "jwt-decode"
import "./Movies.css"

const Posts = ({ posts, loading, user, handleEdit }) => {
  if (loading) {
    return <h2>Loading...</h2>
  }
  const token = localStorage.getItem("token")
  const handleDelete = async name => {
    const del = await axios.delete(`http://localhost:3000/movies/${name}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    window.location.reload()
    console.log(del)
  }
  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Director</th>
          <th scope="col">Popularity</th>
        </tr>
      </thead>
      <tbody>
        {posts.map((post, i) => (
          <tr key={post.name + i}>
            <td>{post.name}</td>
            <td>{post.director}</td>
            <td>{post.popularity}</td>
            <td>
              {user ? <a onClick={() => handleDelete(post.name)}>X</a> : null}
            </td>
            <td>
              {user ? <a onClick={() => handleEdit(post)}>edit</a> : null}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default Posts
