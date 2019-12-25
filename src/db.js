import Dexie from "dexie";

let db = null;

// Declaration of database
// Returns list of requests
export async function initializeDB() {
  db = new Dexie("requests");
  db.version(1).stores({
    requests: "id, query, status, type, mode, server_request_id",
    content: "id"
  });
  console.log("Database Initialized");
  const requests = await db.requests.toArray();
  return requests;
}

export async function putAllRequestElements(requests) {
  console.log("putting all requests to db", requests);
  const response = await db.requests.bulkPut(requests);
  console.log("response", response);
}

export async function putRequestElement(request) {
  console.log("putting request to db", request);
  const response = await db.requests.put(request);
  console.log("response", response);
}

export async function putContentElement(requestId, content) {
  console.log("Adding content for requestId", requestId, content);
  const response = await db.content.put({ id: requestId, content });
  console.log("response", response);
}

export async function removeRequestElement(requestId) {
  const response = await db.requests.delete(requestId);
  return response;

}

export async function removeContent(requestId) {
  const response = await db.content.delete(requestId);
  return response;
}

export async function getVideo(requestId) {
  const response = await db.content.where("id").equals(requestId).toArray();
  return response[0].content;
}