import React, { useState } from "react";
import { ClientConfig } from "agora-rtc-sdk-ng";
import { createClient } from "agora-rtc-react";
import { VideocamOff, Videocam, MicNone, MicOff, ExitToApp } from '@material-ui/icons';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


const config: ClientConfig = { mode: "rtc", codec: "vp8" };

//ENTER APP ID HERE
const useClient = createClient(config);

export const Controls = (props: {
    tracks: any;
    setStart: any;
    setInCall: any;
}) => {
    const client = useClient();
    const { tracks, setStart, setInCall } = props;
    const [trackState, setTrackState] = useState({ video: true, audio: true });
    const [open, setOpen] = useState(false);

    const mute = async (type: "audio" | "video") => {
        if (type === "audio") {
            await tracks[0].setEnabled(!trackState.audio);
            setTrackState((ps) => {
                return { ...ps, audio: !ps.audio };
            });
        } else if (type === "video") {
            await tracks[1].setEnabled(!trackState.video);
            setTrackState((ps) => {
                return { ...ps, video: !ps.video };
            });
        }
    };

    const leaveChannel = async () => {
        await client.leave();
        client.removeAllListeners();
        tracks[0].close();
        tracks[1].close();
        setStart(false);
        setInCall(false);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const AlertDialog = () => {

        const handleClose = () => {
            leaveChannel()
            window.location.reload()
            setOpen(false);
        };

        const handleBack = () => {
            setOpen(false);
        };

        return (
            <div>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">Ingin Mengakhiri Vidio konsulasi ?</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Anda yakin ?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleBack}>Kembali</Button>
                        <Button onClick={handleClose} autoFocus>
                            Yakin
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }

    return (
        <div className="controls">
            <p className={trackState.audio ? "on" : ""} onClick={() => mute("audio")}>
                {trackState.audio ? <MicOff /> : <MicNone />}
            </p>
            <p className={trackState.video ? "on" : ""} onClick={() => mute("video")}>
                {trackState.video ? <VideocamOff /> : <Videocam />}
            </p>
            {<p onClick={() => handleClickOpen()}><ExitToApp /></p>}
            <AlertDialog />
        </div>
    );
};
