import React from 'react';
import { motion } from 'framer-motion';
import { assets } from '../assets/assets';
import Title from './Title';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: "Aarav Sharma",
    role: "Business Consultant",
    image: assets.testimonial_image_1 || assets.user_profile,
    text: "The experience with Idle Wheels was absolutely seamless. The premium fleet selection is unmatched, and the glass-clear booking process made my business trip effortless.",
    rating: 5
  },
  {
    name: "Ishani Verma",
    role: "Adventure Enthusiast",
    image: assets.testimonial_image_2 || assets.user_profile,
    text: "I listed my SUV on Idle Wheels and the verification process gave me so much peace of mind. The dynamic tracking and excellent customer support are top-notch.",
    rating: 5
  },
  {
    name: "Rajesh Patel",
    role: "Tech Entrepreneur",
    image: assets.user_profile,
    text: "As someone who values time and quality, IdleWheels delivers both. The 60-second booking process and impeccable vehicle condition exceeded all expectations.",
    rating: 5
  },
  {
    name: "Meera Nair",
    role: "Travel Blogger",
    image: assets.user_profile,
    text: "I've used many rental services, but IdleWheels stands apart with their curated fleet and attention to detail. Every trip feels like a first-class experience.",
    rating: 4
  }
];

const Testimonials = () => {
  return (
    <section className='section-spacing px-6 md:px-16 lg:px-24 xl:px-32 bg-background relative overflow-hidden'>
      {/* Background accent */}
      <div className='absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/[0.03] blur-[150px] rounded-full pointer-events-none' />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className='flex flex-col items-center mb-20'
      >
        <Title 
          title="Voice of our Members" 
          subTitle="Join thousands of satisfied users who have redefined their journey with our premium vehicle ecosystem." 
        />
      </motion.div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto'>
        {testimonials.map((item, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className='glass p-10 md:p-12 rounded-[2.5rem] border-white/5 relative overflow-hidden group hover:border-primary/20 transition-all duration-500'
          >
            {/* Quote icon */}
            <div className='absolute top-8 right-10 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity'>
                <Quote className='w-20 h-20 text-primary fill-primary' />
            </div>

            {/* Hover gradient */}
            <div className='absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />

            {/* Star Rating */}
            <div className='flex items-center gap-1 mb-6 relative z-10'>
                {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < item.rating ? 'text-amber-400 fill-amber-400' : 'text-white/10'}`} />
                ))}
            </div>

            <p className='text-lg md:text-xl font-medium italic mb-10 relative z-10 leading-[1.7] text-white/60 group-hover:text-white/70 transition-colors'>
               "{item.text}"
            </p>
            
            <div className='flex items-center gap-5 relative z-10'>
                <div className='w-14 h-14 rounded-2xl overflow-hidden border-2 border-white/10 group-hover:border-primary/40 transition-all'>
                    <img 
                        src={item.image} 
                        alt={item.name} 
                        className='w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110' 
                    />
                </div>
                <div>
                    <h4 className='font-black font-heading text-lg uppercase tracking-tight text-white'>{item.name}</h4>
                    <p className='text-[10px] font-bold uppercase tracking-[0.2em] text-primary/70'>{item.role}</p>
                </div>
            </div>

            {/* Bottom accent */}
            <div className='absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700' />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
