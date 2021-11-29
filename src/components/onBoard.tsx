import React from 'react'
import { IPropsOnboard } from '../type'

const OnBoard = (props: IPropsOnboard) => {
    return (
        <div className="wrapper index">
            <div className="ag-header"></div>
            <div className="ag-main">
                <section className="login-wrapper">
                    <div className="login-header">
                        <img src={require('../assets/images/ag-logo.png').default} alt="" />
                        <p className="login-title">AgoraWeb v2.1</p>
                        <p className="login-subtitle">Powering Real-Time Communications</p>
                    </div>
                    <div className="login-body">
                        <div className="columns">
                            <div className="column">
                                <div className="channel-wrapper control has-icons-left">
                                    <input
                                        disabled
                                        value={props.chanel ? props.chanel : ''}
                                        id="channel"
                                        className={'ag-rounded input '}
                                        type="text"
                                        placeholder='Room name here ..' />
                                    <span className="icon is-small is-left">
                                        <img src={require('../assets/images/ag-login.png').default} alt="" />
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
                            disabled={!props.state.isBtn}
                            onClick={(e) => props.actCall(e)}
                            id="joinBtn" className="ag-rounded button is-info">Join
                        </button>
                    </div>
                </section>
            </div>
        </div >
    )
}

export default OnBoard
