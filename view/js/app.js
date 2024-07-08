document.getElementById('url-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const originalUrl = document.getElementById('original-url').value;

    try {
        const response = await fetch('/shorten', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ originalUrl })
        });
        const data = await response.json();

        if (data.shortUrl) {
            document.getElementById('short-url-container').innerHTML = `<p>Short URL: <a href="${data.shortUrl}" target="_blank">${data.shortUrl}</a></p>`;
        }
    } catch (error) {
        console.error(error);
    }
});
