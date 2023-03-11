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
      // originalProgressions = soundscapeStringArray[5].split('');
      // originalProgressions = originalProgressions.map((x) => parseInt(x, 10));
      console.warn(originalProgressions);
    }
  }

  // const scrubMelody = () => {
  //   let convertedSelected = formInput.melodyNotes;
  //   convertedSelected = convertedSelected.toString();
  //   convertedSelected = convertedSelected.replaceAll(',', '');
  //   setFormInput((prevState) => ({
  //     ...prevState,
  //     melodyNotes: convertedSelected,
  //   }));
  // };

  const handleChange = (e) => {
    console.warn('changed handled');
    const { name, value } = e.target;
    setFormInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (router.query.data !== 'new') {
      updateSoundscape(pk, formInput).then(() => router.push('/'));
    } else {
      const payload = { ...formInput, user: user.uid };
      createSoundscape(payload).then(() => router.push('/'));
      console.warn(payload);
    }
  };

  const getChordProgressionsDrillable = () => {
    getChordProgressions(pk).then((response) => {
      originalProgressions = response.map((element) => element.chordProgression);
      console.warn(originalProgressions);
    });
  };

  const alertParentOfSelection = (tile) => {
    const columnContent = selected.map((element) => element[0]);
    if (selected.includes(tile)) {
      const oldSelected = selected;
      oldSelected.splice(selected.indexOf(tile), 1);
      setSelected(oldSelected);
      setDummy(!dummy);
    } else if (columnContent.includes(tile[0])) {
      const oldSelected = selected;
      oldSelected.splice(columnContent.indexOf(tile[0]), 1);
      oldSelected.push(tile);
      setSelected(oldSelected);
      setDummy(!dummy);
    } else if (selected.length < 5) {
      const oldSelected = selected;
      oldSelected.push(tile);
      setSelected(oldSelected);
      setDummy(!dummy);
    } else {
      const oldSelected = selected;
      oldSelected.push(tile);
      oldSelected.shift();
      setSelected(oldSelected);
      setDummy(!dummy);
    }
    let convertedSelected = [0, 0, 0, 0, 0, 0, 0, 0];
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
    });
    convertedSelected = convertedSelected.toString();
    convertedSelected = convertedSelected.replaceAll(',', '');
    setFormInput((prevState) => ({
      ...prevState,
      melodyNotes: convertedSelected,
    }));
    console.warn(formInput.melodyNotes);
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
      setSelected(oldSelected);
      setFormInput((prevState) => ({
        ...prevState,
        melodyNotes: originalMelodyNotes,
        melodyTexture: originalMelodyTexture,
        chordTexture: originalChordTexture,
        title: originalTitle,
      }));
      if (!soundscapeStringArray[5] && router.query.data !== 'new') {
        getChordProgressionsDrillable();
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
              <option value="1">Ocarina</option>
              <option value="2">Rhodes</option>
              <option value="3">Impulse</option>
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
                <input className="checkboxInput" type="checkbox" id="easygoing" name="easygoing" checked />
              </div>
              <div className="checkboxItem">
                <label htmlFor="scales">Nocturnal</label>
                <input className="checkboxInput" type="checkbox" id="nocturnal" name="nocturnal" checked />
              </div>
              <div className="checkboxItem">
                <label htmlFor="scales">Earnest</label>
                <input className="checkboxInput" type="checkbox" id="earnest" name="earnest" checked />
              </div>
              <div className="checkboxItem">
                <label htmlFor="scales">Hopeful</label>
                <input className="checkboxInput" type="checkbox" id="hopeful" name="hopeful" checked />
              </div>
            </div>
            <div className="checkboxColumn">
              <div className="checkboxItem">
                <label htmlFor="scales">Circular</label>
                <input className="checkboxInput" type="checkbox" id="circular" name="circular" checked />
              </div>
              <div className="checkboxItem">
                <label htmlFor="scales">Bittersweet</label>
                <input className="checkboxInput" type="checkbox" id="bittersweet" name="bittersweet" checked />
              </div>
              <div className="checkboxItem">
                <label htmlFor="scales">Foggy</label>
                <input className="checkboxInput" type="checkbox" id="foggy" name="foggy" checked />
              </div>
              <div className="checkboxItem">
                <label htmlFor="scales">Desolate</label>
                <input className="checkboxInput" type="checkbox" id="desolate" name="desolate" checked />
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
              <option value="1">Air chords</option>
              <option value="2">Digital rain</option>
              <option value="3">Gentle chimes</option>
            </select>
          </div>
        </div>
        <div className="soundscapeBox2">
          <div className="parameterLabelBox">
            Name your soundscape:
          </div>
          <div className="selectBox">
            <form>
              <input name="title" onChange={handleChange} className="inputClass" type="text" maxLength="18" placeholder="Enter a name..." value={formInput.title} />
            </form>
          </div>
        </div>
        <div className="soundscapeBox4">
          <Link href="/" passHref>
            <button type="button" className="soundButton">Return</button>
          </Link>
          <button type="submit" className="soundButton">Save</button>
          <Link href="/listen/1" passHref>
            <button type="button" className="soundButton">Listen</button>
          </Link>
        </div>
      </form>
    </>
  );
}
