const db = supabase.createClient("TODO", "TODO");

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

		// TODO: success message
		form.reset();
		if (comments_shown) load_comments().catch((e) => console.error(e));
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
		btn.hidden = true;
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
		.select("name,description")
		.order("created_at", { ascending: false })
		.eq("slug", location.pathname)
		.eq("show", true);
	if (error) throw error;

	for (const comment of data) {
		const comment_el = document.createElement("div");
		comment_el.innerHTML = `
			<p class="text-secondary"><strong>${comment.name}</strong></p>
			<p>${comment.description}</p>
		`;
		container.appendChild(comment_el);
	}
}

window.addEventListener("load", () => {
	const form = document.getElementById("comment-form");
	form.onsubmit = send_comment;

	const loader = document.getElementById("comment-list-loader");
	loader.onclick = see_comments;
});
