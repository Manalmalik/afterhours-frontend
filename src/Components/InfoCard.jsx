import React from 'react'

function InfoCard({title, caption, info, variant}) {
  return (
    <div className={variant ? 'infocard-secondary-containter' : 'infocard-primary-container '}>
      <div className='infocard-details'>
        <p className='infocard-caption'> {caption} </p>
        <h3> {title} </h3>
        <p className='infocard-info'> {info} </p>
      </div>
    </div>
  )
}

export default InfoCard
