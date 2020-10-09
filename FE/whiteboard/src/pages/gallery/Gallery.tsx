import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import './Gallery.css'

const Gallery =  ({ socket }: any) => {
    const [images, setImages] = useState<any>(['']);
    const { name } = useParams<any>();

    useEffect(() => {
        // socket.emit('get-images-for-user', { user_name: name })
        getImages(name);
    }, [])
    socket.on('get-images-for-user', (data: any) => {
        console.log(data.data);
    })
    const getImages = async (name:string)=>{
        const response = await fetch(`http://localhost:4001/getme/${name}`)
        const imageData = await response.json();
        setImages(imageData.data)
        // console.log(Object.keys(imageData));
        
        console.log(imageData.data);
        
    }
    return (
        <div className='container gallery-image-container'>
            {images.map((image: any, index: number) => (
                <img src={image.image} alt="" key={index} />))}
        </div>
    );
}

export default Gallery;