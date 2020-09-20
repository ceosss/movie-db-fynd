import React, { useEffect, useState } from "react"
import axios from "axios"
import { Helmet } from "react-helmet"
import Posts from "../components/Movies"
import Pagination from "../components/Pagination"
import Admin from "../components/Admin"
import Edit from "../components/Edit"
import AddMovie from "../components/AddMovie"
import Register from "../components/Register"

import "../components/index.css"

const Home = () => {
  const [movies, setMovies] = useState([])
  const [workMovies, setWorkMovies] = useState([])
  const [genres, setGenre] = useState([])
  const [selectGenre, setSelectGenre] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [postsPerPage] = useState(10)
  const [sortby, setSortBy] = useState("name")
  const [search, setSearch] = useState("")
  const [edit, setEdit] = useState(null)
  const storedJwt = localStorage.getItem("token")
  const [jwt, setJwt] = useState(storedJwt || null)
  const [showadd, setshowadd] = useState(false)
  useEffect(() => {
    const getMovies = async () => {
      setLoading(true)
      let fetchedMovies = await axios.get("http://localhost:3000/movies")
      if (sortby === "name")
        fetchedMovies.data.sort((a, b) => (a.name > b.name ? 1 : -1))
      else if (sortby === "popularity")
        fetchedMovies.data.sort((a, b) =>
          a.popularity < b.popularity ? 1 : -1
        )
      else if (sortby === "director")
        fetchedMovies.data.sort((a, b) => (a.director > b.director ? 1 : -1))
      console.log(fetchedMovies)
      setMovies(fetchedMovies.data)
      setWorkMovies(fetchedMovies.data)
      let fetchedGenres = await axios.get("http://localhost:3000/genres")
      setGenre(fetchedGenres.data)
      setLoading(false)
    }
    getMovies()
  }, [sortby])

  useEffect(() => {
    setWorkMovies(
      movies.filter(
        mov =>
          mov.name.toLowerCase().includes(search.toLowerCase()) ||
          mov.director.toLowerCase().includes(search.toLowerCase())
      )
    )
  }, [search])

  useEffect(() => {
    if (selectGenre.length) {
      let newGeneredMovies = new Set()
      movies.map(mov => {
        mov.genre.map(gen => {
          selectGenre.map(g => {
            if (gen === g) newGeneredMovies.add(mov)
          })
        })
      })
      console.log([...newGeneredMovies])
      setWorkMovies([...newGeneredMovies])
    } else {
      setWorkMovies(movies)
    }
  }, [selectGenre])

  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = workMovies.slice(indexOfFirstPost, indexOfLastPost)

  const paginate = pageNumber => setCurrentPage(pageNumber)

  const handleSortChange = e => {
    const val = e.target.value
    setSortBy(val)
  }
  const handleSearchChange = e => {
    setSearch(e.target.value)
    console.log(search)
  }

  const handleCheckbox = e => {
    console.log("Val", e.target.value)
    let newGenre = []
    if (selectGenre.length) {
      selectGenre.map(s => {
        if (s !== e.target.value) {
          newGenre.push(e.target.value)
        }
      })
      setSelectGenre(newGenre)
    } else {
      setSelectGenre([e.target.value])
    }
    console.log("s", selectGenre)
  }
  const setToken = d => {
    setJwt(d)
  }
  const handleEdit = post => {
    setEdit(post)
    console.log("EDIT", post)
  }

  const handleAddMovie = () => {
    setshowadd(!showadd)
  }

  return (
    <div className="base-container">
      <Helmet htmlAttributes={{ lang: "en" }}>
        <link
          rel="stylesheet"
          href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
          integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
          crossorigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap"
          rel="stylesheet"
        ></link>
      </Helmet>
      <div className="head">
        <h1 className="text-primary mb-3">My Movies</h1>
      </div>
      <div className="container m-5 admin">
        <Admin setJwtToken={setJwt} />
        <div className="add-out">
          {jwt ? <button onClick={handleAddMovie}>ADD A MOVIE</button> : null}
          {jwt && showadd ? <AddMovie /> : null}
        </div>
        {jwt ? null : <Register setJwtToken={setJwt} />}
      </div>
      {edit && (
        <div className="container m-5">
          <Edit data={edit} />
        </div>
      )}
      <div className="cont">
        <div className="filter">
          <h1>FILTER</h1>
          <div className="check-holder">
            <div className="container m-5 checkboxes">
              {genres.map((genre, i) => (
                <span key={genre.name + i}>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="exampleCheck1"
                    value={genre.name}
                    onChange={handleCheckbox}
                    key={genre.name}
                  />
                  <label>{genre.name}</label>
                  <br />
                </span>
              ))}
            </div>
          </div>
          <div className="filters">
            <select name="sort" id="sort" onChange={handleSortChange}>
              <option value="name">Name</option>
              <option value="director">Director</option>
              <option value="popularity">Popularity</option>
            </select>
            <input
              type="text"
              onChange={handleSearchChange}
              value={search}
              placeholder="Search by Name Dir' Name"
            />
          </div>
        </div>
      </div>
      <div className="container mt-5 movies">
        <Posts
          posts={currentPosts}
          loading={loading}
          user={jwt}
          handleEdit={handleEdit}
        />
        <Pagination
          postsPerPage={postsPerPage}
          totalPosts={workMovies.length}
          paginate={paginate}
        />
      </div>
    </div>
  )
}

export default Home
