import React from 'react';
import PropTypes from 'prop-types';

function GridInteractable({ scores, selected, setSelected }) {
  const columns = ['a', 'b', 'c', 'd', 'e'];
  const rows = ['1', '2', '3', '4', '5'];

  const lessonCategories = {
    1: 'Verb Level 1',
    2: 'Verb Level 2',
    3: 'Verb Level 3',
    4: 'Verb Level 4',
    5: 'Verb Level 5',
    a: 'Present Tense',
    b: 'Past Tense',
    c: 'Future Tense',
    d: 'Conditional Tense',
    e: 'Subjunctive Tense',
  };

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
  const labelFontSize = () => {
    const heightAsLimit = 13 / rows.length;
    const widthAsLimit = 13 / columns.length;
    return Math.min(heightAsLimit, widthAsLimit);
  };
  const scoreLineHeight = () => 70 / rows.length;
  const verbItemLineHeight = () => 70 / rows.length;
  // const syntaxItemLineHeight = () => 10;
  // end hard-coded sizing constants

  const highlightElements = (e) => {
    const tileName = e.target.id.split('--')[1];
    const score = document.getElementById(`hover--${tileName}`);
    const syntax = document.getElementById(`syntax--${tileName[0]}`);
    const verb = document.getElementById(`verb--${tileName[1]}`);
    score.classList.add('highlightedScore');
    syntax.classList.add('highlightedSyntaxItem');
    verb.classList.add('highlightedVerbItem');
  };
  const unHighlightElements = (e) => {
    const tileName = e.target.id.split('--')[1];
    const score = document.getElementById(`hover--${tileName}`);
    const syntax = document.getElementById(`syntax--${tileName[0]}`);
    const verb = document.getElementById(`verb--${tileName[1]}`);
    score.classList.remove('highlightedScore');
    syntax.classList.remove('highlightedSyntaxItem');
    verb.classList.remove('highlightedVerbItem');
  };

  const handleSelect = (e) => {
    const tileName = e.target.id.split('--')[1];
    const syntax = document.getElementById(`syntax--${tileName[0]}`);
    const verb = document.getElementById(`verb--${tileName[1]}`);
    if (tileName === selected) {
      if (selected !== '' && selected !== 'initial') {
        document.getElementById(`syntax--${selected[0]}`).classList.remove('selectedSyntaxItem');
        document.getElementById(`verb--${selected[1]}`).classList.remove('selectedVerbItem');
      }
      setSelected('');
    } else {
      if (selected !== '' && selected !== 'initial') {
        document.getElementById(`syntax--${selected[0]}`).classList.remove('selectedSyntaxItem');
        document.getElementById(`verb--${selected[1]}`).classList.remove('selectedVerbItem');
      }
      setSelected(tileName);
      syntax.classList.add('selectedSyntaxItem');
      verb.classList.add('selectedVerbItem');
    }
  };

  // , lineHeight: `${syntaxItemLineHeight()}vw`

  return (
    <div className="metaGridContainer">
      <div className="syntaxContainer">
        {columns.map((letter) => (
          <div key={letter} id={`syntax--${letter}`} className="syntaxItem" style={{ width: `${100 / columns.length}%`, fontSize: `${labelFontSize()}vw` }}>{lessonCategories[letter] ? lessonCategories[letter] : letter}</div>
        ))}
      </div>
      <div className="verbContainer">
        {rows.map((number) => (
          <div key={number} id={`verb--${number}`} className="verbItem" style={{ lineHeight: `${verbItemLineHeight()}vw`, fontSize: `${labelFontSize()}vw` }}>{lessonCategories[number] ? lessonCategories[number] : number}</div>
        ))}
      </div>
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
              className={`tile grade${scores[tile] ? scores[tile] : '0'}${tile === selected ? ' selected' : ''}`}
            />
            <div
              role="button"
              tabIndex={0}
              className={`scoreContainer${tile === selected ? ' selectedScore' : ''}`}
              id={`hover--${tile}`}
              onClick={(e) => handleSelect(e)}
              onMouseEnter={(e) => highlightElements(e)}
              onMouseLeave={(e) => unHighlightElements(e)}
              onKeyDown={() => console.warn('no keyboard support yet')}
              style={{ fontSize: `${scoreFontSize()}vw`, lineHeight: `${scoreLineHeight()}vw` }}
            >
              {scores[tile] ? scores[tile] : 0}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

GridInteractable.propTypes = {
  scores: PropTypes.objectOf(PropTypes.number),
  selected: PropTypes.string,
  setSelected: PropTypes.func,
};

GridInteractable.defaultProps = {
  scores: {},
  selected: '',
  setSelected: (() => 0),
};

export default GridInteractable;
