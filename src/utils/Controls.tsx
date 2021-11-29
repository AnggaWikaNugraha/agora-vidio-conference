import React, { useState } from "react";
import { ClientConfig } from "agora-rtc-sdk-ng";
import { createClient } from "agora-rtc-react";
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

    return (
        <div className="controls">
            <p className={trackState.audio ? "on" : ""} onClick={() => mute("audio")}>
                {trackState.audio ? "MuteAudio" : "UnmuteAudio"}
            </p>
            <p className={trackState.video ? "on" : ""} onClick={() => mute("video")}>
                {trackState.video ? "MuteVideo" : "UnmuteVideo"}
            </p>
            {<p onClick={() => leaveChannel()}>Leave</p>}
        </div>
    );
};
