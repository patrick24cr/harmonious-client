// import { signOut } from '../utils/auth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
// import { useAuth } from '../../utils/context/authContext';
// import Button from 'react-bootstrap/Button';
// import Card from 'react-bootstrap/Card';
// import Link from 'next/link';
import TopNavigation from '../../components/TopNavigation';
import GridInteractable from '../../components/GridInteractable';
import BottomParameters from '../../components/BottomParameters';

export default function Home() {
  // const { user } = useAuth();
  const [selected, setSelected] = useState('initial');
  const router = useRouter();
  // const { soundscapeId } = router.query;
  useEffect(() => {
    console.warn(router.query);
  });

  return (
    <div className="container1">
      <TopNavigation />
      <div className="soundscapeBox1">
        <div className="parameterLabelBox">
          Design the melodic theme:
        </div>
        <div className="selectBox">
          <GridInteractable selected={selected} setSelected={setSelected} />
        </div>
      </div>
      <div className="soundscapeBox2">
        <div className="parameterLabelBox">
          Choose the melodic texture:
        </div>
        <div className="selectBox">
          <select className="pulldownClass" name="melodyTextures" id="melodyTextures">
            <option value="1">Digital Flute</option>
            <option value="2">Cheap Piano</option>
            <option value="3">Not sure</option>
          </select>
        </div>
      </div>
      <div className="soundscapeBox2">
        <div className="parameterLabelBox">
          Choose the harmonic texture:
        </div>
        <div className="selectBox">
          <select className="pulldownClass" name="melodyTextures" id="melodyTextures">
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
            <input className="inputClass" type="text" maxLength="18" placeholder="Enter a name..." />
          </form>
        </div>
      </div>
      <BottomParameters selected={selected} />
    </div>
  );
}
