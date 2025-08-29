import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Create from "./pages/Create";
import BlogDetails from "./pages/BlogDetails";
import EditBlog from "./pages/EditBlog";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./routes/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Navbar />
          <div className="content">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />

              <ProtectedRoute path="/blogs/:id/edit">
                <EditBlog />
              </ProtectedRoute>

              <Route exact path="/blogs/:id" component={BlogDetails} />

              <ProtectedRoute path="/create">
                <Create />
              </ProtectedRoute>
              <Route path="/forgot" component={ForgotPassword} />
              <Route path="/new-password" component={ResetPassword} />
              <Route path="*" component={NotFound} />
            </Switch>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
