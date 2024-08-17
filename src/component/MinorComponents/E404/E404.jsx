/* eslint-disable no-unused-vars */
import React from 'react'
import './E404.css'
import Modal from '../Modal/Modal'
function E404() {
  return (
    <Modal className='noInternet' defaultCancel={false}>
        <div className="E404">
            <h1>No Internet</h1>
            <b>Please connect to a network and try again</b>
        </div>
    </Modal>
  )
}

export default E404