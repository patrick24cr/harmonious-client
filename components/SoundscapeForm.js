import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Link from 'next/link';

function SoundscapeForm() {
  return (
    <Card bg="dark" style={{ width: '50rem', margin: '10px' }}>
      <div className="cardBuffer">
        <Card.Title>Create New Soundscape?</Card.Title>
        <div className="bandButtons">
          <Link href="/band/" passHref>
            <Button variant="outline-light" className="m-2">Create</Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}

export default SoundscapeForm;
