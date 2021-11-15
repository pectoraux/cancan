import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { CalendarToday, MoreHoriz } from "@material-ui/icons";

const options = [
  {
    icon: <CalendarToday style={{ paddingRight: "5px" }} />,
    name: "Schedule/Reserve",
  },
];

const ITEM_HEIGHT = 48;

export default function ExtraButton() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls="long-menu"
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreHoriz style={{ color: "white", width: "50px", height: "50px" }} />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: "22ch",
          },
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option.name}
            selected={option.name === "Pyxis"}
            onClick={handleClose}
          >
            {option.icon} {option.name}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
