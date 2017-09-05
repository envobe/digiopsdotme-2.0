import React from 'react';
import TimeAgo from 'react-timeago';
import Input from './chat_input.js';
import api from './api.js';

import './chat.css';

const d = document;

class Chat extends React.Component {
  constructor(props){
    super(props);
    let loggedIn = false, uname="nigga";
    if(localStorage.digiChatToken){
      loggedIn = true;
      uname = localStorage.digiChatUname;
    }
    this.state = {
      loggedIn: loggedIn,
      username: uname,
      messages: [],
    };
    this.authenticate = this.authenticate.bind(this);
    this.logout = this.logout.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.getMessages = this.getMessages.bind(this);
  }

  componentDidMount(){
    this.focusInput();
    const i = setInterval(this.getMessages, 2000);
  }

  getMessages(){
    if(!this.state)
      return;
    if(this.state.loggedIn){
      const messages = api.fetchMessages();
      messages
        .then((messages) => {
          this.setState({messages: messages});
          this.scroll();
        })
    }
  }

  sendMessage(content, target="all"){
    if(!this.state.loggedIn)
      return;
    const mes = api.postMessage(content, this.state.username, target);
    return mes.then((res) => {
      this.setState({messages: res.data});
      this.scroll();
    })
    .catch((err) => console.log(err));
  }

  authenticate(uname, pass){

    if(this.state.loggedIn)
      return "You're already logged in mate";

    let string;
    const res = api.login(uname, pass);
    return res.then((res) => {

        if(res.data.token){
          localStorage.digiChatToken = res.data.token;
          localStorage.digiChatUname = uname;
          this.setState({
            loggedIn: true,
            username: uname
          })
        }
        this.getMessages();
        string = `Welcome my boi, ${uname}.`;
        return string;
    });
  }

  focusInput(){
    d.getElementById("chat-input").focus();
  }

  logout(){
    localStorage.digiChatToken = "";
    localStorage.digiChatUname = "";
    console.log("logged out");
    this.setState({
      loggedIn: false, 
      username: "nigga",
      messages: []
    });
  }

  scroll(){
    const box = d.getElementById("messagebox");
    box.scrollTop = box.scrollHeight;
  }

  render(){

    return(
      <div className="chat-terminal" onClick={this.focusInput}>
        <div className="messages" onClick={this.focusInput} id="messagebox">
          {
            this.state.messages.map((msg)=>{
              const d = new Date(msg.time);
              return (
                <div className="message" key={msg.time}>
                <strong>{msg.author}:</strong> {msg.content}
                <small className="time"><TimeAgo date={d}></TimeAgo></small>
                </div>
              );
            })
          }
        </div>
        <Input 
        auth={this.authenticate}
        send={this.sendMessage}
        logout={this.logout}
        username={this.state.username}/>
      </div>
    );
  }
}

export default Chat;