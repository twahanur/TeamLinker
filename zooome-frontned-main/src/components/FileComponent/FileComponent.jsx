/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from 'react';
import { IoMdDownload } from 'react-icons/io';
import { useParams } from 'react-router-dom';
import { BACKEND_URL } from '../../App';

const FileComponent = ({ m: {
    type,
    fileName,
    fileType,  // buffer
    fileSize,
    file,
    id
}, me }) => {

    const roomID = useParams().id;
    const ref = useRef();
    const [fileSizeByCalculate, setFileSizeByCalculate] = useState('0 KB');

    useEffect(() => {
        if (ref.current) {
            ref.current.src = `${BACKEND_URL}/media?room=${roomID}&name=${file}`;
            // i want 3 type size kb, mb, gb
            const size = fileSize / 1024;
            if (size < 1024) {
                setFileSizeByCalculate(`${size.toFixed(2)} KB`);
            } else if (size >= 1024 && size < 1024 * 1024) {
                setFileSizeByCalculate(`${(size / 1024).toFixed(2)} MB`);
            } else {
                setFileSizeByCalculate(`${(size / 1024 / 1024).toFixed(2)} GB`);
            }
        }
    }, [file, fileSize, roomID]);

    const onDownload = () => {
        const link = document.createElement('a');
        link.href = `${BACKEND_URL}/download?room=${roomID}&name=${file}`;
        link.setAttribute('download', file);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <div>
            {fileType.includes('image') && <img ref={ref} className='w-full' />}
            {fileType.includes('video') && <video ref={ref} controls className='w-full' />}
            {fileType.includes('audio') && <audio ref={ref} className='w-full' />}
            {fileType.includes('application/pdf') && <embed ref={ref} className='w-full' />}
            <div className='mt-3 flex items-center gap-3'>
                <IoMdDownload
                    onClick={onDownload}
                    className='text-xl text-gray-200  cursor-pointer'
                />
                <p className='text-gray-300 text-xs md:text-sm'>{fileSizeByCalculate}</p>
            </div>
        </div>
    );
};

export default FileComponent;