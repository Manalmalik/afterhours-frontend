function Card({ title, description, format }) {
  return (
    <div className='card-container'>
      <div>
        <img src='src/assets/images/logo.png' width="100px"/>
      </div>
      <div>
        <h3> {title} </h3>
        <p> {format} </p>
      </div>
    </div>
  )
}

export default Card
