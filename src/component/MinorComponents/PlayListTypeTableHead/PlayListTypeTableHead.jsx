/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'
import './PlayListTypeTableHead.css'
import classNames from 'classnames';

function PlayListTypeTableHead({tabled4=false, rightOption=false, head1="head1", head2="head2", head3="head3", head4="head4"}) {
    const PlayListTypeTableHeadClassName = classNames('PlayListTypeTableHead', {
        rightOption,
        tabled4
      });


  return (
    <div className={PlayListTypeTableHeadClassName}>
        <div className="headings">
            {
                typeof(head1)=="string"&&head1.trim().length>=1?
                    <b className='head1'>{head1}</b>
                :head1
            }
            {
                typeof(head2)=="string"&&head2.trim().length>=1?
                    <b className='head2'>{head2}</b>
                :head2
            }
            {
                typeof(head3)=="string"&&head3.trim().length>=1?
                    <b className='head3'>{head3}</b>
                :head3
            }
            {
                tabled4?typeof(head4)=="string"&&head4.trim().length>=1?
                    <b className='head4'>{head4}</b>
                :head4:null
            }
        </div>
    </div>
  )
}

export default PlayListTypeTableHead