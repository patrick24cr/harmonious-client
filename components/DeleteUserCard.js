import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Link from 'next/link';

function DeleteUserCard() {
  return (
    <Card bg="dark" style={{ width: '14rem', margin: '10px' }}>
      <div className="cardBuffer">
        <Card.Title>Delete User?</Card.Title>
        <div className="bandButtons">
          <Link href="/band/" passHref>
            <Button variant="outline-light" className="m-2">Delete User</Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}

export default DeleteUserCard;
