/* eslint-disable react/prop-types */

import { MdEmojiEmotions, MdMessage } from 'react-icons/md';
import { FaArrowLeft, FaFileImage } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { Form, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { BACKEND_URL, socket } from '../../App';
import ScrollToBottom from 'react-scroll-to-bottom';
import FileComponent from '../FileComponent/FileComponent';


const RightSideBar = ({
    rightSidebar,
    setRightSidebar,
    me
}) => {
    const roomID = useParams().id;
    const [messageInput, setMessageInput] = useState('');
    const [message, setMessage] = useState([
        // {
        //     id: 1,
        //     name: 'Sohan',
        //     type: 'message / file',
        //     message: 'Hello'
        // }
    ]);

    useEffect(() => {
        socket.on('chat-message', (data) => {
            setMessage(prev => [...prev, data]);
        });
        return () => socket.off('chat-message');
    }, [message, roomID]);

    const onSubmit = async (e, isFile) => {
        e?.preventDefault();
        const formData = new FormData();

        let newMessage = {
            id: me?.id,
            name: me?.name,
            room: roomID,
        }

        if (messageInput) {
            newMessage['type'] = 'message';
            newMessage['message'] = messageInput;
        }
        if (isFile) {
            const file = e.target.files[0];
            newMessage['type'] = 'file';
            newMessage['fileName'] = file.name;
            newMessage['fileType'] = file.type;
            newMessage['fileSize'] = file.size;
            formData.append('file', file);
        }
        setMessageInput('');
        e.target.value = '';
        formData.append('data', JSON.stringify(newMessage));
        await fetch(`${BACKEND_URL}/chat-message`, {
            method: 'POST',
            body: formData
        })
    }


    return (
        <div className={`w-full  z-50 fixed top-0 left-0 ${rightSidebar ? 'left-0' : 'left-full'}   md:static md:w-[300px] lg:w-[350px] h-screen  bg-[#262724] flex duration-300 flex-col p-4  gap-3`}>
            <div className="flex-1 ">
                <FaArrowLeft
                    onClick={() => setRightSidebar(!rightSidebar)}
                    className=' absolute top-3 left-2 md:hidden text-gray-300 text-xl cursor-pointer ' />
                <div className='flex items-center gap-2 justify-center'>
                    <MdMessage className='text-2xl text-white' />
                    <p className="text-white md:text-xl  font-bold">Message</p>
                </div>
            </div>


            <ScrollToBottom
                initialScrollBehavior='smooth'
                className='overflow-hidden overflow-y-auto right-scroll '
                style={{ backgroundColor: 'blue', height: 'calc(100% - 100px)' }}
            >
                {message.map((m, i) => {
                    if (m.type === 'message') {
                        return <div key={i} className={`flex mb-3 w-full ${(m?.id === me?.id) && 'justify-end'}`}>
                            <div className={`p-3 bg-white  rounded-md ${(m?.id === me?.id) ? 'bg-opacity-5' : 'bg-opacity-20'}`}>
                                <p className={`text-xs  font-bold text-green-500 capitalize ${(m?.id === me?.id) && 'text-right'}`}>{m?.name}</p>
                                <p className={`text-sm md:text-base mt-1 text-white whitespace-pre-wrap break-words ${(m?.id === me?.id) && 'text-right '}`}>{m.message}</p>
                            </div>
                        </div>
                    }
                    if (m.type === 'file') {
                        return <div key={i} className={`flex mb-3 w-full ${(m?.id === me?.id) && 'justify-end'}`}>
                            <div className={`p-3 bg-white w-3/4  rounded-md ${(m?.id === me?.id) ? 'bg-opacity-5' : 'bg-opacity-20'}`}>
                                <p className={`text-xs mb-1 font-bold text-green-500 capitalize ${(m?.id === me?.id) && 'text-right'}`}>{m?.name}</p>
                                <FileComponent
                                    me={me}
                                    m={m} />
                            </div>
                        </div>
                    }
                })}
            </ScrollToBottom>


            <div className="flex items-center gap-3 border rounded-md py-1 px-2">
                <Form onSubmit={onSubmit} className='flex-1 w-full'>
                    <input type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        className="p-2 bg-transparent  w-full focus:outline-none text-white"
                        placeholder="Type a message"
                    />
                </Form>
                {/* <MdEmojiEmotions className='text-xl text-gray-300 cursor-pointer' /> */}
                <label htmlFor="file">
                    <FaFileImage className='text-xl text-gray-300 cursor-pointer' />
                </label>
                <input
                    onChange={(e) => onSubmit(e, true)}
                    type="file" name="file" id="file" className='w-0 h-0 overflow-hidden' />
            </div>
        </div>
    );
};

export default RightSideBar;