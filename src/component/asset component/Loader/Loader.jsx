/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react'
import './Loader.css'
import logo from '../../../assets/images/iconedlogo no text.png'



export function VideoLoader(){
	return (
		<div className="loadingVideo">
			<span></span>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
		</div>
	)
}

export function ImageLoader(){
	return (
		<div className="loaderBox">
			<div className="imageLoader"></div>
		</div>
	)
}


export const LoadingComponent = ({side=""}) => {
  return (
    <div className={side=="hr"?"cardloader hr":"cardloader"}>
		<div className="wrapper">
			<div className="bigBox"></div>
			{/* <div className="circle"></div> */}
			<div className="contentCont">
				<div className="line-1"></div>
				<div className="line-2"></div>
				<div className="line-3"></div>
				<div className="line-4"></div>
			</div>
		</div>
	</div>
  );
};




function Loader({path}) {
	
	
  return (
    <div className='Loader'>
    <main>
	<svg height="128px" width="128px" viewBox="0 0 128 128" className="pl1">
		<defs>
			<linearGradient y2="1" x2="1" y1="0" x1="0" id="pl-grad">
				<stop stopColor="#000" offset="0%"></stop>
				<stop stopColor="#fff" offset="100%"></stop>
			</linearGradient>
			<mask id="pl-mask">
				<rect fill="url(#pl-grad)" height="128" width="128" y="0" x="0"></rect>
			</mask>
		</defs>
		<g fill="var(--primary)">
			<g className="pl1__g">
				<g transform="translate(20,20) rotate(0,44,44)">
					<g className="pl1__rect-g">
						<rect height="40" width="40" ry="8" rx="8" className="pl1__rect"></rect>
						<rect transform="translate(0,48)" height="40" width="40" ry="8" rx="8" className="pl1__rect"></rect>
					</g>
					<g transform="rotate(180,44,44)" className="pl1__rect-g">
						<rect height="40" width="40" ry="8" rx="8" className="pl1__rect"></rect>
						<rect transform="translate(0,48)" height="40" width="40" ry="8" rx="8" className="pl1__rect"></rect>
					</g>
				</g>
			</g>
		</g>
		<g mask="url(#pl-mask)" fill="var(--primary1000)">
			<g className="pl1__g">
				<g transform="translate(20,20) rotate(0,44,44)">
					<g className="pl1__rect-g">
						<rect height="40" width="40" ry="8" rx="8" className="pl1__rect"></rect>
						<rect transform="translate(0,48)" height="40" width="40" ry="8" rx="8" className="pl1__rect"></rect>
					</g>
					<g transform="rotate(180,44,44)" className="pl1__rect-g">
						<rect height="40" width="40" ry="8" rx="8" className="pl1__rect"></rect>
						<rect transform="translate(0,48)" height="40" width="40" ry="8" rx="8" className="pl1__rect"></rect>
					</g>
				</g>
			</g>
		</g>
	</svg>
    </main>

    {/* <div className="spinner"></div> */}
    <ul className='loadingText'>
        <li>
            <div className="loader">
            <div className="child"></div>
            </div>
        </li>

        <li>
            <div className="text" data-before-1={`Loading ${path}`} data-before-2={`Loading ${path}.`} data-before-3={`Loading ${path}..`} data-before-4={`Loading ${path}...`}></div>
        </li>
    </ul>


    </div>
  )
}

export default Loader