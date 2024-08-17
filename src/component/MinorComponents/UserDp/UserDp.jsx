/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useContext, useState } from 'react'
import './UserDp.css'
import { AddIcon, CancelIcon } from '../../asset component/Icons/Icons'
import { UserContext } from '../../../UserContext'
import Modal from '../Modal/Modal'

function UserDp() {
  const {user, setUser} = useContext(UserContext)
  const [preview, setPreview] = useState(null)
  const [view, setView] = useState(null)
  const handleUpload = () => {
    console.log(1);
    
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = e.target.files[0]
      let name = file.name
      const reader = new FileReader()
      reader.onload = () => {
        // setUser(prev => ({...prev, dp: reader.result}))
        setPreview({name, src: reader.result})
      }
      reader.readAsDataURL(file)
    }
    input.click()

  }
  const handleConfirm = ()=>{
    setUser(prev => ({...prev, dp: preview}))
  }
  const handleDelete = ()=>{
    setUser(prev => ({...prev, dp: null}))
  }

  return (
    <div className='UserDp'>
        <div className="cover"></div>
        <div className="userInfo">
            <div className="userDpPhoto">
              {
                user.dp?<img onClick={()=>setView(user.dp)} src={user.dp.src} alt={user.dp.name} />:null
              }
              {
                user.dp&&user.dp.src?null:<span onClick={handleUpload}><AddIcon fill='var(--baseWhite1000)' /></span>
              }
            </div>
            <b className="Id">{user&&user.name?user.name:'username'}</b>
        </div>
        {
          preview && <Modal defaultCancel={false} className='previewModal'>
          <div className="top"><b className="text">{preview.name}</b>
            </div>
            <div className="imgBox">
              <img src={preview.src} alt={preview.name} />
            </div>
            <div className="actions">
                <button onClick={()=>setPreview(null)}>Cancel<CancelIcon fill='var(--baseWhite1000)' /></button>
                <button onClick={()=>{handleConfirm(); setPreview(null)}}>Confirm</button>
            </div>
          </Modal>
        }
        {
          view && <Modal defaultCancel={false} className='previewModal'>
            <div className="top"><b className="text">{view.name}</b>
              <span className="cancel" onClick={()=>setView(null)}><CancelIcon fill='var(--baseWhite1000)' /></span>
            </div>
            <div className="imgBox">
              <img src={view.src} alt={view.name} />
            </div>
            <div className="actions">
                <button onClick={()=>{handleDelete(); setView(null)}}>Delete<CancelIcon fill='var(--baseWhite1000)' /></button>
                <button onClick={()=>{handleUpload(); setView(null)}}>Change</button>
            </div>
          </Modal>
        }
    </div>
  )
}

export default UserDp