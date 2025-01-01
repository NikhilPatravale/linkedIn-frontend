import { Fragment } from 'react/jsx-runtime';
import Box from '../../components/Box/Box';
import Input from '../../components/Input/Input';
import classes from './Login.module.scss';
import Button from '../../components/Button/Button';
import Seperator from '../../components/Seperator/Seperator';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FormEvent, useCallback, useState } from 'react';
import { useAuthentication } from '../../context/AuthenticationContextProvider';

function Login() {
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const context = useAuthentication();
  const location = useLocation();
  const navigate = useNavigate();

  const doLogin = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const email = e.currentTarget.email.value;
    const password = e.currentTarget.password.value;

    try {
      if (context) {
        const { login } = context;
        await login(email, password);
        const destination = location.state?.from || "/";
        navigate(destination);
      }
    } catch(e) {
      if (e instanceof Error) {
        setErrorMessage(e.message);
      } else {
        setErrorMessage("An unknown error occured");
      }
    } finally {
      setIsLoading(false);
    }
  }, [context, navigate, location]);

  return (
    <div className={classes.root}>
      <Box>
        <Fragment>
          <h1>Sign in</h1>
          <p>Stay updated on your professional world.</p>
          <form onSubmit={doLogin}>
            <Input floatingInput key="email" type="text" name="email" id="email" label="Email or Phone" onFocus={() => setErrorMessage("")} />
            <Input floatingInput key="password" type="password" name="password" id="password" label="Password" />
            {errorMessage ? <p className={classes.errorMessage}>{errorMessage}</p> : null}
            <Link to="/authentication/request-password-reset">Forgot Password?</Link>
            <Button type="submit" outline={false} disabled={isLoading}>
              {`${isLoading ? '...' : 'Sign In'}`}
            </Button>
          </form>
          <Seperator>Or</Seperator>
          <div className={classes.login}>
                        New to LinkedIn? <Link to="/authentication/signup">Join now</Link>
          </div>
        </Fragment>
      </Box>
    </div>
  );
}

export default Login;