import { token } from "./cookies.js";

if (token === "") {
	window.location.assign("https://iteung.ulbi.ac.id");
}