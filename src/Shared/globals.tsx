
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
    id:"general-cleaning",
    title: "General Residential cleaning",
    description: "For a basic home clean, our team of trained staff will leave you satisfied with a magic touch.",
    image: windowcleaning,
    cost:40000,
    recurringCost:34000,
    service:"book general residential cleaning"
  },

  {
    id:"deep-cleaning",
    title: "Deep Residential cleaning",
    description: "From everyday mess to hidden grime, our expert cleaners deliver a deep clean that leaves your home feeling fresh and renewed.",
    image: sofaCleaning,
    cost:55000,
    recurringCost:46750,
    service:"book Deep Residential cleaning"
  },

  {
  id:"event-cleaning",
  title: "Event Cleaning",
  description: "Too tired to clean up after an eventful ceremony? No worries, we are just a call away.",
  image: cleaners,
  cost:75000,
  recurringCost:63750,
  service:"Book Events Cleaning",
  },

  {
    id:'commercial-cleaning',
    title: "Commercial cleaning",
    description: "Hire us to keep your office and working space sparkling clean at a very affordable price.",
    image: cleaningService,
    cost:100000,
    recurringCost:85000,
    service:"BOOK COMMERCIAL CLEANING",
  },
 
];
