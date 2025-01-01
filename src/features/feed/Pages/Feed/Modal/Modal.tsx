import Button from "../../../../authentication/components/Button/Button";
import classes from "./Modal.module.scss";

function Modal() {
  return (
    <div className={classes.root}>
      <div className={classes.postModal}>
        <h3>Create a post</h3>
        <textarea className={classes.contentBox}></textarea>
        <input className={classes.urlBox} type="text"></input>
        <Button outline={false} type="button" >Post</Button>
      </div>
    </div>
  );
}

export default Modal;