/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'
import './MovieCard.css'
import OtherOptions from '../../MinorComponents/OtherOptions/OtherOptions'
import { DownloadDuotoneIcon, DownloadIcon, PlayIcon } from '../../asset component/Icons/Icons'
import ActionWithIcon from '../../MinorComponents/ActionWithIcon/ActionWithIcon'
import classNames from 'classnames';
import Loader, { ImageLoader } from '../../asset component/Loader/Loader'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/opacity.css';


function DefAction({fill='var(--baseBlack1000)'}){
    return(
        <>
        <ActionWithIcon iconFill={fill}>Download</ActionWithIcon>
        <ActionWithIcon iconFill={fill}>save</ActionWithIcon>
        <ActionWithIcon iconFill={fill}>share</ActionWithIcon>
        </>
    )
}


function MovieCard({className="", children=<DefAction fill='var(--baseBlack1000)'/>, imgSrc=false, imgAlt, onClick,onMouseEnter, onMouseLeave, bottom=true, rating=true, icon=<DownloadDuotoneIcon fill='var(--baseWhite800)'/>, text1="Movie name", text2="Movie starrings", text3="date", text4="Extra", before=true,optionDrop=true, optionDropOnRight=false, verticalAlign=false, shrink=false, play=true, tabled3=false, tabled4=false}) {
    const MovieCardClassName = classNames(`MovieCard`, {
        tabled3,
        tabled4,
        shrink: shrink || tabled4 || tabled3,
        vertical: verticalAlign,
      }, className);



  return (
    <div className={MovieCardClassName} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        <div className={optionDrop?optionDropOnRight&&!verticalAlign?"Thumbnailing dropRight":"Thumbnailing":"Thumbnailing noOption"}>
            <div className="imgBox">
                {
                    imgSrc?<LazyLoadImage
                                src={imgSrc}
                                alt={imgAlt}
                                effect="opacity"
                                style={{ maxWidth: '100%', height:'100%',display: 'block' }}
                                delayMethod='debounce'
                                placeholderSrc={<ImageLoader/>}
                            />
                    :<LazyLoadImage
                                src = "data:image/jpeg;base64,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"
                                alt={imgAlt}
                                
                            />
                }
            </div>
            
            {
                (verticalAlign||optionDropOnRight!==true)&&optionDrop?
                    <OtherOptions>
                        {ActionWithIcon}
                    </OtherOptions>
                :null
            }
            {
                play?<span onClick={onClick} className='playHover'>
                    <PlayIcon fill='var(--baseWhite1000)'/>
                </span>
                :null
            }
            {
                bottom?
                    <>
                        <div className="bottomContent">
                            <span className="icon">{icon}</span>
                            {
                                rating?
                                    <span className="rating">{rating}</span>
                                :null
                            }
                        </div>
                    </>
                :null
            }
        </div>
        <div className="content">
            
            {
                text1?typeof(text1)=="string"&&text1.trim().length>=1?
                    <b className='first' data-before={before?"Title: ":null}><i>{text1}</i></b>
                :<span className='first'>{text1}</span>:null
            }
            {
                text2?typeof(text2)=="string"&&text2.trim().length>=1?
                    <b className='second' data-before={before?"Staring: ":null}><i>{text2}</i></b>
                :<span className='second'>{text2}</span>:null
            }
            {
                text3?typeof(text3)=="string"&&text3.trim().length>=1?
                    <b className='third'><i>{text3}</i></b>
                :<span className='third'>{text3}</span>:null
            }
            {
                tabled4?typeof(text4)=="string"&&text4.trim().length>=1?
                    <b className='extra'><i>{text4}</i></b>
                :<span className='extra'>{text4}</span>:null
            }
        </div>
        {
            !verticalAlign&&optionDropOnRight==true&&optionDrop?
                <div className="rightDrop">
                    <OtherOptions x='left' >
                        <ActionWithIcon >Download</ActionWithIcon>
                        <ActionWithIcon >save</ActionWithIcon>
                        <ActionWithIcon >share</ActionWithIcon>
                    </OtherOptions>
                </div>
            :null
        }
    </div>
  )
}

export default MovieCard