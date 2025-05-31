
import cleaningService from '../assets/commercialcleaningservice.jpg';
import sofaCleaning from '../assets/cleaningsofa.jpg';
import windowcleaning from '../assets/cleaningwindow.jpg';
import cleaners from "../assets/taycleaners.jpg";
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
    cost:40000,
    recurringCost:34000,
    service:"book general"
  },

  {
    id:"1",
    title: "Deep Residential cleaning",
    description: "From a basic home clean to a deep clean, Our team of trained staff will leave you satisfied with a magic touch.",
    image: sofaCleaning,
    cost:55000,
    recurringCost:46750,
    service:"book Domestic"
  },

  {
  id:"4",
  title: "Event Cleaning",
  description: "To tired to clean up after an eventful ceremony? No worries, we are just a call away.",
  image: cleaners,
  cost:75000,
  recurringCost:63750,
  service:"Book Events",
  },

  {
    id:'3',
    title: "Commercial cleaning",
    description: "Hire us to keep your office and working space sparkling clean at a very affordable price",
    image: cleaningService,
    cost:100000,
    recurringCost:85000,
    service:"BOOK COMMERCIAL",
  },
 
];
