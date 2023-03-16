import React, { useState, useEffect } from 'react';

const ProductGallery = ( { productPhotos, productName, styleName } ) => {

  const [mainImage, setMainImage] = useState('');

  // Current bug -- this takes a noticeable amount of time to render to the page on initial page load
  useEffect(() => {
    setMainImage(productPhotos[0].url);
  }, [productPhotos]);

  const handleThumbnailClick = (e) => {
    e.preventDefault();
    let thumbnail_index = e.target.id;
    setMainImage(productPhotos[thumbnail_index].url);
  }

  const imageDescription = productName.concat(', ', styleName);

  let count = -1;

  const thunbnailList = productPhotos.map(photo => {
    count++;
    let thumbnailDescription = imageDescription.concat(' Image #', count);
    return (
      <img key={count} id={count} src={photo.thumbnail_url} alt={thumbnailDescription} width="100px" onClick={handleThumbnailClick}></img>
    );
  });

  return (
    <div className="gallery">
      {/* <h2>This is the Product Gallery Component!</h2> */}
      <img className="mainImage" src={mainImage} alt={imageDescription}></img>
      <div className="thumbnailGallery">
        {thunbnailList}
      </div>
    </div>
  )
}

export default ProductGallery;
