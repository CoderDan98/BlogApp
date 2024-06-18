// Wait until the entire DOM content is loaded before executing the script
document.addEventListener("DOMContentLoaded", function () {
  // Function to filter posts based on user input
  function filterPosts() {
    // Get the search input element
    const input = document.getElementById("searchInput");
    // Get the current value of the search input and convert it to lowercase
    const filter = input.value.toLowerCase();
    // Get the list of posts
    const postList = document.getElementById("postList");
    // Get all post items within the post list
    const posts = postList.getElementsByClassName("post-item");

    // Loop through each post item
    for (let i = 0; i < posts.length; i++) {
      // Get the title element (h2) of the current post
      const title = posts[i].getElementsByTagName("h2")[0];
      // Get the body element (p) of the current post
      const body = posts[i].getElementsByTagName("p")[0];

      // Check if the search term is found in the title or body text
      if (
        title.innerHTML.toLowerCase().indexOf(filter) > -1 || // Title contains the search term
        body.innerHTML.toLowerCase().indexOf(filter) > -1 // Body contains the search term
      ) {
        // If found, display the post
        posts[i].style.display = "";
      } else {
        // If not found, hide the post
        posts[i].style.display = "none";
      }
    }
  }

  // Get the search input element
  const searchInput = document.getElementById("searchInput");
  // Check if the search input element exists
  if (searchInput) {
    // Add an event listener to the search input to call filterPosts on keyup event
    searchInput.addEventListener("keyup", filterPosts);
  }
});
