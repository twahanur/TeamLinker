/* eslint-disable react/prop-types */
import { FaUser } from 'react-icons/fa';
import { MdChangeCircle, MdMessage } from 'react-icons/md';
import { IoCameraOutline } from 'react-icons/io5';
import { MdKeyboardVoice } from 'react-icons/md';
import { PiMonitorArrowUpDuotone } from 'react-icons/pi';
import { IoExit } from 'react-icons/io5';
import Stream from '../Stream/Stream';
import { useNavigate } from 'react-router-dom';


const MiddlePart = ({
    participants,
    me,
    camera,
    microphone,
    screenShare,
    videoTrack,
    changeAction,
    shareScreen,
    stopScreenSharing,
    leftSidebar,
    setLeftSidebar,
    rightSidebar,
    setRightSidebar,
    shiftFrontBackCamera
}) => {
    const navigate = useNavigate();
    return (
        <div className="flex-1 flex flex-col w-full h-screen p-4 md:p-8 bg-[#151515] border-x-2 border-[#494949] ">
            <div className='flex-1'>
                <div className='text-xl md:hidden flex justify-between items-center bg-[#4e4e4e] text-gray-300 p-2 rounded-md mb-4'>
                    <FaUser
                        onClick={() => setLeftSidebar(!leftSidebar)}
                        className='cursor-pointer' />
                    <MdMessage
                        onClick={() => setRightSidebar(!rightSidebar)}
                        className='cursor-pointer' />
                </div>
            </div>

            <div className={`w-full  grid grid-cols-1 ${(Object.keys(participants).length > 1) && 'md:grid-cols-2'} gap-5 md:gap-7 overflow-y-auto middle-scroll`}>
                {Object.keys(participants).map((p, i) =>
                    <Stream key={i} shiftFrontBackCamera={shiftFrontBackCamera} p={p} userCamera={camera} screenShare={screenShare} me={me} participants={participants} ></Stream>)}
            </div>

            <div className='flex-1'></div>
            <div className='justify-center mt-4 md:mt-7  flex text-xl md:text-3xl text-white items-center gap-5 md:gap-7'>
                {!screenShare && <div
                    onClick={() => changeAction('camera')}
                    className={`${camera ? 'bg-orange-700' : 'bg-gray-600'}   p-2 rounded cursor-pointer`}>
                    <IoCameraOutline />
                </div>}
                <div
                    onClick={() => changeAction('microphone')}
                    className={`${microphone ? 'bg-orange-700' : 'bg-gray-600'}   p-2 rounded cursor-pointer`}>
                    <MdKeyboardVoice />
                </div>
                <div
                    onClick={() => screenShare ? stopScreenSharing(videoTrack) : shareScreen()}
                    className={`${screenShare ? 'bg-orange-700' : 'bg-gray-600'}   p-2 rounded cursor-pointer`}>
                    <PiMonitorArrowUpDuotone />
                </div>
                <div
                    onClick={() => window.location.href = '/'}
                    className=' bg-red-600 p-2 rounded cursor-pointer'>
                    <IoExit />
                </div>
            </div>
        </div>
    );
};

export default MiddlePart;