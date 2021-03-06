import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Container,
  Divider,
  Grid,
  Header,
  Icon,
  Image,
  List,
  Menu,
  Responsive,
  Segment,
  Sidebar,
  Visibility,
} from 'semantic-ui-react';

/* eslint-disable react/no-multi-comp */
/* Heads up! HomepageHeading uses inline styling, however it's not the best practice. Use CSS or styled components for
 * such things.
 */
const HomepageHeading = ({ mobile }) => (
  <Container text id="headerCont">
    <Header
      as='h1'
      content='hearth'
      inverted
      style={{
        fontSize: mobile ? '2em' : '4em',
        fontWeight: 'normal',
        marginBottom: 0,
        marginTop: mobile ? '1.5em' : '3em',
      }}
    />
    <Header
      as='h2'
      content='Skip the cooking.  Eat Homemade.'
      inverted
      style={{
        fontSize: mobile ? '1.5em' : '1.7em',
        fontWeight: 'normal',
        marginTop: mobile ? '0.5em' : '1.5em',
      }}
    />
    <Button href='/auth/signup' id='getStarted' size='huge'>
      Get Started
      <Icon name='right arrow' />
    </Button>
  </Container>
)

HomepageHeading.propTypes = {
  mobile: PropTypes.bool,
}

class DesktopContainer extends Component {
  state = {};
  hideFixedMenu = () => this.setState({ fixed: false })
  showFixedMenu = () => this.setState({ fixed: true })

  renderButtons = () => {
    const { fixed } = this.state
    if (this.props.user){
      if (Object.keys(this.props.user).length > 0) return (
        <Button inverted={!fixed}>
          <Link to='/dashboard' style={{textDecoration: 'none', color: 'white'}}>Dashboard</Link>
        </Button>
      )
      else return (
        <div>
          <Button inverted={!fixed} primary={fixed} style={{ marginLeft: '0.5em' }} href='/auth/login'>
            Log in
          </Button>
          <Button inverted={!fixed} primary={fixed} style={{ marginLeft: '0.5em' }} href='/auth/signup'>
            Sign Up
          </Button>
        </div>
      )
    }
    else return (
      <div>
        <Button inverted={!fixed} primary={fixed} style={{ marginLeft: '0.5em' }} href='/auth/login'>
          Log in
        </Button>
        <Button inverted={!fixed} primary={fixed} style={{ marginLeft: '0.5em' }} href='/auth/signup'>
          Sign Up
        </Button>
      </div>
    )
  }

  render() {
    const { children } = this.props
    const { fixed } = this.state

    return (
      <Responsive minWidth={Responsive.onlyTablet.minWidth}>
        <Visibility
          once={false}
          onBottomPassed={this.showFixedMenu}
          onBottomPassedReverse={this.hideFixedMenu}
        >
          <Segment
            inverted
            textAlign='center'
            style={{ minHeight: 700, padding: '1em 0em', backgroundImage: '#B73535' }}
            vertical
            id='landingBackground'
          >
            <Menu
              id="mainPageMenu"
              fixed={fixed ? 'top' : null}
              inverted={!fixed}
              pointing={!fixed}
              secondary={!fixed}
              size='large'
            >
              <Container>
                <Link to='/' style={{textDecoration: 'none', color: 'white'}}>
                  <Menu.Item active>Home</Menu.Item>
                </Link>
                <Link to='/auth/chefSignup' style={{textDecoration: 'none', color: 'white'}}>
                  <Menu.Item>Cook with us</Menu.Item>
                </Link>
                <Link to='/auth/signup' style={{textDecoration: 'none', color: 'white'}}>
                  <Menu.Item>Eat with us</Menu.Item>
                </Link>
                <Menu.Item position='right'>
                  {this.renderButtons()}
                </Menu.Item>
              </Container>
            </Menu>
            <HomepageHeading />
          </Segment>
        </Visibility>

        {children}
      </Responsive>
    )
  }
}

DesktopContainer.propTypes = {
  children: PropTypes.node,
}

class MobileContainer extends Component {
  state = {}
  handlePusherClick = () => {
    const { sidebarOpened } = this.state

    if (sidebarOpened) this.setState({ sidebarOpened: false })
  }
  compoentDidMount() {
    this.props.landing();
  };

  handleToggle = () => this.setState({ sidebarOpened: !this.state.sidebarOpened })

