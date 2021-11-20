import * as React from "react";
import { styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import { Link } from "react-router-dom";
import AddLinkIcon from "@material-ui/icons/Link";
import AddIcon from "@material-ui/icons/Add";

interface ChipData {
  key: number;
  label: string;
}

const ListItem = styled("li")(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

export default function TagChips() {
  const [limit, setLimit] = React.useState<number>(10);
  const [chipData, setChipData] = React.useState<readonly ChipData[]>([
    { key: 0, label: "Angular" },
    { key: 1, label: "jQuery" },
    { key: 2, label: "Polymer" },
    { key: 3, label: "React" },
    { key: 4, label: "Vue.js" },
    { key: 4, label: "Vue.js" },
  ]);

  const handleDelete = (chipToDelete: ChipData) => () => {
    setChipData((chips) =>
      chips.filter((chip) => chip.key !== chipToDelete.key)
    );
  };

  return (
    <Paper
      sx={{
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        listStyle: "none",
        p: 0.5,
        m: 0,
      }}
      component="ul"
    >
      {chipData.slice(chipData.length - limit).map((data) => {
        return (
          <ListItem key={data.key}>
            <Link to={`/tags/${data.label}`}>
              <AddLinkIcon />
            </Link>
            <Chip
              label={data.label}
              style={{ color: "blue" }}
              onDelete={handleDelete(data)}
            />
          </ListItem>
        );
      })}
      <AddIcon
        onClick={() => setLimit(limit + 10)}
        style={{ position: "relative", top: "10px", color: "blue" }}
      />
    </Paper>
  );
}
