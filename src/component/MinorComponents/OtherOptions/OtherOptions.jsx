/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react'
import './OtherOptions.css'
import { MenuIcon } from '../../asset component/Icons/Icons'

function OtherOptions({children, x="right", y="straight"}) {
    const [focused, setFocused] = useState(null)
    const [areaHeight, setAreaHeight] = useState(y)
    const [areaWidth, setAreaWidth] = useState(x)
    const details = useRef(null)
    const options = useRef(null)

    function setSpanArea(){
        if(details.current&&options.current){
            const parent = details.current;
            const child = options.current;

            // Get the computed dimensions of the child element
            const childWidth = child.offsetWidth;
            const childHeight = child.offsetHeight;

            // Get the parent element's position relative to the viewport
            const parentRect = parent.getBoundingClientRect();

            // Determine the available space on the left, right, above, below
            const spaceOnLeft = parentRect.left;
            const spaceOnRight = window.innerWidth - parentRect.right;
            const spaceAbove = parentRect.top;
            const spaceBelow = window.innerHeight - parentRect.bottom;
            // Set the left position of the child element based on available space
            // check for default first
            if((spaceOnLeft >= childWidth && spaceOnRight >= childWidth)){
                setAreaWidth("right")
                return
            }
            if((spaceAbove >= childHeight && spaceBelow >= childHeight)){
                setAreaHeight("straight")
                return
            }
            
            if (spaceOnLeft >= childWidth) {
                // Enough space on the left
                setAreaWidth("left")
            } else if (spaceOnRight >= childWidth) {
                // Enough space on the right
                setAreaWidth("right")

            }
            

              // Vertical positioning
            if (spaceAbove >= childHeight) {
                setAreaHeight("top")
            } else if (spaceBelow >= childHeight) {
                setAreaHeight("bottom")
            }
        }
    }
    useEffect(() => {
        setSpanArea()
    }, [details, options])



    const handleFocus = () => {
        if(focused){
            setFocused(false);
            
        }else{
            setFocused(true);
        }
      };

    const handleBlur = (e) => {
        // Check if the blur event is related to clicking inside the container
        if (details.current && details.current.contains(e.relatedTarget)) {
          return;
        }
        setFocused(false);
      };
  return (
    <>
        <div className="otherOptions"
            tabIndex={-1}
            onBlur={handleBlur}
            ref={details}
        
        >
            <span className="open" onClick={handleFocus}><MenuIcon fill="var(--baseBlack1000)"/></span>
            <div ref={options} className={`options ${areaWidth} ${areaHeight}`}>
                {
                    focused?<>
                            {children}
                        </>:null
                }
            </div>
        </div>
    </>
  )
}

export default OtherOptions