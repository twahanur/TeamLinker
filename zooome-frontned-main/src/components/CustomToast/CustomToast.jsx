import React from 'react';
import { FaCheck } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { socket } from '../../App';
import toast from 'react-hot-toast';

const CustomToast = ({ t, data }) => {

    const acceptRequest = (id, status, t) => {
        socket.emit('get-request', { id, status: status });
        toast.dismiss(t.id);
    }

    return (
        <div
            className={`${t.visible ? 'animate-enter' : 'animate-leave'
                } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
            <div className="flex-1 w-0 p-4">
                <div className="flex items-center">
                    <div className="flex-shrink-0 pt-0.5">
                        <p className=' md:text-xl text-white bg-green-700 w-8 h-8 md:w-10 md:h-10 flex justify-center items-center rounded-full font-bold uppercase'>
                            {data.name[0]}
                        </p>
                    </div>
                    <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                            {data.name}
                        </p>
                    </div>
                </div>
            </div>
            <div className='flex items-center justify-end gap-4 pr-3'>
                <p
                    onClick={() => acceptRequest(data.id, true, t)}
                    className=' text-green-600 cursor-pointer text-lg'><FaCheck /></p>
                <p
                    onClick={() => acceptRequest(data.id, false, t)}
                    className=' text-red-600 text-2xl cursor-pointer'><IoMdClose /></p>
            </div>
        </div>
    );
};

export default CustomToast;