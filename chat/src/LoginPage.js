import { Link } from "react-router-dom";

function LoginPage() {
    return(
        <div>
            <h1> HIi Login Page</h1>
            <Link to="/homepage">
                <button>
                    G to Home Page
                </button>
            </Link>
        </div>
    );
}
export default LoginPage;