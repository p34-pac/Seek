/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import './Modal.css'
import { CancelIcon } from '../../asset component/Icons/Icons'
// import { X } from '@phosphor-icons/react'


function Modal({before=null, className='', children, shown=true, defaultCancel=true, remove=null}) {
    const [defShow, setDefShow] = useState(shown)
  return (
    <>
        {
            defShow?
                <div  className={`Modal ${className}`}>
                   
                    <div data-before={before} className="ModalInner">
                        {defaultCancel?
                            <span className="removerDef"><CancelIcon fill="#704848" onClick={()=>{remove?remove():setDefShow(false)}} /></span>
                        :null}
                        {children}
                    </div>
                </div>
            :null
        }
    </>
  )
}

export default Modal