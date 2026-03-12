import About from '../components/About';

/**
 * About page — thin wrapper around the About component.
 * Receives mode from App-level state.
 */
export default function AboutPage({ mode }) {
    return (
        <div className="container my-3">
            <About mode={mode} />
        </div>
    );
}
