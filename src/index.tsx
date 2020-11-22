import React from "react";
import { render } from "react-dom";
import MovieTile from "./component/movie";
import MovieContainer from "./container/movie-container";
import { movieFixture } from "./fixtures/movies";
import "./style.css";

export default function App() {
  const movies = movieFixture.map((movie, idx) => (
    <MovieTile key={idx} {...movie} />
  ));

  return <MovieContainer movies={movies} />;
}

render(<App />, document.getElementById("root"));
