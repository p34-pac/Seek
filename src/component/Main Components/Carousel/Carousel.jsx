/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react'
import './Carousel.css'
import { AddIcon, AngleLeftIcon, AngleRightIcon } from '../../asset component/Icons/Icons';
import { image } from '../../../pages/Home/Home';
import { to_1_decimal } from '../../../functions/Requests/actions';
import { useNavigate } from 'react-router-dom';
import Modal from '../../MinorComponents/Modal/Modal';
import AddToCollection from '../../MinorComponents/AddToCollection/AddToCollection';



function Carousel({images, items}) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate()
    const [toCollection, setToCollection] = useState({item: null, show: false})


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
    <section className="carousel">
      <div className="carousel-inner" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {
          items?
          items.map((item, index) => (
            <div className="carousel-item" key={index}>
              <img src={item.poster_path
                                    ? image(item.poster_path, 10)
                                    : item.backdrop_path
                                    ? image(item.backdrop_path, 10)
                                    : null} alt={`Slide ${index}`} />
              {
                currentIndex == index&&
                <div className="carouselContent">
                    <div className="detail">
                      <h1>{item.title}</h1>
                      <div className="others">
                        <span className="rating">{item.vote_average?to_1_decimal(item.vote_average):null}</span>
                        <span className="rating">{item.original_language?item.original_language:null}</span>
                      </div>
                    </div>
                    
                    <p className="desc">{item.overview}</p>
                    <div className="cta">
                      <button
                          onClick={() => navigate(`/video?title=${item.title}`)}

                        >Seek</button>
                      <button
                          onClick={() => setToCollection({item, show: true})}
                
                        ><AddIcon fill='var(--baseWhite1000)'/></button>
                    </div>
                </div>
              }
            </div>
          ))
          :
          images.map((image, index) => (
          <div className="carousel-item" key={index}>
            <img src={image.src} alt={`Slide ${index}`} />
          </div>
        ))
        }
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
      
      {
        toCollection.item&&toCollection.show?
            <Modal defaultCancel={false}>
                <AddToCollection cancel={()=>setToCollection({item: null, show: false})} item={toCollection.item} />
            </Modal>
        :null
    }
    </section>
  )
}

export default Carousel