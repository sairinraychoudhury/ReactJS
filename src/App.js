import Header from './Header';
import Nav from './Nav';
import Footer from './Footer';
import Home from './Home';
import NewPost from './NewPost';
import PostPage from './PostPage';
import About from './About';
import Missing from './Missing';
import { format } from 'date-fns';
import api from './api/posts';
import { Route, Switch, useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';
import EditPost from './EditPost';


function App() {

  const [posts, setPosts]= useState([]);

  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults]= useState([]);
  const history = useHistory();

  const[postTitle, setPostTitle]= useState('');
  const[postBody, setPostBody] = useState('');

  const[editTitle, setEditTitle]= useState('');
  const[editBody, setEditBody] = useState('');

  // Read data 
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('posts');
        setPosts(response.data);
      } catch (err) {
        if (err.response) {
          // Not in the 200 response range 
          console.log(err.response.data);
          console.log(err.response.status);
          console.log(err.response.headers);
        } else {
          console.log(`Error: ${err.message}`);
        }
      }
    }

    fetchPosts();
  }, [])

  useEffect(() => {

    const filteredResults = posts.filter (post => 
      ((post.body).toLowerCase()).includes(search.toLowerCase()) || ((post.title).toLowerCase()).includes(search.toLowerCase()));

      setSearchResults(filteredResults.reverse()); //shows latest post on top

  },[posts, search])

  //create post
  const handleSubmit = async (e) =>{
    e.preventDefault();
    const id = posts.length ? posts[posts.length -1].id +1 : 1;
    const datetime= format(new Date(), 'MMMM dd, yyyy pp');
    const newPost = { id, title: postTitle, datetime, body: postBody};
    try {
    const response = await api.post('/posts', newPost);
    const allPosts =[...posts,response.data];
    setPosts(allPosts);
    setPostTitle('');
    setPostBody('');
    history.push('/'); 
  } catch (err) {
    console.log(`Error: ${err.message}`);
  }

  }

//Update post
const handleEdit = async (id) => {
    const datetime = format(new Date(), 'MMMM dd, yyyy pp');
    const updatedPost = { id, title: editTitle, datetime, body: editBody };
    try {
      const response = await api.put(`/posts/${id}`, updatedPost);
      setPosts(posts.map(post => post.id === id ? { ...response.data } : post));
      setEditTitle('');
      setEditBody('');
      history.push('/');
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }
  }

//delete post
const handleDelete = async (id) => {
    try {
    await api.delete(`/posts/${id}`);
    const postsList = posts.filter(post => post.id !==id ); //will have all the post other than the post we deleted
    setPosts(postsList);
    history.push('/'); //after we click on delete post takes us back to the updated homepage 
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }
  }
  return (
    <div className="App">

      <Header title="My Blog" />
      <Nav search={search} setSearch={setSearch} />

      <Switch>
        
        <Route exact path= "/">
            <Home posts={searchResults} />
        </Route>

        <Route exact path= "/post">
            <NewPost 
            
            handleSubmit={handleSubmit}
            postTitle={postTitle}
            setPostTitle={setPostTitle}
            postBody={postBody}
            setPostBody={setPostBody}
            
            />
        </Route>  

        <Route path= "/edit/:id">
            <EditPost
            posts={posts}
            handleEdit={handleEdit}
            editTitle={editTitle}
            setEditTitle={setEditTitle}
            editBody={editBody}
            setEditBody={setEditBody}
            
            />
        </Route>  
        
        <Route path= "/post/:id">
            <PostPage posts={posts} handleDelete={handleDelete}/>
        </Route>
          
        <Route path="/about" component={About} />
        <Route path= "*" component={Missing} />

      </Switch>
      
      <Footer />
      
    </div>
  );
}

export default App;
