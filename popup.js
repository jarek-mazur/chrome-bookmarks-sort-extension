let bookmarks = document.getElementById('bookmarks');
let buttons = document.getElementById('buttons');
let smallerHeader = document.getElementById('smallerHeader');


chrome.bookmarks.getSubTree('1', function(array) {
  takeDirs(array[0])
})

function takeDirs ({children}) {
  children.forEach((bookmark) => {
    if (bookmark.children) {
    let button = document.createElement('button');
    button.classList.add('dicButton')
    button.onclick = (event) => onButtonClick(bookmark.id, bookmark.parentId, bookmark.title);
    button.innerText = bookmark.title;
    buttons.append(button)
    takeDirs(bookmark)
    }
  })

}

function createBookmars (id, parentId, title, position) {
  chrome.bookmarks.create({parentId, title, index: position}, (newFolder) => {
    chrome.bookmarks.getChildren(id, (array) => {
      array
      .sort((a,b) => a.title.toLowerCase() < b.title.toLowerCase() ? -1 : 1)
      .forEach((bookmark, index) => {
        if (bookmark.url) {
          chrome.bookmarks.create({index: index, title: bookmark.title, url: bookmark.url, parentId: newFolder.id})
        } else {
          createBookmars(bookmark.id, newFolder.id, bookmark.title, index);
        }
      })
    }) 
  })
  smallerHeader.innerText = `${title} posortowane!`
}

function getChildren (childrenArray) {
  const helper = [];
  childrenArray.forEach((bookmark, index) => {
    helper.push({index: index, title: bookmark.title, url: bookmark.url, parentId: newFolder.id})
  })
}

function onButtonClick(id, parentId, title) {
  createBookmars(id, parentId, title)
}
