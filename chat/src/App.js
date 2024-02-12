import logo from './logo.svg';
import './App.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import LoginPage from './LoginPage';
import HomePage  from './HomePage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/homepage",
    element: <HomePage />,
  },
]);

function App() {
  return (
      <>
        <div className="App">
            <RouterProvider router={router} />
        </div>
      </>
  );
}
// ReactDOM.createRoot(document.getElementById("root")).render(
//   <RouterProvider router={router} />
// );
export default App;
