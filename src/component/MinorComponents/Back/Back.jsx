/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'
import './Back.css'
import { AngleLeftIcon } from '../../asset component/Icons/Icons'
import { useNavigate } from 'react-router-dom';

function Back({text="back", icon=<AngleLeftIcon/>}) {
    const navigate = useNavigate();

    const goBack = () => {
      navigate(-1);
    };
  return (
    <span className="previousPage" onClick={goBack}>
        <i>{icon}</i>
        <b data-before={text}></b>
    </span>
  )
}

export default Back