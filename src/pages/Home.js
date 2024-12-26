import React from 'react'

import Hero from '../components/Hero';
import Navbar from '../components/Navbar';
import BestDeal from '../components/BestDeal';
import ShopByCategory from '../components/ShopByCategory';


const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <BestDeal />
      <ShopByCategory />
  
    </div>
  )
}

export default Home
