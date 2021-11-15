import * as React from "react";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import FileCopy from "@material-ui/icons/FileCopy";
import CloudDownload from "@material-ui/icons/CloudDownload";
import "./TippingButton.scss";
import shareIcon from "../assets/images/icon-share.png";

export default function ShareButton() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [activeAnimations, setActiveAnimations] = React.useState<number[] | []>(
    []
  );

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls="basic-menu"
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <img
          src={shareIcon}
          // className={videoInfo.shares?.includes(userId) ? "active" : ""}
          alt="icon: share current video"
        />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <FileCopy style={{ paddingRight: "3px" }} fontSize="small" />
            Copy Link
          </ListItemIcon>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <CloudDownload style={{ paddingRight: "3px" }} fontSize="small" />
            Download
          </ListItemIcon>
        </MenuItem>
      </Menu>
    </div>
  );
}
