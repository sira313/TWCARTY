if (!window.SUPABASE_URL || !window.SUPABASE_KEY) {
	throw new Error(
		"Supabase url and key are not set yet! Please set in `/asset/js/settings.js`. " +
			"Copy settings.js.example and paste to settings.js in /asset/js/ directory"
	);
}

const db = supabase.createClient(window.SUPABASE_URL, window.SUPABASE_KEY);
const ls_user_key = "COMMENT_USER";
let comments_shown = false;

/**
 * Send comment to API
 *
 * @param {SubmitEvent} e
 */
async function send_comment(e) {
	e.preventDefault();

	/** @type {HTMLFormElement} */
	const form = e.target || e.currentTarget;
	if (!form) return;

	const fd = new FormData(form);
	const name = fd.get("name")?.toString();
	const email = fd.get("email")?.toString();
	const description = fd.get("description")?.toString();

	if (!name || !description) {
		alert("Name and email are required");
		return;
	}

	/** @type {HTMLButtonElement} */
	const submit_btn = form.elements["send"];
	if (submit_btn.disabled) return;

	try {
		submit_btn.disabled = true;
		submit_btn.innerHTML = `<span class="loading loading-spinner"></span> Sending...`;

		const { error } = await db.from("comments").insert({
			slug: location.pathname,
			name,
			email,
			description,
		});
		if (error) throw new Error("Server error");

		form.elements["description"].value = ""; // reset comment box
		if (comments_shown) load_comments().catch((e) => console.error(e)); // load newly added comment
		localStorage.setItem(ls_user_key, JSON.stringify({ name, email })); // store user name and email to use again latter

		// TODO: success message
	} catch (err) {
		// TODO: error message
		alert(`Failed to comment`);
		console.error(
			`Error while sending a comment: ${err.message || "Unkown error"}`
		);
	} finally {
		submit_btn.disabled = false;
		submit_btn.innerHTML = `Send`;
	}
}

/**
 * Load comment from API
 *
 * @param {MouseEvent} e
 */
async function see_comments(e) {
	/** @type {HTMLButtonElement} */
	const btn = e.currentTarget || e.target;
	if (!btn) return;

	try {
		btn.disabled = true;
		btn.innerHTML = `<span class="loading loading-spinner"></span> Loading...`;

		await load_comments();
		comments_shown = true;
		btn.classList.add("hidden");
	} catch (err) {
		// TODO: error message
		alert(`Failed to load comments`);
		console.error(
			`Error while loading comments: ${err.message || "Unkown error"}`
		);
	} finally {
		btn.disabled = false;
		btn.innerHTML = `See comments`;
	}
}

async function load_comments() {
	const container = document.getElementById("comment-list-container");
	if (!container) {
		console.warn(`Comment list container element was null`);
		return;
	}

	const { data, error } = await db
		.from("comments")
		.select("name,description,created_at")
		.order("created_at", { ascending: false })
		.eq("slug", location.pathname)
		.or(`hidden.is.null,hidden.eq.false`);
	if (error) throw error;

	if (!data?.length) {
		container.innerHTML = `No comment yet`;
		return;
	}

	container.innerHTML = ``;
	for (const comment of data) {
		const comment_el = document.createElement("div");
		comment_el.innerHTML = `
			<p>
				<strong class="text-secondary">${comment.name}</strong> &bullet;
				<em class="text-xs">${new Date(comment.created_at).toLocaleString()}</em>
			</p>
			<p>${comment.description}</p>
		`;
		container.appendChild(comment_el);
	}
}

window.addEventListener("load", () => {
	const form = document.getElementById("comment-form");
	form.onsubmit = send_comment;

	const user = JSON.parse(localStorage.getItem(ls_user_key) || "{}");
	form.elements["name"].value = user.name || "";
	form.elements["email"].value = user.email || "";

	const loader = document.getElementById("comment-list-loader");
	loader.onclick = see_comments;
});
