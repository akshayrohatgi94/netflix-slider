import React from "react";
import { render } from "react-dom";
import MovieContainer from "./container/movie-container";
import { movieFixture } from "./fixtures/movies";
import "./style.css";

export default function App() {
  return <MovieContainer movies={movieFixture} />;
}

render(<App />, document.getElementById("root"));
