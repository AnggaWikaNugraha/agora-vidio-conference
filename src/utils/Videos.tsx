import React from "react";
import { IAgoraRTCRemoteUser, ICameraVideoTrack, IMicrophoneAudioTrack } from "agora-rtc-sdk-ng";
import { AgoraVideoPlayer } from "agora-rtc-react";
import { Controls } from "./Controls";

const Videos = (props: {
    users: IAgoraRTCRemoteUser[];
    tracks: [IMicrophoneAudioTrack, ICameraVideoTrack];
    channelName: string | null;
    setStart: any;
    setInCall: any;
    ready: any;
    role: string | null;
    name: string | null;
}) => {
    const { users, tracks, setInCall, setStart, ready } = props;

    return (
        <div className="wrapper meeting">
            <div className="ag-header-onvidio">
                <div className="ag-header-lead">
                    <img
                        className="header-logo"
                        src={require("../assets/images/logo.png").default}
                        alt=""
                    />
                </div>
                <div className="ag-header-msg">Room:&nbsp;<span id="room-name">{props.name ? props.name : ''}</span>
                </div>
            </div>
            <div className="ag-main">
                <div id={users.length > 0 ? 'videos' : 'videosAlone'}>
                    <AgoraVideoPlayer className={users.length > 0 ? 'vidOwn' : 'vidAlone'} videoTrack={tracks[1]} />
                    {users.length > 0 &&
                        users.map((user) => {
                            if (user.videoTrack) {
                                return (
                                    <AgoraVideoPlayer
                                        className="vid"
                                        videoTrack={user.videoTrack}
                                        key={user.uid}
                                    />
                                );
                            } else return null;
                        })}
                </div>
                {ready && tracks && (
                    <Controls
                        tracks={tracks}
                        setStart={setStart}
                        setInCall={setInCall}
                    />
                )}
            </div>
            <div className="ag-footer-onVid">
            </div>
        </div>
    );
};

export default Videos
