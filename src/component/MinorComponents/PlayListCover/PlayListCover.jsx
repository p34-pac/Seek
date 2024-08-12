/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'
import './PlayListCover.css'
import { AddIcon, PlayDuotoneIcon, PlayFillIcon } from '../../asset component/Icons/Icons'


function PlayListCover({img}) {
  return (
    <div className='PlayListCover'>
        <div className="playListThumbnail"><img src={img} alt="" /></div>
        <div className="bottom">
            <div className="play-list">
                <span className='playBtn'><PlayFillIcon fill='var(--baseBlack1000)'/></span>
                <b>24 Playlists</b>
            </div>
            <span className='adding'>
                <i><AddIcon/></i>
                <b>Add to playlist</b>
            </span>
        </div>
    </div>
  )
}

export default PlayListCover