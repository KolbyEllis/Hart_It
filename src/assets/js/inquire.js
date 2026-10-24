document.querySelectorAll(".inquire-form").forEach((form) => {
	form.addEventListener("submit", async (event) => {
		event.preventDefault();
		const data = new FormData(form);
		const lines = [
			"Hi Hart It — I would like to inquire.",
			`Name: ${data.get("name") || ""}`,
			`Email: ${data.get("email") || ""}`,
			`Piece: ${data.get("piece") || ""}`,
			`Event or need-by date: ${data.get("date") || "not set"}`,
			"",
			`${data.get("note") || ""}`,
		];
		const message = lines.join("\n").trim();
		const status = form.querySelector(".form-status");

		try {
			await navigator.clipboard.writeText(message);
			if (status) {
				status.hidden = false;
				status.textContent = "Your note is copied. Instagram is opening so you can paste it into a message to Hart It.";
			}
		} catch (error) {
			if (status) {
				status.hidden = false;
				status.textContent = "Instagram is opening. If the note did not copy, tell Hart It the piece you want and the date.";
			}
		}

		window.open(form.dataset.dm || "https://ig.me/m/hart.itdesign/", "_blank", "noopener");
	});
});
