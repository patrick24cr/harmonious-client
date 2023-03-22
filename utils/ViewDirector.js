import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useAuth } from './context/authContext';
import Loading from '../components/Loading';
import Signin2 from '../components/Signin2';
// import { registerUser } from './auth';
import RegisterForm from '../components/RegisterForm';
// import NavBar from '../components/NavBar';

const ViewDirectorBasedOnUserAuthStatus = ({ component: Component, pageProps }) => {
  const { user, userLoading, updateUser } = useAuth();
  const [value, setValue] = useState(false); // boolean state
  // const useForceUpdate = () => setValue(!value); // update state to force render

  useEffect(() => {
    setValue(!value);
  }, [user]);

  // if user state is null, then show loader
  if (userLoading) {
    return <Loading />;
  }

  // what the user should see if they are logged in
  if (user) {
    return (
      <>
        <div className="container">{'valid' in user ? <RegisterForm user={user} updateUser={updateUser} onUpdate={updateUser} /> : <Component {...pageProps} />}</div>
      </>
    );
  }

  return <div className="container"> <Signin2 /> </div>;
};

export default ViewDirectorBasedOnUserAuthStatus;

ViewDirectorBasedOnUserAuthStatus.propTypes = {
  component: PropTypes.func.isRequired,
  pageProps: PropTypes.oneOfType([PropTypes.object]).isRequired,
};
