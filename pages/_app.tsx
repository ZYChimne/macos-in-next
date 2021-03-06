import React, { useEffect, useReducer, useRef, useState } from 'react';
import { Contacts } from '../components/app/contacts/contacts';
import { Finder } from '../components/app/finder/finder';
import { Mail } from '../components/app/mail/mail';
import { Music } from '../components/app/music/music';
import { MusicList } from '../components/app/music/music.d';
import { Notes } from '../components/app/notes/notes';
import { Photos } from '../components/app/photos/photos';
import { Preferences } from '../components/app/preferences/preferences';
import { Reminders } from '../components/app/reminders/reminders';
import { Safari } from '../components/app/safari/safari';
import { Siri } from '../components/app/siri/siri';
import { BootScreen } from '../components/bootscreen/bootscreen';
import { Dock } from '../components/dock/dock';
import { Launchpad } from '../components/launchpad/launchpad';
import { LockScreen } from '../components/lockscreen/lockscreen';
import {
  Menubar,
  WiFiPanel,
  BatteryPanel,
  InputPanel,
  BluetoothPanel,
  FocusPanel,
  ApplePanel,
  ControlPanel,
  NotificationPanel,
  SearchPanel,
} from '../components/menubar/menubar';
import {
  focusReducer,
  menubarPanelReducer,
} from '../components/menubar/menubar.r';
import { Wallpaper } from '../components/wallpaper/wallpaper';
import { activeApp, appReducer } from '../utils/utlils';
import dynamic from 'next/dynamic';
import '../styles/global.css';
import Script from 'next/script';

