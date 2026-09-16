import React from 'react'
import Cards from '../components/Cards'

function EventsListPage() {
  return (
    <div className='page-container'>
      <div className='list-page-header'>
        <div className="page-header-caption">
          <hr className="primary"/>
          <p> The Calendar </p>
          <hr className="primary"/>
        </div>
        <h1 > Explore Events </h1>
        <p className='caption'> Come for the plan. Stay for whatever happens next. </p>
      </div>
      <section className="section-container">
        <Cards variant="list"/>
      </section>
    </div>
  )
}

export default EventsListPage
