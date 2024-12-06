import React from 'react';
import ReactPlayer from 'react-player';
import treeanimation from '../assets/loaderMedical.mp4';

const Loader = ({ onVideoEnd }) => {
  return (
    <div className="loader-container">
      <ReactPlayer 
        url={treeanimation} 
        playing 
        width="90%" 
        height="90%" 
        //onReady={() => console.log('Video prueba')}
        onEnded={onVideoEnd} 
        controls={false} 
        muted={true} 
      />
    </div>
  );
};

export default Loader;
