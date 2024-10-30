import React from 'react';
import Layout from './Components/LayoutArea/Layout/Layout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-toastify/dist/ReactToastify.min.css';
import "./App.css";


function App() {
    return (
        <>
            <Layout/>  
            <ToastContainer />

        </>
    );
}

export default App;
