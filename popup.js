let bookmarks = document.getElementById('bookmarks');
let buttons = document.getElementById('buttons');
let smallerHeader = document.getElementById('smallerHeader');


chrome.bookmarks.getSubTree('1', function(array) {
  console.log('array: ', array)
  takeDirs(array[0])
})

function takeDirs ({children}) {
  console.log('childrens: ', children)
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

function onButtonClick(id, parentId, title) {
  chrome.bookmarks.create({parentId, title: `${title}`}, (newFolder) => {
    let newOrder = []
    chrome.bookmarks.getChildren(id, (array) => {
      array
      .sort((a,b) => a.title.toLowerCase() < b.title.toLowerCase() ? -1 : 1)
      .forEach((bookmark, index) => {
        newOrder.push({index: index, title: bookmark.title, url: bookmark.url, parentId: newFolder.id})
      })
      newOrder.forEach((bookmark) => chrome.bookmarks.create(bookmark)) 
    }) 
    smallerHeader.innerText = `${title} posortowane!`
  }) 
}