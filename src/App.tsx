import React, { useEffect, useState } from "react";
import {
  ClientConfig,
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
} from "agora-rtc-sdk-ng";
import {
  AgoraVideoPlayer,
  createClient,
  createMicrophoneAndCameraTracks,
} from "agora-rtc-react";
import axios from "axios";

const config: ClientConfig = {
  mode: "rtc",
  codec: "vp8",
};

//ENTER APP ID HERE
const appId: string = process.env.REACT_APP_AGORA_APP_ID as string;

const App = () => {
  const [inCall, setInCall] = useState(false);
  const [channelName, setChannelName] = useState("");
  return (
    <>
      {inCall ? (
        <VideoCall
          setInCall={setInCall}
          setChannelName={setChannelName}
          channelName={channelName}
        />
      ) : (
        <div className="wrapper index">
          <div className="ag-header"></div>
          <div className="ag-main">
            <section className="login-wrapper">
              <div className="login-header">
                <img src={require('./assets/images/ag-logo.png').default} alt="" />
                <p className="login-title">AgoraWeb v2.1</p>
                <p className="login-subtitle">Powering Real-Time Communications</p>
              </div>
              <div className="login-body">
                <div className="columns">
                  <div className="column">
                    <div className="channel-wrapper control has-icons-left">
                      <input
                        onChange={(e) => setChannelName(e.target.value)}
                        id="channel"
                        className={'ag-rounded input '}
                        type="text"
                        placeholder='Room name here ..' />
                      <span className="icon is-small is-left">
                        <img src={require('./assets/images/ag-login.png').default} alt="" />
                      </span>
                    </div>
                  </div>
                </div>
                <div className="columns">
                  <div className="column">
                    <div id="attendeeMode" className="control">
                      <label className="radio">
                        <input
                          value="video" type="radio"
                          name="attendee" defaultChecked />
                        <span className="radio-btn">
                        </span>
                        <span className="radio-img video">
                        </span>
                        <span className="radio-msg">Video Call : join with video call</span>
                      </label>
                      <br />
                    </div>
                  </div>
                </div>
              </div>
              <div className="login-footer">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (channelName === "") {
                      alert("Channel Name is Required!");
                    } else {
                      setInCall(true);
                    }
                  }}
                  id="joinBtn" className="ag-rounded button is-info">Join
                </button>
              </div>
            </section>
          </div>
        </div>
      )}
    </>
  );
};

const useClient = createClient(config);
const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();

const VideoCall = (props: {
  setInCall: React.Dispatch<React.SetStateAction<boolean>>;
  setChannelName: React.Dispatch<React.SetStateAction<string>>;
  channelName: string;
}) => {
  const { setInCall, setChannelName, channelName } = props;
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
    <div className="App">
      {ready && tracks && (
        <Controls
          tracks={tracks}
          setStart={setStart}
          setInCall={setInCall}
          setChannelName={setChannelName}
        />
      )}
      {start && tracks && <Videos users={users} tracks={tracks} />}
    </div>
  );
};

const Videos = (props: {
  users: IAgoraRTCRemoteUser[];
  tracks: [IMicrophoneAudioTrack, ICameraVideoTrack];
}) => {
  const { users, tracks } = props;

  return (
    <div>
      <div id="videos">
        <AgoraVideoPlayer className="vid" videoTrack={tracks[1]} />
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
    </div>
  );
};

export const Controls = (props: {
  tracks: any;
  setStart: any;
  setInCall: any;
  setChannelName: any;
}) => {
  const client = useClient();
  const { tracks, setStart, setInCall, setChannelName } = props;
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
    setChannelName("");
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

const ChannelForm = (props: {
  setInCall: React.Dispatch<React.SetStateAction<boolean>>;
  setChannelName: React.Dispatch<React.SetStateAction<string>>;
  channelName: any;
}) => {
  const { setInCall, setChannelName, channelName } = props;

  return (
    <form className="join">
      {appId === "" && (
        <p style={{ color: "red" }}>
          Please enter your Agora App ID in App.tsx and refresh the page
        </p>
      )}
      <input
        type="text"
        placeholder="Enter Channel Name"
        onChange={(e) => setChannelName(e.target.value)}
      />
      <button
        onClick={(e) => {
          e.preventDefault();
          if (channelName === "") {
            alert("Channel Name is Required!");
          } else {
            setInCall(true);
          }
        }}
      >
        Join
      </button>
    </form>
  );
};


export default App;
