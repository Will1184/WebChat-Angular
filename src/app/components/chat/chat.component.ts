import {Component, OnInit} from '@angular/core';
import {PanelModule} from "primeng/panel";
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import {ToolbarModule} from "primeng/toolbar";
import {AvatarModule} from "primeng/avatar";
import {ChatService} from "../../services/chat.service";
import {ChatMessage} from "../../models/chat-message";
import {ActivatedRoute} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {NgClass, NgForOf} from "@angular/common";

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    PanelModule,
    ButtonModule,
    ToolbarModule,
    InputTextModule,
    AvatarModule,
    FormsModule,
    NgForOf,
    NgClass
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit{
  messageInput:String = '';
  userId:String = '';
  messageList: any[]=[];
  constructor(private chatService:ChatService,private route:ActivatedRoute) {
  }
  ngOnInit() {
    this.userId = this.route.snapshot.params["userId"];
    this.chatService.joinRoom("ABC");
    this.listenerMessage();
  }

  sendMessage(){
    const chatMessage = {
      message: this.messageInput,
      user:'1'
    }as ChatMessage
    this.chatService.sendMessage("ABC",chatMessage);
    this.messageInput = '';
  }

  listenerMessage(){
    this.chatService.getMessageSubject().subscribe((messages:any)=>{
      this.messageList = messages.map((item: any)=>({
        ...item,
          messages_side: item.user === this.userId ? 'sender' : 'receiver'
      }));
    });
  }

}
