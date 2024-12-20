import { Fragment } from 'react/jsx-runtime';
import Box from '../../components/Box/Box';
import Input from '../../components/Input/Input';
import Layout from '../../components/Layout/Layout';
import classes from './Login.module.scss';
import Button from '../../components/Button/Button';
import Seperator from '../../components/Seperator/Seperator';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FormEvent, useState } from 'react';
import { useAuthentication } from '../../context/AuthenticationContextProvider';

function Login() {
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuthentication();
    const location = useLocation();
    const navigate = useNavigate();

    const doLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const email = e.currentTarget.email.value;
        const password = e.currentTarget.password.value;

        try {
            await login(email, password);
            const destination = location.state?.from || "/";
            navigate(destination);
        } catch(e) {
            if (e instanceof Error) {
                setErrorMessage(e.message);
            } else {
                setErrorMessage("An unknown error occured");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Layout className={classes.root}>
            <Box>
                <Fragment>
                    <h1>Sign in</h1>
                    <form onSubmit={doLogin}>
                        <Input key="email" type="email" name="email" id="email" label="Email" onFocus={() => setErrorMessage("")} />
                        <Input key="password" type="password" name="password" id="password" label="Password" />
                        {errorMessage ? <p className={classes.errorMessage}>{errorMessage}</p> : null}
                        <Button type="submit" outline={false} disabled={isLoading}>
                            {`${isLoading ? '...' : 'Sign In'}`}
                        </Button>
                    </form>
                    <Link to="/request-password-reset">Forgot Password?</Link>
                    <Seperator>Or</Seperator>
                    <div className={classes.login}>
                        New to LinkedIn? <Link to="/signup">Join now</Link>
                    </div>
                </Fragment>
            </Box>
        </Layout>
    );
}

export default Login;