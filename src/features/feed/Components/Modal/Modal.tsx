import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import Button from "../../../authentication/components/Button/Button";
import Input from "../../../authentication/components/Input/Input";
import classes from "./Modal.module.scss";

interface ModalProps {
  showModal: boolean,
  title: String,
  setShowModal: Dispatch<SetStateAction<boolean>>
  onSubmit: Function
  content?: string,
  pictureUrl?: string
  postId?: number
}

function Modal({ showModal = true, title, setShowModal, onSubmit, content, pictureUrl, postId }: ModalProps) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [postContent, setPostContent] = useState(content || "");
  const [postPictureUrl, setPostPictureUrl] = useState(pictureUrl || "");
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const content = e.currentTarget.postContent.value;
    const picture = e.currentTarget.picture.value;

    if (content === '') {
      setError("Contnet can't be empty");
      setLoading(false);
      return;
    }

    try {
      onSubmit({
        postId,
        content,
        picture
      });
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!showModal) return null;

  return (
    <div className={classes.root}>
      <div className={classes.postModal}>
        <div className={classes.modelTopSection}>
          <h3 className={classes.title}>{title}</h3>
          <button className={classes.modalCloseButton} onClick={() => {
            setError("");
            setShowModal(false);
          }}>x</button>
        </div>
        <form onSubmit={handleSubmit} className={classes.modalForm}>
          <textarea
            className={classes.contentBox}
            onFocus={() => setError("")}
            placeholder="Your post content..."
            name="postContent"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
          />
          <Input
            inputSize={"md"}
            placeholder="Image URL (optional)"
            name="picture"
            required={false}
            value={postPictureUrl}
            onChange={(e) => setPostPictureUrl(e.target.value)}
          />
          {error && <span className={classes.error}>{error}</span>}
          <Button outline={false} type="submit" disabled={loading} >Post</Button>
        </form>
      </div>
    </div>
  );
}

export default Modal;