//HTTP request get,get/id,post,put/id, delete/id
async function LoadData() {
    try {
        let res = await fetch('http://localhost:3000/posts');
        let posts = await res.json()
        let body = document.getElementById("table-body");
        body.innerHTML = "";
        for (const post of posts) {
            // Apply strikethrough style if post is soft deleted
            let rowStyle = post.isDeleted ? 'style="text-decoration: line-through; opacity: 0.6;"' : '';
            let deleteBtn = post.isDeleted ? 
                `<input type='submit' value='restore' onclick='RestorePost(${post.id})'/>` :
                `<input type='submit' value='delete' onclick='Delete(${post.id})'/>` ;
            body.innerHTML += `<tr ${rowStyle}>
                <td>${post.id}</td>
                <td>${post.title}</td>
                <td>${post.views}</td>
                <td>${deleteBtn}</td>
                <td><input type='submit' value='edit' onclick='EditPost(${post.id})'/></td>
            </tr>`
        }
        return false;
    } catch (error) {
        console.log(error);
    }

}//
async function Save() {
    let id = document.getElementById("id_txt").value;
    let title = document.getElementById("title_txt").value;
    let views = document.getElementById("view_txt").value;
    
    if (id) {
        // Edit existing post
        let getItem = await fetch("http://localhost:3000/posts/" + id);
        if (getItem.ok) {
            let existingPost = await getItem.json();
            let res = await fetch('http://localhost:3000/posts/' + id,
                {
                    method: 'PUT',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(
                        {
                            ...existingPost,
                            title: title,
                            views: views
                        }
                    )
                })
            if (res.ok) {
                console.log("edit du lieu thanh cong");
            }
        }
    } else {
        // Create new post with auto-increment ID
        let postsRes = await fetch('http://localhost:3000/posts');
        let posts = await postsRes.json();
        let maxId = 0;
        for (const post of posts) {
            let postId = parseInt(post.id);
            if (postId > maxId) {
                maxId = postId;
            }
        }
        let newId = (maxId + 1).toString();
        
        let res = await fetch('http://localhost:3000/posts',
            {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(
                    {
                        id: newId,
                        title: title,
                        views: views,
                        isDeleted: false
                    }
                )
            })
        if (res.ok) {
            console.log("them du lieu thanh cong");
        }
    }
    ClearForm();
    LoadData();

}
async function Delete(id) {
    // Soft delete by setting isDeleted to true
    let getItem = await fetch("http://localhost:3000/posts/" + id);
    if (getItem.ok) {
        let post = await getItem.json();
        let res = await fetch('http://localhost:3000/posts/' + id, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...post,
                isDeleted: true
            })
        });
        if (res.ok) {
            console.log("xoa mem thanh cong");
        }
    }
    LoadData();
}

async function RestorePost(id) {
    // Restore soft-deleted post
    let getItem = await fetch("http://localhost:3000/posts/" + id);
    if (getItem.ok) {
        let post = await getItem.json();
        let res = await fetch('http://localhost:3000/posts/' + id, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...post,
                isDeleted: false
            })
        });
        if (res.ok) {
            console.log("khoi phuc thanh cong");
        }
    }
    LoadData();
}

async function EditPost(id) {
    let getItem = await fetch("http://localhost:3000/posts/" + id);
    if (getItem.ok) {
        let post = await getItem.json();
        document.getElementById("id_txt").value = post.id;
        document.getElementById("title_txt").value = post.title;
        document.getElementById("view_txt").value = post.views;
    }
}

function ClearForm() {
    document.getElementById("id_txt").value = "";
    document.getElementById("title_txt").value = "";
    document.getElementById("view_txt").value = "";
}

// ========== COMMENTS CRUD OPERATIONS ==========

async function LoadComments() {
    try {
        let res = await fetch('http://localhost:3000/comments');
        let comments = await res.json();
        let body = document.getElementById("comments-table-body");
        body.innerHTML = "";
        for (const comment of comments) {
            let rowStyle = comment.isDeleted ? 'style="text-decoration: line-through; opacity: 0.6;"' : '';
            let deleteBtn = comment.isDeleted ? 
                `<input type='submit' value='restore' onclick='RestoreComment(${comment.id})'/>` :
                `<input type='submit' value='delete' onclick='DeleteComment(${comment.id})'/>` ;
            body.innerHTML += `<tr ${rowStyle}>
                <td>${comment.id}</td>
                <td>${comment.text}</td>
                <td>${comment.postId}</td>
                <td>${deleteBtn}</td>
                <td><input type='submit' value='edit' onclick='EditComment(${comment.id})'/></td>
            </tr>`
        }
        return false;
    } catch (error) {
        console.log(error);
    }
}

async function SaveComment() {
    let id = document.getElementById("comment_id_txt").value;
    let text = document.getElementById("comment_text_txt").value;
    let postId = document.getElementById("comment_postId_txt").value;
    
    if (id) {
        // Edit existing comment
        let getItem = await fetch("http://localhost:3000/comments/" + id);
        if (getItem.ok) {
            let existingComment = await getItem.json();
            let res = await fetch('http://localhost:3000/comments/' + id,
                {
                    method: 'PUT',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(
                        {
                            ...existingComment,
                            text: text,
                            postId: postId
                        }
                    )
                })
            if (res.ok) {
                console.log("edit comment thanh cong");
            }
        }
    } else {
        // Create new comment with auto-increment ID
        let commentsRes = await fetch('http://localhost:3000/comments');
        let comments = await commentsRes.json();
        let maxId = 0;
        for (const comment of comments) {
            let commentId = parseInt(comment.id);
            if (commentId > maxId) {
                maxId = commentId;
            }
        }
        let newId = (maxId + 1).toString();
        
        let res = await fetch('http://localhost:3000/comments',
            {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(
                    {
                        id: newId,
                        text: text,
                        postId: postId,
                        isDeleted: false
                    }
                )
            })
        if (res.ok) {
            console.log("them comment thanh cong");
        }
    }
    ClearCommentForm();
    LoadComments();
}

async function DeleteComment(id) {
    // Soft delete comment
    let getItem = await fetch("http://localhost:3000/comments/" + id);
    if (getItem.ok) {
        let comment = await getItem.json();
        let res = await fetch('http://localhost:3000/comments/' + id, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...comment,
                isDeleted: true
            })
        });
        if (res.ok) {
            console.log("xoa mem comment thanh cong");
        }
    }
    LoadComments();
}

async function RestoreComment(id) {
    // Restore soft-deleted comment
    let getItem = await fetch("http://localhost:3000/comments/" + id);
    if (getItem.ok) {
        let comment = await getItem.json();
        let res = await fetch('http://localhost:3000/comments/' + id, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...comment,
                isDeleted: false
            })
        });
        if (res.ok) {
            console.log("khoi phuc comment thanh cong");
        }
    }
    LoadComments();
}

async function EditComment(id) {
    let getItem = await fetch("http://localhost:3000/comments/" + id);
    if (getItem.ok) {
        let comment = await getItem.json();
        document.getElementById("comment_id_txt").value = comment.id;
        document.getElementById("comment_text_txt").value = comment.text;
        document.getElementById("comment_postId_txt").value = comment.postId;
    }
}

function ClearCommentForm() {
    document.getElementById("comment_id_txt").value = "";
    document.getElementById("comment_text_txt").value = "";
    document.getElementById("comment_postId_txt").value = "";
}

LoadData();
LoadComments();
