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

// const data = {
//   info: [
//     {
//       id: 1,
//       image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1200px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
//       title: "Starry Night",
//       date: "06/06/2023",
//     },
//     {
//       id: 2,
//       image: "https://cdn.shopify.com/s/files/1/0047/4231/6066/files/The_Scream_by_Edvard_Munch_1893_800x.png",
//       title: "The Scream",
//       date: "05/03/23",
//     },
//     {
//       id: 3,
//       image: "/cover.jpg",
//       title: "title2",
//       date: "xx/yy/zz",
//     },
//   ],
// };

function KrisCard({ data, index }) {
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
  if (index > 3) {
    return null; // Skip rendering for items after the fourth index
  }
  return (

    <div className="w-full lg:w-2/4">
      <div className="flex flex-wrap justify-start p-4">
        <div className="w-full mx-auto border-2 border-black shadow-whiterock" style={{width: "80vw", height: "100vh", border:"solid black"}}>
        <div className="image-container relative overflow-hidden" style={{ width: "80vw", height: "70vh", border: "solid black" }}>
  <img
    className="object-cover w-full h-full transition-transform duration-300 transform-gpu hover:scale-110"
    style={{ objectPosition: "center top-30" }}  // Adjust this line
    src={mediumImage}
    alt={data.attributes.Title}
  />
</div>

          <div className="flex justify-between p-4">
            <h1 className="text-base font-black tracking-widest text-black md:text-3xl lg:text-3xl font-display">{data.attributes.Title}</h1>
            <h2 className="text-base font-black tracking-widest text-black lg:text-1xl font-display">{data.attributes.Date}</h2>
            </div><div>
            <p className="mt-4 text-base font-medium leading-relaxed border-black lg:text-md px-4">
              {data.attributes.Description}
            </p>
            <div className="py-4">
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
  const itemsPerPage = 1;
  const sectionRef = useRef(null);
  let loadedModel;

  const displayedItems = info.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-white">
    <div className="w-full text-black bg-white">
      <div className="flex flex-col max-w-screen-xl px-4 mx-auto md:items-center md:justify-between md:flex-row md:px-1">
        <div className="flex flex-row items-center justify-between p-2 text-black">
          <a href="./index.html"> 
            <div className="text-lg font-semibold tracking-widest rounded-lg focus:outline-none focus:shadow-outline">
              <div className="inline-flex items-center">
                <div className="w-2 h-2 p-2 mr-2 rounded-full bg-beta-300"></div>
                <h2 className="text-lg font-bold tracking-tighter transition duration-500 ease-in-out transform tracking-relaxed hover:text-beta-300">
                  JourneyswithKris
                </h2>
              </div>
            </div>
          </a>
          <button
      className="rounded-lg md:hidden focus:outline-none focus:shadow-outline">
      <svg fill="currentColor" viewBox="0 0 20 20" className="w-12 h-12">
        <path
          fillRule="evenodd"
          d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
          clipRule="evenodd"
        />
        <path
          fillRule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
          </button>
        </div>
        <nav className="flex-col flex-grow hidden pb-4 md:pb-0 md:flex md:justify-end md:flex-row z-10">
          <ul className="items-center inline-block list-none lg:inline-flex">
            <li>
              <Link
                className="px-4 text-lg font-bold tracking-tighter transition duration-500 ease-in-out transform rounded-lg hover:text-black sr-only:mt-2 tracking-relaxed text-beta-300 lg:ml-4 focus:outline-none focus:shadow-outline"
                to="./index"
              >home
              </Link>
            </li>

            <li>
              <Link
                className="px-4 text-lg font-bold tracking-tighter transition duration-500 ease-in-out transform rounded-lg hover:text-black sr-only:mt-2 tracking-relaxed text-beta-300 lg:ml-4 focus:outline-none focus:shadow-outline"
                to="./blog"
                >blog post</Link>
            </li>
            <li>
              <Link
                className="px-4 text-lg font-bold tracking-tighter transition duration-500 ease-in-out transform rounded-lg hover:text-black sr-only:mt-2 tracking-relaxed text-beta-300 lg:ml-4 focus:outline-none focus:shadow-outline"
                to="./contact"
                >contact</Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
    <main>
      <section id='posts' ref={sectionRef} className="bg-white">
        <div className="container px-5 py-24 mx-auto text-black">
          <div className="flex flex-wrap mx-auto">
            <div
              data-rellax-speed="-1"
              data-rellax-xs-speed="0"
              data-rellax-mobile-speed="0"
              className="flex items-center gap-6"
            >
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




