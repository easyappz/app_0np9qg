import React from 'react';
import { useParams } from 'react-router-dom';

const ListingDetailPage = () => {
  const { id } = useParams();

  return (
    <div data-easytag="id1-react/src/pages/ListingDetailPage.js" className="container">
      <h1 data-easytag="id2-react/src/pages/ListingDetailPage.js">Объявление #{id}</h1>
      <p data-easytag="id3-react/src/pages/ListingDetailPage.js">Детали объявления будут здесь</p>
    </div>
  );
};

export default ListingDetailPage;