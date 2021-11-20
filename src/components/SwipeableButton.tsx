import * as React from "react";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import tipIcon from "../assets/images/icon-tip-active.png";
import "./TippingButton.scss";
import LockIcon from "@material-ui/icons/Lock";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import PaymentIcon from "@material-ui/icons/Payment";

export default function SwipeableButton() {
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
    <div style={{ padding: "0" }}>
      <span style={{ position: "relative", top: "15px", left: "93px" }}>
        Pay
      </span>
      <Button
        id="basic-button"
        aria-controls="basic-menu"
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <img
          src={tipIcon}
          className={activeAnimations.length > 0 ? "active" : "default"}
          alt="icon: video reward points"
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
            <LockIcon style={{ paddingRight: "3px" }} fontSize="small" />
            Stake
          </ListItemIcon>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <PaymentIcon style={{ paddingRight: "3px" }} fontSize="small" />
            NFTickets
          </ListItemIcon>
        </MenuItem>
      </Menu>
    </div>
  );
}
