import React from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';

function BottomParameters({ selected }) {
  const router = useRouter();
  return (
    <div className="lessonParameterButtons">
      <button className="button1" type="button" onClick={() => router.push(`/lesson/${selected}`)}>
        Start
      </button>
    </div>
  );
}

BottomParameters.propTypes = {
  selected: PropTypes.string,
};

BottomParameters.defaultProps = {
  selected: '',
};

export default BottomParameters;
