import { api } from "../pages";
import Modal from "./Modal";
import { useState } from "react";
export default function Post(props){
   return(
    <div>
       <img
            src={`https://postrapi.pockethost.io/api/files/_pb_users_auth_/${props.author.id}/${props.author.avatar}`}
            className="w-8 h-8 rounded-full object-cover"
            alt="post image"
          />
       
       <img src="https://postrapi.pockethost.io"
      {props.content}

          <img
          src={`https://postrapi.pockethost.io/api/files/w5qr8xrcpxalcx6/${props.id}/${props.file}`}
          className="w-full h-96 object-cover rounded-md mt-5 cursor-pointer"
          alt="post image"
          onClick={() => {
            document.getElementById("modal" + props.id).showModal();
          }}
        />
    </div>
   )
}

function parseDate(data) {
    const date = new Date(data);
    const now = new Date();
    const diff = now - date;
    const seconds = diff / 1000;
    const minutes = seconds / 60;
    const hours = minutes / 60;
    const days = hours / 24;
    const weeks = days / 7;
    const months = days / 30.44; // An average month length in days
    const years = months / 12;
  
    if (seconds < 60) {
      return "just now";
    }
    if (minutes < 60) {
      return Math.round(minutes) + "m";
    }
    if (hours < 24) {
      return Math.round(hours) + "h";
    }
    if (days < 7) {
      return Math.round(days) + "d";
    }
    if (weeks < 4) {
      return Math.round(weeks) + "w";
    }
    if (months < 12) {
      return Math.round(months) + "m";
    }
    if (years >= 1) {
      return Math.round(years) + "y";
    }
  }
  function debounce(fn, time) {
    let timeout;
    return function () {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        fn();
      }, time);
    };
  }


  function parseNumber(num) {
    if (num < 1000) {
      return num.toString();
    } else if (num < 1000000) {
      const roundedNum = Math.floor(num / 1000);
      return `${roundedNum}k`;
    } else if (num < 1000000000) {
      const roundedNum = Math.floor(num / 1000000);
      return `${roundedNum}m`;
    } else {
      return num.toString();
    }
  }
  
