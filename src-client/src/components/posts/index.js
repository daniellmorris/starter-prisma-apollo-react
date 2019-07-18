import gql from "graphql-tag";
import { useQuery, useMutation } from '@apollo/react-hooks';
import React, { useState } from 'react';
import PostAddUpdate from './add_update';

const SEARCH_POSTS = gql`
  query SearchPosts ($id: ID){
    posts: searchPosts (id: $id) {
      id
      title
      body
      author {
        id
        name
      }
    }
  }
`;

const DELETE_POST = gql`
  mutation DeletePost ($id: ID!){
    deletePost (id: $id) {
      id
      title
      body
    }
  }
`;


function Post({ id, author, title, body, edit}) {
  const [ deletePost, {loading} ] = useMutation(DELETE_POST, {variables: {id}, refetchQueries: ['SearchPosts']});
  return (
      <tr>
        <th scope="row">
          {id}
        </th>
        <td>
          {title}
        </td>
        <td>
          {author.name}
        </td>
        <td>
          {body}
        </td>
        <td>
          <div className="btn-group" role="group" aria-label="">
            <button type="button" className="btn btn-warning" onClick={() => edit({id, title, body})}>
              Edit
            </button>
            <button type="button" className="btn btn-danger" onClick={deletePost}>
              {loading?'Removing':'Remove'}
            </button>
          </div>
        </td>
      </tr>
  )
}

function Posts() {
  const [filter, setFilter] = useState('')
  const [post, setPost] = useState({title: '', body: ''})
  let query = SEARCH_POSTS;
  let search = filter?{id:filter}: null
  const { loading, data, error } = useQuery(query, {variables: search});
  return (
    <div className="row">
      <div className="col">
          <PostAddUpdate post={post} setPost={setPost}/>
          <div className="card">
            <div className="card-body">
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="basic-addon1">
                    Filter
                  </span>
                </div>
                <input type="text" className="form-control" placeholder="ID" aria-label="ID" onChange={(e) => setFilter(e.target.value)}/>
              </div>
              
              {error && (<div class="alert alert-danger" role="alert">
                Error! {error.message}
              </div>)}
              <table className="table table-hover table-responsive-sm">
                <thead>
                  <tr>
                    <th scope="col">
                      #
                    </th>
                    <th scope="col">
                      Title
                    </th>
                    <th scope="col">
                      Author
                    </th>
                    <th scope="col">
                      Content
                    </th>
                    <th scope="col">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {!loading && !error && (
                    data.posts && data.posts.length>0 
                      ? data.posts.map(p => (<Post key={p.id} {...p} edit={setPost}/>)) 
                      : (<tr><td colSpan={5}>No posts available</td></tr>)
                  )}
                </tbody>
              </table>
            </div>
          </div>
      </div>
    </div>
  )
}

export default Posts
