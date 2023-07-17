import React from 'react'
import './Featured.scss'

const Featured = () => {
  return (
    <div className='featured'>
        <div className="container">
            <div className="left">
                <h1>Find the perfect freelance services for your business</h1>
                <div className="search">
                    <div className="searchInput">
                        <img src="../../../public/img/search.png" alt="" />
                        <input type="text" placeholder='Try "building mobile appp"' />
                    </div>
                    <button>Search</button>
                    <div className="popular">
                        <span>Popular:</span>
                        <button>Web Design</button>
                        <button>Wordpress</button>
                        <button>Logo Design</button>
                        <button>AI Services</button>
                    </div>
                </div>
            </div>
            <div className="right">
                <img src="../../../public/img/man.png" alt="" />
            </div>
        </div>
    </div>
  )
}

export default Featured