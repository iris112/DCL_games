import React from 'react'
import './additional.css';
import ethereum from './Images/ethereum3.png';
import { Segment, Container, Button, Center } from 'decentraland-ui'
import { Header, Divider, Grid, Image, List } from 'semantic-ui-react'
import Sidebar from './sidebar.jsx'
import gif from './Images/slots.gif';


const page404 = () => (

  <div className='soon' vertical style={{ backgroundColor: 'white' }}>

  	<Sidebar />
  	
    <Container id='soon' style={{ paddingTop: '4.8rem', paddingBottom: '5em' }}>
      <Center>
        <Image src={gif} className="gif" style={{ marginTop: '-5em' }}/>
      	<Button href='/' style={{ marginTop: '-3em' }}>
      		back to home
      	</Button>
      </Center>

    </Container>
  </div>
)

export default page404
