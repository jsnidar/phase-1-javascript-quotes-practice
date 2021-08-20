
quotesUrl = 'http://localhost:3000/quotes'
document.addEventListener('DOMContentLoaded', () => {
    getQuotes()
    addQuote()
})

function getQuotes () {
    fetch('http://localhost:3000/quotes?_embed=likes')
    .then(response => response.json())
    .then(quotes => {
        quotes.forEach(oneQuote => {
            console.log(oneQuote.likes.length) 
            renderOneQuote(oneQuote)
            })
    })
}

function renderOneQuote(oneQuote) {
    renderLi(oneQuote)
    renderBlockquote(oneQuote)
}

function renderLi (oneQuote) {
    const li = document.createElement('li')
    li.className = 'quote-card'
    li.id = oneQuote.id
    quoteUl = document.getElementById('quote-list')
    quoteUl.appendChild(li)
}

function renderBlockquote(oneQuote) {
//assign variables and create elements for the li
const blockquote = document.createElement('blockquote')
const p = document.createElement('p')
const footer = document.createElement('footer')
const br = document.createElement('br')
const likeBtn = document.createElement('button')
const deleteBtn = document.createElement('button')
//assign properties to elements of the li

blockquote.className = 'blockquote'
p.className = 'mb-0'
p.innerText = oneQuote.quote
footer.className = 'blockquote-footer'
footer.innerText = oneQuote.author
likeBtn.className = 'btn-success'
likeBtn.innerHTML = `Likes: <span>${oneQuote.likes.length}</span>`
deleteBtn.className = 'btn-danger'
deleteBtn.innerText = 'Delete'
//append elements to the DOM
const li = document.getElementById(oneQuote.id)
li.appendChild(blockquote)
blockquote.appendChild(p)
blockquote.appendChild(footer)
blockquote.appendChild(br)
blockquote.appendChild(likeBtn)
blockquote.appendChild(deleteBtn)
//assign functions for buttons
handleLike(likeBtn, oneQuote)
handleDelete(deleteBtn)
}
function handleDelete (deleteBtn) {
    deleteBtn.addEventListener('click', event => {
    const btnLi = event.target.parentNode.parentNode
    liId = btnLi.id
    //delete the quote from the API
    fetch(quotesUrl + '/' + liId, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(btnLi.remove)
    })
}

function addQuote () {
    const form = document.getElementById('new-quote-form')
    form.addEventListener('submit', event => {
        event.preventDefault()
        const newQuote = document.getElementById('new-quote').value
        const newAuthor = document.getElementById('author').value
        const formObj = {quote: newQuote , author: newAuthor }
        fetch(quotesUrl, {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(formObj)
        })
        .then(res => res.json())
        .then(document.getElementById('quote-list').innerHTML = '')
        .then(getQuotes())
    })
}

function handleLike (likeBtn, oneQuote) {
    likeBtn.addEventListener('click', event => {
        const quoteId = oneQuote.id
        const btnLi = event.target.parentNode.parentNode
        const blockquote = event.target.parentNode
        liId = btnLi.id
        const createdTime = Date.now()
        const likeObj = {quoteId: quoteId, createdAt: createdTime}
        console.log(likeObj)
        fetch('http://localhost:3000/likes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(likeObj)
        })
        .then(
            fetch(`http://localhost:3000/quotes/${quoteId}?_embed=likes`)
            .then(response => response.json())
            .then(quote => {
                btnLi.innerHTML = ''
                renderBlockquote(quote)
            })
        )
    })
}
