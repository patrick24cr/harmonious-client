import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useAuth } from './context/authContext';
import Loading from '../components/Loading';
import Signin from '../components/Signin';
// import { registerUser } from './auth';
import RegisterForm from '../components/RegisterForm';
// import NavBar from '../components/NavBar';

const ViewDirectorBasedOnUserAuthStatus = ({ component: Component, pageProps }) => {
  const { user, userLoading, updateUser } = useAuth();
  const [value, setValue] = useState(false); // boolean state
  const useForceUpdate = () => setValue(!value); // update state to force render

  useEffect(() => {
    if (value) {
      updateUser(user);
      console.warn('value changed');
      console.warn(user);
    }
  }, [value]);

  // if user state is null, then show loader
  if (userLoading) {
    return <Loading />;
  }

  // what the user should see if they are logged in
  if (user) {
    return (
      <>
        <div className="container">{'valid' in user ? <RegisterForm user={user} updateUser={updateUser} onUpdate={useForceUpdate} /> : <Component {...pageProps} />}</div>
      </>
    );
  }

  return <Signin />;
};

export default ViewDirectorBasedOnUserAuthStatus;

ViewDirectorBasedOnUserAuthStatus.propTypes = {
  component: PropTypes.func.isRequired,
  pageProps: PropTypes.oneOfType([PropTypes.object]).isRequired,
};
