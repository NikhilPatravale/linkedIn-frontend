import Button from "../../../authentication/components/Button/Button";
import classes from "./RightSideBar.module.scss";

function RightSideBar() {
  return (
    <div className={classes.root}>
      <h3>Add to your feed</h3>
      <div className={classes.items}>
        <div className={classes.item}>
          <img className={classes.avatar} src="/avatar.png" alt="" />
          <div className={classes.info}>
            <div className={classes.name}>Nikhil Patravale</div>
            <div className={classes.position}>SWE at Google</div>
            <Button
              className={classes.follow}
              type="button"
              size="md"
              outline
            >
              + Follow
            </Button>
          </div>
        </div>

        <div className={classes.item}>
          <img className={classes.avatar} src="/avatar.png" alt="" />
          <div className={classes.info}>
            <div className={classes.name}>Nikhil Patravale</div>
            <div className={classes.position}>SWE at Google</div>
            <Button
              className={classes.follow}
              type="button"
              size="md"
              outline
            >
              + Follow
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RightSideBar;