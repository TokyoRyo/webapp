import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { init } from './init';
import "bootstrap";
import './index.scss';
import './components/frame.scss';
import './components/section.scss';
import Auth from './components/Auth';
import Login from './components/Login';
import Home from './components/Home';
import Settings from './components/Settings';
import Navigation from './components/Navigation'
import Signup from './components/Signup';
import StrangerCheck from './components/StrangerCheck';
import Connection from './components/Connection';
import EditProfile from './components/EditProfile';
import Share from './components/Share';
import Meetings from './components/Meetings';
import NewPost from './components/NewPost';
import Post from './components/Post';
import Info from './components/Info';
import Members from './components/Members';



init();

const appRoot = document.getElementById('app');

ReactDOM.render(
    <Router>
        <Switch>
            <Route exact path="/login" render={() => (<StrangerCheck><Login /></StrangerCheck>)} />
            <Route exact path="/signup" component={() => (<StrangerCheck><Signup /></StrangerCheck>)} />
            <Route exact path="/info" component={() => (<StrangerCheck><Info /></StrangerCheck>)} />
            <Auth>
                <Connection />
                <div className="app_frame">
                    <div className="app_frame__content">
                        <Route exact path="/" component={Home} />
                        <Route exact path="/newpost" component={NewPost} />
                        <Route exact path="/members" component={Members} />
                        <Route exact path="/share" component={Share} />
                        <Route exact path="/meetings" component={Meetings} />
                        <Route exact path="/settings" component={Settings} />
                        <Route exact path="/editprofile" component={EditProfile} />
                        <Route exact path="/post/:id" component={Post} />
                    </div>
                    <Navigation />
                </div>
                
            </Auth>
        </Switch>
    </Router>,
    appRoot
);
