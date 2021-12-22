import axios from 'axios';

export function validateChannel(chanelName: string | null) {
    return axios.get(`${process.env.REACT_APP_VALIDATE_CHANNEL}/api/validate-channel?channelName=${chanelName}`)
}