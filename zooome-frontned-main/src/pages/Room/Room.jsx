
import { useEffect, useRef, useState } from 'react';
import { FaCheck, FaCopy, FaFileImage, FaMicrophoneSlash, FaUser } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { IoCameraOutline, IoExit } from 'react-icons/io5';
import { MdEmojiEmotions, MdKeyboardVoice, MdMessage } from 'react-icons/md';
import { PiMonitorArrowUpDuotone } from 'react-icons/pi';
import { socket } from '../../App';
import { useParams } from 'react-router-dom';
import Stream from '../../components/Stream/Stream';
import { BsCameraVideoOffFill } from 'react-icons/bs';
import AudioVisualization from '../../components/AudioVisualization/AudioVisualization';
import LeftSideBar from '../../components/LeftSideBar/LeftSideBar';
import MiddlePart from '../../components/MiddlePart/MiddlePart';
import RightSideBar from '../../components/RightSideBar/RightSideBar';
import toast from 'react-hot-toast';
import audio from '../../assets/message-notification-190034.mp3';
import CustomToast from '../../components/CustomToast/CustomToast';
import { RiVideoChatFill } from 'react-icons/ri';

const Room = ({ name }) => {
    const [leftSidebar, setLeftSidebar] = useState(false);
    const [rightSidebar, setRightSidebar] = useState(false);
    const id = useParams().id;
    const [me, setMe] = useState(null);
    const localStream = useRef(new MediaStream());
    const [videoTrack, setVideoTrack] = useState(null);
    const peerConnections = useRef({});
    const [camera, setCamera] = useState(true);
    const [microphone, setMicrophone] = useState(true);
    const [screenShare, setScreenShare] = useState(false)
    const [showCopy, setShowCopy] = useState(true);
    const [faceingMode, setFaceingMode] = useState(true);
    const [participants, setParticipants] = useState({
        // id : {
        //     name : 'sohan',
        //     stream : localStream.current,
        //     microphone : true,
        //     camera : true,
        // }
    });

    const servers = {
        iceServers: [
            {
                urls: import.meta.env.VITE_STUN_SERVER_URL,
            },
            {
                urls: import.meta.env.VITE_TURN_SERVER_URL,
                username: import.meta.env.VITE_USERNAME,
                credential: import.meta.env.VITE_CREDENTIAL,
            },
        ],
    };

    useEffect(() => {
        const timeOut = setTimeout(() => {
            navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: faceingMode ? 'user' : 'environment'
                }, audio: true
            })
                .then((stream) => {
                    localStream.current = stream;
                    socket.emit('join-room', { id, name });
                })
                .catch((error) => console.log(error));
        }, 0);
        return () => {
            clearTimeout(timeOut);
        }
    }, [id, name]);


    useEffect(() => {
        socket.on('user-joined', (data) => {
            setParticipants((prev) => {
                return {
                    ...prev,
                    [data.id]: {
                        ...data,
                        microphone: true,
                        camera: true,
                    },
                }
            });
            createOffer(data.id);
            if (me?.role !== 'admin') {
                new Audio(audio).play();
                toast.success('New user joined the meeting');
            }
        });

        socket.on('send-request', (data) => {
            new Audio(audio).play();
            toast.custom((t) => (
                <CustomToast t={t} data={data} />
            ), { duration: Infinity })
        });

        socket.on('me', (data) => {
            setMe(data);
            setParticipants((prev) => {
                return {
                    ...prev,
                    [data.id]: {
                        ...data,
                        stream: localStream.current,
                        microphone: true,
                        camera: true,
                    },
                }
            })
            new Audio(audio).play();
            toast.success('You have joined the meeting');
        });

        socket.on("send-message", (data) => {
            if (data.type === "offer") {
                setParticipants((prev) => {
                    return {
                        ...prev,
                        [data.from]: {
                            ...data?.user
                        }
                    }
                });
                createAnswer(data.data, data.from);
            }
            if (data.type === "answer") {
                addAnswer(data.data, data.from);
            }
            if (data.type === "candidate" && peerConnections.current[data.from]) {
                peerConnections.current[data.from].addIceCandidate(new RTCIceCandidate(data.data));
            }
        });

        socket.on('change-video-action', ({ id, camera, microphone }) => {
            setParticipants((prev) => {
                return {
                    ...prev,
                    [id]: {
                        ...prev[id],
                        camera,
                        microphone,
                    }
                }
            });
        });

        socket.on('user-left', ({ id, name }) => {
            setParticipants((prev) => {
                let prevData = {};
                Object.keys(prev).forEach((key) => {
                    if (key !== id) {
                        prevData[key] = prev[key];
                    }
                });
                return {
                    ...prevData,
                }
            });
            peerConnections.current[id].close();
            toast.error(`${name} left the meeting`);
        });

        return () => {
            socket.off('user-joined');
            socket.off('send-request');
            socket.off('me');
            socket.off('send-message');
            socket.off('change-video-action');
            socket.off('user-left');
        }
    }, [id, participants, localStream, me, peerConnections]);


    const connectPeer = async (userID) => {
        const peerConnection = new RTCPeerConnection(servers);

        peerConnection.ontrack = (event) => {
            setParticipants((prev) => {
                let prevData = {};
                Object.keys(prev).forEach((key) => {
                    if (key === userID) {
                        prevData[key] = {
                            ...prev[key],
                            stream: event.streams[0],
                        }
                    }
                    else if (key === me?.id) {
                        prevData[key] = {
                            ...prev[key],
                            stream: localStream.current,
                        }
                    }
                    else {
                        prevData[key] = prev[key];
                    }
                });
                return {
                    ...prevData,
                }
            });
        };

        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit("send-message", { to: userID, type: "candidate", data: event.candidate });
            }
        };

        localStream.current.getTracks().forEach((track) => {
            peerConnection.addTrack(track, localStream.current);
        });

        peerConnections.current[userID] = peerConnection;
    };

    const createOffer = async (userID) => {
        await connectPeer(userID);
        const offer = await peerConnections.current[userID].createOffer();
        await peerConnections.current[userID].setLocalDescription(offer);
        const myInfo = participants[me.id];
        delete myInfo['stream'];
        socket.emit("send-message", { to: userID, type: "offer", data: offer, userInfo: myInfo });
    };

    const createAnswer = async (offer, userID) => {
        await connectPeer(userID);
        await peerConnections.current[userID].setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnections.current[userID].createAnswer();
        await peerConnections.current[userID].setLocalDescription(answer);
        socket.emit("send-message", { to: userID, type: "answer", data: answer });
    };

    const addAnswer = async (answer, userID) => {
        if (peerConnections.current[userID] && !peerConnections.current[userID].currentRemoteDescription) {
            await peerConnections.current[userID].setRemoteDescription(new RTCSessionDescription(answer));
        }
    };


    const changeAction = (name) => {
        let data = {
            camera: camera,
            microphone: microphone,
            room: id,
        };
        if (name === 'camera') {
            const videoTrack = localStream.current.getTracks().find((track) => track.kind === 'video');
            videoTrack.enabled = !videoTrack.enabled;
            setCamera(videoTrack.enabled);
            data['camera'] = videoTrack.enabled;
        }
        if (name === 'microphone') {
            const audioTrack = localStream.current.getTracks().find((track) => track.kind === 'audio');
            audioTrack.enabled = !audioTrack.enabled;
            setMicrophone(audioTrack.enabled);
            data['microphone'] = audioTrack.enabled;
        }
        socket.emit('change-video-action', data);
    }

    const shareScreen = async () => {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            const screenTrack = stream.getVideoTracks()[0]
            const track = localStream.current.getVideoTracks()[0];
            if (!track.enabled) {
                changeAction('camera');
            }
            localStream.current.removeTrack(track);
            localStream.current.addTrack(screenTrack);
            setVideoTrack(track);
            setScreenShare(true);
            Object.values(peerConnections.current).forEach((peerConnection) => {
                const sender = peerConnection.getSenders().find((s) => s.track.kind === "video");
                sender.replaceTrack(screenTrack);
            });
            screenTrack.onended = () => {
                stopScreenSharing(track);
            };
        } catch (error) {
            console.error("Error sharing screen:", error);
        }
    };

    const stopScreenSharing = (track) => {
        try {
            const screenTrack = localStream.current.getVideoTracks().find(track => track.label.includes('screen'));
            screenTrack?.stop();
            localStream.current.removeTrack(screenTrack);
            localStream.current.addTrack(track);
            if (track.enabled) {
                changeAction('camera');
            }
            setVideoTrack(null);
            setScreenShare(false);
            Object.values(peerConnections.current).forEach((peerConnection) => {
                const sender = peerConnection.getSenders().find((s) => s.track.kind === "video");
                sender.replaceTrack(track);
            });
        } catch (error) {
            localStream.current.removeTrack(localStream.current.getVideoTracks()[0]);
            localStream.current.addTrack(track);
            if (track.enabled) {
                changeAction('camera');
            }
            setVideoTrack(null);
            setScreenShare(false);
            Object.values(peerConnections.current).forEach((peerConnection) => {
                const sender = peerConnection.getSenders().find((s) => s.track.kind === "video");
                sender.replaceTrack(track);
            });
        }
    }

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard');
    }

    const shiftFrontBackCamera = async () => {
        const oldTrack = await localStream.current.getVideoTracks()[0];
        const newStream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: faceingMode ? 'environment' : 'user'
            }
        })
        const newTrack = newStream.getVideoTracks()[0];
        oldTrack.stop();
        localStream.current.removeTrack(oldTrack);
        localStream.current.addTrack(newTrack);
        setFaceingMode(!faceingMode);
        Object.values(peerConnections.current).forEach((peerConnection) => {
            const sender = peerConnection.getSenders().find((s) => s.track.kind === "video");
            sender.replaceTrack(newTrack);
        });
    }

    return (
        <div className="flex w-full">

            <LeftSideBar
                leftSidebar={leftSidebar}
                me={me}
                participants={participants}
                setLeftSidebar={setLeftSidebar} />


            <MiddlePart
                participants={participants}
                me={me}
                camera={camera}
                microphone={microphone}
                screenShare={screenShare}
                videoTrack={videoTrack}
                changeAction={changeAction}
                shareScreen={shareScreen}
                stopScreenSharing={stopScreenSharing}
                leftSidebar={leftSidebar}
                setLeftSidebar={setLeftSidebar}
                rightSidebar={rightSidebar}
                shiftFrontBackCamera={shiftFrontBackCamera}
                setRightSidebar={setRightSidebar} />




            <RightSideBar
                rightSidebar={rightSidebar}
                me={me}
                setRightSidebar={setRightSidebar} />

            {showCopy && <div
                className='p-5 max-w-full bg-[#ebf1f3] z-[200] w-[300px] md:w-[400px] rounded-md fixed bottom-3 left-3 shadow-inner '
            >
                <IoMdClose
                    onClick={() => setShowCopy(false)}
                    className='absolute top-2 right-2 text-xl cursor-pointer' />
                <div className='text-gray-700 mt-4 flex gap-2 md:gap-4 items-center'>
                <RiVideoChatFill className='text-4xl md:text-5xl text-[#618899]' />
                    <p
                        className='font-medium  flex-1 items-center'
                    >Share this  meeting link with others you want in the meeting</p>
                </div>
                <div className='bg-gray-300 rounded-md p-2 mt-4 flex justify-between items-center gap-3'>
                    <p className='flex-1 text-xs md:text-sm'>{window.location.hostname + window.location.pathname}</p>
                    <FaCopy
                        onClick={copyLink}
                        className='text-xl  cursor-pointer text-[#4d6f7e]' />
                </div>
            </div>}

        </div>
    );
};

export default Room;