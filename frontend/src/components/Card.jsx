import React from 'react'
import { useContext } from 'react';
import { UserDataContext } from '../context/userContext';

function Card({ image }) {
    const { serverUrl,
            userData,
            setUserData, backendImage, setBackendImage, frontendImage, setFrontendImage, selectedImage, setSelectedImage } = useContext(UserDataContext);
    return (
        <div className={`w-[150px] h-[250px] bg-[#020220] border-2 border-[#000ff66] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white
            ${selectedImage == image ? 'border-4 border-white shadow-2xl hover:shadow-blue-950' : null}`}
        onClick={() => {setSelectedImage(image)
            setBackendImage(null)
            setFrontendImage(null)
        }}>
            <img src={image} className='h-full object-cover' />
        </div>
    )
}

export default Card