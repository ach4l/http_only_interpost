export const serverURL = "http://192.168.43.73:5000/";

export async function getWikitravelAsset(assetPath) {
  console.log('Sending GET Request for wikitravel for', assetPath);
  const response = await fetch(serverURL+assetPath)
  return response;
}

// Function to add request to the server
export async function sendRequest(request) {
  const URL = serverURL + "add_request"
  console.log("Sending request", request);

  const response = await fetch(URL, {
    method: "POST",
    body: JSON.stringify(request),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  let resp = null;

  if (response.ok) resp = await response.json();

  return resp;
}

// Function to get content from server
export async function getContent(request) {
  const URL = serverURL + "send_results";
  console.log("Sending request to response", request);

  const response = await fetch(URL, {
    method: "POST",
    body: JSON.stringify(request),
    headers: {
      "Content-Type": "application/json"
    }
  });

  let resp = await response.json();
  return resp;
}

// Function to backup requests
export async function backupRequests(userId, requests) {
  const URL = serverURL + `backup/${userId}`;
  console.log("backup requests");
  
  const response = await fetch(URL, {
    method: "POST",
    body: JSON.stringify(requests),
    headers: {
      "Content-Type": "application/json"
    }
  });

  const res = await response.json();

  return res;
}

// Function to get backup responses
export async function getBackupRequests(userId) {
  console.log("getting backup requests");
  const URL = serverURL + `backup/${userId}`;

  const response = await fetch(URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  const resp = await response.json();

  return resp;
}

