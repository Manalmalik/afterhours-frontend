import Cards from "../components/Cards"

const HomePage = () => {
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
      </div>
      <Cards/>
    </div>
  )
}

export default HomePage
