
import * as React from 'react';
import { IPropsOnboard } from '../type'
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import ILogo from '../assets/images/logo.png';
import IonboardRs from '../assets/images/oboardRs.png';

const OnBoard = (props: IPropsOnboard) => {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid  container spacing={2}>
                <WrapperKiri item xs={12} md={5}>
                    <Logo src={ILogo}/>
                    <OnBoardRs src={IonboardRs}/>
                </WrapperKiri>
                <WrapperKanan item xs={12} md={7}>
                    <div style={{padding : '30px'}}>
                        <Title Fw={900} Fc='#000' Fs='32px'>Conference</Title>
                        <Gap h='10px'/>
                        <Title Fw={900} Fc='#bdbfc4' Fs='28px'>Join a new conference</Title>
                        <Gap h='100px'/>
                        <Title Fw={900} Fc='#000' Fs='28px'>Room</Title>
                        <Input>
                            <Title Fw={900} Fc='#bdbfc4' Fs='22px'>{props.name ? props.name : 'No Room !!'}</Title>
                        </Input>
                        <Button
                            disabled={!props.state.isBtn}
                            onClick={(e) => props.actCall(e)}
                        >Join</Button>
                    </div>
                </WrapperKanan>
            </Grid>
        </Box>
    )
}

export default OnBoard

type IGap = {
    w? : string,
    h? : string
}

type ITitle = {
    Fs? : string,
    Fc? : string,
    Fw? : number
}

const WrapperKiri = styled(Grid)((props) => ({
    maxHeight : '100vh',
    display: 'flex',
    alignItems : 'center',
    flexDirection : 'column',
    overflow: 'hidden'
}))

const WrapperKanan = styled(Grid)((props) => ({
    backgroundColor : '#f4f5f9',
    maxHeight : '100vh',
    display: 'flex',
    justifyContent : 'center',
    flexDirection : 'column',
    overflow: 'hidden'
}))

const Logo = styled('img')((props) => ({
    width: '25%',
    marginTop : '125px',
    marginBottom : '100px'
}))
const OnBoardRs = styled('img')((props) => ({
    width: '100%'
}))

const Title = styled('div')((props : ITitle)=> ({
    fontSize : props.Fs ? props.Fs : '14px',
    color: props.Fc ? props.Fc : 'white',
    fontWeight : props.Fw ? props.Fw :  400
}))

const Gap = styled('div')((props : IGap) => ({
    width: props.w ? props.w : '0px',
    height: props.h ? props.h : '0px'
}))

const Input = styled('div')((props)=> ({
    width: '50%',
    height: '70px',
    border: 'none',
    marginTop : '10px',
    borderRadius : '10px',
    paddingLeft: '20px',
    backgroundColor : 'white',
    position:  'relative',
    display: 'flex',
    alignItems : 'center'
}))

const Button = styled('button')((props)=> ({
    marginTop : '30px',
    backgroundColor : '#004aad',
    width: '200px',
    height: '50px',
    borderRadius : '10px',
    color : 'white',
    fontWeight : 'bold',
    fontSize : '18px',
    cursor: 'pointer'
}))