  render() {
    const { children } = this.props
    const { sidebarOpened } = this.state

    return (
      <Responsive maxWidth={Responsive.onlyMobile.maxWidth}>
        <Sidebar.Pushable>
          <Sidebar as={Menu} animation='uncover' inverted vertical visible={sidebarOpened}>
            <Link to='/' style={{textDecoration: 'none', color: 'white'}}>
              <Menu.Item active>Home</Menu.Item>
            </Link>
            <Link to='/auth/chefSignup' style={{textDecoration: 'none', color: 'white'}}>
              <Menu.Item>Cook with us</Menu.Item>
            </Link>
            <Link to='/auth/signup' style={{textDecoration: 'none', color: 'white'}}>
              <Menu.Item>Eat with us</Menu.Item>
            </Link>
          </Sidebar>

          <Sidebar.Pusher
            dimmed={sidebarOpened}
            onClick={this.handlePusherClick}
            style={{ minHeight: '100vh' }}
          >
            <Segment
              inverted
              textAlign='center'
              style={{ minHeight: 350, padding: '1em 0em', backgroundColor: '#B73535' }}
              vertical
            >
              <Container>
                <Menu id="mainPageMenu" inverted pointing secondary size='large'>
                  <Menu.Item onClick={this.handleToggle}>
                    <Icon name='sidebar' size="large"/>
                  </Menu.Item>
                  <Menu.Item position='right'>
                    <Button as='a' inverted>
                      Log in
                    </Button>
                    <Button as='a' inverted style={{ marginLeft: '0.5em' }}>
                      Sign Up
                    </Button>
                  </Menu.Item>
                </Menu>
              </Container>
              <HomepageHeading mobile />
            </Segment>

            {children}
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </Responsive>
    )
  }
}

MobileContainer.propTypes = {
  children: PropTypes.node,
}

const ResponsiveContainer = ({ children }) => (
  <div>
    <DesktopContainer>{children}</DesktopContainer>
    <MobileContainer>{children}</MobileContainer>
  </div>
)

ResponsiveContainer.propTypes = {
  children: PropTypes.node,
}

const HomepageLayout = () => (
  <ResponsiveContainer>
    <Segment style={{ padding: '8em 0em' }} vertical>
      <Grid container stackable verticalAlign='middle'>
        <Grid.Row>
          <Grid.Column width={8}>
            <Header as='h3' style={{ fontSize: '2em' }}>
              Get a homecooked meal without the hassle
            </Header>
            <p style={{ fontSize: '1.33em' }}>
              At hearth, students can become chefs and create homecooked meals while building community within the university.
              Order meals from students from different backgrounds and explore a more authentic style of cooking that you won't find in most restaurants.
            </p>
            <Divider/>
            <Header as='h3' style={{ fontSize: '2em' }}>
              We assure that chefs are qualified to cook for you
            </Header>
            <p style={{ fontSize: '1.33em' }}>
              Each hearth chef goes through a process that ensures that each chef is qualified and knowledgable about the food they are serving.
              Our chefs go through trial meals with university embassadors to test for quality and safety. Each kitchen is inspected for cleanliness and
              standards to provide peace of mind for our customers.
            </p>
          <Divider/>
            <Header as='h3' style={{ fontSize: '2em' }}>
              Join the community at your University
            </Header>
            <p style={{ fontSize: '1.33em' }}>
              Every aspect of hearth is designed to influence a community between our users. The company name is meant to convey a sense of feeling of coziness and
              close family sitting around a fireplace. We want students to meet other people on campus that they may not have met otherwise, and form a connection
              through food.
            </p>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
    {/* <Segment style={{ padding: '0em' }} vertical>
      <Grid celled='internally' columns='equal' stackable>
        <Grid.Row textAlign='center'>
          <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
            <Header as='h3' style={{ fontSize: '2em' }}>
              "What a Company"
            </Header>
            <p style={{ fontSize: '1.33em' }}>That is what they all say about us</p>
          </Grid.Column> */}
          {/* <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}> */}
            {/* <Header as='h3' style={{ fontSize: '2em' }}>
              "I shouldn't have gone with their competitor."
            </Header> */}
            {/* <p style={{ fontSize: '1.33em' }}>
              {/* <Image avatar src='/images/avatar/large/nan.jpg' /> */}
              {/* <b>Nan</b> Chief Fun Officer Acme Toys */}
            {/* </p> */}
          {/* </Grid.Column> */}
        {/* </Grid.Row> */}
      {/* </Grid> */}
    {/* </Segment> */}
    <Segment style={{ padding: '8em 0em' }} vertical>
      <Container text>
        <Header as='h3' style={{ fontSize: '2em' }}>
          Have a passion for cooking?
        </Header>
        <p style={{ fontSize: '1.33em' }}>
          Apply to be a hearth chef below. Our university ambassador will contact you to start the process, and you'll be cooking in no time!
        </p>
          <Link to="/auth/signup" style={{textDecoration: 'none', color: 'white'}}><Button size='huge' id='getStarted'>Cook With Us</Button></Link>
        <Divider/>
      </Container>
    </Segment>
    <Segment inverted vertical style={{ padding: '5em 0em' }}>
      <Container>
        <Grid divided inverted stackable>
          <Grid.Row>
            <Grid.Column width={3}>
              <Header inverted as='h4' content='About' />
              <List link inverted>
                <List.Item as='a'>Sitemap</List.Item>
                <List.Item as='a'>Contact Us</List.Item>
              </List>
            </Grid.Column>
            <Grid.Column width={7}>
              <Header as='h4' inverted>
                Our Mission
              </Header>
              <p>
                hearth strives to provide affordable home cooked meals to students across their universities. We want to create a community of people sharing their
                recipes with their peers.
              </p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </Segment>
  </ResponsiveContainer>
)
class parentCont extends Component {
  componentDidMount() {
    this.props.landing();
  }
  render() {
    return (
      HomepageLayout()
    )
  }
}
export default parentCont
