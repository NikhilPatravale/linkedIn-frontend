import { Fragment } from "react/jsx-runtime";
import classes from "./ResetPassword.module.scss";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import Box from "../../components/Box/Box";
import { useNavigate } from "react-router-dom";
import { FormEvent, useState } from "react";
import request from "../../../../utils/api";
import { PUT } from "../../constants/apiConstants";

function ResetPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const sendPasswordResetRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const email = event.currentTarget.email.value;

    await request<String>({
      endPoint: `/api/v1/authentication/send-password-reset-token?email=${email}`,
      httpMethod: PUT,
      onSuccess: () => {
        setIsSubmitted(true);
        setEmail(email);
      },
      onFailure: (error) => setErrorMessage(error),
    });
    setLoading(false);
  };

  const resetPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const code = event.currentTarget.verficationCode?.value;
    const newPassword = event.currentTarget.newPassword?.value;

    await request<String>({
      endPoint: "/api/v1/authentication/reset-password",
      httpMethod: PUT,
      body: JSON.stringify({
        email,
        token: code,
        newPassword,
      }),
      onSuccess: () => navigate("/authentication/login"),
      onFailure: (error) => setErrorMessage(error),
    });

    setLoading(false);
  };

  const clearError = () => {
    if (errorMessage) setErrorMessage("");
    return;
  };

  return (
    <div className={classes.root}>
      <Box>
        <Fragment>
          <h1>Reset Password</h1>
          {isSubmitted
            ?
            <Fragment>
              <p>Enter the verification code we sent to your email and your new password</p>
              <form onSubmit={resetPassword}>
                <Input key="verficationCode" type="input" name="verficationCode" id="verificationCode" onFocus={clearError} label="Verification code" />
                <Input key="newPassword" type="password" name="newPassword" id="newPassword" onFocus={clearError} label="New Password" />
                {errorMessage ? <p className={classes.errorMessage}>{errorMessage}</p> : null}
                <Button outline={false} type="submit" disabled={loading}>
                  {loading ? '...' : 'Reset Password'}
                </Button>
                <Button outline={true} onClick={() => {
                  setIsSubmitted(false);
                  clearError();
                }}
                disabled={loading}>
                                    Back
                </Button>
              </form>
            </Fragment>
            :
            <Fragment>
              <p>Enter your email and we'll send a verification code if it matches an existing LinkedIn account</p>
              <form onSubmit={sendPasswordResetRequest}>
                <Input key="email" type="email" name="email" id="email" label="Email" />
                {errorMessage ? <p className={classes.errorMessage}>{errorMessage}</p> : null}
                <Button outline={false} type="submit" disabled={loading}>
                  {loading ? '...' : 'Next'}
                </Button>
                <Button outline={true} type="button" onClick={() => navigate("/login")} disabled={loading}>
                                    Back
                </Button>
              </form>
            </Fragment>
          }
        </Fragment>
      </Box>
    </div>
  );
}

export default ResetPassword;