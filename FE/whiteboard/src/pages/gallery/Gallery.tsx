import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import './Gallery.css'


//kada  se ucita stranica salje se GET request serveru i server vraca sve slike koje su vezane za ime korisnika
const Gallery = () => {
    const [images, setImages] = useState<any>(['']);
    const {name} = useParams<any>();

    useEffect(() => {
        // socket.emit('get-images-for-user', { user_name: name })
        getImages(name);
    }, [])

    const getImages = async (name: string) => {
        const res = await fetch(`http://localhost:4003/getUserImages?user=${name}`)
        const data = await res.json()
        setImages(data.result)
        console.log('----------');
        console.log(data);
        console.log('----------');

    }
    return (
        <div className='container gallery-image-container'>
            {images.map((image: any, index: number) => (
                <img src={`http://localhost:4003/${image.path}`} alt="Something" key={index} />))}
        </div>
    );
}

export default Gallery;