import React, { useEffect, useState } from 'react';
import img from '../../assets/1640949103839.gif'
import { FaVideo } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { socket } from '../../App';
import { LuLoader } from 'react-icons/lu';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

const Home = () => {


    const navigate = useNavigate();
    const create = async () => {
        const id = uuidv4();
        navigate(`/${id}`);
    }

    return (
        <div className='h-screen bg-[#ebf1f3] p-6 flex md:justify-center md:items-center '>
            <div className='grid grid-cols-1 shadow-lg md:grid-cols-2  rounded-lg overflow-hidden '>
                <div>
                    <img src={img} alt="video-conferencing" className='w-full   h-full' />
                </div>
                <div className='p-5 flex flex-col  justify-center items-center bg-[#c7e2ee93]'>
                    <FaVideo className='text-6xl border-2 border-[#5d8394] p-2 rounded-full text-[#73a0b3]' />
                    <button
                        onClick={create}
                        className='bg-[#73a0b3] mt-5 shadow-lg text-white p-3 md:text-lg font-bold w-[250px] flex justify-center rounded-full px-6 mb-6'
                    >CREATE NEW MEETING</button>
                    <h1 className='text-2xl md:text-3xl text-center font-bold text-gray-700'>WELCOME TO ZOOOME</h1>
                    <p className=' text-sm md:text-base mt-3 font-medium text-center  text-gray-500'>Stay connected with Zooome! Experience seamless video and audio calling, real-time chat, and hassle-free file sharing all in one app. Elevate your communication, anytime, anywhere.</p>
                </div>
            </div>
        </div>
    )
};

export default Home;