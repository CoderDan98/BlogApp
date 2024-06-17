document.addEventListener("DOMContentLoaded", function () {
  function filterPosts() {
    const input = document.getElementById("searchInput");
    const filter = input.value.toLowerCase();
    const postList = document.getElementById("postList");
    const posts = postList.getElementsByClassName("post-item");

    for (let i = 0; i < posts.length; i++) {
      const title = posts[i].getElementsByTagName("h2")[0];
      const body = posts[i].getElementsByTagName("p")[0];
      if (
        title.innerHTML.toLowerCase().indexOf(filter) > -1 ||
        body.innerHTML.toLowerCase().indexOf(filter) > -1
      ) {
        posts[i].style.display = "";
      } else {
        posts[i].style.display = "none";
      }
    }
  }

  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("keyup", filterPosts);
  }
});
