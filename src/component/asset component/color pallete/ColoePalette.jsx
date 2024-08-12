/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'
import './ColorPalette.css'
import { generateShades, parseColorsToCssVar } from '../../../functions/colorgenerator'
import { copyToClipBoard } from '../../../functions/copyToClipBoard'
import { toast } from 'react-toastify'

function ColoePalette({templates}) {
    const {primary, secondary, baseWhite, baseBlack}  = templates()
    let temples = {primary, secondary, baseWhite, baseBlack}


    // create a number range
    let shades = []
    for (let i = 0; i < 10; i++) {
        shades.push(i);
    }
    function copy(name, shade){
        const copied = copyToClipBoard(`${templates[name][((1000-(shade*100))/100)-1]}`)
        if(copied){
            // toast("copied to clipboard")
            toast.success( `copied to ${templates[name][((1000-(shade*100))/100)-1]} clipboard!`,
                {
                    position: "bottom-center",

                }
            )
            
        }
    }
    function Shaded({name}){

        
        return (
            <>
                {
                    shades.map(shade=>{
                        return <li key={`${name}${1000-(shade*100)}`} style={{backgroundColor:`var(--${name}${1000-(shade*100)})`}}>
                                    <span className="textColorCode" data-before={`${name}${1000-(shade*100)}`}>
                                        <b>{`${temples[name][((1000-(shade*100))/100)-1]}`}</b>
                                        <button onClick={()=>copy(name,shade)}>Copy to clip</button>
                                    </span>
                                </li>
                    })
                }
            </>
        )
    }
    

  return (
    <>
        <div className='colorPalette'>
        <h1>Color palette</h1>
        <ul className="primary">
            <h1>Primary</h1>
            <Shaded name="primary" />
        </ul>
        <ul className="secondary">
            <h1>Secondary</h1>
            <Shaded name="secondary" />
        </ul>
        <ul className="baseWhite">
            <h1>baseWhite</h1>
            <Shaded name="baseWhite" />
        </ul>
        <ul className="baseBlack">
            <h1>baseBlack</h1>
            <Shaded name="baseBlack" />
        </ul>

    </div>
    </>

  )
}

export default ColoePalette