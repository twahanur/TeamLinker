import React, { useEffect, useState } from 'react';
import img from '../../assets/video-conferencing-software.jpg'
import { FaVideo } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { socket } from '../../App';
import { LuLoader } from 'react-icons/lu';
import toast from 'react-hot-toast';

const RequestRoom = ({ children }) => {
    const [permissionAccepted, setPermissionAccepted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');

    const id = useParams().id;
    const modificationChildren = React.Children.map(children, child => React.cloneElement(child, { name })
    );

    useEffect(() => {
        socket.on('get-request', (data) => {
            setLoading(false);
            if (data?.status) return setPermissionAccepted(true);
            if (!data?.status) return toast.error('access denied');
        });

        return () => {
            socket.off('get-request');
        }
    }, []);

    const sendRequest = () => {
        if (loading) return;
        if (!name) return toast.error('Name is required');
        setLoading(true);
        socket.emit('send-request', { id, name });
    }

    if (permissionAccepted) return modificationChildren;

    else return <div className='h-screen bg-[#ebf1f3] p-6 flex justify-center md:items-center'>
        <div className='grid grid-cols-1 shadow-lg md:grid-cols-2 rounded-lg overflow-hidden'>
            <div>
                <img src={img} alt="video-conferencing" className='w-full  object-cover h-full' />
            </div>
            <div className='p-5 flex flex-col  justify-center items-center bg-[#c7e2ee93]'>
                <FaVideo className='text-6xl border-2 border-[#5d8394] p-2 rounded-full text-[#73a0b3]' />
                <input type="text"
                    className='bg-transparent focus:outline-none mt-5 mb-4 border-b-2 border-[#73a0b3] p-2'
                    placeholder='Enter your name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <button
                    onClick={sendRequest}
                    className='bg-[#73a0b3] shadow-lg text-white p-3 md:text-lg font-bold w-[200px] flex justify-center rounded-full px-6 mb-6'
                >{
                        loading ? <LuLoader className='text-2xl animate-spin' /> : 'JOIN MEETING'
                    }</button>
                <h1 className='text-2xl md:text-3xl text-center font-medium text-gray-700'>Video calls and meetings for everyone</h1>
                <h1 className=' md:text-lg mt-2 font-medium text-center  text-gray-500'>Connect, collaborate, and celebrate from anywhere </h1>
            </div>
        </div>
    </div>
};

export default RequestRoom;