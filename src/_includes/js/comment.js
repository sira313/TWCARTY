if (!window.SUPABASE_URL || !window.SUPABASE_KEY) {
	throw new Error(
		"Supabase URL and key are not set! Please configure them in the `.env` file. " +
			"Copy `.env.example` and rename it to `.env`. Do not set values in `.env.example`!"
	);
}

const db = supabase.createClient(window.SUPABASE_URL, window.SUPABASE_KEY);
const ls_user_key = "COMMENT_USER";
let comments_shown = false;

const BLACKLISTED_WORDS = [
	// Offensive words
	"stupid", "idiot", "dumb", "moron", "jerk", "ugly", "loser", "freak", 
	"psycho", "trash", "scum", "pathetic", "worthless", "horrible", "crazy", 
	"insane", "lazy", "weird", "clown", "annoying", 

	// Spam words
	"click here", "free", "promo", "discount", "best", "cheap", "contact now", 
	"sign up here", "guaranteed", "join group", "like and subscribe", "follow me", 
	"whatsapp me", "get rich quick", "money transfer", "win a prize", 
	"easy investment", "quick loan", "https://", "http://"
];

/**
 * Send comment to the API
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
		alert("Please fill in your name and comment.");
		return;
	}

	// Validate blacklist
	for (const word of BLACKLISTED_WORDS) {
		if (description.toLowerCase().includes(word.toLowerCase())) {
			alert(`Your comment contains prohibited words.`);
			return;
		}
	}

	/** @type {HTMLButtonElement} */
	const submit_btn = form.elements["Submit"];
	if (submit_btn.disabled) return;

	try {
		submit_btn.disabled = true;
		submit_btn.innerHTML = `<span class="loading loading-dots loading-md"></span>`;

		const { error } = await db.from("comments").insert({
			slug: location.pathname,
			name,
			email,
			description,
		});
		if (error) throw new Error("Server error");

		form.elements["description"].value = ""; // Reset comment

		// Show success message
		const success_message = document.createElement("p");
		success_message.className = "text-success mt-4";
		success_message.innerText =
			"Your comment has been submitted. Thank you for your participation!";
		form.appendChild(success_message);

		// Remove success message after a few seconds
		setTimeout(() => success_message.remove(), 5000);

		if (comments_shown) load_comments().catch((e) => console.error(e)); // Load new comments
		await update_comment_count(); // Update comment count
		localStorage.setItem(ls_user_key, JSON.stringify({ name, email })); // Save user data to localStorage
	} catch (err) {
		alert(`Failed to submit the comment.`);
		console.error(
			`An error occurred while submitting the comment: ${err.message || "Unknown error"}`
		);
	} finally {
		submit_btn.disabled = false;
		submit_btn.innerHTML = `Submit`;
	}
}

/**
 * Load comments from API
 */
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
		container.innerHTML = `No comments yet. Be the first to comment.`;
		return;
	}

	container.innerHTML = ``;
	for (const comment of data) {
		const comment_el = document.createElement("div");
		comment_el.innerHTML = `
			<p>
				<strong class="text-secondary">${comment.name}</strong> &#8211;
				<em class="text-xs">${new Date(comment.created_at).toLocaleString()}</em>
			</p>
			<p>${comment.description}</p>
		`;
		container.appendChild(comment_el);
	}
}

/**
 * Show all comments
 *
 * @param {MouseEvent} e
 */
async function see_comments(e) {
	/** @type {HTMLButtonElement} */
	const btn = e.currentTarget || e.target;
	if (!btn) return;

	try {
		btn.disabled = true;
		btn.innerHTML = `<span class="loading loading-dots loading-md"></span>`;

		await load_comments();
		comments_shown = true;
		btn.classList.add("hidden");
	} catch (err) {
		alert(`Failed to load comments.`);
		console.error(
			`An error occurred while loading comments: ${err.message || "Unknown error"}`
		);
	} finally {
		btn.disabled = false;
		btn.innerHTML = `See all comments`;
	}
}

/**
 * Count comments and update all indicators
 */
async function update_comment_count() {
	const indicators = document.querySelectorAll(".indicator-item");
	if (!indicators.length) return;

	try {
		const { count, error } = await db
			.from("comments")
			.select("*", { count: "exact", head: true })
			.eq("slug", location.pathname)
			.or(`hidden.is.null,hidden.eq.false`);
		if (error) throw error;

		// Format comment count
		const display_count = count > 99 ? "99+" : count.toString();

		// Update or hide indicators
		indicators.forEach((indicator) => {
			if (count > 0) {
				indicator.textContent = display_count;
				indicator.classList.remove("hidden");
			} else {
				indicator.classList.add("hidden");
			}
		});
	} catch (err) {
		console.error("Failed to update comment count:", err.message || err);
		// Hide indicators on error
		indicators.forEach((indicator) => {
			indicator.classList.add("hidden");
		});
	}
}

// Event listener on page load
window.addEventListener("load", () => {
	const form = document.getElementById("comment-form");
	form.onsubmit = async (e) => {
		await send_comment(e);
		await update_comment_count(); // Update comment count after a new comment is submitted
	};

	const user = JSON.parse(localStorage.getItem(ls_user_key) || "{}");
	form.elements["name"].value = user.name || "";
	form.elements["email"].value = user.email || "";

	const loader = document.getElementById("comment-list-loader");
	loader.onclick = see_comments;

	update_comment_count(); // Update comment count on page load
});
