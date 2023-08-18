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
  if (index > 3) {
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
  const itemsPerPage = 4;
  const sectionRef = useRef(null);
  let loadedModel;

  const displayedItems = info.slice(startIndex, startIndex + itemsPerPage);

  const isFirstPage = startIndex === 0;
  const isLastPage = startIndex + itemsPerPage >= info.length;

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  useEffect(() => {
    //DropDown button
    const closeDropdown = (event) => {
      if (!event.target.closest('.menu-button')) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('click', closeDropdown);

    //Zoom Scroll
    const handleScroll = () => {
      const scrollOffset = window.scrollY;
      const zoomSection = document.getElementById('zoom-section');
      const zoomFactor = 1 + scrollOffset * 0.0005;
      zoomSection.style.transform = `scale(${zoomFactor})`;

      const translateX = Math.min(20, scrollOffset * 0.05);
      const translateY = Math.min(-1, scrollOffset * 0.05);
      const translateZ = Math.max(-Math.PI, Math.min(Math.PI, scrollOffset * 0.05)); 

      if (loadedModel) {
        loadedModel.scene.children.forEach(child => {
          child.position.x = translateX;
          child.rotation.z = translateZ;
          child.position.y = translateY;
        });
      } 

    };
    window.addEventListener('scroll', handleScroll);

    //3D MODEL
    const test = new SceneInit('myThreeJsCanvas');
    var renderer = new THREE.WebGLRenderer({
      canvas: document.getElementById('myThreeJsCanvas'),
      antialias: true,
      alpha: true // Set alpha to true for transparent background
    });
    test.initialize();
    
    let loadedModel;
    import('three/examples/jsm/loaders/GLTFLoader.js')
    
    .then(({ GLTFLoader }) => {
      const gltfLoader = new GLTFLoader();
      gltfLoader.load('./plane/scene.gltf', (gltfScene) => {
        loadedModel = gltfScene;
        adjustModelBasedOnScreenSize(gltfScene);

        // Adjust the model's position, rotation, scale as needed
        // gltfScene.scene.rotation.y = Math.PI / 8;
        // gltfScene.scene.position.y = 3;
        // gltfScene.scene.scale.set(1, 1, 1);

        // Add the model to the scene
        test.scene.add(gltfScene.scene);

        // Initialize AnimationMixer
        const mixer = new THREE.AnimationMixer(gltfScene.scene);

        // Load animations from the gltfScene
        const animations = gltfScene.animations;
        const actions = animations.map(animation => mixer.clipAction(animation));

        // Start playing the animations
        actions.forEach(action => action.play());

        // Create an animate function for rendering
        const animate = () => {
          requestAnimationFrame(animate);

          // Update the animation mixer
          const delta = test.clock.getDelta();
          mixer.update(delta);

          renderer.render(test.scene, test.camera);
        };

        // Start the animation loop
        animate();
      });
    })
    .catch(error => {
      // Handle any errors that might occur during the import
      console.error('Error importing GLTFLoader:', error);
    });

    function adjustModelBasedOnScreenSize(gltfScene) {
      const screenWidth = window.innerWidth;

      if (screenWidth < 500) {
        gltfScene.scene.rotation.y = Math.PI / 0.79;
        gltfScene.scene.position.y = -4;
        gltfScene.scene.position.x = 5;
        gltfScene.scene.scale.set(1, 1, 1);
      } else if (screenWidth >= 500 && screenWidth < 768) {
        gltfScene.scene.rotation.y = Math.PI / 0.79;
        gltfScene.scene.position.y = 1;
        gltfScene.scene.position.x = 6;
        gltfScene.scene.scale.set(1.5, 1.5, 1.5);
      } else if (screenWidth >= 768 && screenWidth < 1024) {
        gltfScene.scene.rotation.y = Math.PI / 0.79;
        gltfScene.scene.position.y = 2;
        gltfScene.scene.position.x = 5;
        gltfScene.scene.scale.set(1.5, 1.5, 1.5);
      } else {
        gltfScene.scene.rotation.y = Math.PI / 0.89;
        gltfScene.scene.position.y = -10;
        gltfScene.scene.position.x = 12;
        gltfScene.scene.scale.set(2.5, 2.5, 2.5);
      }
      // gltfScene.scene.classList.add('model-transition');
    }
    
  
    return () => {
      document.removeEventListener('click', closeDropdown);
      window.removeEventListener('scroll', handleScroll);
      if (loadedModel) {
        loadedModel.scene.traverse(child => {
          if (child.isMesh) {
            child.material.dispose();
            child.material = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 });
          }
        });
      }
    };
  }, []);

  return (
    <div className="bg-white">
      <div className="w-full text-black bg-white">
        <div className="flex flex-col max-w-screen-xl px-4 mx-auto md:items-center md:flex-row md:px-1">
          <div className="flex flex-row items-center justify-between p-2 text-black">
            <nav className="bg-gray-900 fixed w-full z-20 top-0 left-0 border-b border-gray-600">
              <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-2">
                <a href="/" className="flex items-center">
                  <span className="text-2xl font-semibold whitespace-nowrap text-white">JourneyswithKris</span>
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
                    <div className="absolute flex top-1 right-0 mt-2 w-48 px-20 py-5">
                      <ul className="flex flex-col px-4 py-3 md:p-0 mt-4 font-medium rounded-lg md:flex-row md:space-x-8 md:mt-0 bg-gray-300 bg-opacity-20">
                        <li>
                          <a href="/allposts" className="w-full block pl-3 pr-4 text-white md:bg-transparent md:p-0 ">POSTS</a>
                        </li>
                        <li>
                          <a href="/contact" className="block pl-3 pr-4 text-white md:bg-transparent md:p-0">CONTACT</a>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
                <div className="items-center hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
                  <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium rounded-lg md:flex-row md:space-x-8 md:mt-0 md:border-0 bg-gray-800 md:bg-gray-900 border-gray-700">
                    <li>
                      <a href="/allposts" className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:p-0">POSTS</a>
                    </li>
                    <li>
                    <a href="/contact" className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:p-0">CONTACT</a>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
    <main>
      <section className="h-screen relative">
      <div className="h-screen relative" style={{overflow:'hidden'}} >
      <div
        id="zoom-section"
        className="h-screen relative"
        style={{
          backgroundImage: 'url(/white-blouse-desktop.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          overflow: 'hidden',
          transformOrigin: 'center',
          transition: 'transform 0.2s ease-out',
          zIndex: '0',
          minHeight: '100vh',
        }}
      >
        <canvas
          className="model-transition"
          id="myThreeJsCanvas"
          style={{
            width: '100vw', // Cover entire viewport width
            height: '100vh', // Cover entire viewport height
            position: 'absolute',
            top: 0,
            zIndex: 1, // Make the canvas appear on top
          }}
        />
      </div>
      </div>
      <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-between">
      <div className="p-3 text-white">
        <h1 className="text-4xl font-bold tracking-tighter lg:text-6xl hidden md:block py-2">
          <span className="italic leading-none"style={{ textShadow: "0 0 2px black", color: "white" }}>Keep your Job.</span>
          <br />
          <span className="text-6xl leading-none uppercase lg:text-12xl"style={{ textShadow: "0 0 2px black", color: "white" }}>See the World.</span>
        </h1>
      </div>
      <button onClick={() => {
        document.getElementById('posts').scrollIntoView({ behavior: 'smooth' });
      }}
      className="absolute bottom-36 right-8 bg-black hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-md shadow-xl transform z-20"
      >Latest Posts
      </button>
    </div>
      </section>
      <section id='posts' ref={sectionRef} className="bg-white">
        <div className="container px-5 py-24 mx-auto text-black">
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
          <div className="justify-center flex flex-center">
            <button className="bottom-36 right-8 bg-black hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-md shadow-xl transform z-20">
              <a href='/allposts'>All Posts</a>
            </button>
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
        <p className="mt-4 text-sm text-white sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-blueGray-200 sm:py-2 sm:mt-0 flex flex-row justify-center lg:justify-start">
          © 2023
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
          <a className="text-white hover:text-blue-500" href="https://www.facebook.com/journeyswithkris/">
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
          </a>
          <a className="ml-3 text-white hover:text-blue-500" href="https://www.instagram.com/journeyswithkris/">
            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
            </svg>
          </a>
          <a className="ml-3" href='https://www.threads.net/@journeyswithkris'>
          <svg fill="white" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="6" className="w-5 h-5 text-white hover:text-blue-500 hover:stroke-blue-500" aria-label="Threads" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg"><path class="x19hqcy" d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.296C133.559 125.696 136.834 117.143 138.28 106.366C144.217 109.949 148.617 114.664 151.047 120.332C155.179 129.967 155.42 145.8 142.501 158.708C131.182 170.016 117.576 174.908 97.0135 175.059C74.2042 174.89 56.9538 167.575 45.7381 153.317C35.2355 139.966 29.8077 120.682 29.6052 96C29.8077 71.3178 35.2355 52.0336 45.7381 38.6827C56.9538 24.4249 74.2039 17.11 97.0132 16.9405C119.988 17.1113 137.539 24.4614 149.184 38.788C154.894 45.8136 159.199 54.6488 162.037 64.9503L178.184 60.6422C174.744 47.9622 169.331 37.0357 161.965 27.974C147.036 9.60668 125.202 0.195148 97.0695 0H96.9569C68.8816 0.19447 47.2921 9.6418 32.7883 28.0793C19.8819 44.4864 13.2244 67.3157 13.0007 95.9325L13 96L13.0007 96.0675C13.2244 124.684 19.8819 147.514 32.7883 163.921C47.2921 182.358 68.8816 191.806 96.9569 192H97.0695C122.03 191.827 139.624 185.292 154.118 170.811C173.081 151.866 172.51 128.119 166.26 113.541C161.776 103.087 153.227 94.5962 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.6368C101.047 98.5234 102.976 98.468 104.871 98.468C111.106 98.468 116.939 99.0737 122.242 100.233C120.264 124.935 108.662 128.946 98.4405 129.507Z">
            </path>
          </svg>
          </a>
        </span>
      </div>
    </footer>
    <script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js" defer></script>
    </div>   
    );
}




