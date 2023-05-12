const campyList = document.querySelector("#campy-list");

// Fetch the data from the JSON file and display it as a list
fetch("campy.json")
  .then((response) => response.json())
  .then((data) => {
    data.forEach((item) => {
      const listItem = document.createElement("li");
      const link = document.createElement("a");
      link.href = item.link;
      link.textContent = item.title;
      listItem.appendChild(link);

      // Add the edition information if it exists
      if (item.ed) {
        const edition = document.createElement("span");
        edition.textContent = item.ed;
        listItem.appendChild(edition);
      }

      campyList.appendChild(listItem);
    });
  });
