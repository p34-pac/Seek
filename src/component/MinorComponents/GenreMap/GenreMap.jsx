/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'

export function GenraMapAll({genreList}){
    return genreList
            .map((genre, index) => genre + (index < genreList.length - 1 ? ', ' : ''))
            .join('');
  }

  export function GenraMap3({genreList}){
    return genreList
          .slice(0, 3) // Take only the first 3 elements
          .map((genre, index) => genre + (index < Math.min(genreList.length, 3) - 1 ? ', ' : ''))
          .join('');
  }

