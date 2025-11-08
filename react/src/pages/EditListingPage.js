import React from 'react';
import { useParams } from 'react-router-dom';

const EditListingPage = () => {
  const { id } = useParams();

  return (
    <div data-easytag="id1-react/src/pages/EditListingPage.js" className="container">
      <h1 data-easytag="id2-react/src/pages/EditListingPage.js">Редактировать объявление #{id}</h1>
      <p data-easytag="id3-react/src/pages/EditListingPage.js">Форма редактирования объявления будет здесь</p>
    </div>
  );
};

export default EditListingPage;