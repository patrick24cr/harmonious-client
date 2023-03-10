import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Link from 'next/link';
import { deleteBandAndMembers } from '../api/soundscapes';

function SoundscapeCard({ soundscapeObj, onUpdate }) {
  const deleteBandAndChangeState = () => {
    if (window.confirm(`Delete ${soundscapeObj.title}?`)) {
      deleteBandAndMembers(soundscapeObj.id).then(() => onUpdate());
    }
  };

  return (
    <Card bg="dark" style={{ width: '14rem', margin: '10px' }}>
      <div className="cardBuffer">
        <Card.Title>{soundscapeObj.title}</Card.Title>
        <div className="bandButtons">
          <Link href={`/soundscape/${soundscapeObj.id}`} passHref>
            <Button variant="outline-light" className="m-2">Load</Button>
          </Link>
          <Button variant="outline-light" onClick={deleteBandAndChangeState} className="m-2">
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
}

SoundscapeCard.propTypes = {
  soundscapeObj: PropTypes.shape({
    title: PropTypes.string,
    id: PropTypes.number,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default SoundscapeCard;
