import React, { useRef, useEffect, useState } from 'react';
import 'app/styles/style.css'; 
import { useLoaderData } from "@remix-run/react";
import { getDataFromStrapi } from "~/api/get-data-from-strapi.server";
import Rellax from 'rellax';  
import { Link } from "react-router-dom";

export function loader({ request }) {  
  const url = new URL(request.url);
  console.log("This is the url:",url);
  const searchParams = new URLSearchParams(url.search);
  const id = searchParams.get('id');
  console.log("Single Post id number:", id);

  const path = "kris-collections/";
  const query = "populate=*";
  
  return getDataFromStrapi(path, query)
    .then(response => {
      let data = response.data;
      let oneitem = data.find(item => item.id === parseInt(id));
      console.log("Data for the specfic selected ID", oneitem);
      return { info: [oneitem] }; // Return a single object, not an array
    })
    .catch(error => {
      console.error("Error loading data:", error);
      return { info: [] }; // Return empty data in case of an error
    });
};

export function Main({ currentUrl }) {
  const [localCurrentUrl, setLocalCurrentUrl] = useState(currentUrl);
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      console.log('This is a production build man');
      setLocalCurrentUrl(window.location.href);
    } else {
      console.log('This is a local build');
      // Set the local URL for development if needed
      // setLocalCurrentUrl('http://localhost:3000/post?id=1');
    }
  }, [currentUrl]);

}

