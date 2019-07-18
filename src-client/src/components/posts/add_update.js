import gql from "graphql-tag";
//import { graphql, withApollo } from "react-apollo";
//import { compose, withHandlers } from "recompose";
import React, { useRef } from 'react';

import { useMutation } from '@apollo/react-hooks';

const CREATE_POST = gql`
  mutation CreatePost($title:String!, $body:String!) {
    createPost(title: $title, body: $body) {
      id
      title
      body
    }
  }
`;

const UPDATE_POST = gql`
  mutation UpdatePost($id: ID!, $title:String!, $body:String!) {
    updatePost(id: $id, title: $title, body: $body) {
      id
      title
      body
    }
  }
`;

function PostAddUpdate({post, setPost}) {
  const [updatePost, {error : updateError}] = useMutation(UPDATE_POST, {
    //variables: { rocket: { model: model, year: +year, stock: +stock } },
    refetchQueries: ['SearchPosts']
  })
  const [createPost, {error: createError}] = useMutation(CREATE_POST, {
    //variables: { rocket: { model: model, year: +year, stock: +stock } },
    refetchQueries: ['SearchPosts']
  })

  let formEl = useRef(null);
  
  let error = post.id ? updateError : createError;

  const resetForm = () => {
    setPost({title: '', body: ''})
    formEl.current.reset();
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const postVariables = { title: post.title, body: post.body };
    if (post.id) {
      postVariables.id = post.id;
    }
    const savePost = post.id ? updatePost : createPost;
    savePost({variables: postVariables})
      .then(() => {
        resetForm()
      })
      .catch(e => {
        console.log('PostAddUpdate Error', e);
      })
  };

  const handleChange = (event) => {
    post[event.target.id] = event.target.value;
    setPost(Object.assign({}, post));
  }

  return (
    <div className="card text-left mb-3">
      <div className="card-body">
        <div className="col-12">
          {error && (<div class="alert alert-danger" role="alert">
            Error! {error.message}
          </div>)}
          <form ref={formEl} onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">
                Title
              </label>
              <input
                type="text"
                className="form-control"
                id="title"
                aria-describedby="title"
                placeholder="Enter title"
                value={post.title}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="content">
                Content
              </label>
              <textarea 
                className="form-control" 
                id="body" 
                placeholder="content" 
                value={post.body}
                onChange={handleChange}
              />
            </div>
            {post.id && (
              <button onClick={resetForm} className="btn btn-default">
                Cancel
              </button>
            )}
            <button type="submit" className="btn btn-primary">
              {post.id?'Save':'Add'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PostAddUpdate;
