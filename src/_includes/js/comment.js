if (!window.SUPABASE_URL || !window.SUPABASE_KEY) {
	throw new Error(
		"Supabase URL and key are not set! Please configure them in the `.env` file. " +
			"Copy `.env.example` and rename it to `.env`. Do not set values in `.env.example`!"
	);
}

const db = supabase.createClient(window.SUPABASE_URL, window.SUPABASE_KEY);
const ls_user_key = "COMMENT_USER";
let comments_shown = false;

const COMMENT_ITEM_TEMPLATE = get_template("comment-list-item-[[id]]");
const REPLY_ITEM_TEMPLATE = get_template("reply-list-item-[[id]]");
const REPLY_CONTAINER_TEMPLATE = get_template("reply-list-container-[[id]]");

const BLACKLISTED_WORDS = [
	// Offensive words
	"stupid",
	"idiot",
	"dumb",
	"moron",
	"jerk",
	"ugly",
	"loser",
	"freak",
	"psycho",
	"trash",
	"scum",
	"pathetic",
	"worthless",
	"horrible",
	"crazy",
	"insane",
	"lazy",
	"weird",
	"clown",
	"annoying",

	// Spam words
	"click here",
	"free",
	"promo",
	"discount",
	"best",
	"cheap",
	"contact now",
	"sign up here",
	"guaranteed",
	"join group",
	"like and subscribe",
	"follow me",
	"whatsapp me",
	"get rich quick",
	"money transfer",
	"win a prize",
	"easy investment",
	"quick loan",
	"https://",
	"http://",
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
	const reply_to = fd.get("reply_to")?.toString() || null;

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
	const submit_btn = form.elements["submit"];
	if (submit_btn.disabled) return;

	try {
		submit_btn.disabled = true;
		submit_btn.innerHTML = `<span class="loading loading-dots loading-md"></span>`;

		const { error } = await db.from("comments").insert({
			slug: location.pathname,
			name,
			email,
			description,
			reply_to,
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

		if (comments_shown) {
			if (reply_to) {
				load_replies(reply_to).catch(console.error);
			} else {
				load_comments().catch(console.error); // Load new comments
			}
		}
		update_comment_count(); // Update comment count
		localStorage.setItem(ls_user_key, JSON.stringify({ name, email })); // Save user data to localStorage
	} catch (err) {
		console.error(
			`An error occurred while submitting the comment: ${
				err.message || "Unknown error"
			}`
		);
		alert(`Failed to submit the comment.`);
	} finally {
		submit_btn.disabled = false;
		submit_btn.innerHTML = reply_to ? "Reply" : "Send";
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
		.from("comments_view")
		.select("id,name,description,created_at,verified")
		.eq("slug", location.pathname)
		.is("reply_to", null)
		.order("created_at", { ascending: false });
	if (error) throw error;

	if (!data?.length) {
		container.innerHTML = `No comments yet. Be the first to comment.`;
		return;
	}

	container.innerHTML = ``;
	for (const comment of data) {
		// simple datetime format, you can change date format here.
		comment.relative_time = relative_time(comment.created_at);
		comment.created_at = new Date(comment.created_at).toLocaleString();
		const comment_el = replace_placeholders(COMMENT_ITEM_TEMPLATE, comment);
		container.appendChild(comment_el);
	}
}

/**
 * Reply a comment by its id
 *
 * @param {HTMLButtonElement} btn
 */
function reply_comment(btn) {
	const id = btn.dataset["commentId"];
	const form_id = `comment-reply-${id}`;
	const existing_reply_form = document.getElementById(form_id);
	if (existing_reply_form) {
		existing_reply_form.nextElementSibling.remove();
		existing_reply_form.remove();
		btn.innerText = "Reply";
		return;
	}

	const comment_form = document.getElementById("comment-form");
	if (!comment_form) return;

	/** @type {HTMLFormElement} */
	const reply_form = comment_form.cloneNode(true);
	reply_form.id = form_id;
	reply_form.classList?.add("pl-4", "mt-4");
	reply_form.elements["submit"].innerText = "Reply";
	reply_form.elements["reply_to"].value = id;
	reply_form.onsubmit = send_comment;

	const comment_item = document.getElementById(`comment-list-item-${id}`);
	comment_item?.insertAdjacentElement("afterend", reply_form);
	btn.innerText = "Hide reply";

	load_replies(id).catch(console.error);
}

/**
 * Load comment replies by parent id
 *
 * @param {number} id
 */
async function load_replies(id) {
	const reply_form = document.getElementById(`comment-reply-${id}`);
	if (!reply_form) return;

	const info_el = document.createElement("div");
	info_el.innerHTML = `<span class="loading loading-dots loading-md ml-5"></span>`;
	reply_form.insertAdjacentElement("afterend", info_el);

	const { data, error } = await db
		.from("comments_view")
		.select("name,description,created_at,verified")
		.eq("slug", location.pathname)
		.eq("reply_to", id)
		.order("created_at", { ascending: false });

	if (error) throw error;
	if (!data?.length) {
		info_el.innerHTML = `<em class="text-sm ml-5">No reply</em>`;
		return;
	}

	info_el.remove();

	const container_id = `reply-list-container-${id}`;
	document.getElementById(container_id)?.remove();

	const container = replace_placeholders(REPLY_CONTAINER_TEMPLATE, { id });
	for (const reply of data) {
		// simple datetime format, you can change date format here.
		reply.relative_time = relative_time(reply.created_at);
		reply.created_at = new Date(reply.created_at).toLocaleString();
		const comment_el = replace_placeholders(REPLY_ITEM_TEMPLATE, reply);
		container.appendChild(comment_el);
	}
	reply_form.insertAdjacentElement("afterend", container);
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
		console.error(
			`An error occurred while loading comments: ${
				err.message || "Unknown error"
			}`
		);
		alert(`Failed to load comments.`);
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
		const display_count = count > 99 ? "99+" : count?.toString() || "0";

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

/**
 * Fill custom template placeholders with actual values
 *
 * @param {string} raw
 * @param {object} data
 */
function replace_placeholders(raw, data) {
	// replace all [[ ... ]] with values of data
	const filled = new String(raw).replace(/\[\[([^\]]+)\]\]/g, (match, key) => {
		let negated = false;

		// Check if the key starts with '!'
		if (key.startsWith("!")) {
			negated = true;
			key = key.slice(1); // Remove '!' from the key
		}

		// Get the value from data
		let value = key in data ? data[key] : "";

		// If negation is true, negate the value
		if (negated) {
			value = !value;
		}

		return value;
	});

	const parser = new DOMParser();
	const doc = parser.parseFromString(filled, "text/html");
	return doc.body.firstElementChild;
}

/**
 *
 * @param {string} id
 * @returns {string}
 */
function get_template(id) {
	const el = document.getElementById(id);
	if (!el) throw new Error(`Template with given id (#${id}) was not found`);
	const template = el.cloneNode(true);
	template.hidden = false;
	el.remove();
	return template.outerHTML;
}

/**
 * Relative time from now
 *
 * @param {Date | string} date
 * @returns {string}
 */
function relative_time(date) {
	date = typeof date === "string" ? new Date(date) : date;
	const now = new Date();
	const diffInSeconds = Math.floor((now - date) / 1000); // Difference in seconds

	// Time unit values
	const units = [
		{ label: "second", value: 1 },
		{ label: "minute", value: 60 },
		{ label: "hour", value: 3600 },
		{ label: "day", value: 86400 },
		{ label: "month", value: 2592000 }, // ~30 days
		{ label: "year", value: 31536000 }, // ~365 days
	];

	// Loop through the units and determine the most appropriate one
	for (let i = units.length - 1; i >= 0; i--) {
		const unitValue = units[i].value;
		const unitLabel = units[i].label;

		// Check if the difference is greater than the unit value
		if (diffInSeconds >= unitValue) {
			const unitCount = Math.floor(diffInSeconds / unitValue);
			const plural = unitCount !== 1 ? `${unitLabel}s` : unitLabel;
			return `${unitCount} ${plural} ago`;
		}
	}

	return "Just now"; // If the difference is less than a second
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
