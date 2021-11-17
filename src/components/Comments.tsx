import React, { FormEvent, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { LoadingIndicator } from "./LoadingIndicator";
import "./Upload.scss";
import { uploadProfilePic } from "../utils/video";
import { auth } from "src/utils/firebase";
import { getComments } from "src/utils";
import backIcon from "../assets/images/icon-back.png";
import { Comment } from "./Comment";
import { Video } from "./Video";
import List from "@material-ui/core/List";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import { ThemeUIStyleObject } from "theme-ui";

declare module "react" {
  interface Attributes {
    sx?: ThemeUIStyleObject;
  }
}
/*
 * Allows selection of a file followed by the option to add a caption before
 * uploading to the canister. Utility functions assist in the data translation.
 */
export function Comments({ user, videoId }) {
  const history = useHistory();
  const [error, setError] = useState("");
  const [comments, setComments] = useState<any>();
  const [creating, setCreating] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [open, setOpen] = React.useState(false);
  const descriptionElementRef = React.useRef<HTMLElement>(null);

  const handleClose = () => {
    setOpen(false);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    getComments(videoId).then((res) => {
      setComments(res);
    });
  }, []);

  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  async function submit(evt: FormEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    setError("");
    setDisabled(true);

    const comment = textAreaRef.current?.value.trim();
    if (comment) {
      setCreating(true);
      // createCollection(auth.currentUser?.uid!, textAreaRef).then(() => {
      //   setCreating(false);
      //   setTimeout(() => {
      //     history.push("/profile");
      //   }, 2000);
      // });
    } else {
      setError("Name not valid");
      setDisabled(false);
    }
  }

  return (
    <main>
      <LoadingIndicator
        loadingMessage="Creating..."
        completedMessage="Created!"
        isLoading={creating}
      />
      <header id="alt-header" style={{ position: "relative", top: "20px" }}>
        <button id="back" onClick={() => history.push("/feed")}>
          <img src={backIcon} alt="Go Back" />
        </button>
      </header>
      <div
        style={
          {
            // overflowY: "scroll",
            // maxHeight: "500px",
            // position: "relative",
            // top: "30px",
            // backgroundColor: 'white'
          }
        }
      >
        <button
          type="submit"
          className="primary medium"
          onClick={handleClickOpen}
          style={{ position: "relative", top: "250px", left: "100px" }}
        >
          View reviews
        </button>

        <Dialog
          open={open}
          onClose={handleClose}
          scroll="body"
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
          style={{ marginTop: "40px" }}
        >
          <DialogTitle id="scroll-dialog-title">Reviews</DialogTitle>
          <DialogContent dividers={false}>
            <DialogContentText
              id="scroll-dialog-description"
              ref={descriptionElementRef}
              tabIndex={-1}
            >
              <List
                sx={{
                  width: "100%",
                  maxWidth: 360,
                  bgcolor: "background.paper",
                }}
              >
                {comments &&
                  comments?.map((comment) => {
                    return (
                      <Comment
                        comment={comment.data()}
                        handleClose={handleClose}
                        handleClickOpen={handleClickOpen}
                        open={open}
                      />
                    );
                  })}
              </List>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </Dialog>
      </div>
      <form onSubmit={submit}>
        <div className="video-add-details">
          <div className="details-entry">
            {error !== "" && (
              <div hidden={error === undefined} className="error">
                <span className="message">{error}</span>
              </div>
            )}
            <textarea
              className="caption-content"
              ref={textAreaRef}
              placeholder="Add your review"
              rows={6}
            />
            <button
              type="submit"
              className="primary medium"
              disabled={disabled}
            >
              Create
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
