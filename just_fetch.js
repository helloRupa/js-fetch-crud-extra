const url = 'http://localhost:3000/posts';

// GET requests
// routed to controller action index
fetch(url)  // send the request and get a response
  .then(res => res.json())  // convert Response object body to JSON
  .then(json => {
    // json is an array of objects
    // Update DOM in here
    console.log('Made a GET request for all entries at that path');
    console.log(json);
    console.log(' ');
  });

// routed to controller action show
fetch(`${url}/1`)
  .then(res => res.json())
  .then(json => {
    // json is an object
    // Update DOM in here
    console.log('Made a GET request for one entry');
    console.log(json);
    console.log(' ');
  });

// POST request
let title = 'You set the title here.';
let text = 'You set the text here.';

let options = {
  method: 'POST',
  headers: {  // data about the request
    'Content-Type': 'application/json', // type of data we're sending
    'Accept': 'application/json' // type of data we want in the response
  },
  body: JSON.stringify({
    title: title, // keys must match what server expects, map to column names in database
    text: text
  })
};
// routed to controller action create
fetch(url, options)
  .then(res => res.json())
  .then(json => {
    // json is an object
    // Update DOM in here
    console.log('Made a POST request');
    console.log(json);
    console.log(' ');
  });

// PATCH request
text = 'I set it just now for patching.';

options = {
  method: 'PATCH',
  headers: {  // data about the request
    'Content-Type': 'application/json', // type of data we're sending
    'Accept': 'application/json' // type of data we want in the response
  },
  body: JSON.stringify({
    text: text  // only send the data you wish to update
  })
};
// routed to controller action update
fetch(`${url}/4`, options)
  .then(res => res.json())
  .then(json => {
    // json is an object
    // Update DOM in here
    console.log('Made a PATCH request');
    console.log(json);
    console.log(' ');
  });

// DELETE request
options = {
  method: 'DELETE'  // How else will the server know what you're up to?
}
// routed to controller action destroy
fetch(`${url}/4`, options)
  .then(res => res.json())
  .then(json => {
    // json is an object
    // Update DOM in here
    console.log('Made a DELETE request');
    console.log('Nothing to see here cuz data was removed');
    console.log(' ');
  });

  // There's no guarantee that the requests above will resolve in order
  // This could cause errors the PATCH and DELETE requests, since they both
  // rely on the POST request to be successful (they're patching and deleting 
  // the entry added during the POST request)