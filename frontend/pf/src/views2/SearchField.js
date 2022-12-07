import React from 'react';
import { Link } from 'react-router-dom';

export const FirstPage = ({ searchfield, setsearchfield }) => {
  const handleChange = (e) => {
    setsearchfield(e.target.value);
  };

  return (

    <div>
                <label htmlFor="searchfield">Search</label>
                <input
                type="text"
                id="searchfield"
                onChange={handleChange}
                // defaultValue = {post.last_name}
                // value = {{...post, last_name:lastname}}
                // onChange={(e) => {setPost({...post, first_name:e.target.value})}}
                // onChange={(e) => {setNote({...note, body:e.target.value})}} value={note?.body}
                // onChange={e => setNote('b')}
                placeholder="Fill in your search "
                className="block mb-5 w-full border-b-2 border-gray-800 outline-none p-2"
              />
              <p>
        <Link to="/list_studio_search">Search</Link>
      </p >
        </div>

  );
};