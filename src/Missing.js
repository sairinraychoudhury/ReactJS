import { Link } from 'react-router-dom'; //links back to homepage

const Missing = () => {
  return (
    <main className='Missing'>
    <h2>Page Not Found! </h2>
              
                <p>
                  <Link to='/'>Visit Our Homepage</Link>
                </p>

    </main>
  )
}

export default Missing