/* eslint-disable react/prop-types */
import { FaArrowRight, FaCheck, FaMicrophoneSlash } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import AudioVisualization from '../AudioVisualization/AudioVisualization';
import { socket } from '../../App';

const LeftSideBar = ({
    participants,
    me,
    leftSidebar,
    setLeftSidebar,
}) => {


    return (
        <div className={`w-full fixed z-50 top-0 right-0 ${leftSidebar ? 'right-0' : 'right-full'} duration-300  md:static md:w-[200px] lg:w-[250px] h-screen  bg-[#262724] flex flex-col`}>
            <div className="p-4 bg-[#636262]  flex justify-center items-center gap-3 relative">
                <p className="text-white md:text-xl  font-bold">Participants</p>
                <p className="text-white md:text-xl font-medium bg-[#3a3939] px-3 rounded py-1">{Object.keys(participants).length}</p>
                <FaArrowRight
                    onClick={() => setLeftSidebar(!leftSidebar)}
                    className='absolute md:hidden text-xl cursor-pointer  right-2 ' />
            </div>
            <div className="flex-1 overflow-y-auto left-scroll p-4 flex flex-col gap-7 mt-5">
                {Object.keys(participants).map((p, i) => <div className="flex items-end 2 justify-between" key={i}>
                    <div className='flex items-center gap-3'>
                        <p className="w-2 h-2 bg-green-500 rounded-full"></p>
                        <p className="text-white text-sm md:text-base capitalize">{participants[p].name}</p>
                    </div>
                    <div className='flex items-center gap-4'>
                        {!participants[p]?.microphone && <FaMicrophoneSlash className=' text-gray-400 md:text-lg' />}
                        {participants[p]?.microphone && <div className='w-10 '>
                            <AudioVisualization stream={participants[p]?.stream} id={p} me={me} />
                        </div>}
                    </div>
                </div>)}
            </div>
        </div>
    );
};

export default LeftSideBar;