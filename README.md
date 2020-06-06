# JS CRUD with Fetch Cheatsheet
Just a little guide on communicating with a remote server from the front-end.

## What does fetch() do?
Fetch communicates with a remote server in order to make HTTP requests. It can make all of the HTTP requests we are familiar with: `GET`, `POST`, `PATCH`, `DELETE`, and `PUT` (though we don't really use `PUT`).

By itself, fetch() does nothing to the DOM. It just communicates with a server and recevies a response. By default, it makes GET requests.

If the URL provided to fetch() is valid and the server accepts the request, the request will be routed to the appropriate controller. The method specified in the options will determine which controller action is triggered (index, show, create, update, or destroy). The server will then send the response back to the client making the request (browser), usually as JSON.

## What does fetch() return?
It returns a Promise.

```
console.log(fetch('http://localhost:3000/posts')); // Promise object
```

## What arguments does it take?
```
const url = 'http://localhost:3000/posts';

const options = {
  method: 'POST',  // HTTP verb
  headers: {  // metadata, info about the request
    'Content-Type': 'application/json', // type of data we're sending to the server
    'Accept': 'application/json' // type of data we'd like back, but it's up to the 
                                 // server. it can give us anything it wants to.
  },
  body: JSON.stringify({  // information to post to server in the database, 
                          // must be converted to a string, server will parse that
                          // based on what type of data we specified in Content-Type
    title: "Check Out This POST Request",  // keys must match what the server is expecting
    text: "I'm making a POST request!"
  })
};

fetch(url, options); // make POST request, if successful will post our entry to the database
                     // and will do nothing else, because we didn't tell it to do anything else
```

## What can I do with the Promise object that fetch() returns?
You can chain on and call all of the methods available to Promises. We're most interested in then(). When fetch resolves (receives a successful response), that value is available in the very next then() that is chained onto fetch().

```
fetch('http://localhost:3000/posts')  // make request to back end, 
                                  // you may or may not get a response
  .then(res => res.json()) // handle the HTTP response: res is a Response object
  .then(json => {  // handle the useful data (body) of the response as an 
                   // object, or array of objects
    // Update the DOM if necessary
    // and call any other functions that depend upon the request being successful.
  });
```

_Important! There is no way to directly get the value of the response from a Promise. For example, you **can NOT** do fetch(url).response. You must chain on a then()._

## fetch() GET Request
For our purposes, we don't need to provide options when making a GET request. When working with third-party APIs, you might need to provide options.

GET (routed to controller action: index):
```
fetch('http://localhost:3000/posts')
  .then(res => res.json())
  .then(json => {
    // Update the DOM here if that's something you need to do
    // Run any other code that depends on this request being successful
    // json will typically be an array
  });
```

GET (routed to controller action: show):
```
fetch('http://localhost:3000/posts/1')
  .then(res => res.json())
  .then(json => {
    // Update the DOM here if that's something you need to do
    // Run any other code that depends on this request being successful
    // json will typically be a single object (POJO)
  });
```

## fetch() POST Request
We always need to provide options when posting data to the database. Otherwise it won't know that we want to POST or have any data to post.

POST (routed to controller action: create):
```
const url = 'http://localhost:3000/posts';

const options = {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'Accept': 'application/json' 
  },
  body: JSON.stringify({
    title: "Check Out This POST Request",
    text: "I'm making a POST request!"
  })
};

fetch(url, options)
  .then(res => res.json())
  .then(json => {
    // Update the DOM if you need to
    // Run any other functions dependent upon this request being successful
    // json will typically be an object (POJO)
  });
```

## fetch() PATCH Request
We always need to provide options when updating data in the database. Otherwise it won't know that we want to PATCH or have any data to update the database entry with.

PATCH (routed to controller action: update):
```
const url = 'http://localhost:3000/posts';

const options = {
  method: 'PATCH',
  headers: { 
    'Content-Type': 'application/json',
    'Accept': 'application/json' 
  },
  body: JSON.stringify({
    text: "I'm making a PATCH request!" // we only need to provide the modified data
  })
};

fetch(url, options)
  .then(res => res.json())
  .then(json => {
    // Update the DOM if you need to
    // Run any other functions dependent upon this request being successful
    // json will typically be an object (POJO)
  });
```

## fetch() DELETE request
We always need to provide options when making a DELETE request. Otherwise it won't know that we want to DELETE.

DELETE (routed to controller action: destroy):
```
const url = 'http://localhost:3000/posts';

const options = {
  method: 'DELETE'
};

fetch(`${url}/1`, options)
  .then(res => res.json())
  .then(json => {
    // Update the DOM if you need to
    // Run any other functions that depend on this request being successful
    // json might be an object or string or nothing or something else
  })
```

## Good to Know, But You Don't Need to Know Right Now
You don't need to know this for the code challenge, but it's good to know.

### Error Handling with catch()
If our request is not successful, we will want to handle that error. We can do that using catch()! The code inside of catch() will only be executed if the request is unsuccessful or an error is thrown for any other reason.

GET (routed to controller action: index):
```
fetch('http://localhost:3000/posts')
  .then(res => res.json())
  .then(json => {
    // Update the DOM
  })
  .catch(error => {
    console.error(error); // if you want to log a red error
    // Any other code that should run if there's an error
  });
```

### What causes fetch() to generate an error that must be handled?
Fetch will only reject on network failure or if anything prevented the request from completing. In other words, as long as the request gets sent to the server, fetch will not throw an error. If the server never responds, fetch will not throw an error - it'll just sit there twiddling its thumbs. 

Even if the server responds with an HTTP 404 or 500 status, fetch will be all good with that and not throw an error.

Fetch will only throw an error if it was unable to get the request to its endpoint (the server at the URL you're targeting). In terms of ordering food at a drive-thru, as long as you order the food over the microphone and an employee hears it, fetch will not throw an error. You may never get your food, but fetch does not care about your hangriness.

### So how do we make fetch() throw an error if we get a bad response? Like a 404 or 500 status code?
Remember that Response object, the one we lovingly call res and then call json() upon. That object also provides us with the status code. We can check that code, and if we don't like it, throw an error. We should handle that error with a catch(). How do we handle that error inside of catch()? What you decide to do inside of catch() depends on your project. Do you want to make the request again? Do you want to display some text to the user? It's up to you.

```
const url = 'http://localhost:3000/posts';

fetch(url)
  .then(res => {
    if (!res.ok) {
      throw new Error('Network response was not ok');
    }

    return res.json();
  })
  .then(json => {
    // Update the DOM
    // Code in here won't run if there was an error thrown by the code above
  })
  .catch(error => {
    console.error(error);
    // Any error handling code you need
  })
```

When working with third-party APIs, and remote servers in general, you should think about generating and handling errors when making fetch() requests. A lot can and will go wrong.
