const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());

const PORT = 5000;

function addMovei(movies) {
  fs.writeFile("./movies.json", JSON.stringify(movies), (err, data) => {});
}

// 1 - show all movies
app.get("/", (req, res) => {
  fs.readFile("./movies.json", (err, data) => {
    let movies = JSON.parse(data.toString());

    movies = movies.filter((movie) => movie.isDeleted === false);

    res.status(200).json(movies);
  });
});

// 2 - show movie by id
app.get("/movie/:id", (req, res) => {
  const { id } = req.params;

  fs.readFile("./movies.json", (err, data) => {
    const movies = JSON.parse(data.toString());

    res.status(200).json(movies[id]);
  });
});

// 3 - add new movie
app.post("/movies/add", (req, res) => {
  fs.readFile("./movies.json", (err, data) => {
    const movies = JSON.parse(data.toString());

    movies.push({
      id: movies.length - 1,
      name: req.body.name,
      isFav: false,
      isDeleted: false,
    });
    addMovei(movies);

    res.status(200).json(movies);
  });
});

// 4 - update movie
app.put("/movie/update", (req, res) => {
  const { id, name } = req.body;
  fs.readFile("./movies.json", (err, data) => {
    const movies = JSON.parse(data.toString());

    movies.splice(id, 1, { id, name, isFav: false, isDeleted: false });
    addMovei(movies);

    res.status(200).json(movies);
  });
});

// 5 - show the favorite movie
app.get("/movies/fav", (req, res) => {
  fs.readFile("./movies.json", (err, data) => {
    const movies = JSON.parse(data.toString());

    let favMovies = movies.filter((movie) => movie.isFav === true);

    res.status(200).json(favMovies);
  });
});

// 6 - soft delete movie
app.put("/movie/delete/:id", (req, res) => {
  const { id } = req.params;

  fs.readFile("./movies.json", (err, data) => {
    const movies = JSON.parse(data.toString());

    movies.splice(id, 1, {
      id,
      name: movies[id].name,
      isFav: movies[id].isFav,
      isDeleted: true,
    });
    addMovei(movies);

    res.status(200).json(movies);
  });
});

// start the server
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
