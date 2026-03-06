import React from 'react';
import TextForm from '../components/TextForm';

/**
 * Home page — wraps the TextForm component.
 * Receives mode and showAlert from App-level state.
 */
export default function Home({ mode, showAlert }) {
    return (
        <div className="container my-3">
            <TextForm heading="TextUtils 🛠️" mode={mode} showAlert={showAlert} />
        </div>
    );
}
