/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react'
import './Carousel.css'
import { AngleLeftIcon, AngleRightIcon } from '../../asset component/Icons/Icons';



function Carousel({images}) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrevClick = () => {
      setCurrentIndex((currentIndex > 0) ? currentIndex - 1 : images.length - 1);
    };
  
    const handleNextClick = () => {
      setCurrentIndex((currentIndex < images.length - 1) ? currentIndex + 1 : 0);
    };
  
    const handleIndicatorClick = (index) => {
      setCurrentIndex(index);
    };


    
  return (
    <div className="carousel">
    <div className="carousel-inner" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
      {images.map((image, index) => (
        <div className="carousel-item" key={index}>
          <img src={image.src} alt={`Slide ${index}`} />
        </div>
      ))}
    </div>
    <button className="carousel-control prev" onClick={handlePrevClick}>
        <AngleLeftIcon fill='var(--baseWhite1000)'/>
    </button>
    <button className="carousel-control next" onClick={handleNextClick}>
        <AngleRightIcon fill='var(--baseWhite1000)'/>
    </button>
    <div className="carousel-indicators">
      {images.map((_, index) => (
        <span
          key={index}
          className={`indicator ${index === currentIndex ? 'active' : ''}`}
          onClick={() => handleIndicatorClick(index)}
        ></span>
      ))}
    </div>
  </div>
  )
}

export default Carousel