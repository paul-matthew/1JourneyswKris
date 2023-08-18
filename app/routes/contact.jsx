import React, { useRef, useEffect, useState } from 'react';
import { Link } from "react-router-dom";

const ContactForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can implement the logic to send the message (e.g., using an API or backend service)
    console.log('Message submitted:', { name, email, message });
    // Clear the form fields after submission
    setName('');
    setEmail('');
    setMessage('');
  };

  useEffect(() => {
    //DropDown button
    const closeDropdown = (event) => {
      if (!event.target.closest('.menu-button')) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('click', closeDropdown);

    return () => {
      document.removeEventListener('click', closeDropdown);
    };
}, []);

  return (
    <div className="bg-white">
      <div className="w-full text-black bg-white">
        <div className="flex flex-col max-w-screen-xl px-4 mx-auto md:items-center md:flex-row md:px-1">
          <div className="flex flex-row items-center justify-between p-2 text-black">
          <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-2">
              <a href="/" className="flex items-center">
                  <span className="text-2xl font-semibold whitespace-nowrap dark:text-white">JourneyswithKris</span>
              </a>


              <div className="md:hidden flex md:order-2 relative dropdown-container">
                <button
                  type="button"
                  className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden menu-button"
                  onClick={toggleDropdown}
                >
                  <svg className="w-5 h-5" ariaHidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
                  </svg>
                </button>
                {isDropdownOpen && (
                  <div className="absolute flex top-1 right-0 mt-2 w-48 rounded-lg shadow-lg">
                    <ul className="flex flex-col px-24 py-3 md:p-0 mt-4 font-medium rounded-lg md:flex-row md:space-x-8 md:mt-0">
                      <li>
                        <a href="/allposts" className="block py-2 pl-3 pr-4 text-white bg-blue-700 md:bg-transparent md:p-0 border-black border">POSTS</a>
                      </li>
                      <li>
                        <a href="/contact" className="block py-2 pl-3 pr-4 text-white bg-blue-700 md:bg-transparent md:p-0 border-black border">CONTACT</a>
                      </li>
                    </ul>
                  </div>
                )}
              </div>



              <div className="items-center hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
                <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                  <li>
                    <a href="/allposts" className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:p-0" ariaCurrent="page">POSTS</a>
                  </li>
                  <li>
                    <a href="/contact" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">CONTACT</a>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
          </div>
        </div>
      </div>
    <main>
      <section id='contact' className="bg-white">
        <div className="container px-5 py-14 mx-auto text-black">
          <div className="flex flex-wrap mx-auto">
            <div
              data-rellax-speed="-1"
              data-rellax-xs-speed="0"
              data-rellax-mobile-speed="0"
              className="flex items-center gap-6"
            >
              <h2 className="text-7xl font-bold text-black xl:text-8xl" style={{ fontFamily: 'Covered by Your Grace', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
                Contact
              </h2>
            </div>
          </div>
        </div>
      </section>
      <div className="container mx-auto flex flex-wrap items-center mb-5 p-5">        
      <div className="lg:w-1/3 container mx-auto mb-5 shadow-whiterock" style={{border: "solid black"}}>
        <img className="w-full" src="./browndress2.jpg" >
        </img>
        </div>
      <form onSubmit={handleSubmit} className="w-full lg:w-2/3 mx-auto p-5">
        <div className="mb-4">
          <label htmlFor="name" className="block font-medium mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            className="w-full border rounded py-2 px-3 focus:outline-none focus:border-black"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full border rounded py-2 px-3 focus:outline-none focus:border-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="message" className="block font-medium mb-1">
            Message
          </label>
          <textarea
            id="message"
            rows="4"
            className="w-full border rounded py-2 px-3 focus:outline-none focus:border-black"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-black text-white py-2 px-4 rounded hover:bg-gray-700 focus:outline-none"
        >
          Send Message
        </button>
      </form>
      </div>
    </main>
    <footer className="bg-black">
      <div className="container flex flex-col items-center px-5 py-8 mx-auto sm:flex-row">
        <a href="https://www.wickedtemplates.com/" className="flex items-center justify-center font-medium text-white title-font md:justify-start">
          <div className="text-lg font-semibold tracking-widest rounded-lg focus:outline-none focus:shadow-outline">
            <div className="inline-flex items-center">
              <div className="w-2 h-2 p-2 mr-2 rounded-full bg-beta-300"></div>
              <h2 className="text-lg font-bold tracking-tighter transition duration-500 ease-in-out transform tracking-relaxed hover:text-beta-300">
                JourneyswithKris
              </h2>
            </div>
          </div>
        </a>
        <p className="mt-4 text-sm text-white sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-blueGray-200 sm:py-2 sm:mt-0">
          © 2020
          <a href="https://twitter.com/wickedtemplates" className="ml-1 text-white hover:text-blue-500" rel="noopener noreferrer" target="_blank"
            >@wickedtemplates</a>
        </p>
        <nav className="inline-flex items-center justify-start gap-2 mt-4 lg:mt-0">
          {/* <p className="mt-4 text-sm text-white sm:ml-4 sm:pl-4 sm:py-2 sm:mt-0 hover:text-blue-500">
            <a href="https://www.wickedtemplates.com/templates.html" rel="noopener noreferrer">Templates</a>
          </p>
          <p className="mt-4 text-sm text-white sm:ml-4 sm:pl-4 sm:py-2 sm:mt-0 hover:text-blue-500">
            <a href="https://www.wickedtemplates.com/demos.html" rel="noopener noreferrer">Freebies</a>
          </p>
          <p className="mt-4 text-sm text-white sm:ml-4 sm:pl-4 sm:py-2 sm:mt-0 hover:text-blue-500">
            <a href="https://www.wickedtemplates.com/pricing.html" rel="noopener noreferrer">Pricing</a>
          </p> */}
        </nav>
        <span className="inline-flex justify-center mt-4 sm:ml-auto sm:mt-0 sm:justify-start lg:ml-auto">
          <a className="text-white hover:text-blue-500">
            <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
            </svg>
          </a>
          <a className="ml-3 text-white hover:text-blue-500">
            <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"
              ></path>
            </svg>
          </a>
          <a className="ml-3 text-white hover:text-blue-500">
            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
            </svg>
          </a>
          <a className="ml-3 text-white hover:text-blue-500">
            <svg fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0" className="w-5 h-5" viewBox="0 0 24 24">
              <path stroke="none" d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path>
              <circle cx="4" cy="4" r="2" stroke="none"></circle>
            </svg>
          </a>
        </span>
      </div>
    </footer>
    <script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js" defer></script>
    </div>
  );
};

export default ContactForm;

