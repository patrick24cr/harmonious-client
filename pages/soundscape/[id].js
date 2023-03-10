// import { signOut } from '../utils/auth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
// import { useAuth } from '../../utils/context/authContext';
// import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
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
      <Card bg="dark" style={{ width: '40rem', margin: '10px' }}>
        <div className="cardBuffer">
          <Card.Title>Test1</Card.Title>
          <div className="bandButtons">
            {/* <Link href="/soundscape/" passHref>
              <Button variant="outline-light" className="m-2">Load</Button>
            </Link> */}
          </div>
        </div>
        <GridInteractable selected={selected} setSelected={setSelected} />
      </Card>
      <BottomParameters selected={selected} />
    </div>
  );
}
