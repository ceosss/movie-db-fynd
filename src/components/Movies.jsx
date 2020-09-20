import React from "react"
import axios from "axios"
import decode from "jwt-decode"
import "./Movies.css"

const Posts = ({ posts, loading, user, handleEdit }) => {
  if (loading) {
    return <h2>Loading...</h2>
  }
  let token
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token") || null
  }
  const handleDelete = async name => {
    const del = await axios.delete(
      `https://movie-db-backend-fynd.herokuapp.com/movies/${name}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    )
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
          <th scope="col">Edit</th>
          <th scope="col">Delete</th>
        </tr>
      </thead>
      <tbody>
        {posts.map((post, i) => (
          <tr key={post.name + i}>
            <td>{post.name}</td>
            <td>{post.director}</td>
            <td>{post.popularity}</td>
            <td>
              {user ? (
                <a className="edit" onClick={() => handleEdit(post)}>
                  Edit
                </a>
              ) : null}
            </td>
            <td>
              {user ? (
                <a className="edit" onClick={() => handleDelete(post.name)}>
                  X
                </a>
              ) : null}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default Posts
