'use client'

import React from 'react'
import { motion } from "framer-motion"
import { MapPin, Star } from 'lucide-react'
import { Button } from "@/components/ui/button"

// Location data for the branches
const locations = [
  {
    id: 1,
    name: "Hogis Marina Resort",
    address: "Marina Waterfront, Calabar",
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=2832&auto=format&fit=crop",
    rating: 4.9,
  },
  {
    id: 2,
    name: "Hogis Luxury Suites",
    address: "Diamond Hill, Calabar",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop",
    rating: 4.8,
  },
  {
    id: 3,
    name: "Hogis Grand",
    address: "Central Business District, Calabar",
    image: "https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=2070&auto=format&fit=crop",
    rating: 4.7,
  },
];

interface LocationsSectionProps {
  isVisible: boolean;
}

const LocationsSection = ({ isVisible }: LocationsSectionProps) => {
  return (
    <section className="hotel-section bg-gradient-to-b from-hotel-navy to-hotel-dark py-20 md:py-32">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="h-0.5 w-16 bg-hotel-gold mx-auto mb-6"></div>
          <h2 className="text-3xl md:text-5xl font-serif mb-4">Our Premium Locations</h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Experience Hogis luxury at any of our three exceptional properties in Calabar
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {locations.map((location, index) => (
            <motion.div 
              key={location.id}
              className="relative rounded-xl overflow-hidden h-[450px] group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -10 }}
            >
              <img 
                src={location.image} 
                alt={location.name} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20"></div>
              
              <div className="absolute top-4 right-4 bg-hotel-gold/90 text-hotel-dark px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                <Star className="w-4 h-4 fill-current" />
                {location.rating}
              </div>
              
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <div className="space-y-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-2xl font-serif">{location.name}</h3>
                  
                  <div className="flex items-center gap-2 text-white/70">
                    <MapPin className="w-4 h-4" />
                    <p className="text-sm">{location.address}</p>
                  </div>
                  
                  <div className="pt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <Button variant="outline" className="border-hotel-gold text-hotel-gold hover:bg-hotel-gold hover:text-hotel-dark">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default LocationsSection