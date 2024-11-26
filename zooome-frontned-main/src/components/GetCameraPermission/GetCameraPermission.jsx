import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import img from '../../assets/Screenshot_1.png'

const GetCameraPermission = ({ children, name }) => {
    const [permission, setPermission] = useState(false);
    const [loading, setLoading] = useState(true);
    const modificationChildren = React.Children.map(children, child => React.cloneElement(child, { name })
    );

    useEffect(() => {
        const timeOut = setTimeout(() => {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                .then(() => {
                    setPermission(true);
                })
                .catch((error) => {
                    toast.error('Camera and Microphone permission required');
                    setLoading(false);
                });
        }, 0);
        return () => {
            clearTimeout(timeOut);
        }
    }, []);

    if (permission) return modificationChildren;
    if (loading) return <></>;
    else return <div className='h-screen bg-[#ebf1f3] p-6 flex justify-center md:items-center'>
        <div className='grid grid-cols-1 shadow-lg md:grid-cols-2 rounded-lg overflow-hidden'>
            <div>
                <img src={img} alt="video-conferencing" className='w-full  object-cover h-full' />
            </div>
            <div className='p-5 flex flex-col  justify-center items-center bg-[#c7e2ee93]'>
                <h1 className='text-2xl md:text-3xl text-center font-medium text-gray-700'>Please turn on your microphone and camera</h1>
                <h1 className=' md:text-lg mt-2 font-medium text-center  text-gray-500'>Otherwise you cannot join your meeting</h1>
            </div>
        </div>
    </div>

};

export default GetCameraPermission;