export function KrisSingleCard({ oneitem}) {
  const path_medImage = oneitem.attributes.Image.data.attributes.formats.medium.url;
  const mediumImage = `${path_medImage}`;
  const ref = useRef();

  useEffect(() => {
    new Rellax(ref.current, {
      speed: -2,
      xsSpeed: 0,
      mobileSpeed: 0,
      tabletSpeed: 0,
    });
  }, []);
 
  return (
    <div className="w-full lg:w-2/4">
      <div className="flex flex-wrap justify-start p-4">
        <div className="w-full mx-auto border-2 border-black shadow-whiterock" style={{width: "80vw", height: "100%", border:"solid black"}}>
          <div className="image-container relative overflow-hidden" style={{ width: "80vw", height: "50vh", border: "solid black" }}>
            <img
              className="object-cover w-full h-full transition-transform duration-300 transform-gpu hover:scale-110"
              style={{ objectPosition: "center top" }} 
              src={mediumImage}
              alt={oneitem.attributes.Title}
            />
          </div>
          <div className="flex justify-between p-4">
            <h1 className="text-base font-black tracking-widest text-black text-xs md:text-3xl lg:text-3xl font-display">{oneitem.attributes.Title}</h1>
            <h2 className="text-base font-black tracking-widest text-black font-display text-xs sm:text-xs md:text-md lg:text-xl xl:text-1xl">
              {oneitem.attributes.Date}
            </h2>
          </div>
          <div>
            <p className="mt-4 text-base font-medium leading-relaxed border-black lg:text-md px-4">
              {oneitem.attributes.Description}
            </p>
            <div className="py-4">
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}

export default function FullPage() {
  const { info } = useLoaderData({ loader });   
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 1;
  const sectionRef = useRef(null);
  let loadedModel;

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const displayedItems = info.slice(startIndex, startIndex + itemsPerPage);

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
          <nav className="bg-black fixed w-full z-20 top-0 left-0 border-b border-gray-600">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-2">
                  <a href="/" className="flex items-center">
                    <span className="text-2xl font-semibold whitespace-nowrap text-white"><img src="./daybreaklogo.png" style={{height:'80px'}}></img></span>
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
                      <div className="absolute flex top-1 right-3 mt-2 w-48 px-20 py-5">
                        <ul className="flex flex-col px-4 py-3 md:p-0 mt-4 font-medium rounded-lg md:flex-row md:space-x-8 md:mt-0 bg-black">
                          <li>
                            <a href="/allposts" className="w-full block pl-3 pr-4 text-white md:bg-transparent md:p-0 hover:text-purple-600">PROPERTIES</a>
                          </li>
                          <li>
                            <a href="/contact" className="block pl-3 pr-4 text-white md:bg-transparent md:p-0 hover:text-purple-600">CONTACT</a>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="items-center hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
                    <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium rounded-lg md:flex-row md:space-x-8 md:mt-0 md:border-0 bg-black md:bg-black">
                      <li>
                        <a href="/allposts" className="text-2xl font-semibold whitespace-nowrap text-white hover:text-purple-600">PROPERTIES</a>
                      </li>
                      <li>
                      <a href="/contact" className="text-2xl font-semibold whitespace-nowrap text-white hover:text-purple-600">CONTACT</a>
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
            <div
              data-rellax-speed="-1"
              data-rellax-xs-speed="0"
              data-rellax-mobile-speed="0"
              className="flex items-center gap-6"
            >
              <h2 className="text-7xl font-bold text-black xl:text-8xl mt-5" style={{ fontFamily: 'Covered by Your Grace', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
                Property
              </h2>
            </div>
          </div>
          <div className="flex flex-wrap mx-auto">
            {displayedItems.map((item, index) => (
              <KrisSingleCard key={item.id} oneitem={item} index={index} />
            ))}
          </div>
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
                Daybreak Travel
              </h2>
            </div>
          </div>
        </a>
        <p className="mt-4 text-sm text-white sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-blueGray-200 sm:py-2 sm:mt-0 flex flex-row justify-center lg:justify-start">
          © {new Date().getFullYear()}
          <div className="flex flex-row items-center justify-between md:px-4 lg:px-4">
            <a href="https://pmdaybreak.com" className="ml-1 text-white hover:text-blue-500" rel="noopener noreferrer" target="_blank">
              PM Daybreak Designs
            </a>
          </div>
        </p>
        <nav className="inline-flex items-center justify-start gap-2 mt-4 lg:mt-0">
          <p className="mt-4 text-sm text-white sm:ml-4 sm:pl-4 sm:py-2 sm:mt-0">
          <a className="text-xs" href="https://sketchfab.com/3d-models/plane-paper-dart-8951aa7cebbf42218f31b2e152b1f752">Plane Paper Dart </a> by 
          <a className="text-xs" href="https://sketchfab.com/Sketchfab"> Sketchfab</a> licensed under 
          <a className="text-xs" href="https://creativecommons.org/licenses/by/4.0/"> CC BY 4.0</a>
          </p>
        </nav>
        <span className="inline-flex justify-center mt-4 sm:ml-auto sm:mt-0 sm:justify-start lg:ml-auto">
          {/* <a className="text-white hover:text-blue-500" href="https://www.facebook.com/journeyswithkris/">
            <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
            </svg>
          </a> 
          <a className="ml-3" href="https://www.youtube.com/@Journeyswithkris">
            <svg fill="#ffffff" height='20px'version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 49 49" xml:space="preserve" stroke="#ffffff" className='text-white hover:fill-blue-500 hover:stroke-blue-500'>
              <path d="M39.256,6.5H9.744C4.371,6.5,0,10.885,0,16.274v16.451c0,5.39,4.371,9.774,9.744,9.774h29.512 c5.373,0,9.744-4.385,9.744-9.774V16.274C49,10.885,44.629,6.5,39.256,6.5z M47,32.726c0,4.287-3.474,7.774-7.744,7.774H9.744 C5.474,40.5,2,37.012,2,32.726V16.274C2,11.988,5.474,8.5,9.744,8.5h29.512c4.27,0,7.744,3.488,7.744,7.774V32.726z">
              </path> 
              <path d="M33.36,24.138l-13.855-8.115c-0.308-0.18-0.691-0.183-1.002-0.005S18,16.527,18,16.886v16.229 c0,0.358,0.192,0.69,0.502,0.868c0.154,0.088,0.326,0.132,0.498,0.132c0.175,0,0.349-0.046,0.505-0.137l13.855-8.113 c0.306-0.179,0.495-0.508,0.495-0.863S33.667,24.317,33.36,24.138z M20,31.37V18.63l10.876,6.371L20,31.37z">
              </path> 
            </svg>
          </a>*/}
          <a className="ml-3 text-white hover:text-blue-500" href="https://www.instagram.com/pm.daybreak/">
            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
            </svg>
          </a>
          {/* <a className="ml-3" href='https://www.threads.net/@journeyswithkris'>
          <svg fill="white" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="6" className="w-5 h-5 text-white hover:text-blue-500 hover:stroke-blue-500" aria-label="Threads" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg"><path class="x19hqcy" d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.296C133.559 125.696 136.834 117.143 138.28 106.366C144.217 109.949 148.617 114.664 151.047 120.332C155.179 129.967 155.42 145.8 142.501 158.708C131.182 170.016 117.576 174.908 97.0135 175.059C74.2042 174.89 56.9538 167.575 45.7381 153.317C35.2355 139.966 29.8077 120.682 29.6052 96C29.8077 71.3178 35.2355 52.0336 45.7381 38.6827C56.9538 24.4249 74.2039 17.11 97.0132 16.9405C119.988 17.1113 137.539 24.4614 149.184 38.788C154.894 45.8136 159.199 54.6488 162.037 64.9503L178.184 60.6422C174.744 47.9622 169.331 37.0357 161.965 27.974C147.036 9.60668 125.202 0.195148 97.0695 0H96.9569C68.8816 0.19447 47.2921 9.6418 32.7883 28.0793C19.8819 44.4864 13.2244 67.3157 13.0007 95.9325L13 96L13.0007 96.0675C13.2244 124.684 19.8819 147.514 32.7883 163.921C47.2921 182.358 68.8816 191.806 96.9569 192H97.0695C122.03 191.827 139.624 185.292 154.118 170.811C173.081 151.866 172.51 128.119 166.26 113.541C161.776 103.087 153.227 94.5962 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.6368C101.047 98.5234 102.976 98.468 104.871 98.468C111.106 98.468 116.939 99.0737 122.242 100.233C120.264 124.935 108.662 128.946 98.4405 129.507Z">
            </path>
          </svg>
          </a> */}
        </span>
      </div>
    </footer>
    <script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js" defer></script>
    </div>   
    );
}

