import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import OnBoard from "./components/onBoard";
import VideoCall from "./components/VideoCall";
import { validateChannel } from "./utils/api-channel";
import DescriptionAlerts from "./utils/Alert";

const App = () => {
  const [inCall, setInCall] = useState(false);
  const [searchParams,] = useSearchParams();
  const chanel = searchParams.get("channelName");
  const role = searchParams.get("role");
  const name = searchParams.get("name");
  const [state, setstate] = useState({ chanelName: '', isBtn: false })
  const [isAlert, setisAlert] = useState(false)

  useEffect(() => {

    if (chanel !== null) {
      setstate({
        ...state,
        chanelName: chanel,
        isBtn: true
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chanel])

  const actCall = async (e: any) => {
    e.preventDefault();
    if (!state.chanelName) {
      return alert('chanel name tidak boleh kosong')
    }

    await validateChannel(chanel).then((res: any) => {

      if (res.data.status === false) {
        return setisAlert(true);
      } else {
        return setInCall(true);
      }
    })
  }

  return (
    <>
      {isAlert &&
        <div style={{ position: 'absolute', top: '-3px', left: 0, right: 0 }}>
          <DescriptionAlerts message="Waktu tidak sesuai!" setisAlert={setisAlert} />
        </div>}
      {inCall ? (
        <VideoCall role={role} name={name} setInCall={setInCall} channelName={chanel} />
      ) : (
        <OnBoard role={role} name={name} chanel={chanel} state={state} actCall={actCall} />
      )}
    </>
  );
};

export default App;

