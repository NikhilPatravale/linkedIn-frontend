import { useState } from 'react';
import Box from '../../components/Box/Box';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import classes from "./Profile.module.scss";
import request from '../../../../utils/api';
import { PUT } from '../../constants/apiConstants';
import { useAuthentication } from '../../context/AuthenticationContextProvider';
import { useNavigate } from 'react-router-dom';
import { User } from '../../context/TypeInterfaces';

function Profile() {
  const [profileState, setProfileState] = useState({
    firstName: "",
    lastName: "",
    company: "",
    position: "",
    location: "",
  });
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, setUser } = useAuthentication() || {};
  const navigate = useNavigate();

  const updateProfile = async () => {
    const { firstName, lastName, company, position, location } = profileState;
    
    if (!firstName || !lastName) {
      setError("First and Last name can not be empty");
      return;
    }

    if (!company || !position) {
      setError("Company details can not be empty");
      return;
    }

    if(!location) {
      setError("Location can not be empty");
      return;
    }

    setLoading(true);

    await request<User>({
      endPoint: `/api/v1/authentication/profile/${user?.id}`,
      httpMethod: PUT,
      body: JSON.stringify({
        firstName,
        lastName,
        company,
        position,
        location,
      }),
      onSuccess: (data) => {
        if(setUser) setUser(data);
        navigate("/");
      },
      onFailure: (error) => setError(error),
    });
    
    setLoading(false);
  };

  return (
    <div className={classes.root}>
      <Box>
        <>
          <div className={classes.title}>You Are Just Few Steps Away From Exciting Journey</div>
          {step === 0 && <div className={classes.step}>
            <div className={classes.stepTitle}>Enter Your Name</div>
            <Input type="text" inputSize={"md"} placeholder="Nikhil" onFocus={() => setError("")} onChange={(e) => setProfileState(prev => ({
              ...prev,
              firstName: e.target.value,
            }))} />
            <Input type="text" inputSize={"md"} placeholder="Patravale" onFocus={() => setError("")} onChange={(e) => setProfileState(prev => ({
              ...prev,
              lastName: e.target.value,
            }))} />
          </div>}
          {step === 1 && <div className={classes.step}>
            <div className={classes.stepTitle}>Enter Your Company Details</div>
            <Input type="text" inputSize="md" placeholder="American Express" onFocus={() => setError("")} onChange={(e) => setProfileState(prev => ({
              ...prev,
              company: e.target.value,
            }))} />
            <Input type="text" inputSize="md" placeholder="Software Engineer" onFocus={() => setError("")} onChange={(e) => setProfileState(prev => ({
              ...prev,
              position: e.target.value,
            }))} />
          </div>}
          {step === 2 && <div className={classes.step}>
            <div className={classes.stepTitle}>Please enter your work location</div>
            <Input type="text" inputSize="md" placeholder="New York, United States" onFocus={() => setError("")} onChange={(e) => setProfileState(prev => ({
              ...prev,
              location: e.target.value,
            }))} />
          </div>}
          {error && <div className={classes.error}>{error}</div>}
          <div className={`${step > 0 ? classes.buttons : ''}`}>
            {step > 0 && <Button
              type="button"
              outline
              onClick={() => setStep(prev => prev - 1)}
            >Back</Button>}
            {step < 2 && <Button
              type="button"
              outline={false}
              onClick={() => setStep(prev => prev + 1)}
            >Next</Button>}
            {step === 2 && <Button
              type="button"
              outline={false}
              onClick={updateProfile}
            >
              {loading ? '...' : 'Submit'}</Button>}
          </div>
        </>
      </Box>
    </div>
  );
}

export default Profile;