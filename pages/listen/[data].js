import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import * as Tone from 'tone';
import { EQ3 } from 'tone';
import TopNavigation from '../../components/TopNavigation';
import { getChordProgressionsDetailed } from '../../api/soundscapes';

export default function Listen() {
  const makeSynths = (count) => {
    const synths = [];
    for (let i = 0; i < count; i++) {
      const synth = new Tone.Synth({
        oscillator: {
          type: 'square4',
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
    const lowCutEQ = new EQ3({ low: -3 });
    const reverb = new Tone.Freeverb({ roomSize: 0.96, dampening: 1000 });
    const reverbVolume = new Tone.Volume({ volume: -14 }).toDestination();
    reverb.connect(reverbVolume);
    lowCutEQ.fan(reverb, Tone.getDestination());
    synths.forEach((synth) => {
      synth.connect(lowCutEQ);
    });
    return synths;
  };

  const makeGrid = (notes) => {
    const rows = [];
    notes.forEach((note) => {
      const row = [];
      for (let i = 0; i < 8; i++) {
        row.push({
          note,
          isActive: false,
        });
      }
      rows.push(row);
    });
    return rows;
  };

  let synths = [];
  let notes = [];
  let grid = [];
  let beat = 0;
  let playing = false;
  let started = false;

  const configLoop = () => {
    const repeat = (time) => {
      grid.forEach((row, index) => {
        const synth = synths[index];
        const note = row[beat];
        if (note.isActive) {
          synth.triggerAttackRelease(note.note, '8n', time);
        }
      });
      beat = (beat + 1) % 8;
    };
    Tone.Transport.bpm.value = 30;
    Tone.Transport.scheduleRepeat(repeat, '8n');
  };

  const changeGridItem = (desiredRowIndex, desiredNoteIndex) => {
    grid.forEach((row, rowIndex) => {
      row.forEach((note, noteIndex) => {
        if (parseInt(desiredRowIndex, 10) === rowIndex && parseInt(desiredNoteIndex, 10) === noteIndex) {
          // eslint-disable-next-line no-param-reassign
          note.isActive = !note.isActive;
        }
      });
    });
  };

  const changeGrid = (string) => {
    const stringArray = string.split('');
    for (let i = 0; i < stringArray.length; i++) {
      // eslint-disable-next-line no-continue
      if (stringArray[i] === '0') { continue; }
      changeGridItem(stringArray[i], i);
    }
  };

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

  const startAudio = () => {
    synths = makeSynths(9);
    notes = ['G3', 'A3', 'C4', 'D4', 'E4', 'G4', 'A4', 'C5', 'D5'];
    grid = makeGrid(notes);
    changeGrid(originalMelodyNotes);
    console.warn(grid);
    if (!started) {
      Tone.start();
      Tone.getDestination().volume.rampTo(-20, 0.001);
      configLoop();
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
    getChordProgressionsDetailed(pk).then(setDetailedProgressions);
  }, []);
  return (
    <>
      <TopNavigation />
      <p key="title">Title: {originalTitle}</p>
      <p key="melodicTheme">Melodic theme: {originalMelodyNotes}</p>
      <p key="melodicTexture">Melodic texture: {originalMelodyTexture}</p>
      <p key="chordProgression">Chord progressions: {originalProgressions}</p>
      <p key="chordTexture">Chord texture: {originalChordTexture}</p>
      <p key="chordFilepaths">Chord filepaths:</p>
      {detailedProgressions.map((progression) => (
        <div key={`block${progression.chordProgression.name}`}>
          <p key={`header${progression.chordProgression.name}`}>- {progression.chordProgression.name}</p>
          <p key={`${progression.chordProgression.name}first`}>- - {progression.chordProgression.firstChord[namingConventionArray[originalChordTexture]]}</p>
          <p key={`${progression.chordProgression.name}second`}>- - {progression.chordProgression.secondChord[namingConventionArray[originalChordTexture]]}</p>
          <p key={`${progression.chordProgression.name}third`}>- - {progression.chordProgression.thirdChord[namingConventionArray[originalChordTexture]]}</p>
          <p key={`${progression.chordProgression.name}fourth`}>- - {progression.chordProgression.fourthChord[namingConventionArray[originalChordTexture]]}</p>
        </div>
      ))}
      <div key="buttonBox" className="soundscapeBox4">
        <Link href={`/soundscape/${router.query.data}`} passHref>
          <button key="returnButton" type="button" className="soundButton">Return</button>
        </Link>
        <button key="playButton" type="button" className="soundButton" onClick={() => startAudio()}>Start/Stop</button>
      </div>
    </>
  );
}
