import React from 'react'
import Featured from '../../components/featured/Featured'
import TrustedBy from '../../components/trustedBy/trustedBy'



const Home = () => {
  return (
    <div className='home'>
      <Featured/>
      <TrustedBy/>
    </div>
  )
}

export default Home