let searchCards;
let searchBlock = document.querySelector(".search-block");
let input = document.querySelector(".search-field");
input.addEventListener(
  "keyup",
  debounce(function (e) {
    console.log(e);
    return searchRepos(e);
  }, 450)
);

function createCards(searchCards) {
  let checkList = document.querySelector(".search-list");
  if (checkList) {
    checkList.remove();
  }

  let fragment = document.createDocumentFragment();

  let list = document.createElement("div");
  list.classList.add("search-list");
  searchCards.forEach((element) => {
    let card = document.createElement("div");
    card.classList.add("search-card");
    let text = document.createElement("p");
    text.textContent = element.name.slice(0, 1).toUpperCase() + element.name.slice(1);
    card.append(text);
    list.append(card);
    card.dataset.stars = element.stargazers_count;
    card.dataset.owner = element.owner.login;
    card.dataset.name = element.name;
    card.dataset.url = element.svn_url;
  });

  fragment.append(list);
  searchBlock.append(fragment);

  list.addEventListener("click", function (e) {
    document.querySelector(".search-list").remove();

    let target = e.target.closest("DIV");
    if (target.classList != "search-card") return;

    let fragment = document.createDocumentFragment();
    let addedCard = document.createElement("DIV");
    addedCard.classList.add("addedCard");
    addedCard.dataset.url = target.dataset.url;

    let name = document.createElement("p");
    name.textContent = `Name: ${target.dataset.name}`;
    addedCard.append(name);

    let owner = document.createElement("p");
    owner.textContent = `Owner: ${target.dataset.owner}`;
    addedCard.append(owner);

    let stars = document.createElement("p");
    stars.textContent = `Stars: ${target.dataset.stars}`;
    addedCard.append(stars);

    let closeIcon = document.createElement("img");
    closeIcon.src = "./icons/9458771_ecommerce_close_del_delete_remove_icon.svg";
    closeIcon.classList.add("close-button");
    addedCard.append(closeIcon);

    fragment.append(addedCard);

    document.querySelector(".added-cards").append(fragment);

    document.querySelector(".added-cards").addEventListener("click", function (e) {
      let target = e.target;
      if (target.classList == "close-button") {
        target.closest("DIV").remove();
      } else window.open(e.target.closest(".addedCard").dataset.url);
    });
  });
}

async function searchRepos(e) {
  if (input.value === "") {
    document.querySelector(".search-list").remove();
  }

  return await fetch(
    `https://api.github.com/search/repositories?q=${input.value}&sort=stars&order=desc`
  ).then((resolve) => {
    if (resolve.ok) {
      resolve.json().then((resolve) => {
        searchCards = resolve.items.slice(0, 5);
        createCards(searchCards);
        console.log(searchCards);
      });
    }
  });
}

function debounce(func, wait, immediate) {
  let timeout;
  return function () {
    const context = this,
      args = arguments;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}
