import React, { useState, useEffect } from "react";
import { Button, Text, Badge, Flex } from "@aws-amplify/ui-react";
// import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import "./roundbutton.css";
import "./timer.css";
import useSound from "use-sound";
import ping from "./ding.mp3";
import Roundbutton from "./roundbutton";

const Timer = () => {
  const [seconds, setSeconds] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [mins, setMins] = useState(30);
  const [isFocus, setIsFocus] = useState(false);
  const [breaktime, setBreakTime] = useState(5);
  const [sessiontime, setSessionTime] = useState(30);

  const [play] = useSound(ping, { interrupt: true });

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function resetSeconds() {
    setSeconds(60);
  }

  function addSessionTime() {
    if (sessiontime < 60) {
      setSessionTime((sessiontime) => sessiontime + 1);
      setMins(sessiontime + 1);
    } else {
      setSessionTime(60);
      setMins(sessiontime);
    }
  }
  // console.log(sessiontime);
  // console.log(mins)

  function reduceSessionTime() {
    if (sessiontime > 0) {
      setSessionTime((sessiontime) => sessiontime - 1);
      setMins(sessiontime - 1);
    } else {
      setSessionTime(0);
      setMins(sessiontime);
    }
  }

  function addBreakTime() {
    if (breaktime < 60) {
      setBreakTime((breaktime) => breaktime + 1);
    } else {
      setBreakTime(60);
    }
  }

  function reduceBreakTime() {
    if (breaktime > 0) {
      setBreakTime((breaktime) => breaktime - 1);
    } else {
      setBreakTime(0);
    }
  }

  function toggle() {
    setIsActive(!isActive);
    setIsFocus(!isFocus);
    // setMins(mins=> mins-1);
  }

  function reset() {
    setSessionTime(30);
    setMins(30);
    setSeconds(60);
    setIsActive(false);
    setIsFocus(false);
  }

  function Status(isFocus) {
    if (isFocus) {
      return ["FOCUS", "white"];
    } else {
      return ["REST", " #4f5165"];
    }
  }
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  useEffect(() => {
    let interval = null;

    //  seconds = 1-5, mins= 1-5 , active
    if (isActive & (mins > 0) & (seconds === 60)) {
      interval = setInterval(() => {
        {
          setSeconds((seconds) => seconds - 1);
        }
        {
          setMins((mins) => mins - 1);
        }
      }, 1000);
    } else if (isActive & (seconds > 0) & (mins > 0)) {
      interval = setInterval(() => {
        {
          setSeconds((seconds) => seconds - 1);
        }
      }, 1000);
      // when second = 0, min =1-5  , active
    } else if (isActive && seconds === 0 && mins > 0) {
      resetSeconds();
      // setMins(mins => mins-1)
    } // when second = 1-5 , min = 0 , active
    else if (isActive && seconds > 0 && mins === 0) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds - 1);
      }, 1000);
    }
    // when second = 0 , min = 0 , active
    else if (isActive && seconds === 0 && mins === 0) {
      console.log(isFocus);
      //// ****
      if (isFocus === true) {
        console.log("sleep5 sec 1");

        play();
        setTimeout(function () {
          setMins(breaktime);
          setSeconds(60);
          setIsFocus(!isFocus);
        }, 3000);
      } else {
        console.log("sleep5 sec 2");

        play();

        setTimeout(function () {
          setIsActive(false);
        }, 3000);
      }
      ///// ****
    }
    // when second = 0 , min = 0 , inactive
    else if (!isActive && seconds === 0 && mins === 0) {
      clearInterval(interval);
      setMins(0);
      setSeconds(60);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds, play]);

  const [loading, setLoading] = useState(true);

  const newseconds = (seconds) => {
    if (seconds === 60) {
      return "00";
    } else if (seconds < 10) {
      return "0" + seconds;
    } else {
      return seconds;
    }
  };

  const newmins = (mins) => {
    if (mins < 10) {
      return "0" + mins;
    } else {
      return mins;
    }
  };

  const newtime = (breaktime) => {
    if (breaktime < 10) {
      return "0" + breaktime;
    } else {
      return breaktime;
    }
  };
  // console.log(newseconds);
  // console.log(newmins);

  return (
    <div className="app">
      <Badge>
        <Text fontWeight={800} fontSize="2em" color={Status(isFocus)[1]}>
          {" "}
          {Status(isFocus)[0]}{" "}
        </Text>
      </Badge>
      <div className="time">
        <h3>
          {" "}
          {newmins(mins)} : {newseconds(seconds)}
        </h3>
      </div>
      <div className="time">
        <div className="column">
          <p className="letter">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;session&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
          </p>
          <button className="small-button" onClick={addSessionTime}>
            <p className="red">+</p>
          </button>
          <p className="letter">{newtime(sessiontime)}:00</p>
          <button className="small-button" onClick={reduceSessionTime}>
            <p className="red">-</p>
          </button>
        </div>
        <div className="column">
          <p className="letter">break</p>
          {/* <Roundbutton></Roundbutton> */}
          <button className="small-button" onClick={addBreakTime}>
            <p className="red">+</p>
          </button>
          <p className="letter">{newtime(breaktime)}:00</p>
          <button className="small-button" onClick={reduceBreakTime}>
            <p className="red">-</p>
          </button>
        </div>
      </div>
      <div className="row">
        <button
          className="button-three"
          title="Start"
          onClick={toggle}
          size="large"
        >
          <p className="letter"> {isActive ? "Pause" : "Start"}</p>
        </button>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <button
          className="button-three"
          title="Reset"
          onClick={reset}
          size="large"
        >
          <p className="letter">Reset</p>
        </button>
      </div>
    </div>
  );
};

export default Timer;
