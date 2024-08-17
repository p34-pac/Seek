/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import './Modal.css'
import { CancelIcon } from '../../asset component/Icons/Icons'


function Modal({before=null, className='', children, shown=true, defaultCancel=true, remove=null}) {
    const [defShow, setDefShow] = useState(shown)
  return (
    <>
        {
            defShow?
                <div  className={`Modal ${className}`}>
                   
                    <div data-before={before} className="ModalInner">
                        {defaultCancel?
                            <span className="removerDef"><CancelIcon onClick={()=>{remove?remove():setDefShow(false)}} /></span>
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