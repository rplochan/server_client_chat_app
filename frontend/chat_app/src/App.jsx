import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import Login from "./components/Login";
import './App.css'

function App() {
    return (
        <div>
            <h1>Chat App</h1>
            <p>Welcome!</p>
            <Login />
        </div>
    );
}


export default App
