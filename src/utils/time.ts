const time = (postTime: string): string => {
  const updatedPostTime = new Date(postTime);
  const currentTime = new Date();

  const differenceInMiliSec = currentTime.getTime() - updatedPostTime.getTime();
  const differenceInSec = differenceInMiliSec / 1000;

  if (differenceInSec >= 2628000) {
    return `${Number(differenceInSec / 2628000).toFixed(0)} ${differenceInSec / 2628000 > 1 ? 'months' : 'month'}`;
  }

  if (differenceInSec >= 604800) {
    return `${Number(differenceInSec / 604800).toFixed(0)}w`;
  }

  if (differenceInSec >= 86400) {
    return `${Number(differenceInSec / 86400).toFixed(0)}d`;
  }

  if (differenceInSec >= 3600) {
    return `${Number(differenceInSec / 3600).toFixed(0)}h`;
  }

  if (differenceInSec >= 60) {
    return `${Number(differenceInSec / 60).toFixed(0)}m`;
  }

  if (differenceInSec > 0) {
    return `${Number(differenceInSec).toFixed(0)}s`;
  }

  return `moments ago`;

};

export default time;