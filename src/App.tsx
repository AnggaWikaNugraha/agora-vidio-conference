import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { IParams } from './type'
import OnBoard from "./components/onBoard";
import VideoCall from "./components/VideoCall";

const App = () => {
  const [inCall, setInCall] = useState(false);
  const [searchParams,] = useSearchParams();
  const chanel = searchParams.get("chanelName");
  const [state, setstate] = useState({
    chanelName: '',
    isBtn: false
  })

  const params: IParams = {
    chanelName: '',
    role: "",
    nama: '',
  }

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

  const actCall = (e: any) => {
    e.preventDefault();
    if (!state.chanelName) {
      return alert('chanel name tidak boleh kosong')
    }
    return setInCall(true);
  }

  return (
    <>
      {inCall ? (
        <VideoCall
          setInCall={setInCall}
          channelName={chanel}
        />
      ) : (
        <OnBoard chanel={chanel} state={state} actCall={actCall} />
      )}
    </>
  );
};

export default App;
