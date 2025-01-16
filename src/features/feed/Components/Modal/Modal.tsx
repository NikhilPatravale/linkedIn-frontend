import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import Button from "../../../authentication/components/Button/Button";
import Input from "../../../authentication/components/Input/Input";
import classes from "./Modal.module.scss";
import fetchClient from "../../../../utils/fetchClient";
import { POST } from "../../../authentication/constants/apiConstants";

interface ModalProps {
  showModal: boolean,
  title: String,
  setShowModal: Dispatch<SetStateAction<boolean>>
}

function Modal({ showModal = true, title, setShowModal }: ModalProps) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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
      const resp = await fetchClient({
        url: import.meta.env.VITE_API_URL + "/api/v1/feed/posts",
        httpMethod: POST,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          content,
          picture,
        })
      });

      if (resp.ok) {
        setShowModal(false);
      }
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
            name="postContent" ></textarea>
          <Input inputSize={"md"} placeholder="Image URL (optional)" name="picture" required={false} />
          {error && <span className={classes.error}>{error}</span>}
          <Button outline={false} type="submit" disabled={loading} >Post</Button>
        </form>
      </div>
    </div>
  );
}

export default Modal;