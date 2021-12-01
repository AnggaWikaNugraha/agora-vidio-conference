import React, { useEffect, useState } from "react";
import { ClientConfig, IAgoraRTCRemoteUser } from "agora-rtc-sdk-ng";
import { createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";
import axios from "axios";
import Videos from "../utils/Videos";
const config: ClientConfig = { mode: "rtc", codec: "vp8" };

//ENTER APP ID HERE
const appId: string = process.env.REACT_APP_AGORA_APP_ID as string;
const useClient = createClient(config);
const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();

const VideoCall = (props: {

    setInCall: React.Dispatch<React.SetStateAction<boolean>>;
    channelName: any;
    role: string | null;
    name: string | null;

}) => {

    const { setInCall, channelName, role, name } = props;
    const [users, setUsers] = useState<IAgoraRTCRemoteUser[]>([]);
    const [start, setStart] = useState<boolean>(false);
    const client = useClient();

    const { ready, tracks } = useMicrophoneAndCameraTracks();

    useEffect(() => {
        // function to initialise the SDK
        let init = async (name: string) => {
            client.on("user-published", async (user, mediaType) => {
                await client.subscribe(user, mediaType);
                console.log("subscribe success");
                if (mediaType === "video") {
                    setUsers((prevUsers) => {
                        return [...prevUsers, user];
                    });
                }
                if (mediaType === "audio") {
                    user.audioTrack?.play();
                }
            });

            client.on("user-unpublished", (user, type) => {
                console.log("unpublished", user, type);
                if (type === "audio") {
                    user.audioTrack?.stop();
                }
                if (type === "video") {
                    setUsers((prevUsers) => {
                        return prevUsers.filter((User) => User.uid !== user.uid);
                    });
                }
            });

            client.on("user-left", (user) => {
                console.log("leaving", user);
                setUsers((prevUsers) => {
                    return prevUsers.filter((User) => User.uid !== user.uid);
                });
            });

            try {

                let generateToken: any = await axios.get(
                    `${process.env.REACT_APP_GENERATE_TOKEN_URL}${name}`
                );
                let generatedToken: any = generateToken.data.key;

                await client.join(appId, name, generatedToken, null);
                if (tracks) await client.publish([tracks[0], tracks[1]]);
                setStart(true);

            } catch (error) {
                console.log(error);
            }
        };

        if (ready && tracks) {
            console.log("init ready");

            init(channelName);

        }

    }, [channelName, client, ready, tracks]);


    return (
        <>
            {start && tracks &&
                <Videos
                    role={role}
                    name={name}
                    channelName={channelName}
                    users={users}
                    tracks={tracks}
                    setStart={setStart}
                    ready={ready}
                    setInCall={setInCall}
                />}
        </>
    );
};

export default VideoCall