import React, { ReactElement } from "react";
import {Button, IconButton, Stack} from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

type HomeProps = {};
export const Home = ({}: HomeProps): ReactElement => {
  return (
    <Stack spacing={4}>
      <Stack spacing={2} direction={"row"}>
        <Button variant={"text"} href={"https://roadmap.sh/react"}>
          1
        </Button>
        <Button variant={"contained"}>2</Button>
        <Button variant={"outlined"}>3</Button>
      </Stack>

      <Stack spacing={2} direction={"row"}>
        <Button variant={"text"} color={"primary"}>
          4
        </Button>
        <Button variant={"contained"} color={"warning"}>
          5
        </Button>
        <Button variant={"outlined"} color={"error"}>
          6
        </Button>
      </Stack>

      <Stack display={"block"} spacing={2} direction={"row"}>
        <Button variant={"text"} color={"primary"} size={"small"}>
          7
        </Button>
        <Button variant={"contained"} color={"warning"} size={"medium"}>
          8
        </Button>
        <Button variant={"outlined"} color={"error"} size={"large"}>
          9
        </Button>
      </Stack>

      <Stack spacing={2} direction={"row"}>
        <Button variant={'text'} startIcon={<AccountCircleIcon/>} disableRipple>10</Button>
        <Button variant={'contained'} endIcon={<AccountCircleIcon/>} disableElevation>11</Button>
        <IconButton aria-label={'send'} color={'primary'}><AccountCircleIcon/></IconButton>
      </Stack>
    </Stack>
  );
};