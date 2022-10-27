import Head from 'next/head'
import Image from 'next/image'

import { motion, useAnimation, useInView, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef } from 'react';
import useEventListener from '../hook/useEventListener';

const Box = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["end end", "start start"]
  });
  return (
    <section>
      <div ref={ref}>
        <figure className="progress">
          <svg id="progress" width="75" height="75" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="30" pathLength="1" className="bg" />
            <motion.circle
              cx="50"
              cy="50"
              r="30"
              pathLength="1"
              className="indicator"
              style={{ pathLength: scrollYProgress }}
            />
          </svg>
        </figure>
      </div>
    </section>
  );
};

const squareVariants = {
  visible: { opacity: 1, scale: 1, transition: { duration: 0.8 } },
  hidden: { opacity: 0, scale: 0 }
};

function Square() {
  const controls = useAnimation();
  const ref = useRef(null)
  const inView = useInView(ref)

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <div className='item'>
    <h1 className='heading'>Video <br/> Some-video <br/> video</h1>
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={squareVariants}
      className="square"
    >
      <video autoPlay muted loop src="/video.mp4"></video>
    </motion.div>
    </div>
  );
}

export default function Index() {
    const frameNumber = 1; // start video at frame 0
    // lower numbers = faster playback
    const playbackConst = 500; 
    // get page height from video duration
    let setHeight;
    let vid;
    useEffect(() => {
      setHeight = document.getElementById("set-height");        
      vid = document.getElementById('v0');
      vid.pause();
      if (typeof window !== 'undefined') {
        window.onscroll = function(){
          vid.pause();
        };
        
        // refresh video frames on interval for smoother playback
        setInterval(function(){
            vid.currentTime = window.pageYOffset/400;
        }, 40);
      }
    }, []) 

    useEventListener('loadedmetadata', function() {
      setHeight.style.height = Math.floor(vid.duration) * playbackConst + "px";
    }, vid);

    function scrollPlay(){  
      var frameNumber  = window.pageYOffset/playbackConst;
      vid.currentTime  = frameNumber;
      if (typeof window !== 'undefined') {
        window.requestAnimationFrame(scrollPlay);
      }
    }

  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["end end", "start start"]
  });
  return (
		<main >
    <Box />
    <Square />
    {/* <Box /> */}
    {/* <Box />
    <Box />
    <Box />
    <Box />
    <Box /> */}
    <div id="set-height"></div>
    <p id="time"></p>
    <video id="v0" tabindex="0" autobuffer="autobuffer" preload="preload" loop>
    <source src="https://www.html5rocks.com/en/tutorials/video/basics/devstories.webm" type="video/webm; codecs=&quot;vp8, vorbis&quot;"></source>
  <source type="video/webm; codecs=&quot;vp8, vorbis&quot;" src="https://www.html5rocks.com/tutorials/video/basics/Chrome_ImF.webm"></source>
  <source type="video/ogg; codecs=&quot;theora, vorbis&quot;" src="https://www.html5rocks.com/tutorials/video/basics/Chrome_ImF.ogv"></source>
  <source type="video/mp4; codecs=&quot;avc1.42E01E, mp4a.40.2&quot;" src="https://www.html5rocks.com/tutorials/video/basics/Chrome_ImF.mp4"></source>
    </video>
    </main>
  );
}