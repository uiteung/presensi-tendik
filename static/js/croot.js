import { token } from "cookies.js";

if (token === "") {
	window.location.assign("https://euis.ulbi.ac.id");
}