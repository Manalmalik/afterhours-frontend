import Cards from "../components/Cards"

const HomePage = () => {
  const currentDate = new Date()
  const monthYear = currentDate.toLocaleString("en-US", {
    month: "long",
    year: "numeric"
  })
  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-caption">
          <hr className="primary"/>
          <p> Berlin </p>
          <hr className="primary"/>
        </div>
        <div className="page-header-hero">
            <h1> After </h1>
            <div>
            <h1> Hours </h1>
            <p> Club </p>
            </div>
            <hr className="secondary"/>
        </div>
        <p className="caption"> Curated experiences for people who want more than just going out.</p>
      </div>
      <section className="section-container">
        <div className="section-dated-header">
          <p className="dated-header-title"> Upcoming Events </p>
          <p className="dated-header-date"> {monthYear} </p>
        </div>
          <Cards/>
      </section>
    </div>
  )
}

export default HomePage
