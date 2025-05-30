import serviceBackground from '../assets/housebackground.jpg';
import cleaningService from '../assets/commercialcleaningservice.jpg';
import sofaCleaning from '../assets/cleaningsofa.jpg';
import windowcleaning from '../assets/cleaningwindow.jpg';
import cleaners from '../assets/cleaniners.jpg';
export const services = [
  "BOOK DOMESTIC",
  "BOOK COMMERCIAL",
  "Book Events",
  
];



export const service = [
  {
    id:"2",
    title: "General Residential cleaning",
    description: "From a basic home clean to a deep, clean, Our team of trained staff will leave you satisfied with a magic touch.",
    image: windowcleaning,
    cost:'40,000'
  },

  {
    id:"1",
    title: "Deep Residential cleaning",
    description: "From a basic home clean to a deep, clean, Our team of trained staff will leave you satisfied with a magic touch.",
    image: sofaCleaning,
    cost:'55,000'
  },

  {
  id:"4",
  title: "Event Cleaning",
  description: "To tired to clean up after an eventful ceremony? No worries, we are just a call away.",
  image: cleaners,
  cost:'75,000'
  },

  {
    id:'3',
    title: "Commercial cleaning",
    description: "Hire us to keep your office and working space sparkling clean at a very affordable price",
    image: cleaningService,
    cost:'100,000'
  },
 
];
