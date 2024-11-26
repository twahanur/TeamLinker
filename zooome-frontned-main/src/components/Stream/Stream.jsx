/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import { ImSpinner3 } from 'react-icons/im';
import { PiSpinner } from 'react-icons/pi';
import loading from '../../assets/output-onlinegiftools.gif';
import { FaMicrophoneSlash } from 'react-icons/fa';
import { BsCameraVideoOffFill } from 'react-icons/bs';
import AudioVisualization from '../AudioVisualization/AudioVisualization';
import { MdChangeCircle, MdOutlineScreenshotMonitor } from 'react-icons/md';

const Stream = ({ p, me, participants, userCamera, shiftFrontBackCamera, screenShare }) => {
    const { name, role, stream, camera, microphone } = participants[p];
    const [isZoom, setIsZoom] = useState(false);

    const nameFirstLetter = name.charAt(0).toUpperCase();
    const videoRef = useRef();

    useEffect(() => {
        if (stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    return (
        <div className={`${isZoom ? ' w-[100%] fixed top-0 left-0 z-[100] mx-auto flex justify-center overflow-hidden items-center  bg-[#393a37] h-[100%]  ' :
            'max-w-[600px] w-full mx-auto flex justify-center overflow-hidden items-center rounded-md bg-[#393a37] h-[200px] md:h-[300px] relative'}`}>
            {!camera && stream && <p className='text-2xl md:text-5xl text-white bg-green-700 w-14 h-14 md:w-20 md:h-20 flex justify-center items-center rounded-full font-bold'>{nameFirstLetter}</p>}
            <p className='absolute top-3 text-xs md:text-sm left-3 border py-1 px-2 border-gray-400 text-gray-400 capitalize rounded'>{name}</p>
            {<video
                muted
                ref={videoRef} autoPlay playsInline className={(stream && camera) ? 'w-full h-full ' : 'w-0 h-0 overflow-hidden'} />}
            {!stream && <img src={loading} className='w-20 md:w-36' alt="" />}
            <div className='absolute bottom-2 right-2 flex items-center gap-4'>
                {!camera && <BsCameraVideoOffFill className=' text-gray-400 md:text-lg' />}
                {!microphone && <FaMicrophoneSlash className=' text-gray-400 md:text-lg' />}
                {(camera && !screenShare && (me?.id === p)) && <MdChangeCircle 
                    onClick={shiftFrontBackCamera}
                className=' text-gray-400 text-lg cursor-pointer ' />}
            </div>
            {microphone && <div className='w-10 md:w-16  absolute left-2 bottom-2'>
                <AudioVisualization stream={stream} id={p} me={me} />
            </div>}
            <MdOutlineScreenshotMonitor
                className=' absolute top-2 right-2 text-white cursor-pointer text-2xl md:text-3xl'
                onClick={() => setIsZoom(!isZoom)}

            />
        </div>
    );
};

export default Stream;
