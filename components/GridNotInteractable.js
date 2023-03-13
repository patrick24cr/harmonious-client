import React from 'react';
import PropTypes from 'prop-types';

function GridNotInteractable({ selected }) {
  const columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p'];
  const rows = ['8', '7', '6', '5', '4', '3', '2', '1'];
  const calculatedTileNames = [];
  for (let y = 0; y < rows.length; y++) {
    for (let x = 0; x < columns.length; x++) {
      calculatedTileNames.push(`${columns[x]}${rows[y]}`);
    }
  }

  // begin hard-coded sizing constants
  const scoreFontSize = () => {
    const heightAsLimit = 25 / rows.length;
    const widthAsLimit = 25 / columns.length;
    return Math.min(heightAsLimit, widthAsLimit);
  };
  const scoreLineHeight = () => 70 / rows.length;

  const handleSelect = (e) => {
    console.warn(e.target.id);
    // const tileName = e.target.id.split('--')[1];
    // alertParent(tileName);
    // need some magic here
  };

  // , lineHeight: `${syntaxItemLineHeight()}vw`

  return (
    <div className="metaGridContainer2">
      <div
        className="lessonGridContainer"
        style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }}
      >
        <div className="lessonGridBackground" />
        {calculatedTileNames.map((tile) => (
          <div className="metaTile" key={tile}>
            <div
              key={`tile--${tile}`}
              id={`tile--${tile}`}
              className={`tile grade0 ${selected.includes(tile) ? ' selected' : ''}`}
            />
            <div
              role="button"
              tabIndex={0}
              className={`scoreContainer${selected.includes(tile) ? ' selectedScore' : ''}`}
              id={`hover--${tile}`}
              onClick={(e) => handleSelect(e)}
            //   onMouseEnter={(e) => highlightElements(e)}
            //   onMouseLeave={(e) => unHighlightElements(e)}
              onKeyDown={() => console.warn('no keyboard support yet')}
              style={{ fontSize: `${scoreFontSize()}vw`, lineHeight: `${scoreLineHeight()}vw` }}
            >
              {/* {scores[tile] ? scores[tile] : 0} */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

GridNotInteractable.propTypes = {
  selected: PropTypes.arrayOf(PropTypes.string),
};

GridNotInteractable.defaultProps = {
  selected: [],
};

export default GridNotInteractable;
