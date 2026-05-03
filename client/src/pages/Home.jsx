import React from 'react'
import Hero from '../components/Hero'
import HowItWorks from '../components/HowItWorks'
import FeaturedSection from '../components/FeaturedSection'
import Banner from '../components/Banner'
import Testimonials from '../components/Testimonials'
import EliteCTA from '../components/EliteCTA'

const Home = () => {
  return (
    <div className="fade-in">
      <Hero />
      <div data-aos="fade-up"><HowItWorks /></div>
      <div data-aos="zoom-in"><FeaturedSection /></div>
      <div data-aos="fade-right"><Testimonials /></div>
      <div data-aos="flip-up"><Banner /></div>
      <div data-aos="zoom-out"><EliteCTA /></div>
    </div>
  )
}

export default Home
