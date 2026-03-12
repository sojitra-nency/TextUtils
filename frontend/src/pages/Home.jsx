import TextForm from '../components/TextForm';

/**
 * Home page — wraps the TextForm component.
 * Receives mode and showAlert from App-level state.
 */
export default function Home({ mode, showAlert }) {
    return <TextForm mode={mode} showAlert={showAlert} />;
}
