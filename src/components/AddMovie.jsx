import React, { useState, useEffect } from "react"
import axios from "axios"
import decode from "jwt-decode"
import qs from "qs"

const AddMovie = () => {
  const [name, setName] = useState("")
  const [popularity, setPopularity] = useState("")
  const [director, setDirector] = useState("")
  const [imdb_score, setImdb_score] = useState("")
  const [genres, setGenre] = useState([])
  let getToken
  if (typeof window !== "undefined") {
    getToken = localStorage.getItem("token")
  }

  const [username] = useState(decode(getToken).email)
  const [selectedGeneres, setSelectedGeneres] = useState([])

  const onChangeHandler = e => {
    if (e.target.name === "name") return setName(e.target.value)
    if (e.target.name === "director") return setDirector(e.target.value)
    if (e.target.name === "popularity") return setPopularity(e.target.value)
    if (e.target.name === "imdb_score") return setImdb_score(e.target.value)
  }

  useEffect(() => {
    const getGenres = async () => {
      const response = await axios.get(
        "https://movie-db-backend-fynd.herokuapp.com/genres"
      )
      let newarr = []
      response.data.map(m => newarr.push(m.name))
      setGenre(newarr)
    }
    getGenres()
  }, [])

  const handleCheckbox = e => {
    let { value } = e.target
    if (selectedGeneres.length) {
      let f = 0
      for (let i in selectedGeneres) {
        if (selectedGeneres[i] === value) {
          f = 1
          break
        }
      }

      if (f === 1) {
        setSelectedGeneres(selectedGeneres.filter(s => s !== value))
      } else {
        setSelectedGeneres([...selectedGeneres, value])
      }
    } else {
      setSelectedGeneres([...selectedGeneres, value])
    }
  }

  const updateMovie = async () => {
    const created = await axios({
      method: "post",
      url: "https://movie-db-backend-fynd.herokuapp.com/movies",
      data: qs.stringify({
        name,
        director,
        popularity,
        imdb_score,
        lastEdited: username,
        genre: selectedGeneres,
      }),
      headers: {
        "content-type": "application/x-www-form-urlencoded;charset=utf-8",
        Authorization: "Bearer " + getToken,
      },
    })
    console.log(created)
    window.location.reload()
  }

  return (
    <div className="add-movie">
      <span>
        <input
          type="text"
          name="name"
          value={name}
          onChange={onChangeHandler}
          placeholder="Name"
        />
        <input
          type="text"
          name="director"
          value={director}
          onChange={onChangeHandler}
          placeholder="Director"
        />
      </span>

      {/* <br /> */}
      <span>
        <input
          type="number"
          name="popularity"
          value={popularity}
          onChange={onChangeHandler}
          placeholder="Popularity (0-100)"
        />
        <input
          type="number"
          name="imdb_score"
          value={imdb_score}
          onChange={onChangeHandler}
          placeholder="IMDB (0-10)"
        />
      </span>

      <div className="container m-5 checkboxes add-movies">
        {genres &&
          genres.map((genre, i) => (
            <span key={genre + i}>
              <input
                type="checkbox"
                className="form-check-input"
                id="exampleCheck1"
                value={genre}
                onChange={handleCheckbox}
                key={genre}
              />
              <label>{genre}</label>
              <br />
            </span>
          ))}
      </div>
      <input type="submit" value="ADD" onClick={updateMovie} />
    </div>
  )
}

export default AddMovie
