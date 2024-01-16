import { Injectable } from '@angular/core';
import SockJS from "sockjs-client";
import {Stomp} from "@stomp/stompjs";
import {ChatMessage} from "../models/chat-message";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private stompClient: any
  private messageSubject: BehaviorSubject<ChatMessage[]> = new BehaviorSubject<ChatMessage[]>([]);
  constructor() {
    this.initConnectionSocket();
  }

  initConnectionSocket(){
    const url = '//localhost:3000/chat-socket';
    const socket = new SockJS(url);
    this.stompClient = Stomp.over(socket);
  }

  joinRoom(roomId:String){
    this.stompClient.connect({},()=>{
      this.stompClient.subscribe(`/topic/${roomId}`,(messages:any)=>{
        const messageContent = JSON.parse(messages.body);
        console.log(messageContent);
        const currentMessage = this.messageSubject.getValue();
        currentMessage.push(messageContent);
        this.messageSubject.next(currentMessage);
      })
    })
  }
  sendMessage(roomId:String,chatMessage:ChatMessage){
    this.stompClient.send(`/app/chat/${roomId}`,{},JSON.stringify(chatMessage));
  }

  getMessageSubject(){
    return this.messageSubject.asObservable();
  }
}
