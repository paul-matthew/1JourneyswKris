import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import SceneInit from 'public/lib/SceneInit';
import 'app/styles/style.css'; 
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { useLoaderData } from "@remix-run/react";
import { getDataFromStrapi } from "~/api/get-data-from-strapi.server";
import Rellax from 'rellax';  
import { Link } from "react-router-dom";

let baseUrl = "https://journeyswkris-938066b97596.herokuapp.com/"; //UPDATE

if (process.env.NODE_ENV !== 'production') {
  baseUrl = "http://127.0.0.1:1337";
  console.log("This is a local build; index.jsx");
} else {
  console.log("This is a production build; index.jsx");
}

export async function loader() {
  const path = "kris-collections/";
  const query = "populate=*";
  const response = await getDataFromStrapi(path, query);
  let data = response.data;
  console.log(data);

  if (!Array.isArray(data)) {
    data = [data]; // Wrap data in an array if it's not already an array
  }

  data.sort((a, b) => {
    const dateA = new Date(a.attributes.Date);
    const dateB = new Date(b.attributes.Date);
    return dateB - dateA; // Sort in descending order
  });
  return { info: data };

}

export function KrisCard({ data, index }) {
  const path_medImage = data.attributes.Image.data.attributes.formats.medium.url;
  // const mediumImage=`${baseUrl}${path_medImage}`; //UNCOMMENT OUT IF USING CLOUDINARY
  const mediumImage = `${path_medImage}`; //COMMENT IF USING CLOUDINARY
  const ref = useRef();

  useEffect(() => {
    new Rellax(ref.current, {
      speed: -2,
      xsSpeed: 0,
      mobileSpeed: 0,
      tabletSpeed: 0,
    });

  }, []);

  if (index > 50) {
    return null; // Skip rendering for items after the fourth index
  }

  return (
    <div className="w-full lg:w-2/4">
      <div className="flex flex-wrap justify-start p-4">
        <div className="w-full mx-auto border-2 border-black shadow-whiterock">
        <div className="image-container relative overflow-hidden h-150">
          <img
            className="object-cover w-full h-60 transition-transform duration-300 transform-gpu hover:scale-110"
            style={{ objectPosition: "center top" }} 
            src={mediumImage}
            alt={data.attributes.Title}
          />
          </div>
          <div className="px-2 py-6 lg:px-10">
            <h1 className="text-base font-black tracking-widest text-black md:text-3xl lg:text-3xl font-display">{data.attributes.Title}</h1>
            <h2 className="text-base font-black tracking-widest text-black lg:text-1xl font-display">{data.attributes.Date}</h2>
            <p className="mt-4 text-base font-medium leading-relaxed border-black lg:text-md">
              {data.attributes.Description
                .split(' ')
                .slice(0, 15)
                .join(' ')}
              {data.attributes.Description.split(' ').length > 15 ? ' ...' : ''}
            </p>
            <div className="py-4">
            <Link
              to={`/post?id=${data.id}`}
              className="p-3 pl-4 font-bold tracking-wide transition duration-500 ease-in-out transform hover:shadow-cinnabar hover:text-black font-base text-beta-300 shadow-whiterock bg-black hover:bg-gray-500 text-white rounded-md py-3 px-6 inline-block"
            >Read more &#8594;
            </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}

export default function HomeRoute() {
  const { info } = useLoaderData();
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 50;
  const sectionRef = useRef(null);
  let loadedModel;

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const displayedItems = info.slice(startIndex, startIndex + itemsPerPage);

  const isFirstPage = startIndex === 0;
  const isLastPage = startIndex + itemsPerPage >= info.length;

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
      <section id='posts' ref={sectionRef} className="bg-white">
        <div className="container px-5 py-14 mx-auto text-black">
          <div className="flex flex-wrap mx-auto">
            <div data-rellax-speed="-1" data-rellax-xs-speed="0" data-rellax-mobile-speed="0" className="flex items-center gap-6">
              <h2 className="text-7xl font-bold text-black xl:text-8xl" style={{ fontFamily: 'Covered by Your Grace', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
                Affiliations
              </h2>
            </div>
          </div>
          <div className="flex flex-wrap mx-auto">
            {displayedItems.map((item, index) => (
              <KrisCard key={item.id} data={item} index={index} />
            ))}
          </div>
          {info.length > itemsPerPage && (
          <div className="flex justify-center mt-20 space-x-4">
            {!isFirstPage && (
              <button className="text-white text-3xl underline" onClick={handlePrevious}>
                Previous
              </button>)}
            {!isLastPage && (
              <a className="text-white text-3xl underline hover:text-blue-500" href="/fullportfolio">
                Browse Portfolio
              </a>)}
          </div>
          )}
        </div>
      </section>
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
          <p className="mt-4 text-sm text-white sm:ml-4 sm:pl-4 sm:py-2 sm:mt-0">
          <a href="https://sketchfab.com/3d-models/plane-paper-dart-8951aa7cebbf42218f31b2e152b1f752">Plane Paper Dart </a> by 
          <a href="https://sketchfab.com/Sketchfab"> Sketchfab</a> licensed under 
          <a href="https://creativecommons.org/licenses/by/4.0/"> CC BY 4.0</a>
          </p>
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
}




