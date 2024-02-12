import { Link } from "react-router-dom";

function HomePage() {
    return(
        <div>
            <h1> Hi, Home Page</h1>
            <Link to="/">
                <button>Go to LoginPage</button>
            </Link>
        </div>
    );
}

export default HomePage;