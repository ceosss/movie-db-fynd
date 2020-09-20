import React, { useState, useEffect } from "react"
import axios from "axios"
import decode from "jwt-decode"
import qs from "qs"

const Edit = ({ data }) => {
  const [director, setDirector] = useState(data.director)
  const [popularity, setPopularity] = useState(data.popularity)
  const [imdb_score, setImdb_score] = useState(data.imdb_score)
  let getToken
  if (typeof window !== "undefined") {
    getToken = localStorage.getItem("token")
  }
  const [username] = useState(decode(getToken).email)
  const [genres, setGeneres] = useState([])
  const [selectedGeneres, setSelectedGeneres] = useState([...data.genre])

  const onChangeHandler = e => {
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
      let myArray = newarr.filter(function (el) {
        return selectedGeneres.indexOf(el) < 0
      })
      setGeneres(myArray)
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

      if (f == 1) {
        setSelectedGeneres(selectedGeneres.filter(s => s !== value))
      } else {
        setSelectedGeneres([...selectedGeneres, value])
      }
    } else {
      setSelectedGeneres([...selectedGeneres, value])
    }
  }
  const updateMovie = async () => {
    const update = await axios({
      method: "put",
      url: "https://movie-db-backend-fynd.herokuapp.com/movies",
      data: qs.stringify({
        name: data.name,
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
    console.log(update)
    window.location.reload()
  }
  return (
    <div className="edit-movie">
      <h2>EDIT MOVIE</h2>
      <span className="name">
        <label>NAME : </label>
        <p>{data.name}</p>
      </span>
      <span>
        {data.lastEdited ? (
          <>
            <label>LAST EDITED BY : </label>
            <p>{data.lastEdited}</p>
          </>
        ) : null}
      </span>
      <span>
        <label>DIRECTOR</label>
        <input
          type="text"
          name="director"
          value={director}
          onChange={onChangeHandler}
        />
      </span>
      <span>
        <label>POPULARITY</label>
        <input
          type="number"
          name="popularity"
          value={popularity}
          onChange={onChangeHandler}
        />
      </span>
      <span>
        <label>IMDB SCORE</label>
        <input
          type="number"
          name="imdb_score"
          value={imdb_score}
          onChange={onChangeHandler}
        />
      </span>
      <div className="container m-5 selected">
        <h3>Selected Genres</h3>
        {selectedGeneres.map((s, i) => (
          <p key={s + i}>{s}</p>
        ))}
      </div>
      <div className="container m-5 checkboxes edit-movie-check">
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
      <input type="submit" value="EDIT" onClick={updateMovie} />
    </div>
  )
}

export default Edit
