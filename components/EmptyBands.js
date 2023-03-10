import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

export default function EmptyBands({ displayName }) {
  return (
    <div
      className="text-center d-flex flex-column justify-content-center align-content-center emptyBands"
      style={{
        padding: '30px',
        maxWidth: '500px',
        margin: '0 auto',
      }}
    >
      <h1>Hi {displayName}! </h1>
      <p>Click the button below to create a band!</p>
      <Link passHref href="/band/new">
        <Button variant="outline-light" type="button" size="lg" className="copy-btn">
          Get Started
        </Button>
      </Link>
    </div>
  );
}

EmptyBands.propTypes = {
  displayName: PropTypes.string,
};

EmptyBands.defaultProps = {
  displayName: 'Stranger',
};
