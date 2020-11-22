import React from "react";
import "./Movie.css";

export default function MovieTile({ id, image }) {
  return (
    <div className="tile">
      <div className="tile-inner">
        <img src={image} />
      </div>
    </div>
  );
}
