// I don't need to add the event listener for DOMContentLoaded because
// I'm using the defer flag in the script tag in the HTML, which defers loading
// until the DOM is ready

// You can see the long way of doing this if you scroll to line 115
// This webpage let's us see all posts, add a post, and delete a post

// I like to factor out fetch into another function that takes care
// of making the request and converting the response to JSON
// function myFetch(url, options={}) {
//   return fetch(url, options)
//     .then(res => res.json());
// }

// // I also like to generate the options using a function so I don't have
// // to retype the same code again and again
// function makeOptions(method, body) {
//   return {
//     method: method,
//     headers: {
//       'Content-Type': 'application/json',
//       'Accept': 'application/json'
//     },
//     body: JSON.stringify(body)
//   };
// }

// // The structure for each post should be 
// // <div>
// //  <h2>Title</h2>
// //  <p>Text</p>
// //  <button>Delete Post</button>
// // </div>

// // Create and return each post div
// function createPost(postData) {
//   const div = document.createElement('div');
//   const h2 = document.createElement('h2');
//   const p = document.createElement('p');
//   // Pass div in so that we can remove it when the button is clicked
//   // Pass postData so that we can get the ID for the route
//   const deleteBtn = makeDeleteBtn(postData, div);

//   h2.textContent = postData.title;
//   p.textContent = postData.text;
//   div.append(h2, p, deleteBtn);

//   return div;
// }

// // Make the delete button
// // On click, it should delete the item from the database
// // Then remove the item from the DOM
// function makeDeleteBtn(postData, div) {
//   const btn = document.createElement('button');

//   btn.textContent = 'Delete Post';
//   btn.addEventListener('click', () => {
//     // Pessimistic rendering, don't delete unless the post
//     // was actually deleted from the DB
//     myFetch(`${url}/${postData.id}`, { method: 'DELETE' })
//       .then(() => {
//         div.remove();
//       })
//   });

//   return btn;
// }

// // Append the post to the DOM inside the section with class posts
// function appendPost(postData) {
//   const postDiv = createPost(postData);
//   const postsSection = document.querySelector('.posts');

//   postsSection.append(postDiv);
// }

// const url = 'http://localhost:3000/posts';

// // Run this GET request as soon as the DOM elements load and add
// // the posts to the page, myFetch makes the fetch request, and converts
// // the Response body to json already, so now we only have to handle the JSON
// // We'll update the DOM only if the GET was successful
// myFetch(url)
//   .then(postsData => {  // All of the posts
//     for (const post of postsData) {  // Iterate through them
//       appendPost(post);  // Add post to DOM
//     }
//   });

// // POST a post to the DB
// const form = document.querySelector('#posting');

// // Listen for submit, this is where the magic happens!
// // Can't post to the DB without data, so must listen for this event
// form.addEventListener('submit', e => {
//   e.preventDefault();  // NO refresh for you

//   const title = document.querySelector('#title').value;
//   const text = document.querySelector('#text').value;
//   // I made my own method for creating the options
//   // Because I usually use the options more than once
//   const options = makeOptions('POST', { title: title, text: text });

//   myFetch(url, options) // making my POST request to add data to the DB
//     .then(postObj => {
//       form.reset(); // Only clear the inputs if the post was successful
//       appendPost(postObj);  // update the DOM with the response
//     });
// });



/***********************************************
// UNREFACTORED WAY
***********************************************/

// The structure for each post should be 
// <div>
//  <h2>Title</h2>
//  <p>Text</p>
//  <button>Delete Post</button>
// </div>

const url = 'http://localhost:3000/posts';

// Create and append to DOM a post div
function createPost(postData) {
  const div = document.createElement('div');
  const h2 = document.createElement('h2');
  const p = document.createElement('p');
  const btn = document.createElement('button');

  btn.textContent = 'Delete Post';
  // On click, it should delete the item from the database
  // Then remove the item from the DOM on success
  btn.addEventListener('click', () => {
    // Pessimistic rendering, don't delete unless the post
    // was actually deleted from the DB
    fetch(`${url}/${postData.id}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(() => {
        // We can access the div because it's available one level up
        // in the scope chain
        div.remove();
      })
  });

  h2.textContent = postData.title;
  p.textContent = postData.text;
  div.append(h2, p, btn);

  const postsSection = document.querySelector('.posts');

  postsSection.append(div);
}

// Make GET request for all posts
// On success, append post divs to DOM
fetch(url)
  .then(res => res.json())
  .then(postsData => {  // All of the posts
    for (const post of postsData) {  // Iterate through them
      createPost(post);  // Add post to DOM
    }
  });

// POST a post to the DB
const form = document.querySelector('#posting');

// Listen for submit, this is where the magic happens!
// Can't post to the DB without data or the user says so, so must listen for this event
form.addEventListener('submit', e => {
  e.preventDefault();  // NO refresh for you
  // Get the values from the inputs
  const title = document.querySelector('#title').value;
  const text = document.querySelector('#text').value;
  const options =  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ title: title, text: text })
  };

  fetch(url, options) // making my POST request to add data to the DB
    .then(res => res.json())
    .then(postObj => { // Single post
      form.reset(); // Only clear the inputs if the post was successful
      createPost(postObj);  // update the DOM with the response
    });
});
