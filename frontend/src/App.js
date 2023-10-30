import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Register from './pages/Register';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './pages/Login';
import Homepage from './pages/Homepage';
import CreateBlog from './pages/CreateBlog';
import MyBlogs from './pages/MyBlogs';
import Header from './components/common/Header';
import FollowerList from './pages/FollowerList';
import FollowingList from './pages/FollowingList';
import Users from './pages/Users';
function App() {
  return (
    <>
    <Header/>
     <Routes>
      <Route path="/" element={<Register/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/homepage" element={<Homepage/>}/>
      <Route path="/create-blog" element={<CreateBlog/>}/>
      <Route path="/my-blogs" element={<MyBlogs/>}/>
      <Route path="/follower-list" element={<FollowerList />}></Route>
      <Route path="/following-list" element={<FollowingList />}></Route>
      <Route path="/users" element={<Users />}></Route>
    </Routes>
    </>
   
  );
}

export default App;
