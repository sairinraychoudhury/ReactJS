
import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
const EditPost = ({ posts, handleEdit, editBody, editTitle, setEditBody, setEditTitle}) => {
  
    const {id} = useParams(); //gets the obeject in key val pair from json server
    const post = posts.find( post => (post.id).toString() === id);

    useEffect(() => {
        if (post) {
            setEditTitle(post.title);
            setEditBody(post.body);
        }
    },[post, setEditTitle, setEditBody])
    return (
        <main className="NewPost">

        {editTitle && 
        
        <>
        
        <h1>Edit Post</h1>
        <form className="newPostForm" onSubmit={(e) => e.preventDefault()}>
                    <label htmlFor= "postTitle">Post Title: </label>
                    <input 
                    id="postTitle"
                    type="text"
                    required
                    value={editTitle}
                    onChange= {(e) => setEditTitle(e.target.value)}
                    />
                    <label htmlFor="postBody">Post:</label>
                    <textarea 
                        id="postBody"
                        required
                        value={editBody}
                        onChange={(e) => setEditBody(e.target.value) }
                    />
                    <button type="submit" onClick={()=> handleEdit(post.id)}>Submit</button>

        </form>
             
        </>

        }
        {
            !editTitle &&
            <>
                <h2>Post Not Found! </h2>
                <p>
                <Link to='/'>Visit Our Homepage</Link>
                </p>
            </>
        }
    </main>
  )
}

export default EditPost