import { useEffect, useState } from "react";
import classes from "./Time.module.scss";
import time from "../../../../utils/time";

function Time({ creationTime, isEdited }: { creationTime: string, isEdited: boolean }) {
  const [updatedTime, setUpdatedTime] = useState(time(creationTime));

  useEffect(() => {
    const interval = setInterval(() => {
      const updatedValue = time(creationTime);
      setUpdatedTime(updatedValue);
    }, 10000);

    return () => clearInterval(interval);
  }, [creationTime]);

  return (
    <div className={classes.root}>{updatedTime} {isEdited ? 'Edited..' : ''}</div>
  );
}

export default Time;