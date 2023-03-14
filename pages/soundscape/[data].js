/* eslint-disable prefer-destructuring */
// import { signOut } from '../utils/auth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
// import { useAuth } from '../../utils/context/authContext';
// import Button from 'react-bootstrap/Button';
// import Card from 'react-bootstrap/Card';
import Link from 'next/link';
import { useAuth } from '../../utils/context/authContext';
import TopNavigation from '../../components/TopNavigation';
import GridInteractable from '../../components/GridInteractable';
import { createSoundscape, updateSoundscape, getChordProgressions } from '../../api/soundscapes';

const initialState = {
  melodyNotes: '',
  melodyTexture: 1,
  chordTexture: 1,
  title: '',
  easygoing: false,
  nocturnal: false,
  earnest: false,
  hopeful: false,
  circular: false,
  bittersweet: false,
  foggy: false,
  desolate: false,
};

export default function Soundscape() {
  const { user } = useAuth();
  const [formInput, setFormInput] = useState(initialState);
  const [selected, setSelected] = useState([]);
  const [dummy, setDummy] = useState(true);
  const router = useRouter();
  // const [progressions, setProgressions] = useState();
  let soundscapeStringArray = [];
  let originalTitle = '';
  let originalMelodyNotes = '';
  let originalMelodyTexture = '';
  let originalChordTexture = '';
  let pk = '';
  let originalProgressions = '';

  if (router.query.data !== 'new') {
    soundscapeStringArray = router.query.data.split('--');
    // eslint-disable-next-line prefer-destructuring
    originalTitle = soundscapeStringArray[0];
    originalMelodyNotes = soundscapeStringArray[1];
    // originalMelodyNotes = soundscapeStringArray[1].split('');
    // originalMelodyNotes = originalMelodyNotes.map((x) => parseInt(x, 10));
    originalMelodyTexture = parseInt(soundscapeStringArray[2], 10);
    originalChordTexture = parseInt(soundscapeStringArray[3], 10);
    pk = parseInt(soundscapeStringArray[4], 10);
    if (soundscapeStringArray[5]) {
      originalProgressions = soundscapeStringArray[5];
    }
  }

  const stringifyProgression = () => {
    let progressionString = '';
    if (formInput.easygoing) {
      progressionString += '1';
    }
    if (formInput.nocturnal) {
      progressionString += '2';
    }
    if (formInput.earnest) {
      progressionString += '3';
    }
    if (formInput.hopeful) {
      progressionString += '4';
    }
    if (formInput.circular) {
      progressionString += '5';
    }
    if (formInput.bittersweet) {
      progressionString += '6';
    }
    if (formInput.foggy) {
      progressionString += '7';
    }
    if (formInput.desolate) {
      progressionString += '8';
    }
    return progressionString;
  };

  const checkNumberOfProgressions = () => {
    if (stringifyProgression().length !== 3) {
      alert('You must select exactly three harmonic progressions.');
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    // const { name, value } = e.target;
    const { name } = e.target;
    let { value } = e.target;
    if (name === 'easygoing') {
      value = !formInput.easygoing;
    }
    if (name === 'nocturnal') {
      value = !formInput.nocturnal;
    }
    if (name === 'earnest') {
      value = !formInput.earnest;
    }
    if (name === 'hopeful') {
      value = !formInput.hopeful;
    }
    if (name === 'circular') {
      value = !formInput.circular;
    }
    if (name === 'bittersweet') {
      value = !formInput.bittersweet;
    }
    if (name === 'foggy') {
      value = !formInput.foggy;
    }
    if (name === 'desolate') {
      value = !formInput.desolate;
    }
    setFormInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (checkNumberOfProgressions()) {
      if (router.query.data !== 'new') {
        updateSoundscape(pk, formInput, stringifyProgression()).then(() => router.push('/'));
      } else {
        const payload = { ...formInput, user: user.uid };
        createSoundscape(payload, stringifyProgression()).then(() => router.push('/'));
      }
    }
  };

  const getChordProgressionsDrillable = () => {
    getChordProgressions(pk).then((response) => {
      originalProgressions = response.map((element) => element.chordProgression);
      originalProgressions = originalProgressions.toString();
      originalProgressions = originalProgressions.replaceAll(',', '');
      setFormInput((prevState) => ({
        ...prevState,
        melodyNotes: originalMelodyNotes,
        melodyTexture: originalMelodyTexture,
        chordTexture: originalChordTexture,
        title: originalTitle,
        easygoing: originalProgressions.includes('1'),
        nocturnal: originalProgressions.includes('2'),
        earnest: originalProgressions.includes('3'),
        hopeful: originalProgressions.includes('4'),
        circular: originalProgressions.includes('5'),
        bittersweet: originalProgressions.includes('6'),
        foggy: originalProgressions.includes('7'),
        desolate: originalProgressions.includes('8'),
      }));
    });
  };

  const alertParentOfSelection = (tile) => {
    const columnContent = selected.map((element) => element[0]);
    if (selected.includes(tile)) {
      // if clicked tile is already selected
      const oldSelected = selected;
      oldSelected.splice(selected.indexOf(tile), 1);
      setSelected(oldSelected);
      setDummy(!dummy);
    } else if (columnContent.includes(tile[0])) {
      // if clicked tile is in the same column as another previously selected tile
      const oldSelected = selected;
      oldSelected.splice(columnContent.indexOf(tile[0]), 1);
      oldSelected.push(tile);
      setSelected(oldSelected);
      setDummy(!dummy);
    } else if (selected.length < 10) {
      // if the above two conditions are not true and there's still less than X selected
      const oldSelected = selected;
      oldSelected.push(tile);
      setSelected(oldSelected);
      setDummy(!dummy);
    } else {
      // if there are already X number of tiles selected
      const oldSelected = selected;
      oldSelected.push(tile);
      oldSelected.shift();
      setSelected(oldSelected);
      setDummy(!dummy);
    }
    let convertedSelected = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    selected.forEach((element) => {
      if (element[0] === 'a') {
        convertedSelected[0] = parseInt(element[1], 10);
      }
      if (element[0] === 'b') {
        convertedSelected[1] = parseInt(element[1], 10);
      }
      if (element[0] === 'c') {
        convertedSelected[2] = parseInt(element[1], 10);
      }
      if (element[0] === 'd') {
        convertedSelected[3] = parseInt(element[1], 10);
      }
      if (element[0] === 'e') {
        convertedSelected[4] = parseInt(element[1], 10);
      }
      if (element[0] === 'f') {
        convertedSelected[5] = parseInt(element[1], 10);
      }
      if (element[0] === 'g') {
        convertedSelected[6] = parseInt(element[1], 10);
      }
      if (element[0] === 'h') {
        convertedSelected[7] = parseInt(element[1], 10);
      }
      if (element[0] === 'i') {
        convertedSelected[8] = parseInt(element[1], 10);
      }
      if (element[0] === 'j') {
        convertedSelected[9] = parseInt(element[1], 10);
      }
      if (element[0] === 'k') {
        convertedSelected[10] = parseInt(element[1], 10);
      }
      if (element[0] === 'l') {
        convertedSelected[11] = parseInt(element[1], 10);
      }
      if (element[0] === 'm') {
        convertedSelected[12] = parseInt(element[1], 10);
      }
      if (element[0] === 'n') {
        convertedSelected[13] = parseInt(element[1], 10);
      }
      if (element[0] === 'o') {
        convertedSelected[14] = parseInt(element[1], 10);
      }
      if (element[0] === 'p') {
        convertedSelected[15] = parseInt(element[1], 10);
      }
    });
    convertedSelected = convertedSelected.toString();
    convertedSelected = convertedSelected.replaceAll(',', '');
    setFormInput((prevState) => ({
      ...prevState,
      melodyNotes: convertedSelected,
    }));
  };

  useEffect(() => {
    if (originalMelodyNotes) {
      const oldSelected = [];
      if (originalMelodyNotes[0] > 0) {
        oldSelected.push(`a${originalMelodyNotes[0]}`);
      }
      if (originalMelodyNotes[1] > 0) {
        oldSelected.push(`b${originalMelodyNotes[1]}`);
      }
      if (originalMelodyNotes[2] > 0) {
        oldSelected.push(`c${originalMelodyNotes[2]}`);
      }
      if (originalMelodyNotes[3] > 0) {
        oldSelected.push(`d${originalMelodyNotes[3]}`);
      }
      if (originalMelodyNotes[4] > 0) {
        oldSelected.push(`e${originalMelodyNotes[4]}`);
      }
      if (originalMelodyNotes[5] > 0) {
        oldSelected.push(`f${originalMelodyNotes[5]}`);
      }
      if (originalMelodyNotes[6] > 0) {
        oldSelected.push(`g${originalMelodyNotes[6]}`);
      }
      if (originalMelodyNotes[7] > 0) {
        oldSelected.push(`h${originalMelodyNotes[7]}`);
      }
      if (originalMelodyNotes[8] > 0) {
        oldSelected.push(`i${originalMelodyNotes[8]}`);
      }
      if (originalMelodyNotes[9] > 0) {
        oldSelected.push(`j${originalMelodyNotes[9]}`);
      }
      if (originalMelodyNotes[10] > 0) {
        oldSelected.push(`k${originalMelodyNotes[10]}`);
      }
      if (originalMelodyNotes[11] > 0) {
        oldSelected.push(`l${originalMelodyNotes[11]}`);
      }
      if (originalMelodyNotes[12] > 0) {
        oldSelected.push(`m${originalMelodyNotes[12]}`);
      }
      if (originalMelodyNotes[13] > 0) {
        oldSelected.push(`n${originalMelodyNotes[13]}`);
      }
      if (originalMelodyNotes[14] > 0) {
        oldSelected.push(`o${originalMelodyNotes[14]}`);
      }
      if (originalMelodyNotes[15] > 0) {
        oldSelected.push(`p${originalMelodyNotes[15]}`);
      }
      setSelected(oldSelected);
      if (!soundscapeStringArray[5] && router.query.data !== 'new') {
        getChordProgressionsDrillable();
      } else if (soundscapeStringArray[5] && router.query.data !== 'new') {
        setFormInput((prevState) => ({
          ...prevState,
          melodyNotes: originalMelodyNotes,
          melodyTexture: originalMelodyTexture,
          chordTexture: originalChordTexture,
          title: originalTitle,
          easygoing: originalProgressions.includes('1'),
          nocturnal: originalProgressions.includes('2'),
          earnest: originalProgressions.includes('3'),
          hopeful: originalProgressions.includes('4'),
          circular: originalProgressions.includes('5'),
          bittersweet: originalProgressions.includes('6'),
          foggy: originalProgressions.includes('7'),
          desolate: originalProgressions.includes('8'),
        }));
      } else {
        setFormInput((prevState) => ({
          ...prevState,
          melodyNotes: originalMelodyNotes,
          melodyTexture: originalMelodyTexture,
          chordTexture: originalChordTexture,
          title: originalTitle,
        }));
      }
    }
  }, []);

  return (
    <>
      <TopNavigation />
      <div className="soundscapeBox1">
        <div className="parameterLabelBox">
          Design the melodic theme:
        </div>
        <div className="selectBox">
          <GridInteractable selected={selected} alertParent={alertParentOfSelection} />
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="soundscapeBox2">
          <div className="parameterLabelBox">
            Choose the melodic texture:
          </div>
          <div className="selectBox">
            <select className="pulldownClass" name="melodyTexture" id="melodyTexture" onChange={handleChange} value={formInput.melodyTexture}>
              <option value="1">Rain Drops</option>
              <option value="2">Ocarina</option>
              <option value="3">Vertexes</option>
            </select>
          </div>
        </div>
        <div className="soundscapeBox3">
          <div className="parameterLabelBox2">
            Choose three harmonic progressions:
          </div>
          <div className="checkboxContainer">
            <div className="checkboxColumn">
              <div className="checkboxItem">
                <label htmlFor="scales">Easygoing</label>
                <input className="checkboxInput" type="checkbox" id="easygoing" name="easygoing" checked={formInput.easygoing} onChange={handleChange} />
              </div>
              <div className="checkboxItem">
                <label htmlFor="scales">Nocturnal</label>
                <input className="checkboxInput" type="checkbox" id="nocturnal" name="nocturnal" checked={formInput.nocturnal} onChange={handleChange} />
              </div>
              <div className="checkboxItem">
                <label htmlFor="scales">Earnest</label>
                <input className="checkboxInput" type="checkbox" id="earnest" name="earnest" checked={formInput.earnest} onChange={handleChange} />
              </div>
              <div className="checkboxItem">
                <label htmlFor="scales">Hopeful</label>
                <input className="checkboxInput" type="checkbox" id="hopeful" name="hopeful" checked={formInput.hopeful} onChange={handleChange} />
              </div>
            </div>
            <div className="checkboxColumn">
              <div className="checkboxItem">
                <label htmlFor="scales">Circular</label>
                <input className="checkboxInput" type="checkbox" id="circular" name="circular" checked={formInput.circular} onChange={handleChange} />
              </div>
              <div className="checkboxItem">
                <label htmlFor="scales">Bittersweet</label>
                <input className="checkboxInput" type="checkbox" id="bittersweet" name="bittersweet" checked={formInput.bittersweet} onChange={handleChange} />
              </div>
              <div className="checkboxItem">
                <label htmlFor="scales">Foggy</label>
                <input className="checkboxInput" type="checkbox" id="foggy" name="foggy" checked={formInput.foggy} onChange={handleChange} />
              </div>
              <div className="checkboxItem">
                <label htmlFor="scales">Desolate</label>
                <input className="checkboxInput" type="checkbox" id="desolate" name="desolate" checked={formInput.desolate} onChange={handleChange} />
              </div>
            </div>
          </div>
        </div>
        <div className="soundscapeBox2">
          <div className="parameterLabelBox">
            Choose the harmonic texture:
          </div>
          <div className="selectBox">
            <select className="pulldownClass" name="chordTexture" id="chordTexture" onChange={handleChange} value={formInput.chordTexture}>
              <option value="1">Air Chords</option>
              <option value="2">Digital Glass</option>
              <option value="3">Gentle Marimbas</option>
            </select>
          </div>
        </div>
        <div className="soundscapeBox2">
          <div className="parameterLabelBox">
            Name your soundscape:
          </div>
          <div className="selectBox">
            <input name="title" onChange={handleChange} className="inputClass" type="text" maxLength="18" placeholder="Enter a name..." value={formInput.title} />
          </div>
        </div>
        <div className="soundscapeBox4">
          <Link href="/" passHref>
            <button type="button" className="soundButton">Return</button>
          </Link>
          <button type="submit" className="soundButton">Save</button>
          <Link href={checkNumberOfProgressions ? `/listen/${formInput.title}--${formInput.melodyNotes}--${formInput.melodyTexture}--${formInput.chordTexture}--${pk}--${stringifyProgression()}` : ''} passHref>
            <button type="button" className="soundButton">Listen</button>
          </Link>
        </div>
      </form>
    </>
  );
}
