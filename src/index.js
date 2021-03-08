// write your code here
const url = 'http://localhost:3000'
const title = document.querySelector('.title')
const image = document.querySelector('.image')
const likes = document.querySelector('.likes')
const likeButton = document.querySelector('.like-button')
const comments = document.querySelector('.comments')
const commentForm = document.querySelector('.comment-form')
const downvote = document.querySelector('.downvote')

const loadCard = () => {
    fetch(url + `/images`)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            data.map(d => {
                title.innerText = d.title
                image.src = d.image
                likes.innerText = `${ d.likes } likes`
            })
        })
}

const loadComments = () => {
    fetch(url + `/comments`)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            comments.innerHTML = ``
            data.map(d => {
                comments.innerHTML += `<li id="comment-${ d.id }"><button class='delete-comment'>X</button> ${ d.content }</li>`
            })
            
            let newComments = document.querySelectorAll('.delete-comment')
            for (let comment of newComments) {
                comment.addEventListener('click', (e)=>{
                    let id = parseInt(e.target.parentElement.id.split("-")[1], 10)
            
                    configObj = {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accepts': 'application/json'
                        }
                    }

                    fetch(url + `/comments/${ id }`, configObj)
                        .then(res => res.json())
                        .then(data => {
                            console.log(data)
                            loadComments()
                        })
                        .catch(err => console.log(err))
                })
            }
        })
}

document.addEventListener("DOMContentLoaded", ()=>{
    loadCard()
    loadComments()
})

likeButton.addEventListener("click", (e)=>{
    configObj = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accepts': 'application/json'
        },
        body: JSON.stringify({ likes: parseInt(likes.innerText.split(" ")[0], 10) + 1 })
    }

    fetch(url + `/images/1`, configObj)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            loadCard()
        })
})

commentForm.addEventListener("submit", (e)=>{
    e.preventDefault()

    let data = {
        content: e.target.comment.value,
        imageId: 1
    }

    configObj = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accepts': 'application/json'
        },
        body: JSON.stringify(data)
    }

    fetch(url + `/comments`, configObj)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            loadComments()
        })

    e.target.comment.value = ``
})

downvote.addEventListener("click", (e)=>{
    configObj = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accepts': 'application/json'
        },
        body: JSON.stringify({ likes: parseInt(likes.innerText.split(" ")[0], 10) - 1 })
    }

    fetch(url + `/images/1`, configObj)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            loadCard()
        })
})