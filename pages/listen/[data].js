import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import * as Tone from 'tone';
import { EQ3 } from 'tone';
import GridNotInteractable from '../../components/GridNotInteractable';
import TopNavigation from '../../components/TopNavigation';
import { getReadOnlyChordProgressions, getChordProgressionsDetailed } from '../../api/soundscapes';

export default function Listen() {
  const router = useRouter();
  const soundscapeStringArray = router.query.data.split('--');
  // eslint-disable-next-line prefer-destructuring
  const originalTitle = soundscapeStringArray[0];
  const originalMelodyNotes = soundscapeStringArray[1];
  const originalMelodyTexture = parseInt(soundscapeStringArray[2], 10);
  const originalChordTexture = parseInt(soundscapeStringArray[3], 10);
  const pk = parseInt(soundscapeStringArray[4], 10);
  const originalProgressions = soundscapeStringArray[5];
  const [detailedProgressions, setDetailedProgressions] = useState([]);
  const namingConventionArray = ['index0', 'texture1filepath', 'texture2filepath', 'texture3filepath'];
  const [originalChordNumbers, setOriginalChordNumbers] = useState([[], [], []]);
  console.warn(detailedProgressions, namingConventionArray, originalChordNumbers);
  //   let melodyString = '';
  //   let chordString = '';
  let synths = [];
  const notes1 = ['G3', 'A3', 'C4', 'D4', 'E4', 'G4', 'A4', 'C5', 'D5', 'E5'];
  const notes2 = ['0', 'c3', 'd3', 'e3', 'f3', 'g3', 'a3', '7', '8', '9', '10', 'c4', 'd4', 'e4', 'f4', '15', 'a4'];
  let grid1 = [];
  let grid2 = [];
  let beat = 0;
  let playing = false;
  let started = false;
  let sampler = {};
  const progressionNames = ['Easygoing', 'Nocturnal', 'Earnest', 'Hopeful', 'Circular', 'Bittersweet', 'Foggy', 'Desolate'];
  const melodyTextureNames = ['Ocarina', 'Vertex', 'Rain'];
  const chordTextureNames = ['Air Chords', 'Digital Glass', 'Gentle Marimbas'];
  const stringTranslatedToTiles = [];
  if (originalMelodyNotes[0] > 0) {
    stringTranslatedToTiles.push(`a${originalMelodyNotes[0]}`);
  }
  if (originalMelodyNotes[1] > 0) {
    stringTranslatedToTiles.push(`b${originalMelodyNotes[1]}`);
  }
  if (originalMelodyNotes[2] > 0) {
    stringTranslatedToTiles.push(`c${originalMelodyNotes[2]}`);
  }
  if (originalMelodyNotes[3] > 0) {
    stringTranslatedToTiles.push(`d${originalMelodyNotes[3]}`);
  }
  if (originalMelodyNotes[4] > 0) {
    stringTranslatedToTiles.push(`e${originalMelodyNotes[4]}`);
  }
  if (originalMelodyNotes[5] > 0) {
    stringTranslatedToTiles.push(`f${originalMelodyNotes[5]}`);
  }
  if (originalMelodyNotes[6] > 0) {
    stringTranslatedToTiles.push(`g${originalMelodyNotes[6]}`);
  }
  if (originalMelodyNotes[7] > 0) {
    stringTranslatedToTiles.push(`h${originalMelodyNotes[7]}`);
  }
  if (originalMelodyNotes[8] > 0) {
    stringTranslatedToTiles.push(`i${originalMelodyNotes[8]}`);
  }
  if (originalMelodyNotes[9] > 0) {
    stringTranslatedToTiles.push(`j${originalMelodyNotes[9]}`);
  }
  if (originalMelodyNotes[10] > 0) {
    stringTranslatedToTiles.push(`k${originalMelodyNotes[10]}`);
  }
  if (originalMelodyNotes[11] > 0) {
    stringTranslatedToTiles.push(`l${originalMelodyNotes[11]}`);
  }
  if (originalMelodyNotes[12] > 0) {
    stringTranslatedToTiles.push(`m${originalMelodyNotes[12]}`);
  }
  if (originalMelodyNotes[13] > 0) {
    stringTranslatedToTiles.push(`n${originalMelodyNotes[13]}`);
  }
  if (originalMelodyNotes[14] > 0) {
    stringTranslatedToTiles.push(`o${originalMelodyNotes[14]}`);
  }
  if (originalMelodyNotes[15] > 0) {
    stringTranslatedToTiles.push(`p${originalMelodyNotes[15]}`);
  }

  const makeSynths = (count) => {
    synths = [];
    for (let i = 0; i < count; i++) {
      const synth = new Tone.Synth({
        oscillator: {
          type: 'square6',
        },
        envelope: {
          attack: 0.005,
          decay: 0.7,
          sustain: 0.0,
          release: 0.5,
        },
      });
      synths.push(synth);
    }
    const feedbackDelay = new Tone.FeedbackDelay(0.75, 0.5);
    const synthVolume = new Tone.Volume({ volume: -4 });
    const delayVolume = new Tone.Volume({ volume: -12 });
    const lowCutEQ = new EQ3({ low: -3 });
    const reverb = new Tone.Freeverb({ roomSize: 0.96, dampening: 1000 });
    const reverbVolume = new Tone.Volume({ volume: -14 }).toDestination();
    feedbackDelay.connect(delayVolume);
    delayVolume.connect(lowCutEQ);
    reverb.connect(reverbVolume);
    lowCutEQ.connect(synthVolume);
    synthVolume.fan(reverb, Tone.getDestination());
    synths.forEach((synth) => {
      synth.fan(feedbackDelay, lowCutEQ);
    });
    sampler = new Tone.Sampler({
      urls: {
        C3: 'blown_c_major.m4a',
        D3: 'blown_d_minor.m4a',
        E3: 'blown_e_minor.m4a',
        F3: 'blown_f_major.m4a',
        G3: 'blown_g_major.m4a',
        A3: 'blown_a_minor.m4a',
        C4: 'blown_c_major7.m4a',
        D4: 'blown_d_minor7.m4a',
        E4: 'blown_e_minor7.m4a',
        F4: 'blown_f_major7.m4a',
        A4: 'blown_a_minor7.m4a',
      },
      baseUrl: 'http://localhost:3000/chords/',
    });
    sampler.fan(reverb, Tone.getDestination());
    return synths;
  };

  const makeGrid = (notesTaco) => {
    const rows = [];
    notesTaco.forEach((note) => {
      const row = [];
      for (let i = 0; i < 192; i++) {
        row.push({
          note,
          isActive: false,
        });
      }
      rows.push(row);
    });
    return rows;
  };

  const configLoop = () => {
    const repeat = (time) => {
      grid1.forEach((row, index) => {
        const synth = synths[index];
        const note = row[beat];
        if (note.isActive) {
          synth.triggerAttackRelease(note.note, '8n', time);
        }
      });
      grid2.forEach((row) => {
        // const sampler = synths[index];
        const note = row[beat];
        if (note.isActive) {
          sampler.triggerAttackRelease(note.note, '1n', time);
        }
      });
      beat = (beat + 1) % 192;
    };
    Tone.Transport.bpm.value = 30;
    Tone.Transport.scheduleRepeat(repeat, '8n');
  };

  const changeGridItem = (targetGrid2, desiredRowIndex, desiredNoteIndex) => {
    targetGrid2.forEach((row, rowIndex) => {
      row.forEach((note, noteIndex) => {
        if (parseInt(desiredRowIndex, 10) === rowIndex && parseInt(desiredNoteIndex, 10) === noteIndex) {
          // eslint-disable-next-line no-param-reassign
          note.isActive = !note.isActive;
        }
      });
    });
  };

  const changeGridWhole = (targetGrid, string) => {
    const stringArray = string.split('');
    for (let i = 0; i < stringArray.length; i++) {
      // eslint-disable-next-line no-continue
      if (stringArray[i] === '0') { continue; }
      changeGridItem(targetGrid, stringArray[i], i);
    }
  };

  const changeGridWholeForChords = (targetGrid, array) => {
    let iModulator = 0;
    for (let i = 0; i < array.length; i++) {
      // eslint-disable-next-line no-continue
      changeGridItem(targetGrid, array[i], iModulator);
      //   changeGridItem(targetGrid, 0, iModulator + 1);
      //   changeGridItem(targetGrid, 0, iModulator + 2);
      //   changeGridItem(targetGrid, 0, iModulator + 3);
      iModulator += 4;
    }
  };

  const shuffleArray = (originalArray) => (originalArray.sort(() => 0.5 - Math.random()));

  const decrementString = (originalString) => {
    let newString = '';
    for (let i = 0; i < originalString.length; i++) {
      if (originalString.charAt(i) === '0') {
        newString += 0;
      } else {
        newString += parseInt(originalString.charAt(i), 10) - 1;
      }
    }
    return newString;
  };

  const incrementString = (originalString) => {
    let newString = '';
    for (let i = 0; i < originalString.length; i++) {
      if (originalString.charAt(i) === '0') {
        newString += 0;
      } else {
        newString += parseInt(originalString.charAt(i), 10) + 1;
      }
    }
    return newString;
  };

  const invertString = (originalString) => {
    let newString = '';
    for (let i = 0; i < originalString.length; i++) {
      if (originalString.charAt(i) === '0') {
        newString += 0;
      } else {
        newString += 9 - parseInt(originalString.charAt(i), 10);
      }
    }
    return newString;
  };

  const melodyArranger = (melodicSeed) => melodicSeed + decrementString(melodicSeed) + incrementString(melodicSeed) + melodicSeed + invertString(melodicSeed) + melodicSeed + decrementString(invertString(melodicSeed)) + decrementString(melodicSeed) + invertString(melodicSeed) + decrementString(melodicSeed) + incrementString(invertString(melodicSeed) + incrementString(melodicSeed));

  const chordArranger = (chords) => {
    const shuffledChords = shuffleArray(chords);
    const arrangedChords = shuffledChords[0].concat(shuffledChords[0], shuffledChords[1], shuffledChords[0], shuffledChords[2], shuffledChords[2], shuffledChords[1], shuffledChords[2], shuffledChords[1], shuffledChords[0], shuffledChords[1], shuffledChords[2]);
    return arrangedChords;
  };

  const startAudio = () => {
    if (!started) {
      Tone.start();
      Tone.getDestination().volume.rampTo(-10, 0.001);
      started = true;
    }
    if (playing) {
      Tone.Transport.stop();
      playing = false;
    } else {
      Tone.Transport.start();
      playing = true;
    }
  };

  useEffect(() => {
    getChordProgressionsDetailed(pk).then((response) => {
      setDetailedProgressions(response);
    });
    getReadOnlyChordProgressions().then((response) => {
      const decrementedOriginalProgressions = decrementString(originalProgressions);
      // eslint-disable-next-line max-len
      const tacoOfAspiration = ([[response[decrementedOriginalProgressions[0]].firstChord, response[decrementedOriginalProgressions[0]].secondChord, response[decrementedOriginalProgressions[0]].thirdChord, response[decrementedOriginalProgressions[0]].fourthChord], [response[decrementedOriginalProgressions[1]].firstChord, response[decrementedOriginalProgressions[1]].secondChord, response[decrementedOriginalProgressions[1]].thirdChord, response[decrementedOriginalProgressions[1]].fourthChord], [response[decrementedOriginalProgressions[2]].firstChord, response[decrementedOriginalProgressions[2]].secondChord, response[decrementedOriginalProgressions[2]].thirdChord, response[decrementedOriginalProgressions[2]].fourthChord]]);

      setOriginalChordNumbers(tacoOfAspiration);

      synths = makeSynths(10);
      grid1 = makeGrid(notes1);
      grid2 = makeGrid(notes2);
      changeGridWhole(grid1, melodyArranger(originalMelodyNotes));
      changeGridWholeForChords(grid2, chordArranger(tacoOfAspiration));
      configLoop();
      console.warn('Start Procession');
      console.warn(melodyArranger(originalMelodyNotes));
      console.warn(tacoOfAspiration);
      console.warn(chordArranger(tacoOfAspiration));
    });
  }, []);

  // the following useEffect runs when user leaves the page
  useEffect(() => () => {
    Tone.Transport.stop();
    Tone.Transport.cancel();
    synths.forEach((synth) => {
      synth.dispose();
    });
    sampler.dispose();
  }, []);

  return (
    <>
      <TopNavigation />
      <div className="soundscapeBox2">
        <div className="parameterLabelBox">
          {originalTitle}
        </div>
      </div>
      <div className="soundscapeBox1">
        <div className="parameterLabelBox">
          Melodic theme:
        </div>
        <div className="selectBox">
          <GridNotInteractable selected={stringTranslatedToTiles} />
        </div>
      </div>
      <div className="soundscapeBox2">
        <div className="parameterLabelBox">
          Chord progressions: {progressionNames[originalProgressions[0] - 1]}, {progressionNames[originalProgressions[1] - 1]}, {progressionNames[originalProgressions[2] - 1]}
        </div>
      </div>
      <div className="soundscapeBox2">
        <div className="parameterLabelBox">
          Texture: {melodyTextureNames[originalMelodyTexture]} over {chordTextureNames[originalChordTexture]}
        </div>
      </div>
      <div key="buttonBox" className="soundscapeBox4">
        <Link href={`/soundscape/${router.query.data}`} passHref>
          <button key="returnButton" type="button" className="soundButton">Return</button>
        </Link>
        <button key="playButton" type="button" className="soundButton" onClick={() => startAudio()}>Start/Stop</button>
      </div>
    </>
  );
}
