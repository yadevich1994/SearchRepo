const inputForm = document.querySelector(".input-form");
const input = createElement("input", "search-input");
const selectRepo = createElement("ul", "select-repo");
const savedRepo = document.querySelector(".saved-repo");
const btnDel = createElement("button", "btn-del");
let result;

const startSearch = debounce(searchRepo, 500);

inputForm.append(input);
inputForm.append(selectRepo);

input.addEventListener("keyup", startSearch);

selectRepo.addEventListener("click", (e) => {
  let target = e.target;
  saveRepository(target);
  selectRepo.textContent = "";
  input.value = "";
});

savedRepo.addEventListener("click", (e) => {
  let target = e.target;

  if (target.classList.contains("btn-del")) {
    target.parentElement.remove();
  }
});

function createElement(tagName, tagClass) {
  const element = document.createElement(tagName);

  if (tagClass) {
    element.classList.add(tagClass);
  }

  return element;
}

function debounce(fn, ms) {
  return function (...args) {
    let prev = this.last;
    this.last = Date.now();

    if (prev && this.last - prev <= ms) {
      clearTimeout(this.lastTimer);
    }

    this.lastTimer = setTimeout(() => fn(...args), ms);
  };
}

async function searchRepo() {
  return await fetch(
    `https://api.github.com/search/repositories?q=${input.value}&per_page=5`
  )
    .then((response) => response.json())
    .then((response) => {
      let element;
      let item = document.querySelectorAll(".select-repo__item");

      result = response.items;

      if (input.value == "") {
        selectRepo.textContent = "";
        return;
      }

      if (item.length == 0) {
        result.forEach((item, i) => {
          element = createElement("li", "select-repo__item");
          element.textContent = `${item["name"]}`;
          selectRepo.append(element);
          saveInfo(item, element);
        });
      } else {
        item.forEach((el, i) => {
          el.textContent = `${result[i]["name"]}`;
        });
      }
    })
    .catch((err) => console.log("repositories not found"));
}

function saveInfo(item, el) {
  el.dataset.owner = `${item["owner"]["login"]}`;
  el.dataset.stars = `${item["stargazers_count"]}`;
}

function saveRepository(el) {
  const savedRepository = createElement("div", "saved-repo__item");
  const name = createElement("p", "saved-repo__item--text");
  const owner = createElement("p", "saved-repo__item--text");
  const stars = createElement("p", "saved-repo__item--text");
  const btnDel = createElement("button", "btn-del");

  name.textContent = `Name: ${el.textContent}`;
  owner.textContent = `Owner: ${el.dataset.owner}`;
  stars.textContent = `Stars: ${el.dataset.stars}`;

  savedRepo.append(savedRepository);
  savedRepository.append(name);
  savedRepository.append(owner);
  savedRepository.append(stars);
  savedRepository.append(btnDel);
}



