import * as React from "react";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import { ThemeUIStyleObject } from "theme-ui";

declare module "react" {
  interface Attributes {
    sx?: ThemeUIStyleObject;
  }
}

export function Comment({
  comment,
  handleClose,
  handleClickOpen,
  open = false,
}) {
  return (
    <>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt={comment.userEmail} src={comment.profilePic} />
        </ListItemAvatar>
        <ListItemText
          primary={comment.userEmail}
          secondary={
            <React.Fragment>
              <Typography
                sx={{ display: "inline" }}
                component="span"
                variant="body2"
                color="textPrimary"
              >
                {comment.content}
              </Typography>
              <br />
            </React.Fragment>
          }
        />
      </ListItem>
      <Divider variant="inset" component="li" />
    </>
  );
}
