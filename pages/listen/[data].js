import { useRouter } from 'next/router';
import Link from 'next/link';
import TopNavigation from '../../components/TopNavigation';

export default function Listen() {
  const router = useRouter();

  const soundscapeStringArray = router.query.data.split('--');
  // eslint-disable-next-line prefer-destructuring
  const originalTitle = soundscapeStringArray[0];
  const originalMelodyNotes = soundscapeStringArray[1];
  const originalMelodyTexture = parseInt(soundscapeStringArray[2], 10);
  const originalChordTexture = parseInt(soundscapeStringArray[3], 10);
  // const pk = parseInt(soundscapeStringArray[4], 10);
  const originalProgressions = soundscapeStringArray[5];
  return (
    <>
      <TopNavigation />
      <p>Title: {originalTitle}</p>
      <p>Melodic theme: {originalMelodyNotes}</p>
      <p>Melodic texture: {originalMelodyTexture}</p>
      <p>Chord progressions: {originalProgressions}</p>
      <p>Chord texture: {originalChordTexture}</p>
      <div className="soundscapeBox4">
        <Link href={`/soundscape/${router.query.data}`} passHref>
          <button type="button" className="soundButton">Return</button>
        </Link>
      </div>
    </>
  );
}
