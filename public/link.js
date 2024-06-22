const query = window.location.search;
const params = new URLSearchParams(query);
const data = params.get("data");
window.location.replace(`liftlogs://${data}`);
