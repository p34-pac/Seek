/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import './Thumbnailing.css'; // Import the CSS file

const Thumbnailing = ({ collection }) => {
  const getThumbnails = () => {
    if (collection.length >= 4) {
      return collection.slice(0, 4).map(movie => movie.poster_path);
    } else if (collection.length === 3) {
      return collection.slice(0, 2).map(movie => movie.poster_path);
    } else if (collection.length === 2) {
      return [collection[0].poster_path];
    }
    return [];
  };

  const thumbnails = getThumbnails();

  return (
    <div className={`collage collage-${thumbnails.length}`}>
      {thumbnails.map((thumbnail, index) => (
        <img
          key={index}
          src={`https://image.tmdb.org/t/p/w500${thumbnail}`}
          alt={`Poster ${index + 1}`}
          className={`collage-item collage-item-${index + 1}`}
        />
      ))}
    </div>
  );
};

export default Thumbnailing;
