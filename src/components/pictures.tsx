import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { getSelectedPicture, picturesSelector } from '../reducer';
import { selectPicture, closeModal } from '../actions';
import ModalPortal from './modal';

const Container = styled.div`
  padding: 1rem;
  justify-content: center;
  display: flex;
  flex-wrap: wrap;
`;

const Image = styled.img`
  margin: 10px;
  object-fit: contain;
  transition: transform 1s;
  max-width: fit-content;
  &:hover {
    transform: scale(1.2);
  }
`;
const Pictures = () => {
  const picture = useSelector(picturesSelector);
  const selectedPicture = useSelector(getSelectedPicture);
  const dispatch = useDispatch();
  return (
    <Container>
      {picture.map((picture, key) => (
        <Image 
          key={key} 
          src={picture.previewFormat}
          alt={picture.author} 
          onClick={() => dispatch(selectPicture(picture))}/> 
      ))}
      {selectedPicture && (
        <ModalPortal
          largeFormat={selectedPicture.largeFormat}
          close={() => dispatch(closeModal())}
        />
      )}
    </Container>
  );
};

export default Pictures;