const App = () => {
  const Maps = dynamic(
    async () => {
      const mod = await import('../components/app/maps/maps');
      return mod.Maps;
    },
    { ssr: false }
  );
  let windowHeight = 0,
    windowWidth = 0;
  const [player, setPlayer] = useState<any>(null);
  if (typeof window !== 'undefined') {
    (windowHeight = window.innerHeight), (windowWidth = window.innerWidth);
  }
  const appRef = useRef<HTMLDivElement>(null);
  const [boot, setBoot] = useState(true);
  const [lock, setLock] = useState(false);
  const [menubarPanelState, menubarPanelDispatcher] = useReducer(
    menubarPanelReducer,
    {
      showWifi: false,
      showInput: false,
      showBattery: false,
      showBluetooth: false,
      showFocus: false,
      showApple: false,
      showControl: false,
      showSiri: false,
      showSearch: false,
      showNotification: false,
    }
  );
  const [appState, appStateDispatcher] = useReducer(appReducer, {
    showLaunchpad: false,
    showSiri: false,
    showPreferences: false,
    showMail: false,
    showMaps: false,
    showFinder: false,
    showSafari: false,
    showPhotos: false,
    showContacts: false,
    showReminders: false,
    showNotes: false,
    showMusic: false,
  });
  const [wifiState, setWifi] = useState(true);
  const [bluetoothState, setBluetooth] = useState(true);
  const [focusState, setFocus] = useReducer(focusReducer, {
    state: true,
    type: 'None',
  });
  const [darkState, setDark] = useState(false);
  const [fullscreenState, setFullscreen] = useState(false);
  const [musicList, setMuicList] = useState<any>(null);
  const playerPlayPause = () => {
    console.log(player.data);
    setMuicList(player.data);
  };
  const playMusic = () => {
    if (musicList) {
      if (musicList.state === 'playing') {
        player.pause();
      } else {
        player.play();
      }
    } else {
      player.play(MusicList);
    }
  };
  const playOnIndex = (index: number) => {
    player.play(MusicList, { index: index });
  };
  const playPrev = () => {
    player.playPrev();
  };
  const playNext = () => {
    player.playNext();
  };
  useEffect(() => {
    if (player) {
      player.on('play', playerPlayPause);
      player.on('pause', playerPlayPause);
    }
  }, [player]);
  useEffect(() => {
    document.onfullscreenchange = (event) => {
      setFullscreen(!fullscreenState);
    };
  }, [fullscreenState]);
  const enterFullscreen = () => {
    if (appRef.current) {
      if (!document.fullscreenElement) {
        appRef.current.requestFullscreen();
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    }
  };
  return windowHeight >= 600 && windowWidth >= 1024 ? (
    <div className='app' ref={appRef}>
      {boot ? (
        <BootScreen boot={boot} setBoot={setBoot} />
      ) : (
        <>
          <Script
            src='https://y.gtimg.cn/music/h5/player/player.js?max_age=2592000'
              onLoad={() => {
              setPlayer(
                new (window as any).QMplayer({
                  target: 'web',
                  fliter: true,
                  loop: true,
                })
              );
            }}
          />
          <LockScreen lock={lock} setLock={setLock} />
          <Wallpaper
            dark={darkState}
            menubarPanelDispatcher={menubarPanelDispatcher}
          />
          {!lock && (
            <>
              <Menubar
                state={activeApp(appState)}
                menubarPanelDispatcher={menubarPanelDispatcher}
                menubarState={menubarPanelState}
                appState={appState}
                appStateDispatcher={appStateDispatcher}
              />
              <WiFiPanel
                show={menubarPanelState.showWifi}
                state={wifiState}
                setState={setWifi}
              />
              <InputPanel show={menubarPanelState.showInput} />
              <BatteryPanel show={menubarPanelState.showBattery} />
              <BluetoothPanel
                show={menubarPanelState.showBluetooth}
                state={bluetoothState}
                setState={setBluetooth}
              />
              <SearchPanel
                show={menubarPanelState.showSearch}
                appState={appState}
                appStateDispatcher={appStateDispatcher}
                menubarPanelDispatcher={menubarPanelDispatcher}
              />
              <FocusPanel
                show={menubarPanelState.showFocus}
                state={focusState}
                dispatch={setFocus}
              />
              <ApplePanel
                show={menubarPanelState.showApple}
                appState={appState}
                appStateDispatcher={appStateDispatcher}
                menubarPanelDispatcher={menubarPanelDispatcher}
                setLock={setLock}
              />
              <ControlPanel
                show={menubarPanelState.showControl}
                wifiState={wifiState}
                setWifi={setWifi}
                bluetoothState={bluetoothState}
                setBluetooth={setBluetooth}
                focusState={focusState}
                setFoucs={setFocus}
                darkState={darkState}
                setDark={setDark}
                musicList={musicList}
                playMusic={playMusic}
                playPrev={playPrev}
                playNext={playNext}
                fullscreen={fullscreenState}
                enterFullscreen={enterFullscreen}
              />
              <Siri show={appState.showSiri} />
              <NotificationPanel show={menubarPanelState.showNotification} />
              <Launchpad
                show={appState.showLaunchpad}
                setApp={appStateDispatcher}
              />
              <div onClick={() => menubarPanelDispatcher('Hide')}>
                <Dock appState={appState} setApp={appStateDispatcher} />
                <Preferences
                  show={appState.showPreferences}
                  setApp={appStateDispatcher}
                />
                <Safari
                  show={appState.showSafari}
                  setApp={appStateDispatcher}
                />
                <Mail show={appState.showMail} setApp={appStateDispatcher} />
                <Maps show={appState.showMaps} setApp={appStateDispatcher} />
                <Finder
                  show={appState.showFinder}
                  setApp={appStateDispatcher}
                />
                <Photos
                  show={appState.showPhotos}
                  setApp={appStateDispatcher}
                />
                <Contacts
                  show={appState.showContacts}
                  setApp={appStateDispatcher}
                />
                <Reminders
                  show={appState.showReminders}
                  setApp={appStateDispatcher}
                />
                <Notes show={appState.showNotes} setApp={appStateDispatcher} />
                <Music
                  show={appState.showMusic}
                  setApp={appStateDispatcher}
                  musicList={musicList}
                  playMusic={playMusic}
                  playOnIndex={playOnIndex}
                  playPrev={playPrev}
                  playNext={playNext}
                />
              </div>
            </>
          )}
        </>
      )}
    </div>
  ) : (
    <div>
      {`Your Window width = ` +
        windowWidth +
        ` and height = ` +
        windowHeight +
        ` .Please run on a device with width >= 1024 and height >= 600 for content to display properly. 
    If you are using an iPad, you may need to rotate the screen and refresh the page.`}
    </div>
  );
};

export default App;
